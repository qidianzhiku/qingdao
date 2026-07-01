# P0 Repo Baseline 06 — Tracked Deletions Policy Decision

## 1. Purpose

This document establishes the official governance policy for identifying, auditing, and deleting residual files from past iterations of the repository during the Qingdao Healthcare Operations Simulation project repository baseline recovery phase.

The primary objective is to define a strict policy gate and validation mechanism that ensures no critical simulation logic, configurations, package dependencies, workflows, or academic content are inadvertently destroyed or modified during baseline cleanup.

## 2. Current Baseline

As of the completion of QINGDAO-P0-05, PR #1 has been merged into the default branch `main` of the target repository `qidianzhiku/qingdao`.

Current baseline facts:

- Target repository: `qidianzhiku/qingdao`.
- Local path base: `D:\codex\qingdao`.
- Merged PR: PR #1.
- PR #1 scope: docs-only governance seed.
- PR #1 changed files count: exactly three files under `docs/governance/`.
- Current main branch status: aligned with `origin/main` after PR #1 merge and post-merge cleanup.

This policy decision acts as the direct successor to PR #1 and provides a formal gating standard before any tracked file deletions are carried out.

## 3. Definition of Tracked Deletions

A tracked deletion is any operation that permanently removes a tracked file from the Git history of the default branch through a committed change.

For this governance process, the following operations are treated as deletion-sensitive:

- Deleting a tracked file.
- Moving a tracked file.
- Renaming a tracked file.
- Removing a tracked placeholder file that controls directory presence.
- Removing legacy configuration, documentation, source, test, or workflow files.

A tracked deletion must be registered, audited, justified, reviewed, and approved through a dedicated Pull Request.

## 4. Why Deletions Require a Policy Gate

Residual files from legacy configurations, draft prototypes, sandbox generation experiments, or early project setup can create confusion. However, uncontrolled deletion is also risky.

Tracked deletions require a policy gate because they can cause:

- Dependency breaks if deleted files are imported, referenced, or dynamically loaded.
- Audit gaps if historical context or governance evidence is removed.
- Build failures if configuration or runtime files are removed without dependency tracing.
- Repository confusion if Qingdao project files are mixed up with unrelated project remnants.
- Rollback difficulty if deletion work is mixed with refactoring, formatting, package, workflow, or feature changes.

Therefore, no tracked file may be deleted from the default branch without passing the policy gate defined in this document.

## 5. Allowed Deletion Candidates

The following categories may be considered future deletion candidates, subject to evidence and separate approval:

1. Explicitly deprecated temporary files.
2. Obsolete historical drafts fully superseded by merged governance documents.
3. Sandbox-generated files that are empty, malformed, duplicated, or unrelated to the Qingdao project.
4. Empty directory placeholder files where the directory is no longer needed.
5. External project remnants that are confirmed to be unrelated to the Qingdao repository.
6. Duplicate document copies outside their authoritative paths.
7. Old configuration files confirmed not to participate in formatting, building, testing, linting, deployment, or runtime behavior.
8. Files confirmed not to be referenced by source code, tests, workflows, documentation, or package scripts.

This decision does not define the final deletion candidate list. It only defines candidate standards.

## 6. Forbidden Deletion Targets Without Separate Authorization

The following files and areas are protected and must not be deleted, moved, or renamed under a general cleanup task without separate Project Owner authorization:

- `src/`
- `tests/`
- `test/`
- `e2e/`
- `.github/`
- `.github/workflows/`
- `package.json`
- `package-lock.json`
- `README.md`
- `App.tsx`
- `index.tsx`
- `components/`
- `services/`
- `metadata.json`
- `vite.config.*`
- `tsconfig.*`
- `eslint.*`
- `prettier.*`
- business documentation originals
- course materials
- user-uploaded materials
- any file whose purpose cannot be clearly determined
- any file that may affect build, runtime, auditability, or rollback

Unknown files default to protected status until their purpose is researched and documented.

## 7. Required Pre-Deletion Evidence

