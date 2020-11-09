
import * as localforage from "localforage"
import { Octokit } from '@octokit/rest';


import { Repo, Repos } from "./repo";
import { Note } from "./types"


async function expect<T>(promise: Promise<T>): Promise<[T?, Error?]> {
  return promise
    .then(data => [data, undefined] as [T, undefined])
    .catch(error => Promise.resolve([undefined, error] as [undefined, Error]));
}

export async function verifyRepo(repo: Repo) {
  const octokit = new Octokit({
    auth: repo.token,
  });

  let [content, error] = await expect(octokit.repos.getContent({
    owner: repo.userName,
    repo: repo.repoName,
    path: ".",
  }))

  if (content != null) {
    console.log("Verification succeeded.")
    return true;
  } else {
    console.log("Verification failed:")
    console.log(error);
    return false;
  }
}

type Contents = {
  notes: Note[]
}

async function cachedFetch(octokit: Octokit, repo: Repo, path: string, sha: string): Promise<string | undefined> {
  let key = `${path}_${sha}`
  let cached = await localforage.getItem(key) as string | undefined

  if (cached != null) {
    return cached;
  } else {
    let [content, error] = await expect(octokit.repos.getContent({
      owner: repo.userName,
      repo: repo.repoName,
      path: path,
    })) as [any, Error]

    if (error != null) {
      console.log(error)
      return undefined;
    }

    if (content != null) {
      //console.log(content)
      console.assert(content.data.sha === sha, "SHA mismatch")
      console.assert(content.data.encoding === "base64", "Encoding mismatch")
      let plainContent = atob(content.data.content)
      console.log(plainContent)
      await localforage.setItem(key, plainContent)
      return plainContent;
    } else {
      return undefined;
    }

  }

}

async function recursiveLoad(octokit: Octokit, repo: Repo, path: string, contents: Contents) {
  console.log("recursiveLoad", path)

  let [content, error] = await expect(octokit.repos.getContent({
    owner: repo.userName,
    repo: repo.repoName,
    path: path,
  }))

  console.log(content)
  //console.log(error)

  if (content != null) {
    for (let entry of content.data as any) {
      console.log(entry.path)
      if (entry.type === "dir") {
        await recursiveLoad(octokit, repo, entry.path, contents)
      } else if (entry.type === "file") {
        let content = await cachedFetch(octokit, repo, entry.path, entry.sha)
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
      }
    }
    debugger;
  }
}

export async function loadContents(repos: Repos): Promise<Contents> {
  console.log("Loading contents")
  console.log(repos)

  let contents = {
    notes: []
  }

  for (let repo of repos) {
    const octokit = new Octokit({
      auth: repo.token,
    });

    await recursiveLoad(octokit, repo, ".", contents);
  }

  return contents;
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
