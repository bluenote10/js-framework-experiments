
export type Repo = {
  userName: string,
  repoName: string,
  token: string,
  enabled: boolean,
  default: boolean,
}

export function getStoredRepos(): Repo[] {
  let reposEntry = window.localStorage.getItem("repos")
  if (reposEntry != null) {
    return JSON.parse(reposEntry) as Repo[]
  } else {
    return []
  }
}

export function setStoredRepos(repos: Repo[]) {
  window.localStorage.setItem("repos", JSON.stringify(repos))
}

