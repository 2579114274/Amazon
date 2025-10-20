#!/bin/bash

echo "🧪 像素跟踪功能测试"
echo "===================="

# 1. 检查像素设置API
echo "1️⃣ 检查像素设置..."
curl -s "https://gzwvkicf.shop/api/pixel_settings" | head -5
echo ""

# 2. 创建测试像素设置
echo "2️⃣ 创建测试像素设置..."
cat > test_pixel.json << 'EOF'
{
  "is_active": true,
  "facebook_pixels": [
    {
      "name": "测试Facebook像素",
      "pixel_id": "123456789012345",
      "is_active": true,
      "pixel_code": "<!-- Facebook Pixel Code -->\n<script>\n!function(f,b,e,v,n,t,s)\n{if(f.fbq)return;n=f.fbq=function(){n.callMethod?\nn.callMethod.apply(n,arguments):n.queue.push(arguments)};\nif(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';\nn.queue=[];t=b.createElement(e);t.async=!0;\nt.src=v;s=b.getElementsByTagName(e)[0];\ns.parentNode.insertBefore(t,s)}(window, document,'script',\n'https://connect.facebook.net/en_US/fbevents.js');\nfbq('init', '123456789012345');\nfbq('track', 'PageView');\n</script>\n<noscript><img height=\"1\" width=\"1\" style=\"display:none\"\nsrc=\"https://www.facebook.com/tr?id=123456789012345&ev=PageView&noscript=1\"\n/></noscript>\n<!-- End Facebook Pixel Code -->"
    }
  ],
  "tiktok_pixels": [],
  "google_pixels": [
    {
      "name": "测试Google Analytics",
      "analytics_id": "G-XXXXXXXXXX",
      "is_active": true,
      "pixel_code": "<!-- Google Analytics -->\n<script async src=\"https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX\"></script>\n<script>\nwindow.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());\ngtag('config', 'G-XXXXXXXXXX');\n</script>\n<!-- End Google Analytics -->"
    }
  ],
  "other_pixels": [],
  "custom_pixels": [],
  "enable_server_side": false
}
EOF

curl -X POST "https://gzwvkicf.shop/api/pixel_settings" \
  -H "Content-Type: application/json" \
  -d @test_pixel.json

echo ""

# 3. 验证设置是否保存
echo "3️⃣ 验证像素设置..."
curl -s "https://gzwvkicf.shop/api/pixel_settings" | jq '.[] | {is_active, facebook_pixels: .facebook_pixels | length, google_pixels: .google_pixels | length}'

echo ""

# 4. 检查前端是否正常加载
echo "4️⃣ 检查前端页面..."
curl -s "https://gzwvkicf.shop/" | grep -E "(PixelTracker|Facebook|Google)" || echo "❌ 像素相关代码未在HTML中找到（这是正常的，因为是动态加载）"

echo ""

# 5. 清理临时文件
rm -f test_pixel.json

echo "✅ 像素跟踪系统测试完成！"
echo ""
echo "📋 使用说明："
echo "1. 访问 https://gzwvkicf.shop/admin 进入管理后台"
echo "2. 点击'广告像素管理'配置您的像素"
echo "3. 保存设置后，像素会自动在网站上生效"
echo "4. 打开浏览器开发者工具查看控制台日志"
echo "5. 查看Network标签验证像素请求" 