# QINGDAO-P0-REPO-BASELINE-08 — Workflow Tracking Decision

## 1. Purpose

This decision records the Qingdao project's governance gate for future GitHub Workflows and CI-related work.

This decision does not create GitHub workflows.

This decision does not modify package scripts.

This decision does not modify source code.

This decision only defines the policy gate for future workflow recovery or workflow creation.

## 2. Baseline

- Project: Qingdao / 青岛康养经营仿真项目
- Repository: `qidianzhiku/qingdao`
- Branch: `main`
- HEAD: `71b96c935189ae7c428d150eca5471162b9ad22d`
- Working tree status: clean
- Local path: `D:\codex\qingdao`
- SimWar exclusion: confirmed. This decision targets only `qidianzhiku/qingdao`.

Merged governance baseline:

- PR #1: `docs(governance): add Qingdao seed governance docs`
- PR #2: `docs(governance): add tracked deletions policy decision`
- PR #3: `docs(governance): add tracked deletions candidate audit`

Recent main history:

```text
71b96c9 Merge pull request #3
69b1255 docs(governance): add tracked deletions candidate audit
90016ee Merge pull request #2
9ed7c9b docs(governance): add tracked deletions policy decision
1ab6f1c Merge pull request #1
```

Current governance documents on `main` include:

- `docs/governance/FUTURE_DEVELOPMENT_PROMPT_CONSTRAINTS.md`
- `docs/governance/P0_REPO_BASELINE_02_GOVERNANCE_DOCS_TRACKING_DECISION.md`
- `docs/governance/P0_REPO_BASELINE_06_TRACKED_DELETIONS_POLICY_DECISION.md`
- `docs/governance/P0_REPO_BASELINE_07_TRACKED_DELETIONS_CANDIDATE_AUDIT.md`
- `docs/governance/PROJECT_AUDIT_BASELINE_AND_DEVELOPMENT_CONSTRAINTS.md`

## 3. Current Workflow Status

This stage does not authorize creating or restoring `.github/workflows`.

Workflow presence must be verified on the host before any workflow PR is proposed.

This decision does not assert that CI is currently enabled.

This decision does not assert that CodeQL, Playwright, Knip, Postgres checks, coverage, deployment, or E2E workflows are currently enabled.

No workflow file should be created, restored, or modified until a separate host inventory audit verifies:

- whether `.github/` exists
- whether `.github/workflows/` exists
- which package scripts are actually available
- which validation commands can be supported by the current Qingdao repository
- which workflow permissions and triggers are appropriate

## 4. Why Workflow Tracking Requires a Policy Gate

Workflow changes require a policy gate because GitHub Actions can affect every future pull request and can create repository-wide operational risk.

Risks include:

1. A workflow may trigger unknown CI failures.
2. A workflow may reference package scripts that do not exist.
3. A workflow may assume the wrong default branch.
4. A workflow may use an unsupported Node or npm version.
5. A workflow may introduce excessive GitHub token permissions.
6. A workflow may create deployment or secret exposure risk.
7. A workflow may accidentally copy quality gates from unrelated repositories.
8. A workflow may mix Qingdao governance with SimWar-specific assumptions.
9. A workflow committed to `main` affects all later branches and PRs.

For these reasons, workflow work must be isolated, evidenced, reviewable, and separately authorized.

## 5. Workflow Candidate Categories

Future workflow inventory or workflow recovery may consider these categories:

1. Basic install and build workflow.
2. Lint workflow.
3. Typecheck workflow.
4. Format check workflow.
5. Dependency audit workflow.
6. Security scanning workflow.
7. Deployment workflow.
8. Preview build workflow.

This decision does not approve adding any of these workflows.

Each workflow requires separate host verification, a separate PR, and separate Project Owner authorization.

## 6. Forbidden Workflow Actions Without Separate Authorization

The following actions are forbidden unless separately authorized by the Project Owner:

