import type { Input } from 'valibot'
import Exception from '@allayjs/exception'
import { parseAsync, record, string, unknown, ValiError } from 'valibot'

import { E_INVALID_ENVIRONMENT_VARIABLES } from './exceptions'

export default class Processor {
  private error: Exception

  constructor() {
    this.error = new E_INVALID_ENVIRONMENT_VARIABLES()
  }

  private async transformValue(value: string) {
    if (!Number.isNaN(Number(value))) {
      return Number(value)
    }

    const lowerCaseValue = value.toLowerCase()
    if (['true', 'false', '(true)', '(false)'].includes(lowerCaseValue)) {
      return lowerCaseValue === 'true' || lowerCaseValue === '(true)'
    }

    return value
  }

  private async loadAndProcessEnvironment() {
    const schema = record(string(), unknown())
    const variables = Bun.env ?? process.env

    try {
      const values = await parseAsync(schema, variables)
      const processedValues = Object.entries(values).reduce(
        async (promise, [key, value]) => {
          const acc = await promise

          if (typeof value === 'string') {
            acc[key] = await this.transformValue(value)
            return acc
          }

          acc[key] = value
          return acc
        },
        Promise.resolve({}) as Promise<Input<typeof schema>>,
      )

      return processedValues
    } catch (error) {
      if (error instanceof ValiError) {
        const help = error.issues.map((issue) => {
          return `- ${issue.message}`
        })

        this.error.help = help.join('\n')
        throw this.error
      }

      throw error
    }
  }

  public async proccess() {
    return this.loadAndProcessEnvironment()
  }
}
