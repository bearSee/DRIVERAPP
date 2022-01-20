/*
 * @Author: 熊望
 * @Date: 2022-01-07 22:59:31
 * @LastEditors: 熊望
 * @LastEditTime: 2022-01-09 20:58:12
 * @FilePath: /nginx/Users/bear/projects/project-bear/DRIVERAPP/src/store/index.js
 * @Description:
 */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const store = new Vuex.Store({
    state: {
        // 需要缓存的数据
        keepAliveKeys: ['userInfo', 'currentGoodsInfo'],
        logined: false,
        // 用户信息
        userInfo: {},
        // 当前商品信息
        currentGoodsInfo: {},
    },
    mutations: {
        setLoginStatus(state, payload) {
            state.logined = payload;
        },
        setUserInfo(state, payload) {
            state.userInfo = { ...state.userInfo, ...payload };
        },
        replaceUserInfo(state, payload) {
            state.userInfo = payload || {};
        },
        setCurrentGoodsInfo(state, payload) {
            state.currentGoodsInfo = payload;
        },
        clearPermissions(state, saveStorage) {
            state.userInfo = {};
            state.currentGoodsInfo = {};
            state.logined = false;
            if (!saveStorage) window.localStorage.clear();
        },
    },
    actions: {
        handlerLogin({ commit }, payload) {
            const { mobile, showToast } = payload || {};
            return new Promise((resolve) => {
                Vue.prototype.$http.post('/init/login', Vue.prototype.$qs.stringify({ mobile }), { loading: true, loadingText: '加载中...', showToast }).then((res) => {
                    window.localStorage.setItem('Authorization', (res && res.data || {}).Authorization);
                    commit('setLoginStatus', true);
                    resolve(true);
                }).catch(() => {
                    resolve(false);
                });
            });
        },
        getUserInfo({ commit }) {
            return new Promise((resolve) => {
                Vue.prototype.$http.post('/user/info', null, { loading: true, loadingText: '加载中...' }).then((res) => {
                    commit('replaceUserInfo', (res && res.data || {}).data || {});
                    commit('setLoginStatus', true);
                    resolve(true);
                }).catch(() => {
                    resolve(false);
                });
            });
        },
        getLoginStatus() {
            return new Promise((resolve) => {
                Vue.prototype.$http.post('/activity/list', null, { loading: true, loadingText: '鉴定登录权限中...' }).then(() => {
                    resolve(true);
                }).catch(() => {
                    resolve(false);
                });
            });
        },
    },
    strict: debug,
});


// 在页面刷新/关闭/失焦后，缓存指定数据
const listener = () => {
    const state = store.state;
    const keys = state.keepAliveKeys || [];
    const keepAliveData = {};
    Object.keys(state).forEach((key) => {
        if (keys.includes(key)) {
            const aliveData = window.localStorage.getItem(key);
            try {
                keepAliveData[key] = JSON.parse(aliveData) || state[key];
            } catch (error) {
                keepAliveData[key] = state[key];
            }
        }
    });
    window.localStorage.setItem('storeStates', JSON.stringify(keepAliveData));
};

window.addEventListener('blur', listener);
window.addEventListener('beforeunload', listener);
window.addEventListener('close', listener);

// 在页面加载时读取缓存数据
try {
    const storeStates = window.localStorage.getItem('storeStates');
    store.replaceState(Object.assign({}, store.state, JSON.parse(storeStates)));
} catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
}

export default store;
