@echo off
echo ============================================
echo   TESTE DE LOGS DA VERCEL
echo ============================================
echo.

echo 1. Testando endpoint de health check...
echo.
curl -X GET https://market-place-nxm5.vercel.app/health
echo.
echo.

echo 2. Testando endpoint de CORS...
echo.
curl -X GET https://market-place-nxm5.vercel.app/test-cors
echo.
echo.

echo 3. Testando endpoint de categorias...
echo.
curl -X GET https://market-place-nxm5.vercel.app/api/category/categories
echo.
echo.

echo ============================================
echo   TESTE CONCLUÍDO
echo ============================================
echo.
echo Agora verifique os logs na Vercel:
echo 1. Acesse: https://vercel.com/dashboard
echo 2. Clique no projeto "market-place-nxm5"
echo 3. Va em "Deployments" e clique no mais recente
echo 4. Role ate "Function Logs"
echo.
echo Ou use o CLI:
echo   vercel logs --follow
echo.
pause
