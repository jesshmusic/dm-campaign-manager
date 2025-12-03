# Claude Code Instructions

## Testing Requirements

**Failing tests are never acceptable.** When making code changes:

1. Always run tests after making changes
2. Update tests **while** making changes, not after
3. If a change breaks existing tests, fix them immediately
4. Never commit code with failing tests
5. Both Jest (frontend) and RSpec (backend) tests must pass

## Commands

- **Jest tests**: `NO_COVERAGE=true yarn test`
- **RSpec tests**: `NO_COVERAGE=true bundle exec rspec`
- **Prettier**: `yarn format` (to fix) / `yarn format:check` (to check)
- **ESLint**: `yarn lint`
- **Rubocop**: `bundle exec rubocop`

## Stack

- Rails 7 with Ruby 3.3
- React 18 with TypeScript
- Webpack 5 (Shakapacker)
- styled-components for CSS-in-JS
- react-pro-sidebar for navigation
- react-grid-layout for dashboard
- Auth0 for authentication
- PostgreSQL database

## Code Style

- Use styled-components, not CSS modules
- Use functional React components with hooks
- Use TypeScript for all new frontend code
- Follow existing patterns in the codebase

## Zeitwerk Naming Conventions

The `Utilities::Openai::Client` class uses `Openai` (not `OpenAI`) because Zeitwerk requires module names to match directory names. The directory is `app/models/utilities/openai/`, so the module must be `Openai`. Changing to `OpenAI` would require renaming the directory to `open_ai/` which would be a breaking change across the codebase.
