import { Octokit } from '@octokit/rest';

const auth = process.env.REACT_APP_AUTH;
console.log(auth)

const octokit = new Octokit({
  auth: auth,
});

// Compare: https://docs.github.com/en/rest/reference/repos/#list-organization-repositories
/*
octokit.repos
  .listForOrg({
    org: "octokit",
    type: "public",
  })
  .then(({ data }) => {
    console.log(data)
  });
*/

/*
octokit.repos.listForAuthenticatedUser()
  .then(({ data }) => {
    console.log(data)
  });
*/

export async function getData() {
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
