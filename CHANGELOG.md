# @allayjs/env

## 0.1.1

### Patch Changes

- 26aabb3: feat: integrate dotenv for environment variable management

  - Add dotenv dependency for better environment variable management.
  - Implement Loader class to handle .env file loading based on the
    application's root path and NODE_ENV.
  - Modify Processor class to utilize dotenv for parsing environment
    variables and integrate Loader for file loading.
  - Update Env class to accept application root path as an argument for
    initializing the Processor with the correct directory.
  - Remove previous environment variable parsing logic in Processor and
    replace with dotenv parsing logic.
  - Add new EnvFile interface in types.ts for Loader class output.
  - Remove unused imports and refactor code across several files to
    align with new dotenv integration.

## 0.1.0

### Minor Changes

- 4732c67: - **`Env` class** in `env.ts` to handle, validate, and parse environment variables with methods for creation, setting, and retrieving values.

  - **`E_INVALID_ENVIRONMENT_VARIABLES` exception class** in `exceptions.ts` for handling invalid environment variables.
  - **Export** of `Env` class, exceptions, and validation types in `index.ts`.

  These changes introduce robust tools for environment variable management including creation, validation, parsing, and exception handling to improve application configuration processes.
