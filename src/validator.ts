import type Exception from '@allayjs/exception'
import type { BaseSchema, Input, ObjectSchema } from 'valibot'
import type { Obj } from './types'
import { object, parse, ValiError } from 'valibot'

import { E_INVALID_ENVIRONMENT_VARIABLES } from './exceptions'

export default class Validator {
  private schema: ObjectSchema<Obj<BaseSchema<any>>>
  private error: Exception

  constructor(baseSchema: Obj<BaseSchema<any>>) {
    this.schema = object(baseSchema)
    this.error = new E_INVALID_ENVIRONMENT_VARIABLES()
  }

  public parse(input: unknown): Input<typeof this.schema> {
    try {
      return parse(this.schema, input)
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
}
