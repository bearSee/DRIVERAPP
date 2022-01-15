<!--
 * @Author: 熊望
 * @Date: 2021-12-30 00:11:13
 * @LastEditors: 熊望
 * @LastEditTime: 2022-01-09 23:00:07
 * @FilePath: /nginx/Users/bear/projects/project-bear/DRIVERAPP/src/views/userCenter/my-order.vue
 * @Description:
-->


<template>
  <div class="my-order">
    <van-pull-refresh
      v-model="refreshing"
      @refresh="handlerRefresh">
      <div class="head-total-box">
        订单总消耗积分：
        <span class="total-points">{{ sumPrice }}</span>
        <span class="point-mark" />
      </div>
      <van-list
        v-model="loading"
        :finished="finished"
        :finished-text="tipText"
        @load="getOrderData">
        <div
          class="content-item"
          v-for="order in orderData"
          :key="order.id">
          <div class="title-box">
            <div class="date-time">
              {{ order.updatedDt }}
            </div>
            <div class="order-num">
              订单号码：{{ order.orderNo }}
            </div>
          </div>
          <div
            class="goods-box"
            @click="handlerViewDetail(order)">
            <img :src="order.productPic">
            <div class="name cut_font_3">
              {{ order.productName }}
            </div>
            <div class="total-info">
              <div class="point-num">
                {{ order.productPrice }} <span>积分</span>
              </div>
              <div>共 {{ order.productNum }} 件</div>
            </div>
          </div>
          <div class="operate-box">
            <div class="status">
              {{ order.orderStatusName }}
            </div>
            <div class="operate-btn">
              <van-button
                type="info"
                size="mini"
                plain
                round
                :disabled="order.orderStatus !== 'ORDER_STATUS_NEW'"
                @click="handlerChangeStatus(order, 'cancel')">
                取消交易
              </van-button>
              <van-button
                type="info"
                size="mini"
                plain
                round
                :disabled="order.orderStatus !== 'ORDER_STATUS_WAIT_CONFIRM'"
                @click="handlerChangeStatus(order, 'confirm')">
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
            limit: 20,
            page: 1,
            sumPrice: 0,
            tipText: '',
        };
    },
    methods: {
        getOrderData() {
            this.$http.post('/myOrder', this.$qs.stringify({
                page: this.page,
                limit: this.limit,
            })).then((res) => {
                const { totalCount = 0, list = [] } = (res.data || {}).page || {};
                this.orderData.splice(this.orderData.length, 0, ...list);
                this.page += 1;
                this.sumPrice = (res.data || {}).sumPrice || 0;
                if (this.orderData.length >= totalCount) {
                    this.tipText = '已经到底了喔';
                    this.finished = true;
                }
            }).catch(() => {
                this.finished = true;
            }).finally(() => {
                this.loading = false;
                this.refreshing = false;
                if (!this.orderData.length) this.tipText = '暂无订单';
            });
        },
        handlerRefresh() {
            this.finished = false;
            this.loading = true;
            this.orderData = [];
            this.limit = 20;
            this.page = 1;
            this.getOrderData();
        },
        handlerChangeStatus({ id }, type) {
            const obj = {
                cancel: {
                    url: '/order/cancel',
                    message: '是否取消交易？',
                },
                confirm: {
                    url: '/order/confirm',
                    message: '是否确认交易？',
                },
            };
            const { message, url } = obj[type];
            this.$dialog.confirm({
                title: '温馨提示',
                message,
            }).then(() => {
                this.$http.post(url, this.$qs.stringify({ orderId: id }), { loading: true, loadingText: '加载中...' }).then(() => {
                    this.$toast.success('操作成功');
                    this.handlerRefresh();
                });
            });
        },
        handlerViewDetail({ id }) {
            this.$router.push(`/goods-detail?id=${id}`);
        },
    },
};
</script>

<style lang="scss">
@import "@/assets/scss/theme.scss";

.my-order {
    padding: .14rem .12rem;
    .head-total-box {
      font-weight: 500;
      color: #000;
      .total-points {
        font-size: .16rem;
        margin-right: .03rem;
        font-family: DIN-Medium, DIN;
        color: #F66A4A;
      }
    }
    .van-list {
        margin-top: 0;
        min-height: calc(100vh - 0.9rem);
        .content-item {
            padding: .14rem .16rem;
            background: #fff;
            margin: .12rem 0;
            font-size: .12rem;
            box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.02);
            border-radius: 6px;
            .title-box {
              width: 100%;
              padding: 0 0 .13rem 0;
              box-shadow: inset 0px -1px 0px 0px rgba(238, 238, 238, 0.5);
              display: flex;
              justify-content: space-between;
              line-height: .17rem;
              color: #999;
            }
            .goods-box {
              display: flex;
              justify-content: space-between;
              padding: .12rem 0 .14rem 0;
              img {
                width: .67rem;
                height: .67rem;
                max-width: .67rem;
                max-height: .67rem;
              }
              .name {
                margin: auto .08rem;
                font-size: .14rem;
                min-width: calc(100% - 2rem);
                max-width: calc(100% - 1.4rem);
                font-weight: 500;
                color: #000000;
                line-height: .2rem;
              }
              .total-info {
                margin: auto 0;
                color: #666666;
                text-align: right;
                .point-num {
                  font-size: .22rem;
                  font-family: DIN-Medium, DIN;
                  font-weight: 500;
                  color: #F66A4A;
                  margin-bottom: .05rem;
                  span {
                    display: inline-block;
                    width: .24rem;
                    font-size: .12rem;
                    font-family: PingFangSC-Regular, PingFang SC;
                  }
                }
              }
            }
            .operate-box {
              display: flex;
              justify-content: space-between;
              .status {
                color: #999;
                margin: auto 0;
              }
              .operate-btn {
                .van-button {
                  border-color: $theme;
                  color: $theme;
                  width: .6rem;
                  margin-left: .1rem;
                }
              }
            }
        }
        // .van-list__loading {
        //   display: none;
        // }
    }
}
</style>
