import Exception from '@allayjs/exception'

export const E_INVALID_ENVIRONMENT_VARIABLES = class EnvironmentValidationException extends Exception {
  static message = 'Validation failed for one or more environment variables'
  static code = 'E_INVALID_ENVIRONMENT_VARIABLES'

  help: string = ''
}
