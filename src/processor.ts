import dotenv from 'dotenv'

import Loader from './loader'

export default class Processor {
  private appRoot: URL

  constructor(appRoot: URL) {
    this.appRoot = appRoot
  }

  private transformValue(value: string) {
    if (!Number.isNaN(Number(value))) {
      return Number(value)
    }

    const lowerCaseValue = value.toLowerCase()
    if (['true', 'false', '(true)', '(false)'].includes(lowerCaseValue)) {
      return lowerCaseValue === 'true' || lowerCaseValue === '(true)'
    }

    return value
  }

  private async processContents(contents: string, values: Record<string, any>) {
    if (!contents.trim()) {
      return values
    }

    const collection = dotenv.parse(contents.trim()) as Record<string, any>

    for (const key of Object.keys(collection)) {
      let value = process.env[key]

      if (!value) {
        value = values[key]
        process.env[key] = values[key]
      }

      if (!values[key]) {
        values[key] = value
      }
    }

    for (const key in values) {
      values[key] = this.transformValue(values[key])
    }

    return collection
  }

  private async loadAndProcessEnvironment() {
    const loadEnv = new Loader(this.appRoot)
    const variables = await loadEnv.load()

    const values: Record<string, any> = {}
    await Promise.all(variables.map(({ contents }) => this.processContents(contents, values)))

    return values
  }

  public async proccess() {
    return this.loadAndProcessEnvironment()
  }
}
