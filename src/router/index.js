/*
 * @Author: 熊望
 * @Date: 2022-01-07 22:59:31
 * @LastEditors: 熊望
 * @LastEditTime: 2022-01-09 20:58:57
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

const query = qs.parse(window.location.href.split('?')[1] || '');
const mobile = query.mobile;

router.beforeEach(async (to, from, next) => {
    document.body.scrollTop = 0;
    if (!store.state.logined && !to.path.includes('vip-register')) {
        if (!mobile) {
            const verificationToken = await store.dispatch('getUserInfo');
            if (!verificationToken) {
                next('/vip-register');
                return;
            }

            next();
            return;
        }
        await store.dispatch('handlerLogin', mobile);
    }
    next();
});

export default router;
