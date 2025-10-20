# Magic Spoon - Ubuntu 20.04 + 宝塔面板部署指南

## 🎯 系统要求

- **操作系统**：Ubuntu 20.04 LTS（推荐）
- **内存**：最少 2GB RAM
- **存储**：最少 20GB 可用空间
- **网络**：公网IP或域名

## 🚀 快速开始（Ubuntu 20.04）

### 1. 宝塔面板安装

#### 1.1 一键安装宝塔面板
```bash
# Ubuntu 20.04 一键安装命令
wget -O install.sh http://download.bt.cn/install/install-ubuntu_6.0.sh && sudo bash install.sh

# 或者使用curl（更稳定）
curl -sSO http://download.bt.cn/install/install-ubuntu_6.0.sh && sudo bash install-ubuntu_6.0.sh
```

#### 1.2 安装完成后信息
安装完成后会显示：
- 宝塔面板地址：`http://服务器IP:8888`
- 用户名：`root`
- 密码：`随机生成的密码`

#### 1.3 首次登录配置
1. 访问 `http://服务器IP:8888`
2. 使用显示的账号密码登录
3. 选择推荐的软件安装：
   - ✅ Nginx 1.20+
   - ✅ MySQL 8.0
   - ✅ PM2管理器
   - ✅ 其他推荐软件

### 2. 环境配置

#### 2.1 安装Node.js 18+ LTS
```bash
# 方法1：使用NodeSource仓库（推荐）
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 方法2：使用NVM（推荐用于开发环境）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18

# 验证安装
node -v  # 应该显示 v18.x.x
npm -v   # 应该显示 9.x.x 或更高
```

#### 2.2 安装PM2
```bash
# 全局安装PM2
npm install -g pm2

# 验证安装
pm2 -v
```

#### 2.3 配置MySQL
1. 在宝塔面板中，进入"数据库"
2. 添加数据库：
   - 数据库名：`magic_spoon`
   - 用户名：`magic_spoon_user`
   - 密码：`设置一个强密码`
   - 访问权限：`本地服务器`

### 3. 项目部署

#### 3.1 上传项目文件
1. 在宝塔面板中，进入"文件"管理
2. 进入 `/www/wwwroot/` 目录
3. 创建项目文件夹：`magic-spoon`
4. 上传项目文件到此目录

#### 3.2 后端部署
```bash
# 进入项目目录
cd /www/wwwroot/magic-spoon

# 安装依赖
npm install

# 创建环境配置文件
cp .env.production .env

# 编辑环境配置
nano .env
```

环境配置示例（.env文件）：
```env
# 数据库配置
DB_HOST=localhost
DB_USER=magic_spoon_user
DB_PASSWORD=your_password_here
DB_NAME=magic_spoon

# 服务配置
PORT=8787
NODE_ENV=production

# Gemini API配置（如果需要）
GEMINI_API_KEY=your_gemini_api_key_here
```

#### 3.3 启动后端服务
```bash
# 使用PM2启动服务
pm2 start server/index.js --name "magic-spoon-api"

# 设置开机自启
pm2 startup
pm2 save

# 查看服务状态
pm2 status
pm2 logs magic-spoon-api
```

#### 3.4 前端构建
```bash
# 构建前端
npm run build

# 构建完成后，dist目录就是前端文件
ls -la dist/
```

### 4. 网站配置

#### 4.1 创建网站
1. 在宝塔面板中，进入"网站"
2. 点击"添加站点"
3. 填写信息：
   - 域名：`yourdomain.com`（或你的实际域名）
   - 根目录：`/www/wwwroot/magic-spoon/dist`
   - PHP版本：选择"纯静态"

#### 4.2 配置反向代理
在网站设置中添加反向代理：

**API反向代理：**
- 代理名称：`api`
- 目标URL：`http://127.0.0.1:8787`
- 代理目录：`/api/`

**文件上传反向代理：**
- 代理名称：`uploads`
- 目标URL：`http://127.0.0.1:8787`
- 代理目录：`/uploads/`

#### 4.3 配置SSL证书（推荐）
1. 在网站设置中申请SSL证书
2. 开启"强制HTTPS"
3. 配置301重定向

### 5. 测试部署

#### 5.1 测试后端API
```bash
# 测试健康检查
curl http://127.0.0.1:8787/api/health

# 测试产品列表
curl http://127.0.0.1:8787/api/products

# 测试分类列表
curl http://127.0.0.1:8787/api/categories
```

#### 5.2 测试前端访问
1. 访问你的域名：`https://yourdomain.com`
2. 确认前端页面正常显示
3. 测试前端功能是否正常

#### 5.3 测试API通信
1. 在前端页面中测试API调用
2. 检查浏览器开发者工具的网络请求
3. 确认API请求都返回正确的响应

