---
"@allayjs/env": patch
---

feat: integrate dotenv for environment variable management

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
