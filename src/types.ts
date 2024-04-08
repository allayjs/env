export interface Obj<V = any> {
  [key: string]: V
}

export interface EnvFile {
  path: string
  contents: string
  fileExists: boolean
}