### 6. 常见问题解决

#### 6.1 依赖安装失败
```bash
# 清理npm缓存
npm cache clean --force

# 删除node_modules重新安装
rm -rf node_modules package-lock.json
npm install
```

#### 6.2 PM2服务启动失败
```bash
# 查看详细错误日志
pm2 logs magic-spoon-api

# 检查Node.js版本
node -v

# 重新启动服务
pm2 restart magic-spoon-api
```

#### 6.3 Nginx配置错误
```bash
# 测试Nginx配置
nginx -t

# 如果配置正确，重载Nginx
nginx -s reload

# 查看Nginx错误日志
tail -f /www/wwwlogs/yourdomain.com.error.log
```

#### 6.4 数据库连接失败
1. 确认MySQL服务正在运行
2. 检查数据库用户名、密码、数据库名是否正确
3. 确认数据库用户权限是否足够

### 7. 维护命令

#### 7.1 服务管理
```bash
# 查看服务状态
pm2 status

# 重启后端服务
pm2 restart magic-spoon-api

# 查看服务日志
pm2 logs magic-spoon-api

# 停止服务
pm2 stop magic-spoon-api

# 删除服务
pm2 delete magic-spoon-api
```

#### 7.2 系统监控
```bash
# 查看系统资源使用
htop
df -h
free -h

# 查看服务状态
systemctl status nginx
systemctl status mysql
```

#### 7.3 日志查看
```bash
# Nginx访问日志
tail -f /www/wwwlogs/yourdomain.com.log

# Nginx错误日志
tail -f /www/wwwlogs/yourdomain.com.error.log

# PM2日志
pm2 logs magic-spoon-api
```

### 8. 安全配置

#### 8.1 防火墙设置
1. 在宝塔面板中，进入"安全"
2. 开放必要端口：
   - 80 (HTTP)
   - 443 (HTTPS)
   - 8888 (宝塔面板)

#### 8.2 文件权限设置
```bash
# 设置项目目录权限
chown -R www:www /www/wwwroot/magic-spoon
chmod -R 755 /www/wwwroot/magic-spoon

# 设置上传目录权限
chmod -R 777 /www/wwwroot/magic-spoon/uploads
```

#### 8.3 定期备份
```bash
# 备份项目文件
tar -czf /backup/magic-spoon-$(date +%Y%m%d).tar.gz /www/wwwroot/magic-spoon

# 备份数据库
mysqldump -u root -p --all-databases > /backup/all-databases-$(date +%Y%m%d).sql

# 备份宝塔配置
bt backup
```

### 9. 性能优化

#### 9.1 Nginx优化
```nginx
# 在网站配置中添加
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
gzip_comp_level 6;
gzip_min_length 1000;
```

#### 9.2 Node.js优化
```bash
# 使用集群模式启动多个进程
pm2 start server/index.js -i max --name "magic-spoon-api"

# 设置环境变量
export NODE_ENV=production
export UV_THREADPOOL_SIZE=64
```

### 10. 部署检查清单

- [ ] 宝塔面板安装完成
- [ ] Node.js 18+ 安装完成
- [ ] PM2 安装完成
- [ ] MySQL 数据库创建完成
- [ ] 项目文件上传完成
- [ ] 项目依赖安装完成
- [ ] 环境配置文件创建完成
- [ ] 后端服务启动成功
- [ ] 前端构建完成
- [ ] 网站创建完成
- [ ] 反向代理配置完成
- [ ] SSL证书配置完成
- [ ] 前端页面访问正常
- [ ] API接口调用正常
- [ ] 文件上传功能正常
- [ ] 数据库连接正常
- [ ] 服务开机自启配置完成

## 🎉 部署完成！

恭喜！你的Magic Spoon项目已经成功部署到Ubuntu 20.04 + 宝塔面板上。

### 访问地址：
- **前端网站**：`https://yourdomain.com`
- **后端API**：`https://yourdomain.com/api/`
- **宝塔面板**：`http://服务器IP:8888`

### 技术支持：
如果遇到问题，请检查：
1. 服务状态：`pm2 status`
2. 错误日志：`pm2 logs magic-spoon-api`
3. Nginx配置：`nginx -t`
4. 系统资源：`htop`

---

*本指南专为Ubuntu 20.04 + 宝塔面板环境编写*

## 📁 环境配置文件说明

### 1. **`.env.production`** - 生产环境模板文件
这个文件应该包含生产环境的所有配置，作为模板使用。

