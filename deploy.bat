@echo off
set /p MSG="コミットメッセージを入力（省略可、Enterでスキップ）: "
if "%MSG%"=="" set MSG=Update
git add -A
git commit -m "%MSG%"
git push
pause
