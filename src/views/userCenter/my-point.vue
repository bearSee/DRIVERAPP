<!--
 * @Author: 熊望
 * @Date: 2021-12-30 00:11:13
 * @LastEditors: 熊望
 * @LastEditTime: 2021-12-30 00:56:48
 * @FilePath: /nginx/Users/bear/Desktop/DRIVERAPP/src/views/userCenter/my-point.vue
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
        finished-text="没有更多了"
        @load="getPointData">
        <div
          class="content-item"
          v-for="point in pointData"
          :key="point.id">
          <div class="describe-box">
            <div class="reason">
              {{ point.reason }}
            </div>
            <div class="datetime">
              {{ point.time }}
            </div>
          </div>
          <div
            class="point-num"
            :class="String(point.type) === '1' ? 'red' : 'green'">
            {{ String(point.type) === '1' ? '+' : '-' }} {{ point.pointNum }}
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
            pageSize: 20,
            pageIndex: 1,
        };
    },
    methods: {
        getPointData() {
            setTimeout(() => {
                const data = Array(this.pageSize).fill().map((_, i) => ({
                    type: i % 2,
                    pointNum: (this.pageSize * (this.pageIndex - 1) + i + 1) * 5,
                    time: '2021-12-12 00:30:56',
                    reason: `卡bug得的积分${this.pageSize * (this.pageIndex - 1) + i + 1}`,
                    id: this.pageSize * (this.pageIndex - 1) + i + 1,
                }));
                const total = 100;

                this.pointData.splice(this.pointData.length, 0, ...data);
                this.pageIndex += 1;
                this.loading = false;
                this.refreshing = false;

                if (this.pointData.length >= total) this.finished = true;
            }, 1000);
        },
        handlerRefresh() {
            this.finished = false;
            this.loading = true;
            this.list = [];
            this.pageSize = 20;
            this.pageIndex = 1;
            this.getPointData();
        },
    },
    created() {
        this.getPointData();
    },
};
</script>

<style lang="scss">
@import "@/assets/scss/theme.scss";

.my-point {
    padding: .1rem;
    .van-list {
        .content-item {
            padding: .1rem;
            display: flex;
            justify-content: space-between;
            border-bottom: .01rem solid #ebedf0;
            &:last-child {
                border-bottom: 0;
            }
            .describe-box {
                color: #333;
                .reason {

                }
                .datetime {
                    font-size: .12rem;
                    margin-top: .1rem;
                }
            }
            .point-num {
                font-size: .3rem;
                &.red {
                    color: $theme;
                }
                &.green {
                    color: green;
                }
            }
        }
    }
}
</style>
