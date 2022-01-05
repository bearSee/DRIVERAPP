<!--
 * @Author: 熊望
 * @Date: 2021-12-30 00:11:13
 * @LastEditors: 熊望
 * @LastEditTime: 2022-01-05 23:34:44
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
        finished-text="已经到底了喔"
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
import { mapState } from 'vuex';

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
        };
    },
    computed: {
        ...mapState(['userInfo']),
    },
    methods: {
        getPointData() {
            this.$http.post('/user/score/detail', this.$qs.stringify({
                userId: this.userInfo.id,
                page: this.page,
                limit: this.limit,
            })).then((res) => {
                const { totalCount = 0, list = [] } = (res.data || {}).page || {};
                this.pointData.splice(this.pointData.length, 0, ...list);
                this.page += 1;
                if (this.pointData.length >= totalCount) this.finished = true;
            }).finally(() => {
                this.loading = false;
                this.refreshing = false;
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
    created() {
        this.getPointData();
    },
};
</script>

<style lang="scss">
@import "@/assets/scss/theme.scss";

.my-point {
    padding-bottom: .1rem;
    background: #f9f9f9;
    .van-list {
      margin-top: .1rem;
      border-top: 1px solid #f3f3f3;
      font-size: .14rem;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      background: #fff;
      color: #333333;
        .content-item {
            padding: .2rem 0;
            margin: 0 .16rem;
            display: flex;
            justify-content: space-between;
            box-shadow: inset 0px -1px 0px 0px #f3f3f3;
            &:last-child {
              box-shadow: none;
            }
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
    }
}
</style>
