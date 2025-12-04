# Create PR

Follow these steps to prepare and create a pull request:

## Step 1: Run Prettier
Run `yarn format` to fix formatting on all changed files. Fix any issues that can't be auto-fixed.

## Step 2: Run ESLint
Run `yarn lint --fix` to fix linting issues. Fix any remaining issues manually.

## Step 3: Run Rubocop
Run `bundle exec rubocop -a` to fix Ruby style issues. Fix any remaining issues manually.

## Step 4: Run All Tests
Run both test suites and ensure they pass:
- `NO_COVERAGE=true yarn test` (Jest)
- `NO_COVERAGE=true bundle exec rspec` (RSpec)

If any tests fail, fix them before proceeding.

## Step 5: Commit and Push
Only if ALL checks pass:
1. Stage all changes
2. Create a commit with a descriptive message
3. Push to the remote branch

## Step 6: Create the PR
Create a pull request using `gh pr create` with:
- A clear title describing the changes
- A summary of what was changed and why
- A test plan if applicable

## Step 7: Follow PR Workflow
After creating the PR:
1. Wait for CI to complete
2. Wait for Copilot review
3. Address any failures or review comments
4. Only merge when all checks pass and comments are resolved
