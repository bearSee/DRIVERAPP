<!--
 * @Author: 熊望
 * @Date: 2021-12-30 00:11:13
 * @LastEditors: 熊望
 * @LastEditTime: 2022-01-06 22:58:47
 * @FilePath: /nginx/Users/bear/projects/project-bear/DRIVERAPP/src/views/userCenter/my-point.vue
 * @Description:
-->


<template>
  <div class="my-point">
    <van-pull-refresh
      v-model="refreshing"
      @refresh="handlerRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        :finished-text="tipText"
        @load="getPointData">
        <div class="list-container">
          <div
            class="content-item"
            :class="i + 1 === pointData.length && 'no-shadow'"
            v-for="(point, i) in pointData"
            :key="point.id">
            <div class="describe-box">
              <div class="reason">
                {{ point.sourceTypeName }}
              </div>
              <div class="datetime">
                {{ point.updatedDt }}
              </div>
            </div>
            <div
              class="point-num"
              :class="point.score >= 0 ? 'green' : 'red'">
              {{ (point.score >= 0) ? '+' : '' }} {{ point.score }}
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>

export default {
    name: 'MyPoint',
    data() {
        return {
            loading: false,
            finished: false,
            refreshing: false,
            pointData: [],
            limit: 20,
            page: 1,
            tipText: '',
        };
    },
    methods: {
        getPointData() {
            this.$http.post('/myScore', this.$qs.stringify({
                page: this.page,
                limit: this.limit,
            })).then((res) => {
                const { totalCount = 0, list = [] } = (res.data || {}).page || {};
                this.pointData.splice(this.pointData.length, 0, ...list);
                this.page += 1;
                if (this.pointData.length >= totalCount) {
                    this.tipText = '已经到底了喔';
                    this.finished = true;
                }
            }).finally(() => {
                this.loading = false;
                this.refreshing = false;
                if (!this.messageData.length) this.tipText = '暂无消息';
            });
        },
        handlerRefresh() {
            this.finished = false;
            this.loading = true;
            this.pointData = [];
            this.limit = 20;
            this.page = 1;
            this.getPointData();
        },
    },
};
</script>

<style lang="scss">
@import "@/assets/scss/theme.scss";

.my-point {
    .van-list {
      margin-top: .1rem;
      border-top: 1px solid #f3f3f3;
      font-size: .14rem;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      background: #fff;
      color: #333333;
        .content-item {
            .describe-box {
                color: #333;
                .reason {
                  line-height: .2rem;
                }
                .datetime {
                    font-size: .12rem;
                    margin-top: .02rem;
                    color: #999;
                }
            }
            .point-num {
                font-size: .24rem;
                line-height: .34rem;
                &.red {
                    color: $theme;
                }
                &.green {
                    color: #59C13F;
                }
            }
        }
        .van-list__loading {
          display: none;
        }
    }
}
</style>
