# QINGDAO-P0-REPO-BASELINE-10 — Package Manager and Lockfile Strategy Decision

## 1. Purpose

This document defines the package manager and lockfile strategy for the Qingdao project.

This decision does not modify `package.json`.

This decision does not create `package-lock.json`.

This decision does not install dependencies.

This decision does not run `npm ci`.

This decision does not create GitHub workflows.

This decision only defines the package manager and lockfile strategy gate for future implementation work.

## 2. Current Verified Baseline

| Item                       | Verified State        |
| -------------------------- | --------------------- |
| repo                       | `qidianzhiku/qingdao` |
| branch                     | `main`                |
| latest merged PR           | PR #6                 |
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

## 3. Current Package Manager Evidence

Current repository evidence:

- `package.json` exists.
- `package-lock.json` does not exist.
- `pnpm-lock.yaml` is not verified as present.
- `yarn.lock` is not verified as present.
- local toolchain uses Node `v24.18.0`.
- local npm version is `11.6.0`.
- current available scripts are only `dev`, `build`, and `preview`.

Current repository evidence supports npm as the default package manager candidate, but npm lockfile generation is not authorized in this decision.

Current package scripts:

| Script Name    | Command        | Present? | Current Policy                                               |
| -------------- | -------------- | -------- | ------------------------------------------------------------ |
| `dev`          | `vite`         | Yes      | local development only                                       |
| `build`        | `vite build`   | Yes      | only current build candidate after install policy is settled |
| `preview`      | `vite preview` | Yes      | preview server only                                          |
| `lint`         | N/A            | No       | cannot be referenced by workflow                             |
| `typecheck`    | N/A            | No       | cannot be referenced by workflow                             |
| `test`         | N/A            | No       | cannot be referenced by workflow                             |
| `format:check` | N/A            | No       | cannot be referenced by workflow                             |

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

## 4. Package Manager Decision

npm is the default package manager candidate for Qingdao unless a future Project Owner authorized decision changes it.

This decision does not authorize `npm install`.

This decision does not authorize `npm ci`.

This decision does not authorize `package-lock.json` creation.

This decision does not authorize dependency upgrades.

This decision does not authorize workflow creation.

## 5. Lockfile Strategy Decision

The current `main` branch does not contain `package-lock.json`.

Qingdao should adopt `package-lock.json` only through a future isolated lockfile implementation PR.

That future PR must:

1. be based on the latest `origin/main`
2. use an independent branch
3. use an independent worktree
4. handle only lockfile / install reproducibility
5. not create workflow files
6. not add package scripts
7. not modify source code
8. not modify tests
9. record Node/npm versions
10. record complete validation output
11. provide a rollback plan

## 6. Install Command Policy

Before `package-lock.json` enters `main`:

- future workflows must not use `npm ci`
- future docs must not claim `npm ci` is available
- future local validation must not rely on `npm ci`

After `package-lock.json` enters `main`:

- `npm ci` may become the preferred CI install command
- `npm install` should remain a local lockfile-maintenance command, not a CI command
- dependency update work must be handled in separate PRs

## 7. Future Lockfile Implementation Gate

Future creation of `package-lock.json` requires explicit Project Owner authorization:

`我授权创建 Qingdao package-lock.json implementation PR`

Without that authorization, no lockfile may be generated.

A future lockfile implementation PR should include at minimum:

- `git status --short --branch`
- `node -v`
- `npm -v`
- `npm install`, only if explicitly authorized
- inspect `package-lock.json`
- `npm run build`, only after lockfile generation is authorized
- `git diff --name-only`
- `git diff --stat`
- verify no `.github` changes
- verify no source changes unless separately authorized

## 8. Future Workflow Impact

Future workflow design must wait for:

1. package manager strategy decision merged
2. lockfile implementation PR merged, if `npm ci` will be used
3. scripts baseline decision merged
4. scripts implementation PR merged, if lint/typecheck/test will be used
5. workflow creation PR authorized

A workflow PR must not create a lockfile as a side effect.

A workflow PR must not add package scripts as a side effect.

A workflow PR must not install dependencies as a side effect.

A workflow PR must not copy SimWar workflow configuration into Qingdao.

A workflow PR must not enable CodeQL, Playwright, Vitest, Knip, Postgres, coverage, or deployment unless separately authorized and implemented.

## 9. Forbidden Actions Without Separate Authorization

The following actions are forbidden without separate Project Owner authorization:

- creating `package-lock.json`
- modifying `package.json`
- running `npm install`
- running `npm ci`
- running `npm update`
- running `npm audit fix`
- adding package scripts
- adding lint/typecheck/test tooling
- creating `.github`
- creating `.github/workflows`
- adding CI workflow
- adding CodeQL
- adding Playwright
- adding Vitest
- adding deployment
- touching source code
- touching tests
- auto merge

## 10. Required PR Shape for Future Lockfile Implementation

Future lockfile implementation PRs must satisfy:

- one task
- one branch
- one worktree
- one PR
- explicit Project Owner authorization
- no workflow changes in the same PR
- no source changes in the same PR
- no script additions in the same PR
- no dependency upgrades unless explicitly authorized
- validation commands documented
- generated lockfile diff reviewed
- rollback plan documented

## 11. Risks

Key risks:

- no lockfile reproducibility risk
- lockfile generated accidentally by `npm install`
- future workflow using `npm ci` before lockfile exists
- package manager ambiguity risk
- dependency drift risk
- combining lockfile, script, and workflow changes in one PR risk
- copying SimWar workflow risk
- CI false confidence risk

## 12. Recommended Next Step

The recommended next stage is:

`QINGDAO-P0-REPO-BASELINE-10A-PACKAGE-MANAGER-AND-LOCKFILE-STRATEGY-DOCS-PR`

That stage may only add this decision document as a docs-only PR.

That stage must not:

- modify `package.json`
- create `package-lock.json`
- install dependencies
- run `npm ci`
- create workflows
- modify source code
- modify tests

## 13. Non-Goals

This decision does not:

- modify `package.json`
- create `package-lock.json`
- run `npm install`
- run `npm ci`
- upgrade dependencies
- add scripts
- run build
- run lint
- run tests
- create workflows
- modify source code
- modify tests

## 14. Final Decision

npm is the default package manager candidate for Qingdao, but `package-lock.json` creation and `npm ci` readiness are not authorized until a separate Project Owner authorized implementation PR creates and verifies the lockfile.

## 15. Final Conclusion

`QINGDAO-P0-REPO-BASELINE-10-PACKAGE-MANAGER-AND-LOCKFILE-STRATEGY-DECISION DOC-READY / LOCKFILE-IMPLEMENTATION-NOT-AUTHORIZED`

package manager candidate: npm.

package-lock creation: not authorized.

npm install: not authorized.

npm ci: not authorized.

package.json modification: not authorized.

dependency installation: not authorized.

workflow creation: not authorized.

source changes: not authorized.

Next allowed action: create docs-only package manager and lockfile strategy decision PR.
