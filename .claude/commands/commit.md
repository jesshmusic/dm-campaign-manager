# Commit Command

Run all linting, formatting, and tests, then commit and push changes (without creating a PR).

## Steps to perform:

1. **Run Prettier** - `yarn format` to fix formatting
2. **Run ESLint** - `yarn lint` to check for lint errors
3. **Run Rubocop** - `bundle exec rubocop` to check Ruby style (use `-a` to auto-fix if needed)
4. **Run Jest tests** - `NO_COVERAGE=true yarn test`
5. **Run RSpec tests** - `NO_COVERAGE=true bundle exec rspec`

If ALL checks pass:
6. **Stage all changes** - `git add -A`
7. **Show git status and diff** - to understand what's being committed
8. **Write a descriptive commit message** based on the changes
9. **Commit** - using the commit message format from CLAUDE.md
10. **Push** - `git push` to the current branch

## Important:
- If any check fails, STOP and report the failure - do not commit
- Fix any auto-fixable issues (prettier, rubocop -a) before running tests
- The commit message should summarize all changes being committed
- Do NOT create a pull request - just commit and push
