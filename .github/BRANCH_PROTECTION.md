# Branch Protection Rules

This document describes the recommended branch protection settings for this repository.

## Main Branch (`main`)

Configure in GitHub: Settings > Branches > Add branch protection rule

### Required Settings

| Setting | Value | Description |
|---------|-------|-------------|
| **Branch name pattern** | `main` | Protects the main branch |
| **Require a pull request before merging** | Yes | No direct pushes |
| **Required approvals** | 1 | At least one review required |
| **Dismiss stale PR approvals** | Yes | Re-review after new commits |
| **Require review from code owners** | Yes | CODEOWNERS must approve |
| **Require status checks to pass** | Yes | CI must pass |
| **Required status checks** | `RSpec Tests`, `Jest Tests`, `Lint` | All CI jobs |
| **Require branches to be up to date** | Yes | Must be current with main |
| **Require conversation resolution** | Yes | All comments addressed |
| **Do not allow bypassing** | Yes | Rules apply to admins too |

### Optional Settings

| Setting | Value | Description |
|---------|-------|-------------|
| **Require signed commits** | Optional | GPG-signed commits |
| **Require linear history** | Optional | No merge commits |
| **Allow force pushes** | No | Never allow force push |
| **Allow deletions** | No | Prevent branch deletion |

## Development Branch (`develop`)

If using GitFlow, apply similar but less strict rules:

| Setting | Value |
|---------|-------|
| **Require a pull request** | Yes |
| **Required approvals** | 1 |
| **Require status checks** | Yes |
| **Required status checks** | `RSpec Tests`, `Jest Tests` |

## Feature Branches

No protection required - developers can push freely to feature branches.

## Setup via GitHub CLI

```bash
# Enable branch protection for main
gh api repos/{owner}/{repo}/branches/main/protection \
  -X PUT \
  -H "Accept: application/vnd.github+json" \
  -f required_status_checks='{"strict":true,"contexts":["RSpec Tests","Jest Tests","Lint"]}' \
  -f enforce_admins=true \
  -f required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true,"require_code_owner_reviews":true}' \
  -f restrictions=null
```

## Ruleset (GitHub Repository Rulesets)

For repositories using the newer GitHub Rulesets feature:

```json
{
  "name": "Main Branch Protection",
  "target": "branch",
  "enforcement": "active",
  "conditions": {
    "ref_name": {
      "include": ["refs/heads/main"],
      "exclude": []
    }
  },
  "rules": [
    {
      "type": "pull_request",
      "parameters": {
        "required_approving_review_count": 1,
        "dismiss_stale_reviews_on_push": true,
        "require_code_owner_review": true,
        "require_last_push_approval": false
      }
    },
    {
      "type": "required_status_checks",
      "parameters": {
        "strict_required_status_checks_policy": true,
        "required_status_checks": [
          { "context": "RSpec Tests" },
          { "context": "Jest Tests" },
          { "context": "Lint" }
        ]
      }
    },
    {
      "type": "non_fast_forward"
    }
  ]
}
```
