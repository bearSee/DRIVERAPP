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

    if (to.path.includes('vip-register')) {
        if (mobile) {
            store.commit('setUserInfo', { mobile });
            const loginStatus = await store.dispatch('handlerLogin', { mobile, showToast: false });
            if (loginStatus) {
                // let action = 'cancel';
                // try {
                //     action = await Vue.prototype.$dialog.confirm({
                //         title: '温馨提示',
                //         message: `当前手机号 ${mobile} 已被注册`,
                //         confirmButtonText: '直接登陆',
                //         cancelButtonText: '前往注册',
                //         theme: 'round-button',
                //     });
                // } catch (error) {
                //     console.error(error);
                // }
                // if (action === 'confirm') {
                //     next('/user-center');
                //     return;
                // }
                Vue.prototype.$dialog.alert({
                    title: '温馨提示',
                    message: `当前手机号 ${(mobile || '').replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')} 已被注册`,
                    theme: 'round-button',
                });
            }
        }
        next();
        return;
    }


    if (!store.state.logined) {
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
        const loginStatus = await store.dispatch('handlerLogin', { mobile });
        if (!loginStatus) {
            next('/vip-register');
            return;
        }
    }

    next();
    document.title = to.name;
});

export default router;
