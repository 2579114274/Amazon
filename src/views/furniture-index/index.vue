<template>
  <div class="furniture_index">


    <products></products> 

    
  </div>
</template>

<script>

import products from './products/index.vue'

export default {
  name: 'FurnitureIndex',
  components: {
    // AmazonCustomerExperienceSurvey,
    products,
  },

  data() {
    return {

    }
  },
  mounted() {
    // beforeunload  监听所有窗口关闭事件（例如用户刷新或离开页面）并将当前滚动位置存储到浏览器的 sessionStorage 中
    // window.addEventListener('beforeunload', this.setScroll)
  },
  


}
</script>

<style lang="scss" scoped>
.furniture_index {
  overflow: hidden; //用于防止fadeInDown动画从下往上时，y轴-100%出现的问题，因为translate不会脱离文档流。就会在一定的时间内出现多余的滚动条
}
</style>
