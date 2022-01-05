<!--
 * @Author: 熊望
 * @Date: 2021-12-28 20:10:42
 * @LastEditors: 熊望
 * @LastEditTime: 2022-01-05 23:31:24
 * @FilePath: /nginx/Users/bear/projects/project-bear/DRIVERAPP/src/App.vue
 * @Description:
-->
<template>
  <div id="app">
    <van-nav-bar
      left-arrow
      fixed
      placeholder
      :title="$route.name || ''"
      :class="`${$route.path.slice(1)}-head`"
      @click-left="$router.go(-1)"
    />
    <router-view class="app-container" />
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
    name: 'App',
    methods: {
        ...mapMutations(['replaceUserInfo']),
    },
    mounted() {
        this.replaceUserInfo({
            username: '司机007',
            id: '2',
        });
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
  background-color: #f9fbff;
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
  .app-container {
    width: 100%;
    height: calc(100% - 46px);
    overflow-y: auto;
  }
}
</style>
