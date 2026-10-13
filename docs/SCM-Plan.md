# SOFTWARE CONFIGURATION MANAGEMENT PLAN

**Project Name:** Secure Campus Lost and Found System  
**Version:** 1.0  
**Prepared by:** Student Project Developer  
**Date:** 13 October 2026

## 1. Purpose

The purpose of this Software Configuration Management (SCM) Plan is to define how changes to the Secure Campus Lost and Found System will be identified, developed, reviewed, tested, tracked and released. The plan establishes procedures for maintaining source-code integrity, preventing accidental loss of work, documenting modifications and ensuring that the application remains reliable as new features are introduced.

Git will be used for local version control, while GitHub will host the repository, track issues, manage pull requests and automate quality checks.

## 2. Scope

This plan applies to all application components and project documentation, including:

- Frontend interfaces developed using React, TypeScript and Tailwind CSS.
- Backend services and REST API endpoints developed using Node.js and Express.
- Database schemas, migrations and configuration files for PostgreSQL.
- Automated tests, GitHub Actions workflows and deployment configuration.
- Project documentation, including the README, requirements and user instructions.

The plan covers changes from initial development through testing, integration and release. Passwords, API keys, database credentials and other secrets must never be committed to the repository. Environment-specific settings will be stored in environment variables, with a safe `.env.example` file provided where necessary.

## 3. Roles and Responsibilities

The project initially has one student developer. Responsibilities may be separated among team members if the project expands.

**Project Developer:** Identifies requirements, creates GitHub issues, implements features, writes tests, maintains documentation, resolves defects and prepares releases.

**Reviewer:** Checks proposed changes for correctness, readability, security and compliance with project requirements. Initially, the developer will perform a self-review, supplemented by peer review where available.

**Repository Maintainer:** Controls repository settings, manages branch protection where available, reviews merge readiness, creates version tags and maintains release notes. Initially, these duties belong to the student developer.

**Users or Stakeholders:** Report defects, suggest improvements and provide feedback on usability and expected behaviour.

## 4. Version Control Strategy

The project will use GitHub Flow because it is suitable for a small, initially single-developer project with incremental feature development. It avoids the overhead of maintaining separate permanent development and release branches while keeping the main branch stable.

The `main` branch will contain the reviewed, tested and release-ready version of the application. Direct commits to `main` will be avoided during normal feature development.

Short-lived branches will be created from `main` using these naming conventions:

- `feature/issue-number-short-description` for new features.
- `fix/issue-number-short-description` for bug fixes.
- `docs/short-description` for documentation changes.
- `test/short-description` for test-related changes.

Examples include `feature/12-item-search` and `fix/15-claim-validation`.

Each branch should address one clearly defined task. Changes will be committed using descriptive messages, such as `feat: add lost item reporting form` or `fix: validate item claim fields`.

Once a change is complete, the developer will push the branch, open a pull request against `main`, review the changes, run the required checks and merge only when the change is ready. The feature branch will then be deleted. Important releases will be identified using version tags such as `v1.0.0`.

## 5. Change Control Strategy

Every significant feature request, defect or improvement will be recorded as a GitHub Issue. Each issue should include a descriptive title, background, expected behaviour, acceptance criteria and priority where appropriate.

The change-control workflow will be:

1. Record the requested change as a GitHub Issue.
2. Review its scope, priority, risks and acceptance criteria.
3. Create a short-lived branch linked to the issue.
4. Implement the change and write or update relevant tests.
5. Open a pull request referencing the issue.
6. Review the code, verify the tests and resolve identified problems.
7. Merge the approved change into `main`.
8. Close the issue and update documentation or release notes where necessary.

Changes involving authentication, authorization, ownership claims or personal information require particular attention to access control and data privacy. Database schema changes must include appropriate migrations and be checked for compatibility with existing data.

If a change fails testing or introduces a defect, the developer will correct it in the same branch or revert the change where necessary. Significant changes to requirements or scope must be documented in the relevant issue before implementation.

## 6. CI/CD Process Control Strategy

GitHub Actions will be used to automate basic quality checks whenever code is pushed to a branch or a pull request is opened against `main`.

The continuous integration pipeline will perform the following checks as the relevant scripts become available:

- Install project dependencies using the project's lockfile.
- Run linting and TypeScript checks where configured.
- Execute automated unit and integration tests.
- Build the frontend and backend components as applicable.
- Report failures so that they can be resolved before merging.

The pipeline must pass before a change is considered ready for integration. Until a deployment workflow is configured, releases will be performed manually after successful testing. Once deployment is introduced, the production environment must use protected credentials and a verified release version.

The developer will also test critical user flows, including reporting an item, searching for items and submitting a claim, before each release. Automated checks complement rather than replace manual testing.

## 7. Issue Tracking Tool and Workflow

GitHub Issues will be the primary issue-tracking tool because it is integrated with the source-code repository and supports traceability between requirements, implementation branches, pull requests and releases.

Issues will be categorized using labels such as `feature`, `bug`, `documentation`, `testing` and `security`. Priority labels may include `high`, `medium` and `low`.

A typical workflow is:

**Open → Ready → In Progress → In Review → Done**

An issue begins as Open when reported, becomes Ready when its requirements are clear, and moves to In Progress when implementation begins. It enters In Review when a pull request is opened and becomes Done after successful integration and verification.

Each pull request will reference its issue using a keyword such as `Closes #12`. This creates a traceable link between the requested change and the resulting code. Duplicate issues will be linked, and rejected or postponed requests will be closed with an explanation.

## 8. Release Strategy

The application will use incremental releases so that useful features can be delivered without waiting for the entire system to be completed.

The initial release, `v0.1.0`, will provide the basic interface and lost-and-found item listing. Later releases will introduce item reporting, search and filtering, ownership claims, authentication, administrative review and additional security improvements.

A release candidate must pass the configured automated checks and manual tests for its intended functionality. The developer will review unresolved critical defects, verify configuration and database migrations, update the README and release notes, and confirm that secrets are excluded from version control.

Stable releases will be tagged using Semantic Versioning (`MAJOR.MINOR.PATCH`). For example, `v1.0.0` represents the first stable release, `v1.1.0` introduces backward-compatible functionality, and `v1.1.1` contains a backward-compatible bug fix. Breaking changes after version 1.0.0 will require an appropriate major-version increment.

Each GitHub Release will include the version number, release date, key changes, known limitations and setup instructions where relevant. If a release introduces a serious defect, the developer will fix the problem through a new branch and release or revert the faulty change.

**Plan Review:** This SCM Plan will be reviewed whenever the project structure, team size, development workflow or release requirements change significantly.