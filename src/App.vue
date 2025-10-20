<template>
  <div id="app">
    <div class="main" ref="main" :style="`margin-top:${contTop};`">
      <!-- 导航栏 -->
      <!-- <nav-head @animatePush="toPush"></nav-head> -->
      <keep-alive>
        <router-view />
      </keep-alive>
    </div>
    <div class="pop_box" :style="`z-index:${zIndex};top:${top};`" v-loading="loading" element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading" element-loading-background="#18191b"></div>
  </div>
</template>

<script>
import NavHead from '@/components/NavHead'

export default {
  name: 'App',
  components: { NavHead },
  watch: {
    // 监听路由变化,监听不到根路由的变化，
    /**
     * 当路由从一个非空的子路径（例如‘/foo‘）切换到根路径‘/‘时，虽然‘route对象的属性发生了变化，但实际上‘本身并没有变化，因此‘route‘本身并没有变化，因此‘watch` 方法并不会捕获到该变化。
     * */
    $route(to, from) { }
    //   <!-- <noscript>
    //   <strong>We're sorry but <%= htmlWebpackPlugin.options.title %> doesn't work properly without JavaScript enabled.
    //       Please enable it to continue.</strong>
    //   <img height="1" width="1" style="display:none"
    //     src="https://www.facebook.com/tr?id=1773948003462346&ev=PageView&noscript=1" />
    // </noscript> -->
  },
  data() {
    return {
      contTop: '0', // 内容缩放后距离顶部的距离
      zIndex: -1, // 遮挡层的层级
      top: '100vh', // 遮挡层的位置1
      loading: false // 遮挡层的加载状态
    }
  },
  methods: {
    toPush(path) {
      this.$refs.main.style.transform = 'scale(0.8)' // transform: scale(${scaleSize}); 这里不能再main元素上设置transform，因为会影响子项的fixed固定定位
      this.contTop = '200px'
      setTimeout(() => {
        this.zIndex = 1
        this.top = 0
        this.loading = true
        // 模拟请求
        setTimeout(() => {
          this.$refs.main.style.transform = ''
          this.contTop = 0
          this.loading = false
          this.zIndex = -1
          this.top = '100vh'
          this.$router.push(path)
        }, 2000)
      }, 1000)
    }
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap');

// @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');
// 设置向上的动画
@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }

  100% {
    opacity: 1;
    transform: none;
  }
}

// 设置向下的动画
@keyframes fadeInDown {
  0% {
    opacity: 0;
    transform: translate3d(0, -100%, 0);
  }

  100% {
    opacity: 1;
    transform: none;
  }
}

.animate {
  animation-duration: 1s;
  animation-fill-mode: both;
  animation-timing-function: ease;
}

.animate_up {
  animation-name: fadeInUp;
}

.animate_down {
  animation-name: fadeInDown;
}

html {
  /*1rem = 100px;   720设计稿*/
  font-size: calc(100vw / 7.2);
  font-size: -webkit-calc(100vw / 7.2);
  -webkit-text-size-adjust: 100%;
  /*去除高亮*/
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

#app {
  width: 100%;
  //background: url('@/assets/images/body_bg.jpg') top center fixed;//背景图  全局
  position: relative;
  overflow: hidden;

  .main {
    transform-origin: center top;
    transition: all 1s;
  }

  .pop_box {
    width: 100%;
    height: 100vh;
    background-color: #18191b;
    position: fixed;
    // top: 100vh;
    left: 0;
    transition: all 1s;
    // z-index: -1;
  }
}
</style>
