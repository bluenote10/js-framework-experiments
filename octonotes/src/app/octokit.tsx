import { Repo, Repos } from "./repo";

import { Octokit } from '@octokit/rest';

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

async function recursiveLoad(octokit: Octokit, repo: Repo, path: string, contents: Contents) {
  console.log("recursiveLoad", path)

  let [content, error] = await expect(octokit.repos.getContent({
    owner: repo.userName,
    repo: repo.repoName,
    path: path,
  }))

  //console.log(content)
  //console.log(error)

  if (content != null) {
    for (let entry of content.data as any) {
      console.log(entry)
      if (entry.type === "dir") {
        recursiveLoad(octokit, repo, `${path}/${entry.name}`, contents)
      }
    }
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
