# Project Context - D&D 2014 + 2024 Edition Support

## Current Branch
`feature/2024_rules`

## What Was Accomplished

### 1. Edition Support Infrastructure
- Added `edition` column to all SRD content tables (monsters, spells, classes, races, items, rules, etc.)
- Created `Editionable` concern (`app/models/concerns/editionable.rb`) included in all content models
- Added `current_edition` helper in `ApplicationController` that reads from session/header
- All controllers now filter content by edition
- Updated slug indexes to include edition for proper uniqueness

### 2. Frontend Edition Toggle
- Created `EditionContext` (`contexts/EditionContext.tsx`) with localStorage persistence
- Created `EditionToggle` component in sidebar for switching between 2014/2024
- API now sends `X-DND-Edition` header with requests
- `PageTitle` component shows "(Legacy)" badge for 2014 content

### 3. Python PDF Parser
- Located at `scripts/srd_parser/`
- Extracts content from official SRD 5.2.1 PDF using pdfplumber
- Extractors for: rules, monsters, spells, classes, races, items, magic_items, conditions, skills, profs, ability_scores
- Outputs JSON files to `scripts/srd_parser/output/2024/`
- Run with: `python parser.py /path/to/pdf --edition 2024`

### 4. SRD Importer Service
- `app/services/srd_importer.rb` - imports JSON data into Rails models
- Rake tasks in `lib/tasks/srd.rake`:
  - `rails srd:import[edition]` - import all content types
  - `rails srd:import_type[type,edition]` - import specific type

### 5. Removed Conditions Model
- Conditions are now stored as Rules with `category: "Conditions"`
- Deleted `Condition` model, controller, views, tests
- Dropped `conditions` table via migration

### 6. Rules Page Refactor
- `RulesIndex` now displays category cards dynamically (based on rule categories in DB)
- `RulesCategory` component handles both category views AND individual rules
- Fixed infinite loop bug by:
  - Adding separate `currentRuleLoading` state in reducer
  - Preserving `rules` array during refetch (not clearing it)
  - Using `useRef` in `Rule` component to prevent duplicate fetches

### 7. JSON Data Files
- `scripts/srd_parser/output/2024/` - 2024 edition content from PDF
- `scripts/srd_parser/output/2014/` - 2014 edition content exported from existing DB
- Magic items extracted from PDF pages 209-253 (54 items)

## Database Migrations Created
1. `add_edition_to_srd_content` - adds edition column to all tables
2. `change_slug_indexes_to_include_edition` - unique indexes on (slug, edition)
3. `add_primary_abilities_to_dnd_classes` - for 2024 class data
4. `drop_conditions_table` - removes conditions (now in rules)

## Files That Need Tests (Coverage Gaps)
- `contexts/EditionContext.tsx` - 0% coverage
- `components/EditionToggle/EditionToggle.tsx` - 0% coverage
- `pages/rules/RulesCategory.tsx` - 0% coverage
- `pages/rules/RulesIndex.tsx` - 33% coverage

## Current Test Status
- **Jest**: 1083 tests passing, functions coverage at 54.94% (threshold 55%)
- **RSpec**: 1078 tests passing, line coverage at 79.8%

## Slash Commands Created
- `/commit` - runs lint/format/rubocop/jest/rspec, then commits and pushes (no PR)

## Key Files Modified
### Backend
- All models in `app/models/` - added `include Editionable`
- All controllers in `app/controllers/admin/v1/` - added edition filtering
- `app/controllers/application_controller.rb` - added `current_edition` helper
- `config/routes.rb` - removed conditions routes

### Frontend
- `App.tsx` - wrapped with EditionProvider
- `api/api.ts` - sends X-DND-Edition header
- `components/SideBar/SideBar.tsx` - added EditionToggle
- `reducers/rules.ts` - added currentRuleLoading, fixed state management
- `pages/rules/Rule.tsx` - fixed infinite loop with useRef
- `pages/rules/RulesIndex.tsx` - dynamic category display
- `pages/rules/RulesCategory.tsx` - new component for category/rule routing

## Next Steps (TODO)
1. Write tests for new components to improve coverage:
   - EditionContext tests
   - EditionToggle tests
   - RulesCategory tests
   - RulesIndex tests (improve coverage)
2. Test the rules pages in browser to confirm infinite loop is fixed
3. Consider adding more 2024 content as it becomes available

## Important Notes
- Default edition is '2024'
- Edition is stored in localStorage as 'dnd-edition'
- Backend reads edition from: params[:edition] || request.headers['X-DND-Edition'] || session[:edition] || '2024'
- The PDF parser uses column-based extraction for two-column layouts
