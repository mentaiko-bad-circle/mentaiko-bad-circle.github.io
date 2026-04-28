# Mentaiko Project

## Environment
- Shell: bash (not PowerShell) — use `$LOCALAPPDATA` not `$env:LOCALAPPDATA`
- gh CLI: `"$LOCALAPPDATA/gh-cli/bin/gh.exe"` (not in PATH)
- netlify-cli: installed globally via npm, available as `netlify`

## Deploy
- Netlify: `netlify deploy --prod --dir=.`
- GitHub: `git push` (run `"$LOCALAPPDATA/gh-cli/bin/gh.exe" auth setup-git` if push fails)

## Project Structure
- `data/schedule.js` — schedule config, edit here to update dates
- `css/style.css` — styles
- `js/main.js` — all JavaScript logic

## Gotchas
- winget: never run multiple instances simultaneously (causes 1618 lock error)
- gh auth: after switching accounts, run `auth setup-git` before git push
