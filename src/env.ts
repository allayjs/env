import type { BaseSchema, Input } from 'valibot'
import type { Obj } from './types'

import Processor from './processor'
import Validator from './validator'

export default class Env<Values extends Obj> {
  private values: Values
  public static schema: any

  constructor(values: Values) {
    this.values = values
  }

  public static async create<Schema extends Obj<BaseSchema<any>>>(
    appRoot: URL,
    schema: Schema,
  ): Promise<Env<{ [key in keyof Schema]: Input<(typeof schema)[key]> }>> {
    const values = await new Processor(appRoot).proccess()
    const validator = this.rules(schema)

    return new Env(
      validator.parse(values) as {
        [key in keyof Schema]: Input<(typeof schema)[key]>
      },
    )
  }

  public static rules<Schema extends Obj<BaseSchema<any, any>>>(schema: Schema) {
    return new Validator(schema)
  }

  public get<K extends keyof Values>(key: K): Values[K]
  public get<K extends keyof Values>(key: K, defaultValue: Exclude<Values[K], undefined>): Exclude<Values[K], undefined>
  public get(key: string): string | undefined
  public get(key: string, defaultValue: string): string
  public get(key: string, defaultValue?: any): any {
    if (this.values[key] !== undefined) {
      return this.values[key]
    }

    const envValue = process.env[key]
    if (envValue) {
      return envValue
    }

    return defaultValue
  }

  public set<K extends keyof Values>(key: K, value: Values[K]): void
  public set(key: string, value: string): void
  public set(key: string | keyof Values, value: any): void {
    this.values[key] = value
    process.env[key as string] = value
  }
}
