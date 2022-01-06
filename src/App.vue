<!--
 * @Author: 熊望
 * @Date: 2021-12-28 20:10:42
 * @LastEditors: 熊望
 * @LastEditTime: 2022-01-05 23:42:40
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
            company: '22',
            createdDt: '2021-12-31 00:38:58',
            createdUserId: null,
            enabled: 'Y',
            id: '1476593663708585986',
            identityNo: '22',
            invitationCode: 'I0FCUH',
            label: null,
            mobile: '13800000000',
            score: 989,
            updatedDt: '2021-12-31 01:53:56',
            updatedUserId: null,
            userName: '张三',
            userType: 'USER_TYPE_TAKEAWAY',
            userTypeName: '外卖司机',
            vehicleNo: '22',
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
