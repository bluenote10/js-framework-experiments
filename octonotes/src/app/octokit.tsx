
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

type Contents = {
  notes: Note[],
}

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
        /*
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
        */
      }
    }
  }
}

export async function loadContents(repos: Repos): Promise<Result<File, FileError>[]> {
  console.log("Loading contents")
  console.log(repos)

  let filePromises = [] as FilePromises

  for (let repo of repos) {
    const octokit = new Octokit({
      auth: repo.token,
    });

    // It is important to await the recursive load, otherwise the outer logic does not
    // even know what / how many promises there will be scheduled.
    await recursiveLoad(octokit, repo, ".", filePromises);
  }
  console.log("filePromises:", filePromises)
  console.log("filePromises.length:", filePromises.length)
  console.log("filePromises:", filePromises)
  console.log("filePromises.length:", filePromises.length)
  console.log("filePromises:", filePromises)
  console.log("filePromises.length:", filePromises.length)

  for (let filePromise of filePromises) {
    console.log(filePromise)
  }

  console.log("num files to load:", filePromises.length);
  /*
  let files: Result<File, FileError>[] = (await Promise.allSettled(filePromises)).map(settleStatus => {
    if (settleStatus.status === "fulfilled") {
      return settleStatus.value;
    } else {
      return err(settleStatus.reason);
    }
  });
  */
  let files = await Promise.all(filePromises);
  console.log("num files loaded:", files.length);

  for (let file of files) {
    console.log(file)
  }

  //debugger;
  return files;
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
