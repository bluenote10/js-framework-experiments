
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
    return [
      createDefaultInitializedRepo(true)
    ]
  }
}

export function setStoredRepos(repos: Repo[]) {
  window.localStorage.setItem("repos", JSON.stringify(repos))
}

export function createDefaultInitializedRepo(isFirst: boolean): Repo {
  return {
    userName: "",
    repoName: "",
    token: "",
    enabled: true,
    default: (isFirst ? true : false),
  }
}