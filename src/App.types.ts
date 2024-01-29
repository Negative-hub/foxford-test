export interface Repository {
  id: number,
  name: string,
  description: string,
  stargazers_count: number,
  language: string | null,
  git_url: string,
  owner: {
    login: string,
    avatar_url: string,
    url: string
  }
}

export interface Repositories {
  total_count: number,
  items: Repository[]
}

export interface ComponentData {
  message: string,
  page: number,
  perPage: number,
  isLoading: boolean,
  repositories: Repositories
}