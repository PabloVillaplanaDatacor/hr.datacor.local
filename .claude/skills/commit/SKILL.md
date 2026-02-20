---
name: commit
description: Stage and create a semantic commit for this HR Datacor project following Conventional Commits spec
argument-hint: "[optional scope or message hint]"
allowed-tools: Bash, Read, Glob, Grep
---

Create a semantic commit for the current changes in this repository.

## Steps

1. Run `git status` and `git diff` (staged + unstaged) in parallel to understand what changed.
2. Run `git log --oneline -5` to match the existing commit style of the repo.
3. Analyze the changes and determine the correct **type**, **scope**, and **subject**.
4. Stage only the relevant files (avoid `.env`, secrets, or unrelated files).
5. Commit using the message format below.

## Conventional Commits format

```
<type>(<scope>): <subject>

[optional body]
```

- **Subject**: imperative, lowercase, no period, max 72 chars.
- **Body**: only when the "why" is not obvious from the subject.

### Types

| Type       | When to use                                              |
|------------|----------------------------------------------------------|
| `feat`     | New page, component, or user-visible functionality       |
| `fix`      | Bug fix, hydration error, broken layout, logic error     |
| `style`    | CSS/Tailwind changes, theme, colors, spacing             |
| `refactor` | Code restructure with no behavior change                 |
| `chore`    | Config files, dependencies, tooling, CLAUDE.md           |
| `docs`     | README, CLAUDE.md, comments                              |
| `revert`   | Reverting a previous commit                              |

### Scopes for this project

| Scope         | Files it covers                                      |
|---------------|------------------------------------------------------|
| `dashboard`   | `src/app/(admin)/dashboard/`                         |
| `employees`   | `src/app/(admin)/employees/`                         |
| `departments` | `src/app/(admin)/departments/`                       |
| `settings`    | `src/app/(admin)/settings/`                          |
| `sidebar`     | `src/components/layout/sidebar.tsx`                  |
| `layout`      | `src/app/(admin)/layout.tsx`, `src/components/layout/` |
| `store`       | `src/lib/store.tsx`                                  |
| `data`        | `src/lib/data.ts`, `src/lib/types.ts`                |
| `ui`          | `src/components/ui/`                                 |
| `theme`       | `src/app/globals.css`                                |
| `config`      | `next.config.ts`, `tsconfig.json`, `components.json` |

Omit the scope if the change touches many areas at once.

## Commit command

Use a heredoc so multi-line messages format correctly:

```bash
git commit -m "$(cat <<'EOF'
<type>(<scope>): <subject>

<optional body>

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

## Important rules

- If `$ARGUMENTS` is provided, treat it as a hint for the scope or message.
- Never stage `node_modules/`, `.env*`, or `.next/`.
- If nothing is staged and there are no unstaged changes, report "Nothing to commit." and stop.
- Do not push — only commit.
- After the commit, run `git log --oneline -1` to confirm it was created.
