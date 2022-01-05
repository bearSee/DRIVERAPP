import Vue from 'vue';
import Vant from 'vant';
import App from './App';
import router from './router';
import store from './store';
import './plugins';
import 'vant/lib/index.css';


Vue.use(Vant);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
