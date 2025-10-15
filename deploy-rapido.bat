@echo off
echo ============================================
echo   DEPLOY RAPIDO PARA VERCEL
echo ============================================
echo.

cd /d "%~dp0"

echo [1/5] Verificando git status...
git status

echo.
echo [2/5] Adicionando arquivos modificados...
git add .

echo.
echo [3/5] Fazendo commit...
git commit -m "Fix: Corrige CORS e adiciona logs detalhados para debug"

echo.
echo [4/5] Enviando para GitHub...
git push origin main

echo.
echo [5/5] Aguardando deploy automatico da Vercel...
echo.
echo ============================================
echo   DEPLOY ENVIADO!
echo ============================================
echo.
echo A Vercel vai fazer o deploy automaticamente.
echo.
echo Acompanhe em: https://vercel.com/dashboard
echo.
echo Ou use o CLI:
echo   vercel logs --follow
echo.
echo Aguarde 1-2 minutos e teste:
echo   https://market-place-nxm5.vercel.app/api/diagnostico
echo.
pause
