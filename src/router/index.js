import Vue from 'vue';
import Router from 'vue-router';
import qs from 'qs';
import routeConfig from './route-config';
import store from '@/store';

Vue.use(Router);
const router = new Router(routeConfig);

const query = qs.parse(window.location.href.split('?')[1] || '');
const mobile = query.mobile || '13800000000';

router.beforeEach(async (to, from, next) => {
    document.body.scrollTop = 0;
    if (!store.state.logined) {
        await store.dispatch('handlerLogin', mobile);
    }
    next();
});

export default router;
