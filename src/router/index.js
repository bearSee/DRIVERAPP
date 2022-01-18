/*
 * @Author: 熊望
 * @Date: 2022-01-07 22:59:31
 * @LastEditors: 熊望
 * @LastEditTime: 2022-01-18 00:46:34
 * @FilePath: /nginx/Users/bear/projects/project-bear/DRIVERAPP/src/router/index.js
 * @Description:
 */
import Vue from 'vue';
import Router from 'vue-router';
import qs from 'qs';
import store from '@/store';
import routeConfig from './route-config';

Vue.use(Router);
const router = new Router(routeConfig);

router.beforeEach(async (to, from, next) => {
    document.body.scrollTop = 0;
    const query = qs.parse(window.location.href.split('?')[1] || '');
    const mobile = query.mobile;
    console.log('获取URL上的手机号---', mobile);
    if (to.path.includes('vip-register') && mobile) {
        store.commit('setUserInfo', { mobile });
    }
    if (!store.state.logined && !to.path.includes('vip-register')) {
        if (!mobile) {
            const verificationToken = await store.dispatch('getLoginStatus');
            if (!verificationToken) {
                next('/vip-register');
                return;
            }

            next();
            document.title = to.name;
            return;
        }
        const loginSuc = await store.dispatch('handlerLogin', mobile);
        if (!loginSuc) {
            next('/vip-register');
            return;
        }
    }
    next();
    document.title = to.name;
});

export default router;
