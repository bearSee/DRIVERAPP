<!--
 * @Author: 熊望
 * @Date: 2021-12-30 00:11:13
 * @LastEditors: 熊望
 * @LastEditTime: 2021-12-31 00:31:03
 * @FilePath: /nginx/Users/bear/Desktop/DRIVERAPP/src/views/userCenter/my-order.vue
 * @Description:
-->


<template>
  <div class="my-order">
    <van-pull-refresh
      v-model="refreshing"
      @refresh="handlerRefresh">
      <div class="total-box">
        订单总消耗积分：{{ totalPoints }} <van-icon name="points" />
      </div>
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="getOrderData">
        <div
          class="content-item"
          v-for="order in orderData"
          :key="order.id">
          <div class="title-box">
            <div class="date-time">
              {{ order.time }}
            </div>
            <div class="order-num">
              订单号码：{{ order.orderNum }}
            </div>
          </div>
          <div class="goods-box">
            <img :src="order.image">
            <div class="name cut_font_3">
              {{ order.name }}
            </div>
            <div class="status">
              {{ order.statusName }}
            </div>
          </div>
          <div class="total-box">
            <div class="total">
              共 {{ order.acount }} 件 总计：{{ order.points }} <van-icon name="points" />
            </div>
            <div class="operate-box">
              <van-button
                type="info"
                size="mini"
                plain
                round
                :disabled="String(order.status) === '0'"
                @click="handlerCancel(order)">
                取消交易
              </van-button>
              <van-button
                type="info"
                size="mini"
                plain
                round
                :disabled="String(order.status) === '0'"
                @click="handlerConfirm(order)">
                确认交易
              </van-button>
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>

export default {
    name: 'MyOrder',
    data() {
        return {
            loading: false,
            finished: false,
            refreshing: false,
            orderData: [],
            pageSize: 20,
            pageIndex: 1,
            totalPoints: 98,
        };
    },
    methods: {
        getOrderData() {
            setTimeout(() => {
                const data = Array(this.pageSize).fill().map((_, i) => ({
                    status: i % 2,
                    statusName: i % 2 ? '进行中' : '交易完成',
                    orderNum: 23777887,
                    time: '2021-12-12 00:30:56',
                    name: `【推荐商品】车载手机支架${i}`,
                    image: 'https://axure-file.lanhuapp.com/2965a46e-cb50-411b-a84b-2bbd9c18fc95__d0c916cce3608bc186581b8f3b3a4946.png',
                    acount: 1,
                    points: 46,
                    id: this.pageSize * (this.pageIndex - 1) + i + 1,
                }));
                const total = 100;

                this.orderData.splice(this.orderData.length, 0, ...data);
                this.pageIndex += 1;
                this.loading = false;
                this.refreshing = false;

                if (this.orderData.length >= total) this.finished = true;
            }, 1000);
        },
        handlerRefresh() {
            this.finished = false;
            this.loading = true;
            this.list = [];
            this.pageSize = 20;
            this.pageIndex = 1;
            this.getOrderData();
        },
        handlerCancel(order) {
            console.log('order', order);
        },
        handlerConfirm(order) {
            console.log('order', order);
        },
    },
    created() {
        this.getOrderData();
    },
};
</script>

<style lang="scss">
@import "@/assets/scss/theme.scss";

.my-order {
    background: #f1eeee;
    padding: .1rem;
    .total-box {
      .van-icon {
        color: $theme;
        opacity: .8;
      }
    }
    .van-list {
        .content-item {
            padding: .12rem .05rem;
            background: #fff;
            margin: .1rem 0;
            border-radius: .05rem;
            font-size: .12rem;
            .title-box {
              width: 100%;
              padding: 0 .05rem;
              padding-bottom: .05rem;
              border-bottom: .01rem solid #ebedf0;
              display: flex;
              justify-content: space-between;
              .order-num {
                margin-left: .05rem;
              }
            }
            .goods-box {
              display: flex;
              justify-content: space-between;
              padding: .08rem .05rem;
              border-bottom: .01rem solid #ebedf0;
              img {
                width: .5rem;
                height: .5rem;
                max-width: .5rem;
                max-height: .5rem;
              }
              .name {
                margin: auto .05rem;
                width: calc(100% - 1.1rem);
                word-break: break-all;
              }
              .status {
                color: $theme;
                margin: auto 0;
              }
            }
            .total-box {
              display: flex;
              justify-content: space-between;
              margin-top: .1rem;
              padding: 0 .05rem;
              .total {
                margin: auto 0;
              }
              .operate-box {
                margin: auto 0;
                .van-button {
                  border-color: $theme;
                  color: $theme;
                  width: .6rem;
                  margin-left: .1rem;
                }
              }
            }
        }
    }
}
</style>
