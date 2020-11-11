
import * as localforage from "localforage"
import { Octokit } from '@octokit/rest';

import * as neverthrow from 'neverthrow'
import { ok, err, okAsync, errAsync, Result, ResultAsync } from 'neverthrow'

import { Repo, Repos } from "./repo";
import { Note } from "./types"


const NOTEMARKS_FOLDER = ".notemarks"


enum FileKind {
  NoteMarkdown = "NoteMarkdown",
  Link = "Link",
  Document = "Document",
}

function getFileKind(path: string): FileKind {
  let extension = path.split('.').pop()?.toLowerCase();
  if (extension === "md") {
    return FileKind.NoteMarkdown;
  } else if (extension === "desktop") {
    return FileKind.Link;
  } else {
    return FileKind.Document;
  }
}

function getAssociatedMetaPath(path: string): string {
  return `${NOTEMARKS_FOLDER}/${path}.yaml`
}

//type Result<T> = neverthrow.Result<T, Error>
//type ResultAsync<T> = Promise<Result<T>>
//type ResultAsync<T> = neverthrow.ResultAsync<T, Error>


/*
async function expect<T>(promise: Promise<T>): Promise<[T?, Error?]> {
  return promise
    .then(data => [data, undefined] as [T, undefined])
    .catch(error => Promise.resolve([undefined, error] as [undefined, Error]));
}
*/

function expect<T>(promise: Promise<T>): neverthrow.ResultAsync<T, Error> {
  return neverthrow.ResultAsync.fromPromise(promise, (e) => e as Error);
}


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

/*
async function foo(): Promise<number> {
  return 42;
}

async function test(): Promise<Result<string, Error>> {
  let result = await ResultAsync.fromPromise(foo(), () => new Error("failed"))
  if (result.isOk()) {
    if (result.value > 0) {
      return okAsync("positive")
    } else {
      return okAsync("negative")
    }
  } else {
    return errAsync(new Error("failed"))
  }
}
*/

/*
async function foo(): Promise<number> {
  return 42;
}

async function combine(): Promise<Result<number, Error>> {
  let promiseA = foo();
  let promiseB = foo();
  let resultA = await ResultAsync.fromPromise(promiseA, () => new Error("failed"))
  let resultB = await ResultAsync.fromPromise(promiseB, () => new Error("failed"))
  return (
    resultA.isOk() && resultB.isOk() ?
    okAsync(resultA.value + resultB.value) :
    errAsync(new Error("failed"))
  )
}
*/

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

/*
async function cachedFetchFile(octokit: Octokit, repo: Repo, path: string, sha: string): Promise<Result<File, FileError>> {
  let fileKind = getFileKind(path)
  if (fileKind === FileKind.Document) {
    return ok({
      kind: fileKind,
      path: path,
      content: undefined,
    })
  } else {
    let result = await cachedFetch(octokit, repo, path, sha);
    if (result.isOk()) {
      return ok({
        kind: fileKind,
        path: path,
        content: result.value,
      })
    } else {
      return err({
        kind: fileKind,
        path: path,
        error: result.error,
      })
    }
  }
}


type File = {
  kind: FileKind,
  //filename: string,
  path: string,
  content: string | undefined,
}

type FileError = {
  kind: FileKind,
  //filename: string,
  path: string,
  error: Error,
}

type FilePromises = Array<Promise<Result<File, FileError>>>

async function recursiveLoad(octokit: Octokit, repo: Repo, path: string, promises: FilePromises) {
  console.log("recursiveLoad", path)

  let result = await expect(octokit.repos.getContent({
    owner: repo.userName,
    repo: repo.repoName,
    path: path,
  }))

  if (result.isOk()) {
    let content = result.value
    // console.log(content)

    for (let entry of content.data as any) {
      // console.log(entry.path)
      if (entry.type === "dir" &&  entry.name !== NOTEMARKS_FOLDER) {
        // It is important to await the recursive load, otherwise the outer logic does not
        // even know what / how many promises there will be scheduled.
        await recursiveLoad(octokit, repo, entry.path, promises)
      } else if (entry.type === "file") {
        promises.push(cachedFetchFile(octokit, repo, entry.path, entry.sha))
        / *
        if (content != null) {
          contents.notes.push({
            repoId: repo.id,
            location: entry.path,
            title: "",
            labels: [],
            timeCreated: new Date(),
            timeUpdated: new Date(),
            content: content,
          })
        }
        * /
      }
    }
  }
}
*/

type File = {
  path: string,
  sha: string,
}

type Contents = {
  notes: Note[],
}

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

    for (let entry of content.data as any) {
      if (entry.type === "dir" &&  entry.name !== NOTEMARKS_FOLDER) {
        // It is important to await the recursive load, otherwise the outer logic does not
        // even know what / how many promises there will be scheduled.
        await recursiveListFiles(octokit, repo, entry.path, files)
      } else if (entry.type === "file") {
        files.push({
          path: entry.path,
          sha: entry.sha
        })
      }
    }
  }
}

export async function loadContents(repos: Repos): Promise<Result<File, Error>[]> {
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

    combineFilesAndMeta(files, metaFiles)
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

type FileAndMeta = {
  file: File,
  meta: File,
}

function combineFilesAndMeta(files: File[], metaFiles: File[]) {

  // Build meta lookup map
  let metaFilesMap: {[key: string]: File} = {}
  for (let metaFile of metaFiles) {
    metaFilesMap[metaFile.path] = metaFile;
  }
  console.log(metaFilesMap)

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

  for (let { file, meta } of filesAndMeta) {
    // fetch contents
  }
}

/*
const auth = process.env.REACT_APP_AUTH;
console.log(auth)

const octokit = new Octokit({
  auth: auth,
});

// Compare: https://docs.github.com/en/rest/reference/repos/#list-organization-repositories
octokit.repos
  .listForOrg({
    org: "octokit",
    type: "public",
  })
  .then(({ data }) => {
    console.log(data)
  });

  octokit.repos.listForAuthenticatedUser()
  .then(({ data }) => {
    console.log(data)
  });
*/

export async function experiment() {
  const auth = process.env.REACT_APP_AUTH;
  console.log(auth)

  const octokit = new Octokit({
    auth: auth,
  });

  // https://octokit.github.io/rest.js/v18#repos-get-content
  let content = await octokit.repos.getContent({
    owner: "bluenote10",
    repo: "DummyRepo",
    path: "README.md",
  })

  console.log(content)
  console.log(content.data.content)

  let fileContent = atob(content.data.content)
  console.log(fileContent)

  // https://octokit.github.io/rest.js/v18#repos-create-or-update-file-contents
  let commit = await octokit.repos.createOrUpdateFileContents({
    owner: "bluenote10",
    repo: "DummyRepo",
    path: ".autogen_001",
    message: "auto commit",
    content: btoa("another dummy content"),
    "committer.name": "Octokit",
    "committer.email": "Octokit@github.com",
    "author.name": "Octokit",
    "author.email": "Octokit@github.com",
  })
  console.log(commit)

  let files = await octokit.repos.getContent({
    owner: "bluenote10",
    repo: "DummyRepo",
    path: ".",
  })
  console.log(files)
}
