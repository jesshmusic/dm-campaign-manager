# Contributing to DM Campaign Manager

Thank you for your interest in contributing to DM Campaign Manager!

## Development Setup

### Prerequisites
- Ruby 3.x
- Node.js 18+
- PostgreSQL 14+
- Yarn

### Getting Started
```bash
# Clone the repository
git clone https://github.com/jesshmusic/dm-campaign-manager.git
cd dm-campaign-manager

# Install dependencies
bundle install
yarn install

# Setup database
rails db:create db:migrate

# Run the development server
rails s
```

## Code Style

### Ruby (Rails)
- Follow [RuboCop](https://rubocop.org/) guidelines (see `.rubocop.yml`)
- Run `bundle exec rubocop` before committing
- Maximum line length: 150 characters
- Use meaningful variable and method names

### JavaScript/TypeScript (React)
- Follow ESLint rules (see `.eslintrc.json`)
- Run `yarn lint` before committing
- Use Prettier for formatting: `yarn format`
- Prefer TypeScript over JavaScript for new files
- Use functional components with hooks

### CSS/SCSS
- Follow Stylelint rules (see `.stylelintrc`)
- Run `yarn stylelint` before committing

## Testing

### Backend (RSpec)
```bash
# Run all tests
bundle exec rspec

# Run specific test file
bundle exec rspec spec/requests/monsters_spec.rb

# Run with coverage
COVERAGE=true bundle exec rspec
```

### Frontend (Jest)
```bash
# Run all tests
yarn test

# Run in watch mode
yarn test:watch

# Run with coverage
yarn test:coverage
```

### Test Requirements
- All new features must include tests
- All bug fixes should include a regression test
- Maintain or improve code coverage
- Tests must use factories (FactoryBot) for test data, not seeds

## Pull Request Process

1. **Branch Naming**: Use descriptive branch names
   - `feat/add-monster-search` - New features
   - `fix/login-redirect-bug` - Bug fixes
   - `refactor/cleanup-api-controllers` - Refactoring
   - `docs/update-readme` - Documentation

2. **Commits**: Write clear, concise commit messages
   - Use present tense ("Add feature" not "Added feature")
   - Reference issues when applicable

3. **Pull Request**:
   - Fill out the PR template completely
   - Ensure all CI checks pass
   - Request review from code owners
   - Address review feedback promptly

4. **Merging**:
   - Squash and merge for cleaner history
   - Delete branch after merging

## Branch Protection Rules

The `main` branch has the following protections:
- Require pull request reviews before merging
- Require status checks to pass (CI tests)
- Require branches to be up to date before merging
- No direct pushes allowed

## Questions?

Open an issue with the `question` label or reach out to the maintainers.