```env
# ===== 生产环境配置模板 =====

# 前端配置 (Vite)
VITE_API_BASE_URL=https://gzwvkicf.shop
VITE_GEMINI_BASE=https://generativelanguage.googleapis.com

# 后端配置 (Node.js)
NODE_ENV=production
PORT=8787

# 数据库配置
DB_HOST=localhost
DB_USER=magic_spoon_user
DB_PASSWORD=your_strong_password_here
DB_NAME=magic_spoon

# Gemini API配置 (如果需要)
GEMINI_API_KEY=your_gemini_api_key_here

# 文件上传配置
UPLOAD_MAX_SIZE=5242880
UPLOAD_PATH=/www/wwwroot/magic-spoon/uploads

# 安全配置
SESSION_SECRET=your_random_session_secret_here
CORS_ORIGIN=https://gzwvkicf.shop
```

### 2. **`.env`** - 当前环境配置文件
这个文件是实际运行时使用的配置，从 `.env.production` 复制并修改。

```env
# ===== 当前环境配置 =====

# 前端配置 (Vite)
VITE_API_BASE_URL=https://gzwvkicf.shop
VITE_GEMINI_BASE=https://generativelanguage.googleapis.com

# 后端配置 (Node.js)
NODE_ENV=production
PORT=8787

# 数据库配置
DB_HOST=localhost
DB_USER=magic_spoon_user
DB_PASSWORD=your_actual_password_here
DB_NAME=magic_spoon

# Gemini API配置 (如果有的话)
GEMINI_API_KEY=your_actual_gemini_key_here

# 文件上传配置
UPLOAD_MAX_SIZE=5242880
UPLOAD_PATH=/www/wwwroot/magic-spoon/uploads

# 安全配置
SESSION_SECRET=magic_spoon_production_secret_2024
CORS_ORIGIN=https://gzwvkicf.shop
```

### 3. **`.env.save`** - 备份配置文件
这个文件用于保存你的配置备份，防止意外丢失。

```env
# ===== 配置备份文件 =====

# 前端配置 (Vite)
VITE_API_BASE_URL=https://gzwvkicf.shop
VITE_GEMINI_BASE=https://generativelanguage.googleapis.com

# 后端配置 (Node.js)
NODE_ENV=production
PORT=8787

# 数据库配置
DB_HOST=localhost
DB_USER=magic_spoon_user
DB_PASSWORD=your_backup_password_here
DB_NAME=magic_spoon

# Gemini API配置
GEMINI_API_KEY=your_backup_gemini_key_here

# 文件上传配置
UPLOAD_MAX_SIZE=5242880
UPLOAD_PATH=/www/wwwroot/magic-spoon/uploads

# 安全配置
SESSION_SECRET=magic_spoon_backup_secret_2024
CORS_ORIGIN=https://gzwvkicf.shop

# 备注信息
# 创建时间: 2024-12-19
# 服务器: Ubuntu 20.04 + 宝塔面板
# 域名: gzwvkicf.shop
```

##  创建步骤

### 步骤1：创建生产环境模板
```bash
# 进入项目目录
cd /www/wwwroot/magic-spoon

# 创建 .env.production 文件
nano .env.production
```

### 步骤2：创建当前环境配置
```bash
# 从模板复制
cp .env.production .env

# 编辑当前配置
nano .env
```

### 步骤3：创建备份配置
```bash
# 创建备份文件
cp .env .env.save

# 编辑备份文件（添加备注信息）
nano .env.save
```

##  配置说明

### **前端配置 (Vite)**
- `VITE_API_BASE_URL`: 你的域名，用于前端API请求
- `VITE_GEMINI_BASE`: Gemini API的基础URL

### **后端配置 (Node.js)**
- `NODE_ENV`: 环境标识，生产环境设为 `production`
- `PORT`: 后端服务端口，默认8787

### **数据库配置**
- `DB_HOST`: 数据库主机，本地部署用 `localhost`
- `DB_USER`: 数据库用户名
- `DB_PASSWORD`: 数据库密码
- `DB_NAME`: 数据库名称

### **安全配置**
- `SESSION_SECRET`: 会话密钥，使用随机字符串
- `CORS_ORIGIN`: 允许跨域访问的域名

## ✅ 验证配置

### 1. **测试后端配置**
```bash
# 重启后端服务
pm2 restart magic-spoon-api

# 查看日志
pm2 logs magic-spoon-api
```

### 2. **测试前端配置**
```bash
# 重新构建前端
npm run build

# 检查构建后的文件
ls -la dist/
```

### 3. **测试API连接**
```bash
# 测试健康检查
curl https://gzwvkicf.shop/api/health
```

## 🎯 重要提醒

1. **`.env`** 文件包含敏感信息，不要提交到Git
2. **`.env.production`** 作为模板，可以提交到Git
3. **`.env.save`** 作为备份，定期更新
4. 修改配置后记得重启相关服务

这样配置后，你的项目就能在不同环境中正常运行了！