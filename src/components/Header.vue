<template>
  <header class="header">
    <div class="top-banner">
      <span class="banner-text">✨ Free Shipping, and 80,000+ 5-Star Reviews ✨</span>
    </div>
    <div class="header-content">
      <div class="header-background" :class="{ 'scrolled': isScrolled }"></div>
      
      <!-- 移动端菜单按钮 -->
      <button class="mobile-menu-btn" @click="toggleMobileMenu" v-if="isMobile">
        <div class="hamburger" :class="{ 'active': showMobileMenu }">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>
      
      <div class="logo" @click="$router.push('/')">
        <svg class="logo-svg" viewBox="0 0 150 80" xmlns="http://www.w3.org/2000/svg">
          <!-- MAGIC 文字 -->
          <text x="75" y="32" text-anchor="middle" 
                font-family="Montserrat, sans-serif" 
                font-size="24" font-weight="800" 
                fill="#4c1d95" letter-spacing="-0.8px">
            MAGIC
          </text>
          
          <!-- 注册商标符号 -->
          <text x="118" y="20" 
                font-family="Montserrat, sans-serif" 
                font-size="8" font-weight="600" 
                fill="#4c1d95">
            ®
          </text>
          
          <!-- SPOON 文字 -->
          <text x="75" y="62" text-anchor="middle" 
                font-family="Montserrat, sans-serif" 
                font-size="24" font-weight="800" 
                fill="#4c1d95" letter-spacing="-0.8px">
            SPOON
          </text>
        </svg>
      </div>
      
      <!-- 促销文字区域 -->
      <div class="promotion-area" v-if="!isMobile">
        <div class="promotion-text">
          This promotion is open to existing Amazon customers only.
        </div>
      </div>
      
      <!-- 手机端促销文字区域 -->
      <div class="mobile-promotion-area" v-if="isMobile">
        <div class="mobile-promotion-text">
          This promotion is open to existing Amazon customers only.
        </div>
      </div>
      
      <!-- PC端导航 -->
      <nav class="navigation" v-if="!isMobile">
        <a href="#" class="nav-link" @click="navigateTo('/products')">SNACKS</a>
        <a href="#" class="nav-link" @click="navigateTo('/products')">SHOP ALL</a>
      </nav>
    </div>
    
    <!-- 移动端菜单覆盖层 -->
    <div class="mobile-menu-overlay" :class="{ 'active': showMobileMenu }" v-if="isMobile">
      <!-- 白色顶部栏 -->
      <div class="menu-header">
        <button class="close-btn" @click="toggleMobileMenu">
          <div class="close-icon">×</div>
        </button>
        <div class="menu-logo">
          <svg class="menu-logo-svg" viewBox="0 0 150 80" xmlns="http://www.w3.org/2000/svg">
            <!-- MAGIC 文字 -->
            <text x="75" y="32" text-anchor="middle" 
                  font-family="Montserrat, sans-serif" 
                  font-size="24" font-weight="800" 
                  fill="#4c1d95" letter-spacing="-0.8px">
              MAGIC
            </text>
            
            <!-- 注册商标符号 -->
            <text x="118" y="20" 
                  font-family="Montserrat, sans-serif" 
                  font-size="8" font-weight="600" 
                  fill="#4c1d95">
              ®
            </text>
            
            <!-- SPOON 文字 -->
            <text x="75" y="62" text-anchor="middle" 
                  font-family="Montserrat, sans-serif" 
                  font-size="24" font-weight="800" 
                  fill="#4c1d95" letter-spacing="-0.8px">
              SPOON
            </text>
          </svg>
        </div>
      </div>
      
      <!-- 渐变背景菜单区域 -->
      <div class="menu-content">
        <div class="menu-items">
          <div class="menu-item" @click="navigateTo('/products')">
            <span>SNACKS</span>
          </div>
          <div class="menu-item" @click="navigateTo('/products')">
            <span>SHOP ALL</span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      isScrolled: false,
      showMobileMenu: false,
      isMobile: false
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
    window.addEventListener('resize', this.checkMobile)
    this.checkMobile()
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
    window.removeEventListener('resize', this.checkMobile)
  },
  methods: {
    handleScroll() {
      this.isScrolled = window.scrollY > 50
    },
    checkMobile() {
      this.isMobile = window.innerWidth <= 768
      if (!this.isMobile) {
        this.showMobileMenu = false
      }
    },
    toggleMobileMenu() {
      this.showMobileMenu = !this.showMobileMenu
    },
    navigateTo(path) {
      this.showMobileMenu = false
      // 检查是否已经在目标页面，避免NavigationDuplicated错误
      if (this.$route.path !== path) {
        this.$router.push(path)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// Header Styles
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  transition: all 0.3s ease;
}

.top-banner {
  background: #8b5cf6;
  color: white;
  text-align: center;
  padding: 12px 0;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Montserrat', sans-serif;
  width: 100vw !important;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  max-width: 1200px;
  margin: 0 auto;
  height: 80px;
  position: relative;
  transition: all 0.3s ease;
}

.header-background {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100vw;
  height: 100%;
  background: transparent; // 初始状态透明
  transition: all 0.3s ease;
  z-index: -1;
  
  &.scrolled {
    background: white;
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  }
}

.logo {
  cursor: pointer;
  position: relative;
  z-index: 2;
}

.logo-svg {
  height: 80px;
  width: auto;
}

// 促销文字区域样式
.promotion-area {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 40px;
  position: relative;
  z-index: 2;
}

.promotion-text {
  // background: white;
  // border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 15px;
  font-weight: 500;
  // color: #6b7280;
  color: #4c1d95;
  text-align: center;
  min-width: 330px;
  max-width: 500px;
  font-family: 'Montserrat', sans-serif;
  // box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  // &:hover {
  //   border-color: #d1d5db;
  //   box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  // }
}

// 手机端促销文字区域样式
.mobile-promotion-area {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0;
  position: relative;
  z-index: 2;
}

.mobile-promotion-text {
  // background: white;
  // border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 8px 15px;
  font-size: 14px;
  font-weight: 500;
  color: #4c1d95;
  text-align: center;
  width: 100%;
  max-width: calc(100vw - 40px);
  font-family: 'Montserrat', sans-serif;
  // box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  white-space: normal;
  word-wrap: break-word;
  line-height: 1.3;
}

.navigation {
  display: flex;
  gap: 40px;
  position: relative;
  z-index: 2;
}

.nav-link {
  color: #4c1d95;
  text-decoration: none;
  font-weight: 700;
  font-size: 16px;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  cursor: pointer;
  font-family: 'Montserrat', sans-serif;
  
  &:hover {
    color: #7c3aed;
  }
}

// 移动端菜单按钮样式
.mobile-menu-btn {
  // background: white;
  border: none;
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  position: relative;
  z-index: 2;
  // box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  .hamburger {
    width: 24px;
    height: 18px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    
    span {
      display: block;
      height: 2px;
      background: #4c1d95;
      border-radius: 1px;
      transition: all 0.3s ease;
      transform-origin: center;
    }
    
    &.active {
      span:nth-child(1) {
        transform: rotate(45deg) translate(6px, 6px);
      }
      span:nth-child(2) {
        opacity: 0;
      }
      span:nth-child(3) {
        transform: rotate(-45deg) translate(6px, -6px);
      }
    }
  }
}

// 移动端菜单覆盖层
.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  
  &.active {
    opacity: 1;
    visibility: visible;
  }
  
  // 白色顶部栏
  .menu-header {
    background: white;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    z-index: 1001;
    
    .close-btn {
      background: white;
      border: none;
      border-radius: 8px;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      
      .close-icon {
        font-size: 24px;
        color: #4c1d95;
        font-weight: bold;
      }
    }
    
    .menu-logo {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      
      .menu-logo-svg {
        height: 80px;
        width: auto;
        transition: all 0.3s ease;
      }
    }
  }
  
  // 渐变背景菜单区域
  .menu-content {
    background: linear-gradient(180deg, #FFD700 0%, #FF69B4 50%, #9370DB 100%);
    padding: 40px 20px;
    min-height: 30vh;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    transform: translateY(100%);
    transition: transform 0.3s ease;
    
    .menu-items {
      display: flex;
      flex-direction: column;
      gap: 30px;
      width: 100%;
    }
    
    .menu-item {
      padding: 20px 0;
      cursor: pointer;
      transition: all 0.3s ease;
      
      span {
        color: white;
        font-size: 24px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 2px;
        font-family: 'Montserrat', sans-serif;
      }
      
      &:hover {
        transform: translateX(10px);
      }
    }
  }
  
  &.active .menu-content {
    transform: translateY(0);
  }
}

// Responsive Design
@media (max-width: 768px) {
  .header-content {
    padding: 15px 20px;
    height: auto;
    gap: 10px;
  }
  
  .logo-svg {
    height: 60px;
    width: auto;
  }
  
  .promotion-area {
    display: none; // 在移动端隐藏PC端促销文字区域
  }
  
  .mobile-promotion-area {
    order: 2; // 调整顺序，放在Logo下方
  }
  
  .navigation {
    display: none;
  }
}

@media (max-width: 480px) {
  .header-content {
    padding: 10px 16px;
  }
  
  .logo-svg {
    height: 50px;
    width: auto;
  }
  
  .mobile-promotion-text {
    font-size: 11px;
    padding: 6px 12px;
  }
  
  .mobile-menu-overlay {
    .mobile-menu-content {
      padding: 100px 20px 20px;
    }
    
    .menu-item span {
      font-size: 20px;
    }
  }
}
</style>
