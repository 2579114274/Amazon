import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import Products from '@/views/furniture-index/products/index.vue'
import ProductDetail from '@/views/ProductDetail.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/home',
    name: 'HomeAlias',
    component: Home
  },
  {
    path: '/products',
    name: 'Products',
    component: Products
  },
  {
    path: '/product/:id?',
    name: 'ProductDetail',
    component: ProductDetail,
    props: true
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 如果savedPosition存在，说明是通过浏览器的前进/后退按钮导航的
    // 此时返回保存的位置
    if (savedPosition) {
      return savedPosition
    } else {
      // 否则，滚动到顶部
      return { x: 0, y: 0 }
    }
  }
})

export default router