<!--
 * @Author: 熊望
 * @Date: 2021-12-30 00:11:13
 * @LastEditors: 熊望
 * @LastEditTime: 2022-01-09 21:06:33
 * @FilePath: /nginx/Users/bear/projects/project-bear/DRIVERAPP/src/views/userCenter/my-message.vue
 * @Description:
-->


<template>
  <div class="my-message">
    <van-pull-refresh
      v-model="refreshing"
      @refresh="handlerRefresh">
      <van-list
        v-model="loading"
        :finished-text="tipText"
        :finished="finished"
        @load="getMessageData">
        <div class="list-container">
          <div
            class="content-item"
            v-for="(message, i) in messageData"
            :class="i + 1 === messageData.length && 'no-shadow'"
            :key="message.id"
            @click="handlerRead(message)">
            <div class="content-box">
              <div class="title-box">
                <h3 class="cut_font_2">
                  {{ message.title }}
                </h3>
                <div class="text cut_font_2">
                  {{ message.content }}
                </div>
              </div>
            </div>
            <div class="date-box">
              <span>{{ message.sendDt }}</span>
              <div
                class="status"
                :class="'status_' + message.readStatus">
                {{ message.readStatusName }}
              </div>
            </div>
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
            messageData: [],
            limit: 20,
            page: 1,
            tipText: '',
        };
    },
    methods: {
        getMessageData() {
            this.$http.post('/myMessage').then((res) => {
                const { totalCount = 0, list = [] } = (res.data || {}).page || {};
                this.messageData.splice(this.messageData.length, 0, ...list);
                this.page += 1;
                if (this.messageData.length >= totalCount) {
                    this.tipText = '已经到底了喔';
                    this.finished = true;
                }
            }).catch(() => {
                this.finished = true;
            }).finally(() => {
                this.loading = false;
                this.refreshing = false;
                if (!this.messageData.length) this.tipText = '暂无消息';
            });
        },
        handlerRefresh() {
            this.finished = false;
            this.loading = true;
            this.messageData = [];
            this.limit = 20;
            this.page = 1;
            this.getMessageData();
        },
        async handlerRead(message) {
            if (message.readStatus === 'N') {
                await this.$http.post('/message/read', this.$qs.stringify({ messageDetailId: message.id }));
                this.$set(message, 'readStatus', 'Y');
            }
            this.$dialog.alert({
                title: message.title,
                message: (message.content || '暂无内容'),
                theme: 'round-button',
            });
        },
    },
};
</script>

<style lang="scss">
@import "@/assets/scss/theme.scss";

.my-message {
    .van-list {
      border-top: 0;
      .list-container {
        background: transparent;
        .content-item {
            box-shadow: unset;
            margin-bottom: .12rem;
            background: #fff;
            box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.02);
            border-radius: 6px;
            padding: .2rem .16rem 0 .16rem;
            display: block;
            .content-box {
              border-bottom: .01rem solid #ebedf0;
              .title-box {
                font-size: .16rem;
                line-height: .22rem;
                font-weight: 500;
                color: #000000;
                .text {
                  font-size: .12rem;
                  color: #999;
                  margin: .1rem 0 .14rem 0;
                  line-height: 1.2;
                }
              }
            }
            .date-box {
              padding: .15rem 0;
              color: #999999;
              font-size: .12rem;
              display: flex;
              justify-content: space-between;
              .status {
                font-size: .13rem;
                margin: auto 0;
                &_Y {
                  color: #999;
                }
                &_N {
                  color: $theme;
                }
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
