#!/bin/bash

echo "🚀 Magic Spoon 像素跟踪功能 - 宝塔部署脚本"
echo "============================================="

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 请在项目根目录运行此脚本"
    exit 1
fi

# 1. 停止现有的 PM2 进程
echo "1️⃣ 停止现有服务..."
pm2 stop magic-spoon-api 2>/dev/null || true
pm2 delete magic-spoon-api 2>/dev/null || true

# 2. 备份现有文件
echo "2️⃣ 备份现有构建..."
if [ -d "dist" ]; then
    mv dist dist_backup_$(date +%Y%m%d_%H%M%S)
fi

# 3. 清理并重新安装依赖
echo "3️⃣ 清理并重新安装依赖..."
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# 4. 构建前端
echo "4️⃣ 构建前端应用..."
npm run build

if [ ! -d "dist" ]; then
    echo "❌ 前端构建失败"
    exit 1
fi

# 5. 检查后端依赖
echo "5️⃣ 安装后端依赖..."
cd server 2>/dev/null || echo "后端代码在项目根目录"
npm install 2>/dev/null || echo "使用项目根目录的依赖"
cd ..

# 6. 启动后端服务
echo "6️⃣ 启动后端 API 服务..."
pm2 start server/index.js --name "magic-spoon-api" --cwd $(pwd) --update-env

# 7. 检查服务状态
echo "7️⃣ 检查服务状态..."
sleep 3
pm2 status

# 8. 测试 API 健康状态
echo "8️⃣ 测试 API 连接..."
curl -s http://127.0.0.1:8787/api/health || echo "⚠️ API 健康检查失败，请检查服务"

# 9. 测试像素设置 API
echo "9️⃣ 测试像素设置 API..."
curl -s http://127.0.0.1:8787/api/pixel_settings | head -3 || echo "⚠️ 像素设置 API 测试失败"

# 10. 保存 PM2 配置
echo "🔟 保存 PM2 配置..."
pm2 save

echo ""
echo "✅ 部署完成！"
echo ""
echo "🔗 访问链接:"
echo "   前端: https://gzwvkicf.shop/"
echo "   管理后台: https://gzwvkicf.shop/admin"
echo "   像素管理: https://gzwvkicf.shop/admin (点击'广告像素管理')"
echo ""
echo "📋 下一步:"
echo "1. 访问管理后台配置像素"
echo "2. 启用像素跟踪系统全局开关"
echo "3. 添加您的 Facebook/TikTok/Google 像素"
echo "4. 保存设置并测试"
echo ""
echo "🧪 测试方法:"
echo "1. 打开浏览器 F12 开发者工具"
echo "2. 访问网站首页查看 Console 日志"
echo "3. 应该看到: '✅ 像素已注入: facebook-xxxxx'"
echo ""
echo "📞 如有问题，请检查:"
echo "- PM2 服务状态: pm2 status"
echo "- API 日志: pm2 logs magic-spoon-api"
echo "- 网站访问: curl https://gzwvkicf.shop/api/health" 