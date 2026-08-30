# Git Commit Message Guidelines

Use Conventional Commits for all commit messages.

Format:

`<type>(<scope>): <description>`

## Commit types

- `feat`: Adds a new user-facing feature or capability.
- `fix`: Fixes incorrect or broken behavior.
- `refactor`: Changes code structure without changing behavior.
- `perf`: Improves application performance without changing behavior.
- `docs`: Documentation-only changes.
- `test`: Adds or modifies tests.
- `chore`: Developer tooling, configuration, dependencies, scripts, build configuration, CI/CD, or maintenance changes.
- `style`: Formatting or whitespace changes that do not affect behavior.
- `build`: Changes to the build system or build dependencies.
- `ci`: Changes to CI/CD configuration.
- `revert`: Reverts a previous commit.

## Classification rules

Before generating a commit message, determine what the change actually does.

Do NOT use `feat` simply because something was added.

Use `feat` only when the change introduces functionality that users or consumers of the application can use.

Examples:

- Adding a new API endpoint → `feat`
- Adding a new booking capability → `feat`
- Adding a new payment feature → `feat`
- Fixing incorrect booking behavior → `fix`
- Refactoring a service without behavior changes → `refactor`
- Adding npm scripts → `chore`
- Updating package.json scripts → `chore`
- Updating dependencies → `chore`
- Updating ESLint configuration → `chore`
- Updating TypeScript configuration → `chore`
- Updating build configuration → `build`
- Updating GitHub Actions → `ci`
- Adding or changing tests → `test`
- Improving application performance → `perf`
- Updating documentation → `docs`

## package.json rules

Changes to package.json should normally use `chore(package.json)` when they involve:

- npm scripts
- dependency updates
- development tooling
- configuration
- maintenance

Use another type only when the package.json change directly supports a change that genuinely belongs to that type.

For example:

`chore(package.json): add versioning scripts`

NOT:

`feat(package.json): add versioning scripts`

## Description rules

- Use imperative, concise wording.
- Do not capitalize the first word of the description.
- Do not end the description with a period.
- Describe what changed, not why it was changed.
- Do not exaggerate a change as a feature.
- Prefer a specific description over a vague one.
- Keep the subject line concise.

## Examples

Good:

`chore(package.json): add versioning scripts`

`feat(bookings): add vehicle swap capability`

`fix(payments): prevent duplicate payment references`

`refactor(auth): simplify token validation`

`perf(media): optimize image processing`

`docs(api): document payment endpoints`

`test(bookings): add vehicle availability tests`

`ci(github): add automated release workflow`

Bad:

`feat(package.json): add versioning scripts`

`feat: update stuff`

`fix: changes`

`feat: improve code`

When unsure between `feat` and `chore`, prefer `chore` unless the change clearly introduces user-facing functionality.
