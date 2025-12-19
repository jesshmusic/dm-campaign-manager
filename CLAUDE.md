# Claude Code Instructions

## Testing Requirements

**Failing tests are never acceptable.** When making code changes:

1. Always run tests after making changes
2. Update tests **while** making changes, not after
3. If a change breaks existing tests, fix them immediately
4. Never commit code with failing tests
5. Both Jest (frontend) and RSpec (backend) tests must pass
6. **Write tests for new components/features as you create them** - don't leave new code untested
7. Maintain coverage thresholds - new code should not decrease overall test coverage

## Pre-Push Checklist

**Always check ALL of these before pushing:**

1. `yarn lint` - ESLint
2. `yarn format:check` - Prettier
3. `bundle exec rubocop` - Rubocop
4. `NO_COVERAGE=true yarn test` - Jest tests
5. `NO_COVERAGE=true bundle exec rspec` - RSpec tests

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

## PR Creation Steps

Before creating a PR, follow these steps in order:

1. **Run Prettier** - `yarn format` to fix all changed files
2. **Run ESLint** - `yarn lint --fix` to fix linting issues
3. **Run Rubocop** - `bundle exec rubocop -a` to fix Ruby style issues
4. **Run all tests** - Both `NO_COVERAGE=true yarn test` and `NO_COVERAGE=true bundle exec rspec` must pass
5. **Commit and push** - Only if ALL checks pass and issues are fixed
6. **Open PR** - Create the pull request, then follow the Pull Request Workflow below

## Pull Request Workflow

After every commit and push to a PR:

1. **Wait for CI to complete** - All checks must pass (Jest, RSpec, Lint)
2. **Wait for Copilot review** - GitHub Copilot will automatically review the PR
3. **Address any failures** - Fix broken tests immediately
4. **Resolve Copilot comments** - Address any issues Copilot identifies and resolve those conversations
5. **Only merge when green** - All checks passing and no unresolved review comments

Never merge a PR with failing tests or unresolved Copilot review comments.

## Zeitwerk Naming Conventions

The `OpenAIClient` class is in `app/models/utilities/openai_client.rb`. Zeitwerk maps `openai` to `OpenAI` via a custom inflector in `config/initializers/zeitwerk.rb`. The `utilities/` folder is added as an autoload root in `config/application.rb`, so classes there don't have a `Utilities::` namespace prefix.
