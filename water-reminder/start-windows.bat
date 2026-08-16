@echo off
REM Double-click this file on Windows to set up (first run) and launch Sip.
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo   Node.js isn't installed yet.
  echo   Install it once from https://nodejs.org  ^(the green "LTS" button^),
  echo   then double-click this file again.
  echo.
  pause
  exit /b 1
)

if not exist node_modules (
  echo First-time setup: installing Sip ^(this takes a minute^)...
  call npm install
)

echo Launching Sip...
call npm start
