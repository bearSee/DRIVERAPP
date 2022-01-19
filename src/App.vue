<!--
 * @Author: 熊望
 * @Date: 2021-12-28 20:10:42
 * @LastEditors: 熊望
 * @LastEditTime: 2022-01-18 00:45:26
 * @FilePath: /nginx/Users/bear/projects/project-bear/DRIVERAPP/src/App.vue
 * @Description:
-->
<template>
  <div id="app">
    <van-nav-bar
      left-arrow
      fixed
      placeholder
      v-show="!isMiniprogram"
      :title="$route.name || ''"
      :class="`${$route.path.slice(1)}-head`"
      @click-left="$router.go(-1)"
    />
    <router-view
      class="app-container"
      :class="isMiniprogram && 'is-miniprogram'" />
  </div>
</template>

<script>
import wx from 'weixin-js-sdk';

export default {
    name: 'App',
    data() {
        return {
            isMiniprogram: false,
        };
    },
    created() {
        try {
            const userAgent = (navigator.userAgent.toLowerCase().match(/MicroMessenger/i) || '');
            if (userAgent.includes('micromessenger') || userAgent === 'micromessenger') {
                // ios的ua中无miniProgram，但都有MicroMessenger（表示是微信浏览器）
                wx.miniProgram.getEnv((res) => {
                    this.isMiniprogram = !!res.miniprogram;
                });
            }
        } catch (error) {
            console.error(error);
        }
    },
};
</script>
<style lang="scss">
@import "@/assets/scss/style.scss";

html{
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
html,body{
  height: 100vh;
  width: 100vh;
  background: #f9f9f9;
  padding: 0 !important;
  font-size: 100px;
}
textarea {
  font-family: inherit;
}
a {
  text-decoration:none;
  color: inherit;
}
#app {
  width: 100vw;
  height: 100vh;
  font-size: 0.14rem;
  color: #333;
}
.van-nav-bar__placeholder {
  height: .46rem!important;
  .van-nav-bar {
    line-height: .22rem;
    .van-nav-bar__left {
      padding: 0 .16rem;
      font-size: .14rem;
      .van-icon-arrow-left {
        color: $theme;
      }
    }
    .van-nav-bar__title {
      font-size: .16rem;
    }
  }
  &.user-center-head {
      .van-nav-bar {
        .van-nav-bar__content {
          background: $theme;
          .van-nav-bar__title, .van-icon {
            color: #fff;
          }
        }
        &::after {
          display: none;
        }
      }
  }
}
.app-container {
  width: 100%;
  height: calc(100% - .46rem);
  overflow-y: auto;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 400;
  .van-list {
      min-height: calc(100vh - .56rem);
      margin-top: .1rem;
      border-top: 1px solid #f3f3f3;
      font-size: .14rem;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      .list-container {
        background: #fff;
        .content-item {
            padding: .2rem 0;
            margin: 0 .16rem;
            display: flex;
            justify-content: space-between;
            box-shadow: inset 0px -1px 0px 0px #f3f3f3;
            &.no-shadow {
              box-shadow: unset;
            }
            &:hover {
              // background: #e9e9e9;
            }
        }
      }
  }
  &.is-miniprogram {
    height: 100%;
    .van-list {
        min-height: calc(100vh - .1rem);
    }
  }
}
</style>
