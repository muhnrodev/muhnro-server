# Git Commit Messages

When generating a Git commit message, follow these rules exactly.

## Format

Always use Conventional Commits:

`<type>(<scope>): <description>`

The scope is optional when there is no meaningful scope.

## First inspect the diff

Before generating a commit message:

1. Inspect the staged/changed files and their diff.
2. Determine what the changes actually do.
3. Classify the change based on its purpose and behavior.
4. Generate one concise commit message.

Do not classify a change based merely on the fact that code or files were added.

## Commit types

- `feat`: Adds genuinely new user-facing functionality or an API capability consumed by users/clients.
- `fix`: Fixes incorrect or broken behavior.
- `refactor`: Changes code structure without changing behavior.
- `perf`: Improves application performance without changing behavior.
- `docs`: Documentation-only changes.
- `test`: Adds or modifies tests.
- `chore`: Maintenance, dependencies, npm scripts, development tooling, configuration, or miscellaneous maintenance.
- `style`: Formatting or whitespace changes with no behavioral impact.
- `build`: Changes to build systems or build dependencies.
- `ci`: Changes to CI/CD configuration.
- `revert`: Reverts a previous commit.

## Important classification rules

Do NOT use `feat` simply because something was added.

Use `feat` ONLY when the change introduces functionality that users or consumers of the application can actually use.

Examples:

- New API endpoint → `feat`
- New booking capability → `feat`
- New payment capability → `feat`
- New user-facing UI functionality → `feat`

Examples that are NOT `feat`:

- Adding npm scripts → `chore`
- Updating dependencies → `chore`
- Updating package.json configuration → `chore`
- Updating ESLint configuration → `chore`
- Updating TypeScript configuration → `chore`
- Adding developer tooling → `chore`
- Updating build configuration → `build`
- Updating GitHub Actions → `ci`
- Internal code cleanup → `refactor`
- Fixing broken behavior → `fix`
- Adding tests → `test`
- Updating documentation → `docs`

## package.json

Changes to `package.json` should normally use:

`chore(package.json): <description>`

Examples:

`chore(package.json): add versioning scripts`

`chore(package.json): update development dependencies`

Do NOT use:

`feat(package.json): add versioning scripts`

unless the package.json change itself directly introduces genuine user-facing functionality.

## Description

The description must:

- Be imperative.
- Be concise.
- Start with lowercase.
- Not end with a period.
- Describe what changed rather than why.
- Be specific rather than vague.
- Avoid exaggerated wording.

## Scope

Use a meaningful scope when one is obvious.

Examples:

`feat(bookings): add vehicle swap capability`

`fix(payments): prevent duplicate payment references`

`refactor(auth): simplify token validation`

`perf(media): optimize image processing`

`chore(package.json): add versioning scripts`

If there is no meaningful scope, use:

`fix: prevent duplicate booking submission`

Do not invent scopes merely to satisfy the format.

## Decision rule

When deciding between `feat` and `chore`, prefer `chore` unless the change clearly introduces user-facing or consumer-facing functionality.

When deciding between multiple types, classify based on the PRIMARY purpose of the change.

## Output

When asked to generate a commit message:

- Output ONE commit message.
- Do not provide multiple alternatives.
- Do not explain the classification.
- Do not include quotes around the commit message.
- Do not include Markdown code fences.
- Do not include a bullet point.
- Return only the commit message.
