<!--
 * @Author: 熊望
 * @Date: 2021-12-30 00:11:13
 * @LastEditors: 熊望
 * @LastEditTime: 2021-12-31 00:46:19
 * @FilePath: /nginx/Users/bear/Desktop/DRIVERAPP/src/views/userCenter/my-message.vue
 * @Description:
-->


<template>
  <div class="my-message">
    <van-pull-refresh
      v-model="refreshing"
      @refresh="handlerRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="getOrderData">
        <div
          class="content-item"
          v-for="message in orderData"
          :key="message.id">
          <div class="content-box">
            <div class="title-box">
              <h3>{{ message.title }}</h3>
              <div class="text cut_font_3">
                {{ message.content }}
              </div>
            </div>
            <div
              class="status"
              :class="'status_' + message.status">
              {{ message.statusName }}
            </div>
          </div>
          <div class="date-box">
            {{ message.time }}
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>

export default {
    name: 'MyMessage',
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
                    statusName: i % 2 ? '新消息' : '已读',
                    time: '2021-12-12 00:30:56',
                    title: '第三次XXX公益活动开始报名啦！',
                    content: '开始报名啦！开始报名啦！开始报名啦！开始报名啦！开始报名啦！开始报名啦！开始报名啦！开始报名啦！开始报名啦！',
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
        handlerCancel(message) {
            console.log('message', message);
        },
        handlerConfirm(message) {
            console.log('message', message);
        },
    },
    created() {
        this.getOrderData();
    },
};
</script>

<style lang="scss">
@import "@/assets/scss/theme.scss";

.my-message {
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
            .content-box {
              display: flex;
              border-bottom: .01rem solid #ebedf0;
              padding: 0 .05rem;
              padding-bottom: .1rem;
              .title-box {
                width: calc(100% - .6rem);
                font-size: .14rem;
                .text {
                  font-size: .12rem;
                  color: #999;
                  margin-top: .1rem;
                }
              }
              .status {
                width: .6rem;
                font-size: .14rem;
                text-align: right;
                // margin: auto 0;
                &_0 {
                  color: #999;
                }
                &_1 {
                  color: $theme;
                }
              }
            }
            .date-box {
              padding: 0 .05rem;
              margin-top: .1rem;
            }
        }
    }
}
</style>
