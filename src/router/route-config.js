/*
 * @Author: 熊望
 * @Date: 2021-12-27 20:50:16
 * @LastEditors: 熊望
 * @LastEditTime: 2022-01-05 22:54:06
 * @FilePath: /nginx/Users/bear/projects/project-bear/DRIVERAPP/src/router/route-config.js
 * @Description:
 */

import pointExchange from '@/views/pointExchange/index';
import goodsDetail from '@/views/pointExchange/goods-detail';
import userCenter from '@/views/userCenter/index';
import myPoint from '@/views/userCenter/my-point';
import myOrder from '@/views/userCenter/my-order';
import myMessage from '@/views/userCenter/my-message';
import vipRegister from '@/views/vipRegister/index';

export default {
    routes: [
        {
            path: '/',
            redirect: '/user-center',
        },
        {
            path: '/vip-register',
            name: '会员注册',
            meta: {
                keepAlive: false,
            },
            component: vipRegister,
        },
        {
            path: '/point-exchange',
            name: '积分商城',
            meta: {
                keepAlive: false,
            },
            component: pointExchange,
        },
        {
            path: '/goods-detail',
            name: '商品详情',
            meta: {
                keepAlive: false,
            },
            component: goodsDetail,
        },
        {
            path: '/user-center',
            name: '个人中心',
            meta: {
                keepAlive: false,
            },
            component: userCenter,
        },
        {
            path: '/my-point',
            name: '收支明细',
            meta: {
                keepAlive: false,
            },
            component: myPoint,
        },
        {
            path: '/my-order',
            name: '我的订单',
            meta: {
                keepAlive: false,
            },
            component: myOrder,
        },
        {
            path: '/my-message',
            name: '我的消息',
            meta: {
                keepAlive: false,
            },
            component: myMessage,
        },
    ],
};
