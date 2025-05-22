@echo off
echo 关闭当前运行的服务...
taskkill /f /im node.exe

echo.
echo 清理临时文件...
if exist ".netlify" rmdir /s /q .netlify
echo.
node generate-content-index.js
echo.
echo 重新启动本地CMS系统...
echo.
echo 请在浏览器中访问: http://localhost:8080/admin/
echo.
npm run dev 