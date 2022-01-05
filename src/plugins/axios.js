import Vue from 'vue';
import axios from 'axios';
import store from '@/store';
import errorCode from '@/utils/error-code';

const baseURLConfig = {
    development: 'http://edc-api.dev.dc.sibionics.com',
    release: 'http://edc-api.test.dc.sibionics.com',
    production: '',
};

const baseURL = baseURLConfig[process.env.NODE_ENV];

// const baseURL = 'http://192.168.0.84:18100';
// const baseURL = 'http://192.168.0.141:18100';

const axiosConfig = {
    baseURL,
    timeout: 30 * 1000, // Timeout
    // withCredentials: true, // Check cross-site Access-Control
};
const Axios = axios.create(axiosConfig);
// 请求拦截
Axios.interceptors.request.use(
    (config) => {
        // UUID || 生成随机数
        config.headers = config.headers;
        // get请求增加时间戳，避免服务器304
        if (config.method === 'get') {
            config.params = {
                _t: (new Date()).getTime(),
                ...config.params,
            };
        }

        if (config.loading) {
            Vue.prototype.$toast.loading({
                forbidClick: true,
                message: config.loadingText || '页面加载中...',
            });
        }

        return config;
    },
    (error) => {
        Promise.reject(error);
    },
);

// 响应拦截
Axios.interceptors.response.use(
    async (res) => {
        Vue.prototype.$toast.clear();

        const { code, message } = res.data || {};

        // 错误提示拦截
        const showMessage = () => {
            const messageTip = errorCode[code] || message || '服务器响应失败，请稍后再试';
            Vue.prototype.$toast.clear();
            Vue.prototype.$toast(messageTip);
        };

        // 返回成功响应
        if (String(code) === '200') return res;

        showMessage();

        // 登录失效拦截
        if (['401', '906', '907', '908', '909', '999'].includes(String(code))) {
            // 清除相关菜单权限
            store.commit('clearPermissions');
            // window.location.replace('/#/login');
        }

        return Promise.reject(res);
    },
    (error) => {
        Vue.prototype.$toast.clear();
        Vue.prototype.$toast('服务器内部异常');
        return Promise.reject(error);
    },
);

window.axios = Axios;
Vue.prototype.$http = Axios;
