import type { EnvFile } from './types'
import { isAbsolute, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { v } from '.'

export default class Loader {
  private appRoot: string
  private loadExampleFile: boolean

  constructor(appRoot: URL, loadExampleFile: boolean = false) {
    this.appRoot = typeof appRoot === 'string' ? appRoot : fileURLToPath(appRoot)
    this.loadExampleFile = loadExampleFile
  }

  private async loadFile(path: string) {
    try {
      const contents = await Bun.file(path).text()
      return {
        contents,
        fileExists: true,
      }
    } catch (error) {
      const schema = v.object({ code: v.string() })
      const validate = v.safeParse(schema, error)

      if (validate.success && validate.output.code !== 'ENOENT') {
        throw error
      }

      return { contents: '', fileExists: false }
    }
  }

  public async load(): Promise<EnvFile[]> {
    const ENV_PATH = process.env.ENV_PATH
    const NODE_ENV = process.env.NODE_ENV

    const files: EnvFile[] = []
    let basePath = ENV_PATH || this.appRoot

    if (ENV_PATH && !isAbsolute(basePath)) {
      basePath = join(this.appRoot, ENV_PATH)
    }

    if (NODE_ENV) {
      const nodeEnvLocalFile = join(basePath, `.env.${NODE_ENV}.local`)
      files.push({ path: nodeEnvLocalFile, ...(await this.loadFile(nodeEnvLocalFile)) })
    }

    if (!NODE_ENV || !['test', 'testing'].includes(NODE_ENV)) {
      const envLocalFile = join(basePath, '.env.local')
      files.push({ path: envLocalFile, ...(await this.loadFile(envLocalFile)) })
    }

    if (NODE_ENV) {
      const nodeEnvFile = join(basePath, `.env.${NODE_ENV}`)
      files.push({ path: nodeEnvFile, ...(await this.loadFile(nodeEnvFile)) })
    }

    const envFile = join(basePath, '.env')
    files.push({ path: envFile, ...(await this.loadFile(envFile)) })

    if (this.loadExampleFile) {
      const envExampleFile = join(basePath, '.env.example')
      files.push({ path: envExampleFile, ...(await this.loadFile(envExampleFile)) })
    }

    return files
  }
}
