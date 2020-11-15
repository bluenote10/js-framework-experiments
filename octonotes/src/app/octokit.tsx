
import * as localforage from "localforage"
import { Octokit } from '@octokit/rest';

import * as neverthrow from 'neverthrow'
import { ok, err, okAsync, errAsync, Result, ResultAsync } from 'neverthrow'

import * as yaml from "js-yaml"

import { Repo, Repos } from "./repo";
import { Note } from "./types"
import * as date_utils from "./date_utils"


const NOTEMARKS_FOLDER = ".notemarks"

// ----------------------------------------------------------------------------
// File name / path handling utils
// ----------------------------------------------------------------------------

export enum EntryKind {
  NoteMarkdown = "NoteMarkdown",
  Link = "Link",
  Document = "Document",
}

export function getEntryKind(path: string): EntryKind {
  let extension = path.split('.').pop()?.toLowerCase();
  if (extension === "md") {
    return EntryKind.NoteMarkdown;
  } else if (extension === "desktop") {
    return EntryKind.Link;
  } else {
    return EntryKind.Document;
  }
}

export function getAssociatedMetaPath(path: string): string {
  return `${NOTEMARKS_FOLDER}/${path}.yaml`
}

export function splitLocationAndFilename(path: string): [string, string] {
  let idxLastSlash = path.lastIndexOf('/')
  if (idxLastSlash === -1) {
    return ["", path]
  } else {
    return [
      path.substring(0, idxLastSlash),
      path.substring(idxLastSlash + 1),
    ]
  }
}

export function filenameToTitle(filename: string) {
  // TODO: Unescaping of special chars has to go here...
  let idxLastDot = filename.lastIndexOf('.')
  if (idxLastDot === -1) {
    return filename;
  } else {
    return filename.substring(0, idxLastDot);
  }
}

export function titleToFilename(title: string, extension: string) {
  // TODO: Escaping of special chars has to go here...
  let titleEscaped = title
  if (extension.length > 0) {
    return `${titleEscaped}.${extension}`;
  } else {
    return titleEscaped;
  }
}

// ----------------------------------------------------------------------------
// ResultAsync helper
// ----------------------------------------------------------------------------


function expect<T>(promise: Promise<T>): neverthrow.ResultAsync<T, Error> {
  return neverthrow.ResultAsync.fromPromise(promise, (e) => e as Error);
}

// ----------------------------------------------------------------------------
// High level functions
// ----------------------------------------------------------------------------


export async function verifyRepo(repo: Repo) {
  const octokit = new Octokit({
    auth: repo.token,
  });

  let content = await expect(octokit.repos.getContent({
    owner: repo.userName,
    repo: repo.repoName,
    path: ".",
  }))

  if (content.isOk()) {
    console.log("Verification succeeded.")
    return true;
  } else {
    console.log("Verification failed:")
    console.log(content.error);
    return false;
  }
}

// ----------------------------------------------------------------------------
// Internal cached fetching
// ----------------------------------------------------------------------------

async function cachedFetch(octokit: Octokit, repo: Repo, path: string, sha: string): Promise<Result<string, Error>> {
  let key = `${path}_${sha}`
  let cached = await localforage.getItem(key) as string | undefined

  if (cached != null) {
    console.log(`${key} found in cached`)
    return ok(cached);
  } else {
    let result = await expect(octokit.repos.getContent({
      owner: repo.userName,
      repo: repo.repoName,
      path: path,
    }))

    if (result.isOk()) {
      console.log(`${key} fetched successfully`)
      let content = result.value;
      //console.log(content)
      console.assert(content.data.sha === sha, "SHA mismatch")
      console.assert(content.data.encoding === "base64", "Encoding mismatch")
      let plainContent = atob(content.data.content)
      //console.log(plainContent)
      await localforage.setItem(key, plainContent)
      return ok(plainContent);
    } else {
      console.log(`${key} failed to fetch`, result.error)
      return err(result.error);
    }
  }
}

// ----------------------------------------------------------------------------
// Recursive file listing
// ----------------------------------------------------------------------------

type File = {
  path: string,
  sha: string,
  rawUrl: string,
}

/*
type OctokitContext = {
  octokit: Octokit,
  owner: string,
  repo: string,
}
*/

async function recursiveListFiles(octokit: Octokit, repo: Repo, path: string, files: File[]) {
  console.log("recursiveListFiles", path)

  let result = await expect(octokit.repos.getContent({
    owner: repo.userName,
    repo: repo.repoName,
    path: path,
  }))

  if (result.isOk()) {
    let content = result.value
    // console.log(content)
    // Reference for fields:
    // https://developer.github.com/v3/repos/contents/#get-repository-content

    for (let entry of content.data as any) {
      if (entry.type === "dir" &&  entry.name !== NOTEMARKS_FOLDER) {
        // It is important to await the recursive load, otherwise the outer logic does not
        // even know what / how many promises there will be scheduled.
        await recursiveListFiles(octokit, repo, entry.path, files)
      } else if (entry.type === "file") {
        files.push({
          path: entry.path,
          sha: entry.sha,
          rawUrl: entry.download_url,
        })
      }
    }
  }
}

// ----------------------------------------------------------------------------
// High level entry loading
// ----------------------------------------------------------------------------