Before any tracked deletion PR may be proposed, the following read-only evidence must be collected:

1. Static reference scan showing whether the target file is imported, referenced, dynamically loaded, linked, or mentioned.
2. Path and ownership explanation for every proposed deletion.
3. Reason the file is believed to be obsolete, duplicated, unrelated, or unsafe to retain.
4. Confirmation that the deletion target is not protected by Section 6.
5. Review of build, test, package, workflow, and runtime impact.
6. Explicit rollback plan.
7. Confirmation that the deletion PR will contain only authorized deletions.

Evidence must be included in the PR body or in a linked governance audit document.

## 8. Required PR Shape for Future Deletion Work

Future deletion work must follow these PR rules:

1. One task, one branch, one worktree, one PR.
2. The branch must be created from the latest clean `origin/main`.
3. The PR title must clearly identify the deletion scope.
4. The PR body must list every deleted file.
5. Every deleted file must have a deletion reason and supporting evidence.
6. `git diff --name-status origin/main...HEAD` must be included in validation.
7. The PR must not include source code modifications.
8. The PR must not include test modifications.
9. The PR must not include formatting-only edits.
10. The PR must not include package or workflow changes.
11. The PR must not include new files unless separately authorized.
12. The PR must not be auto-merged.
13. Merge requires separate explicit Project Owner authorization.

Deletion PRs must be small, reviewable, and reversible.

## 9. Validation Requirements

A future deletion PR must provide validation appropriate to its scope. At minimum, it must include:

- `git diff --name-status origin/main...HEAD`
- `git diff --stat origin/main...HEAD`
- `git status --short --branch`
- evidence that every changed path is expected
- confirmation that no unauthorized additions or modifications are included

If the repository has operational scripts available, deletion PRs should also run the relevant build, lint, typecheck, and test commands. If those scripts are not yet available, the PR must explicitly state that the validation is not yet operational and explain why.

## 10. Rollback Requirements

Every deletion PR must be safely reversible.

Rollback requirements:

1. The deletion PR must be revertible using a normal Git revert.
2. Deletion work must not be mixed with refactoring.
3. Deletion work must not be mixed with feature development.
4. Deletion work must not be mixed with dependency installation or package updates.
5. Deletion work must not be mixed with directory migration.
6. Deletion work must not be mixed with formatting changes.
7. The PR body must identify the exact revert strategy.

If rollback cannot be clearly described, the deletion must not proceed.

## 11. Audit Record Requirements

Every deletion proposal must maintain an audit record.

The audit record must include:

- repository name
- base branch
- task branch
- worktree path
- deletion candidate list
- evidence for every candidate
- validation commands and results
- final changed file list
- Project Owner authorization status
- merge status
- rollback notes

The merged deletion PR, if approved, becomes the permanent audit record for the deletion event.

## 12. Non-Goals of This Decision

This decision does not delete any files.

This decision does not define the final candidate file list.

This decision does not authorize general cleanup.

This decision does not authorize source code refactoring.

This decision does not authorize package changes.

This decision does not authorize workflow changes.

This decision does not authorize runtime, database, UI, Router, or simulationEngine changes.

This decision only defines the policy gate for future tracked deletion cleanup.

Actual deletion requires a separate PR, separate review, and separate Project Owner authorization.

## 13. Decision

The Qingdao project adopts this tracked deletions policy as the required governance gate for future deletion cleanup.

Any future deletion work must be performed through a separate, isolated, reviewable PR.

Any deletion executed outside this policy is considered a governance breach and must be reviewed for immediate revert.

## 14. Next Stage

After this decision document is reviewed and merged, the next stage is:

`QINGDAO-P0-REPO-BASELINE-06-PR-REVIEW-AND-MERGE-AUTHORIZATION`

After the P0-06 PR is merged, the project may proceed to:

`QINGDAO-P0-REPO-BASELINE-07-TRACKED-DELETIONS-CANDIDATE-AUDIT`

P0-07 may audit candidate deletion lists, but actual deletion still requires a separate authorized deletion PR.