- creating `.github/workflows/*`
- modifying `.github/workflows/*`
- modifying `package.json`
- modifying `package-lock.json`
- installing dependencies
- changing Node version
- changing npm version
- changing build tooling
- changing Vite config
- changing TypeScript config
- changing source code
- changing test code
- adding Playwright
- adding CodeQL
- adding Knip
- adding Postgres checks
- adding deployment secrets
- adding GitHub tokens
- adding cloud deployment targets
- enabling auto-merge
- enabling destructive workflow permissions
- copying workflow content from SimWar without Qingdao-specific review

## 7. Required Evidence Before Any Future Workflow PR

Before any future workflow PR is proposed, the following evidence must be collected from the host repository:

1. `git status --short --branch`
2. `git ls-files .github`
3. package manifest inspection, such as `cat package.json` or equivalent
4. actual available npm scripts
5. Node and npm version
6. exact intended workflow file path
7. workflow permission model
8. branch trigger model
9. expected validation commands
10. local command equivalents, if available
11. rollback plan
12. explicit Project Owner authorization

Workflow decisions must be based on host evidence, not memory, assumptions, or another project's CI design.

## 8. Required PR Shape for Future Workflow Work

Future workflow work must follow these PR constraints:

1. One task, one branch, one worktree, one PR.
2. Branch from the latest clean `origin/main`.
3. PR title must state the exact workflow scope.
4. PR body must list every workflow file changed.
5. No source changes.
6. No test changes unless separately authorized.
7. No package changes unless separately authorized.
8. No dependency installation unless separately authorized.
9. No secrets.
10. No deployment unless separately authorized.
11. No auto-merge.
12. Explicit Project Owner authorization is required before merge.

## 9. Validation Requirements

A future workflow PR must validate at least:

- `git diff origin/main...HEAD --name-only`
- `git diff origin/main...HEAD --stat`
- workflow YAML syntax, if applicable
- package scripts referenced by the workflow actually exist
- local command equivalents pass, if available
- no secrets are introduced
- no broad or destructive permissions are introduced
- no SimWar workflow content is copied into Qingdao without review

If validation cannot be executed because supporting scripts do not yet exist, the PR must state that explicitly and must not pretend the validation is operational.

## 10. Rollback Requirements

Any future workflow PR must be revertible by a normal Git revert.

Workflow PRs must not be mixed with:

- source refactor
- package upgrade
- dependency installation
- feature development
- deletion cleanup
- formatting sweep
- deployment migration

Rollback must be simple, isolated, and auditable.

## 11. Non-Goals of This Decision

This decision does not create workflows.

This decision does not restore CI.

This decision does not modify package scripts.

This decision does not install dependencies.

This decision does not enable deployment.

This decision does not authorize CodeQL, Playwright, Knip, Postgres checks, or any SimWar-derived workflow.

This decision only creates the governance rule for future workflow tracking.

## 12. Decision

The Qingdao project adopts a workflow tracking gate before any GitHub Actions workflow may be created, restored, or modified.

No workflow may be introduced until host repository evidence, package script availability, workflow scope, permission model, rollback strategy, and Project Owner authorization are documented in a separate PR.

## 13. Next Stage

The next recommended stage is:

`QINGDAO-P0-REPO-BASELINE-08A-WORKFLOW-INVENTORY-AUDIT`

P0-08A may perform a workflow inventory audit.

P0-08A may verify whether `.github/` exists, whether workflows exist, and whether package scripts can support future CI.

P0-08A must not directly create a workflow.

## 14. Final Conclusion

`QINGDAO-P0-REPO-BASELINE-08-WORKFLOW-TRACKING-DECISION DOC-READY / NO-WORKFLOW-CHANGES-AUTHORIZED`

Workflow creation: not authorized.

Package changes: not authorized.

Source changes: not authorized.

Next allowed action: create docs-only workflow tracking decision PR.
