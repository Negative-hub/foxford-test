/// <reference types="vite/client" />
/// <reference types="vite-svg-loader" />

interface ImportMetaEnv {
  readonly VITE_GITHUB_ACCESS_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
