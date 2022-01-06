

<template>
  <div class="point-exchange-index">
    <van-search
      v-model="searchParams.keyword"
      show-action
      placeholder="请输入搜索关键词"
      @search="handlerSearch">
      <template #action>
        <div @click.stop="handlerSearch">
          搜索
        </div>
      </template>
    </van-search>
    <van-dropdown-menu :close-on-click-outside="false">
      <van-dropdown-item
        class="goods-status"
        v-model="searchParams.goodsStatus"
        :options="goodsStatusOptions" />
      <van-dropdown-item
        class="goods-type"
        v-model="searchParams.goodsType"
        :options="goodsTypeOptions" />
      <van-dropdown-item
        class="dropdown-date"
        title="上新时间"
        ref="dropdownItem">
        <van-cell class="date-box">
          <div
            class="start-date"
            @click="handlerChooseDate('startDate')">
            <span v-if="searchParams.startDate">{{ searchParams.startDate }}</span>
            <span
              class="placeholder"
              v-else>请选择开始时间</span>
          </div>
          <span class="mark">至</span>
          <div
            class="end-date"
            @click="handlerChooseDate('endDate')">
            <span v-if="searchParams.endDate">{{ searchParams.endDate }}</span>
            <span
              class="placeholder"
              v-else>请选择结束时间</span>
          </div>
        </van-cell>
        <div class="confirm-btn">
          <van-button
            type="danger"
            block
            round
            @click="handlerConfrimDate">
            确认
          </van-button>
        </div>
      </van-dropdown-item>
    </van-dropdown-menu>
    {{ this.searchParams }}
    <van-calendar
      v-model="calendarVisible"
      @confirm="handlerSelectDate" />
  </div>
</template>

<script>

export default {
    name: 'PointExchangeIndex',
    data() {
        return {
            searchParams: {
                keyword: '',
                goodsStatus: 1,
                goodsType: 1,
                startDate: '',
                endDate: '',
            },
            goodsStatusOptions: [
                {
                    text: '可兑换',
                    value: 1,
                },
                {
                    text: '已兑换',
                    value: 2,
                },
                {
                    text: '已下架',
                    value: 3,
                },
            ],
            goodsTypeOptions: [
                {
                    text: '生活用品',
                    value: 1,
                },
                {
                    text: '家电',
                    value: 2,
                },
                {
                    text: '箱包',
                    value: 3,
                },
                {
                    text: '食品酒饮',
                    value: 4,
                },
                {
                    text: '个体清洁',
                    value: 5,
                },
                {
                    text: '户外运动',
                    value: 6,
                },
            ],
            calendarVisible: false,
            currentDateCode: '',
        };
    },
    methods: {
        handlerSearch() {
            console.log('tag', this.searchParams);
        },
        handlerConfrimDate() {
            const dropdownItem = this.$refs.dropdownItem;
            if (dropdownItem) dropdownItem.toggle();
            this.handlerSearch();
        },
        handlerChooseDate(code) {
            this.currentDateCode = code;
            this.calendarVisible = true;
        },
        handlerSelectDate(date) {
            this.$set(this.searchParams, this.currentDateCode, window.formatDate(date));
            const { startDate, endDate } = this.searchParams;
            if (startDate && endDate && (startDate > endDate)) {
                this.$toast('开始日期不能大于结束日期');
                this.$set(this.searchParams, this.currentDateCode, '');
            }
            this.calendarVisible = false;
            console.log('this.searchParams', this.searchParams);
        },
    },
};
</script>

<style lang="scss">
// @import "@/assets/scss/theme.scss";

.point-exchange-index {
  .dropdown-date {
    .van-dropdown-item__content {
      padding: .15rem .1rem;
      .date-box {
        padding: .2rem .1rem;
        padding-top: .1rem;
        .van-cell__value {
          display: flex;
          justify-content: space-between;
          .start-date, .end-date {
            background: #f1eeee;
            padding: .06rem .1rem;
            width: calc(50% - .2rem);
            border-radius: .03rem;
            .placeholder {
              color: #999;
            }
          }
          .mark {
            width: .3rem;
            text-align: center;
            // font-size: .2rem;
          }
        }
      }
    }
  }
}
</style>
