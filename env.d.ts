interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_URL_FRONT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}