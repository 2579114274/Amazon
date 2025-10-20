<template>
  <!-- 头部导航 -->
  <header class="header_box">
    <nav class="nav_cont">
      <img src="@/assets/images/logo.png" alt="" class="l_logo">
      <!-- pc端 -->
      <ul class="r_list">
        <li v-for="(item,index) in navList" :key="index" :class="pcIndex===index?'nav_active':''" @click="toPush(index)">{{ item.txt }}
          <ul class="child_list" v-if="item.childList">
            <li v-for="(itemChild,childIndex) in item.childList" :key="childIndex">{{ itemChild.txt }}</li>
          </ul>
        </li>
      </ul>

      <!-- 移动端 -->
      <img src="@/assets/images/phone_menu.png" alt="" class="r_menu" @click="showMenuHandler">
      <ul :class="['menu_box',showMenu?'show_menu':'']">
        <li v-for="(item,index) in navList" :key="index" @click="navHanlder(index,item.show)">
          <div class="tit_box">
            <span>{{ item.txt }}</span>
            <img src="@/assets/images/touch-arrow-d.png" v-if="item.childList" alt="" :class="item.show?'img_rotate':''">
          </div>
          <CollapseTransition v-if="item.childList">
            <ul class="child_list" v-show="item.show">
              <li v-for="(itemChild,chidlIndex) in item.childList" :key="chidlIndex" @click.stop="">{{ itemChild.txt }}</li>
            </ul>
          </CollapseTransition>
        </li>

      </ul>

    </nav>
  </header>
</template>

<script>
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'

export default {
  name: 'NavHead',
  components: { CollapseTransition },
  data () {
    return {
      // pc端导航选中项
      pcIndex: 0, // 这里应该换成路由的路径
      // 先代替下，做一下效果
      pathActive: '/home',

      // 导航列表
      navList: [
        {
          txt: '首页',
          show: false
        },
        {
          txt: '关于我们',
          show: false,
          childList: [
            {
              txt: '公司简介'
            },
            {
              txt: '企业文化'
            },
            {
              txt: '发展历程'
            }
          ]
        },
        {
          txt: '服务项目',
          show: false,
          childList: [
            {
              txt: '服务范围'
            },
            {
              txt: '服务优势'
            },
            {
              txt: '服务流程'
            }
          ]
        },
        {
          txt: '案例展示',
          show: false,
          childList: [
            {
              txt: '案例分类一'
            },
            {
              txt: '案例分类二'
            },
            {
              txt: '案例分类三'
            },
            {
              txt: '案例分类四'
            }
          ]
        },
        {
          txt: '新闻资讯',
          show: false,
          childList: [
            {
              txt: '公司新闻'
            },
            {
              txt: '行业新闻'
            },
            {
              txt: '常见问题'
            }
          ]
        },
        {
          txt: '专家团队',
          show: false
        },
        {
          txt: '人力资源',
          show: false,
          childList: [
            {
              txt: '人才战略'
            },
            {
              txt: '人才招聘'
            }
          ]
        },
        {
          txt: '联系我们',
          show: false
        }
      ],
      showMenu: false // 菜单项的状态
    }
  },
  created () {},
  methods: {
    showMenuHandler () {
      this.showMenu = !this.showMenu
    },
    navHanlder (index, bol) {
      this.navList[index].show = !bol
    },
    toPush (index) {
      this.pcIndex = index
      this.pathActive = this.pathActive === '/home' ? '/about-we' : '/home'
      this.$emit('animatePush', this.pathActive)
    }
  }
}
</script>

<style lang="scss" scoped>
.header_box {
  width: 100%;
  // background: url('@/assets/images/top-bg.png');
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9;
  .nav_cont {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;

    // pc端
    .r_list {
      display: flex;
      margin-right: 20px;
      > li {
        color: #ddd;
        font-size: 14px;
        padding: 0 30px;
        line-height: 90px;
        position: relative;
        &:not(&:last-child) {
          &::after {
            content: '';
            display: block;
            width: 5px;
            height: 5px;
            background: #f90;
            border-radius: 50%;
            position: absolute;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
          }
        }

        &:hover {
          color: #fab702;
          cursor: pointer;
        }
        &:hover .child_list {
          transform: scaleY(1);
          transition: transform 0.25s ease;
        }
        .child_list {
          position: absolute;
          top: 90px;
          left: 0;
          transform: scaleY(0);
          transform-origin: center top;
          transition: transform 0.1s ease;

          > li {
            width: 210px;
            line-height: 47px;
            background-color: #222327;
            color: #ddd;
            padding: 0 20px 0 30px;

            &:hover {
              background-color: #fab702;
              color: #222;
            }
          }
        }
      }
      .nav_active {
        color: #fab702;
      }
    }
    // 移动端
    .r_menu,
    .menu_box {
      display: none;
    }
  }

  @media screen and (max-width: 1200px) {
    .nav_cont {
      width: 100%;
      height: 0.6rem;
      padding: 0 0.15rem;
      position: relative;
      // 隐藏pc端的导航条
      .r_list {
        display: none;
      }
      // 重新设置css
      .l_logo {
        height: 0.4rem;
      }

      .r_menu {
        display: block;
        cursor: pointer;
        width: 0.28rem;
      }
      .menu_box {
        display: block;
        width: 100%;
        position: absolute;
        left: 0;
        top: 0.6rem;
        padding: 0.2rem 0.2rem 0.35rem;
        background-color: #e0a502;
        transition: transform 0.25s ease;
        transform-origin: top center;
        transform: scaleY(0);

        > li {
          color: #fff;
          font-size: 0.18rem;
          line-height: 0.48rem;
          border-bottom: 1px solid #efcf79;
          cursor: pointer;
          .tit_box {
            padding-left: 0.1rem;
            padding-right: 0.1rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            &:hover {
              background-color: #fab802;
            }
            > img {
              width: 0.15rem;
            }
          }

          .img_rotate {
            transform: rotate(180deg);
          }
          .child_list {
            padding: 0 0.1rem 0.3rem 0.3rem;

            > li {
              font-size: 0.16rem;
              line-height: 0.38rem;
              &:hover {
                background-color: #fab802;
              }
            }
          }
        }
      }
      .show_menu {
        transform: scaleY(1);
      }
    }
  }
}
</style>