export async function loadEntries(repos: Repos): Promise<Result<File, Error>[]> {
  console.log(`Loading contents from ${repos.length} repos`)

  for (let repo of repos) {
    const octokit = new Octokit({
      auth: repo.token,
    });

    // It is important to await the recursive load, otherwise the outer logic does not
    // even know what / how many promises there will be scheduled.

    let files = [] as File[]
    await recursiveListFiles(octokit, repo, ".", files);

    let metaFiles = [] as File[]
    await recursiveListFiles(octokit, repo, NOTEMARKS_FOLDER, metaFiles);

    /*
    for (let file of files) {
      console.log(file)
    }
    for (let metaFile of metaFiles) {
      console.log(metaFile)
    }
    */

    let entryPromises = combineFilesAndMeta(octokit, repo, files, metaFiles)
    let entries = await Promise.all(entryPromises)
    console.log(entries)

  }

  /*
  let files: Result<File, FileError>[] = (await Promise.allSettled(filePromises)).map(settleStatus => {
    if (settleStatus.status === "fulfilled") {
      return settleStatus.value;
    } else {
      return err(settleStatus.reason);
    }
  });
  */

  /*
  let files = await Promise.all(filePromises);
  console.log("num files loaded:", files.length);

  for (let file of files) {
    console.log(file)
  }
  */

  //debugger;
  return [];
}


// better name: loadEntriesForRepoFromFilesList
function combineFilesAndMeta(octokit: Octokit, repo: Repo, files: File[], metaFiles: File[]): Array<Promise<Result<Entry, Error>>> {

  // Build meta lookup map
  let metaFilesMap: {[key: string]: File} = {}
  for (let metaFile of metaFiles) {
    metaFilesMap[metaFile.path] = metaFile;
  }
  console.log(metaFilesMap)

  type FileAndMeta = {
    file: File,
    meta: File,
  }
  let filesAndMeta = [] as FileAndMeta[]
  let filesWithMissingMeta = [] as File[]

  // Iterate over files and find associated meta
  for (let file of files) {
    let metaPath = getAssociatedMetaPath(file.path)
    if (metaPath in metaFilesMap) {
      console.log(metaPath, "found")
      filesAndMeta.push({
        file: file,
        meta: metaFilesMap[metaPath],
      })
    } else {
      console.log(metaPath, "is missing")
      filesWithMissingMeta.push(file)
    }
  }

  console.log("filesAndMeta", filesAndMeta)
  console.log("filesWithMissingMeta", filesWithMissingMeta)

  // TODO: Should we fix filesWithMissingMeta here? Or later?
  // TODO: Return "staged changes" data structure along with entries?
  // TODO: Make sure the cases "missing meta data" and "failed to parse meta data" are handled
  // identically without much code duplication. Currently there is a check in loadEntry for that.

  let entryPromises = []
  for (let { file, meta } of filesAndMeta) {
    // fetch contents
    entryPromises.push(loadEntry(octokit, repo, file, meta))
  }

  return entryPromises;
}


export type Entry = {
  // General fields
  repoId: string,
  rawUrl: string,
  // Fields derived from filename/path
  location: string,
  title: string,
  entryKind: EntryKind,
  // From meta data:
  labels: string[],
  timeCreated: Date,
  timeUpdated: Date,
  // From file content (optional):
  content: string | undefined,
}

type MetaData = {
  labels: string[],
  timeCreated: Date,
  timeUpdated: Date,
}


async function loadEntry(octokit: Octokit, repo: Repo, file: File, meta: File): Promise<Result<Entry, Error>> {
  let entryKind = getEntryKind(file.path)

  let metaContent = await cachedFetch(octokit, repo, meta.path, meta.sha);

  let fileContent: Result<string, Error> | undefined = undefined
  if (entryKind !== EntryKind.Document) {
    fileContent = await cachedFetch(octokit, repo, file.path, file.sha);
  }

  if (metaContent.isOk() && (fileContent == null || fileContent.isOk())) {

    let [location, filename] = splitLocationAndFilename(file.path)
    let title = filenameToTitle(filename)

    let metaDataResult = parseMetaData(metaContent.value)

    if (metaDataResult.isErr()) {
      // TODO: Actually when meta data parsing fails we should as well create a new empty meta data
      // (similar to the case when the file doesn't exist in the first place), and stage this change.
      return err(metaDataResult.error)
    } else {
      let metaData = metaDataResult.value;
      return ok({
        repoId: repo.id,
        rawUrl: file.rawUrl,
        location: location,
        title: title,
        entryKind: entryKind,
        labels: metaData.labels as string[],
        timeCreated: metaData.timeCreated as Date,
        timeUpdated: metaData.timeUpdated as Date,
        content: fileContent?.value,
      })
    }
  } else {
    return err(new Error(`Failed to fetch contents for ${meta.path} or ${file.path}`))
  }
}

// ----------------------------------------------------------------------------
// Parsing utils
// ----------------------------------------------------------------------------

function parseMetaData(content: string): Result<MetaData, Error> {
  let metaData = yaml.safeLoad(content) as MetaData

  if (metaData == null) {
    return err(new Error("Meta data parsing returned null"));
  } else {

    let labels = Array.isArray(metaData["labels"])
      ? metaData["labels"] as string[]
      : undefined
    let timeCreated = typeof metaData["timeCreated"] === "string"
      ? date_utils.stringToDate(metaData["timeCreated"])
      : undefined;
    let timeUpdated = typeof metaData["timeUpdated"] === "string"
      ? date_utils.stringToDate(metaData["timeUpdated"])
      : undefined;

    if (labels == null) {
      return err(new Error("Meta data field 'labels' isn't an array."));
    } else if (timeCreated == null) {
      return err(new Error("Meta data field 'timeCreated' cannot be parsed."));
    } else if (timeUpdated == null) {
      return err(new Error("Meta data field 'timeUpdated' cannot be parsed."));
    } else {
      return ok({
        labels: labels,
        timeCreated: timeCreated,
        timeUpdated: timeUpdated,
      })
    }
  }
}
