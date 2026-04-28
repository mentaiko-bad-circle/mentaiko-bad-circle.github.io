# Mentaiko Project

## Environment
- Shell: bash (not PowerShell) — use `$LOCALAPPDATA` not `$env:LOCALAPPDATA`
- gh CLI: `"$LOCALAPPDATA/gh-cli/bin/gh.exe"` (not in PATH)
- netlify-cli: installed globally via npm, available as `netlify`
- make: NOT available on Windows — use `bash deploy.sh` instead

## Deploy
- Netlify サイト: https://mentaiko-bad-circle.netlify.app
- GitHub push で Netlify 自動デプロイ（GitHub連携済み、1〜2分で反映）
- GitHub: `git add -A && git commit -m "msg" && git push`
- GitHub push 失敗時: `"$LOCALAPPDATA/gh-cli/bin/gh.exe" auth setup-git` を実行してから再push
- 手動即時デプロイ（緊急時）: `netlify deploy --prod --dir=.`

## Workflow（日程を更新するとき）
1. `data/schedule.js` を編集
2. `bash deploy.sh "Update schedule"`（自動デプロイ）
   または `deploy.bat` をダブルクリック、VS Code: `Ctrl+Shift+P` → `Tasks: Run Task` → `Deploy`

## Project Structure
- `index.html` — メインHTML（CSS/JSは外部ファイル参照）
- `data/schedule.js` — schedule config, edit here to update dates
- `css/style.css` — styles
- `js/main.js` — all JavaScript logic
- `.netlify/` — Netlify サイトID保存（削除しないこと）
- `deploy.sh` — デプロイスクリプト（bash用）: `bash deploy.sh "msg"`
- `deploy.bat` — デプロイスクリプト（ダブルクリック用）
- `.vscode/tasks.json` — VS Code Deploy タスク

## Gotchas
- winget: never run multiple instances simultaneously (causes 1618 lock error)
- gh auth: after switching accounts, run `auth setup-git` before git push
- GitHub Pages と Netlify の両方が有効。本番は Netlify を使用
