# QINGDAO-P0-REPO-BASELINE-09 — Package Lock and Scripts Policy Decision

## 1. Purpose

This document defines the governance policy for package lock handling and package script evolution in the Qingdao project.

This decision does not modify `package.json`.

This decision does not create `package-lock.json`.

This decision does not install dependencies.

This decision does not create GitHub workflows.

This decision only defines the governance gate for future package and script work.

## 2. Current Verified Baseline

| Item                       | Verified State        |
| -------------------------- | --------------------- |
| repo                       | `qidianzhiku/qingdao` |
| branch                     | `main`                |
| latest merged PR           | PR #5                 |
| working tree               | clean                 |
| `.github` exists           | false                 |
| `.github/workflows` exists | false                 |
| `package.json` exists      | true                  |
| `package-lock.json` exists | false                 |
| `server.ts` exists         | false                 |
| Node                       | `v24.18.0`            |
| npm                        | `11.6.0`              |

Tracked `.github` files: none.

Tracked workflow files: none.

Tracked package-related files: `package.json` only.

Untracked files: none.

SimWar exclusion: confirmed. This policy applies only to `qidianzhiku/qingdao`.

## 3. Current Package Scripts Inventory

| Script Name    | Command        | Present? | Future CI Candidate?                            | Current Policy                   |
| -------------- | -------------- | -------- | ----------------------------------------------- | -------------------------------- |
| `dev`          | `vite`         | Yes      | No                                              | local development only           |
| `build`        | `vite build`   | Yes      | Yes, after dependency install policy is settled | only current build candidate     |
| `preview`      | `vite preview` | Yes      | No                                              | preview server only              |
| `lint`         | N/A            | No       | No                                              | cannot be referenced by workflow |
| `typecheck`    | N/A            | No       | No                                              | cannot be referenced by workflow |
| `test`         | N/A            | No       | No                                              | cannot be referenced by workflow |
| `format:check` | N/A            | No       | No                                              | cannot be referenced by workflow |
| `format`       | N/A            | No       | No                                              | cannot be referenced by workflow |
| `test:e2e`     | N/A            | No       | No                                              | cannot be referenced by workflow |
| `coverage`     | N/A            | No       | No                                              | cannot be referenced by workflow |
| `audit`        | N/A            | No       | No                                              | no package script exists         |
| `security`     | N/A            | No       | No                                              | no package script exists         |

Verified dependencies:

- `lucide-react`: `^0.562.0`
- `recharts`: `^3.6.0`
- `react-dom`: `^19.2.3`
- `react`: `^19.2.3`

Verified devDependencies:

- `@types/node`: `^22.14.0`
- `@vitejs/plugin-react`: `^5.0.0`
- `typescript`: `^5.8.2`
- `vite`: `^6.2.0`

## 4. Package Lock Policy

The verified host `main` branch does not contain `package-lock.json`.

Therefore, future workflow work must not assume that `npm ci` is available.

Any creation of `package-lock.json` must be handled as a separate stage with a separate branch, separate worktree, separate PR, and separate Project Owner authorization.

A docs-only PR must not generate `package-lock.json`.

A developer must not run `npm install` merely as a side effect of a documentation or workflow planning task.

If the project later adopts an npm lockfile, the lockfile PR must first complete:

1. package manager decision
2. dependency installation reproducibility check
3. lockfile diff review
4. build smoke verification
5. isolated PR review

## 5. Scripts Policy

The current scripts are limited to `dev`, `build`, and `preview`.

Future workflows must not reference missing scripts.

The following commands must not be used by any workflow until they are formally added and verified in a separate Project Owner authorized PR:

- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run test`
- `npm run format:check`
- `npm run test:e2e`
- `npm run coverage`

Adding scripts must be a separate stage. It must not be combined with workflow creation in the same PR.

## 6. Future CI Dependency Policy

Future CI design must follow this order:

1. decide package-lock / install strategy
2. decide package scripts baseline
3. verify scripts in a separate host-run stage
4. create workflow only after the prior stages are complete
5. ensure workflow PRs reference only existing and verified scripts

Workflow work must not copy SimWar workflow configuration into Qingdao.

Workflow work must not reference nonexistent commands.

Workflow work must not assume Playwright, CodeQL, Vitest, coverage, Knip, Postgres, or any other advanced gate is available unless separately authorized and implemented.

## 7. Forbidden Actions Without Separate Authorization

The following actions are forbidden without separate Project Owner authorization:

- creating `package-lock.json`
- modifying `package.json`
- installing dependencies
- adding `lint`, `typecheck`, or `test` scripts
- creating `.github`
- creating `.github/workflows`
- adding CI workflow files
- adding CodeQL
- adding Playwright
- adding Vitest
- adding deployment
- touching source code
- touching tests
- auto merge

## 8. Required PR Shape for Future Package Changes

Future package-related PRs must satisfy:

- one task
- one branch
- one worktree
- one PR
- explicit Project Owner authorization
- no workflow changes in the same PR
- no source refactor in the same PR
- validation commands documented
- rollback plan documented

## 9. Required PR Shape for Future Workflow Changes

Future workflow PRs must satisfy:

- workflow PR must not add package scripts
- workflow PR must not create `package-lock.json`
- workflow PR must not install new dependencies
- workflow PR must reference only already-existing scripts
- workflow PR must use least-privilege permissions
- workflow PR must avoid deployment until separately authorized
- workflow PR must be reviewable and revertible in one commit

## 10. Risks

Key risks:

- no lockfile reproducibility risk
- workflow referencing missing scripts risk
- accidental `package-lock.json` generation risk
- copying SimWar workflow risk
- combining package, script, and workflow changes in one PR risk
- CI false confidence risk
- branch protection disruption risk

## 11. Recommended Next Step

The recommended next stage is:

`QINGDAO-P0-REPO-BASELINE-09A-PACKAGE-LOCK-AND-SCRIPTS-POLICY-DOCS-PR`

That stage may only add this decision document as a docs-only PR.

That stage must not:

- modify `package.json`
- create `package-lock.json`
- install dependencies
- create workflows
- modify source code
- modify tests

## 12. Non-Goals

This decision does not:

- modify `package.json`
- create `package-lock.json`
- install dependencies
- add scripts
- run build
- run lint
- run tests
- create workflows
- modify source code

## 13. Final Decision

Until a separate Project Owner authorized PR establishes package-lock and script policy, future workflow work must not reference missing package scripts and must not assume npm ci readiness.

## 14. Final Conclusion

`QINGDAO-P0-REPO-BASELINE-09-PACKAGE-LOCK-AND-SCRIPTS-POLICY-DECISION DOC-READY / NO-PACKAGE-CHANGES-AUTHORIZED`

package-lock creation: not authorized.

package.json modification: not authorized.

dependency installation: not authorized.

workflow creation: not authorized.

source changes: not authorized.

Next allowed action: create docs-only package lock and scripts policy decision PR.
