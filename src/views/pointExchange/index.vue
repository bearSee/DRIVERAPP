

<template>
  <div class="point-exchange-index">
    <van-search
      v-model="searchParams.productName"
      show-action
      placeholder="请输入搜索关键词"
      @search="handlerSearch"
      @focus="popupShow = true">
      <template #action>
        <div
          class="search-btn"
          @click.stop="handlerSearch">
          搜索
        </div>
      </template>
    </van-search>
    <div class="filter-box">
      <div
        class="recommend-btn"
        :class="searchParams.recommendFlag === 'Y' && 'is-active'"
        @click="handlerRecommend">
        推荐商品
        <van-tag
          v-show="searchParams.recommendFlag === 'Y'"
          type="danger">
          推荐
        </van-tag>
      </div>
      <van-dropdown-menu :close-on-click-outside="false">
        <van-dropdown-item
          class="goods-status"
          v-model="searchParams.productStatus"
          :title-class="searchParams.productStatus !== '' && 'is-active'"
          :options="goodsStatusOptions"
          @change="handlerRefresh" />
        <van-dropdown-item
          class="goods-type"
          v-model="searchParams.productCategoryId"
          :title-class="searchParams.productCategoryId !== '' && 'is-active'"
          :options="goodsTypeOptions"
          @change="handlerRefresh" />
        <van-dropdown-item
          class="dropdown-date"
          :title-class="(searchParams.startDate || searchParams.endDate) && 'is-active'"
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
              @click="handlerConfrimDate">
              确认
            </van-button>
            <van-button
              type="danger"
              plain
              @click="handlerClearDate">
              清空
            </van-button>
          </div>
        </van-dropdown-item>
      </van-dropdown-menu>
    </div>
    <van-popup
      v-model="popupShow"
      class="history-popup"
      duration="0.1"
      get-container=".point-exchange-index"
      position="top">
      <div class="popup-title">
        历史搜索
      </div>
      <div
        class="popup-content"
        v-if="historyTag.length">
        <van-tag
          size="large"
          closeable
          v-for="(tag, i) in historyTag"
          :key="i"
          :class="tag === searchParams.productName && 'is-active'"
          @click="handlerChooseTag(tag)"
          @close="handlerDeleteTag(i)">
          <div class="cut_font">
            {{ tag }}
          </div>
        </van-tag>
      </div>
      <van-empty
        v-else
        image="search"
        description="暂无历史搜索记录" />
    </van-popup>
    <van-pull-refresh
      v-model="refreshing"
      @refresh="handlerRefresh">
      <van-list
        v-model="loading"
        loading-text=" "
        :finished="finished"
        :finished-text="tipText"
        @load="getGoodsData">
        <div
          class="content-item"
          v-for="order in goodsData"
          :key="order.id">
          <div class="image-box">
            <img
              src=""
              alt="1">
          </div>
          <div class="content-box">
            123
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
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
                recommendFlag: 'Y',
                productName: '',
                productStatus: '',
                productCategoryId: '',
                startDate: '',
                endDate: '',
            },
            goodsStatusOptions: [],
            goodsTypeOptions: [],
            calendarVisible: false,
            currentDateCode: '',
            popupShow: false,
            historyTag: JSON.parse(window.localStorage.getItem('historyTag') || '[]'),
            loading: false,
            finished: false,
            refreshing: false,
            goodsData: [],
            limit: 20,
            page: 1,
            tipText: '',
        };
    },
    methods: {
        getGoodsType() {
            this.$http.post('/product/info/queryPage', this.$qs.stringify({ page: 1, limit: 999 })).then((res) => {
                this.goodsTypeOptions = [
                    {
                        text: '所有商品',
                        value: '',
                    },
                    ...(((res.data || {}).page || {}).list || []).map(({ id: value, categoryName: text }) => ({ text, value })),
                ];
            });
        },
        getGoodsStatus() {
            this.$http.get('/dict/select/list/PRODUCT_STATUS').then((res) => {
                this.goodsStatusOptions = [
                    {
                        text: '全部状态',
                        value: '',
                    },
                    ...((res.data || {}).list || []).map(({ dicKey: value, dicValue: text }) => ({ text, value })),
                ];
            });
        },
        getGoodsData() {
            this.$http.post('/product/info/queryPage', this.$qs.stringify({
                ...this.searchParams,
                page: this.page,
                limit: this.limit,
            }, { loading: true })).then((res) => {
                const { totalCount = 0, list = [] } = (res.data || {}).page || {};
                this.goodsData.splice(this.goodsData.length, 0, ...list);
                this.page += 1;
                if (this.goodsData.length >= totalCount) {
                    this.tipText = '已经到底了喔';
                    this.finished = true;
                }
            }).finally(() => {
                this.loading = false;
                this.refreshing = false;
                if (!this.goodsData.length) this.tipText = '暂无订单';
            });
        },
        handlerRefresh() {
            this.finished = false;
            this.loading = true;
            this.goodsData = [];
            this.limit = 20;
            this.page = 1;
            this.getGoodsData();
        },
        handlerSearch() {
            this.popupShow = false;
            const { productName } = this.searchParams;
            if (productName && !this.historyTag.includes(productName)) {
                this.historyTag = [productName, ...this.historyTag].slice(0, 6);
                window.localStorage.setItem('historyTag', JSON.stringify(this.historyTag));
            }
            this.handlerRefresh();
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
        },
        handlerClearDate() {
            this.searchParams = {
                ...this.searchParams,
                startDate: '',
                endDate: '',
            };
        },
        handlerChooseTag(tag) {
            this.searchParams = { ...this.searchParams, productName: tag };
            this.handlerSearch();
        },
        handlerDeleteTag(i) {
            this.historyTag.splice(i, 1);
            window.localStorage.setItem('historyTag', JSON.stringify(this.historyTag));
        },
        handlerRecommend() {
            this.searchParams.recommendFlag = this.searchParams.recommendFlag === 'Y' ? 'N' : 'Y';
            this.handlerRefresh();
        },
    },
    created() {
        this.getGoodsType();
        this.getGoodsStatus();
    },
};
</script>

<style lang="scss">
@import "@/assets/scss/theme.scss";

.point-exchange-index {
  position: relative;
  .van-search__action {
    border-radius: .17rem;
    border: 1px solid #F66A4A;
    padding: 0;
    margin: 0 .1rem;
    .search-btn {
      width: 0.68rem;
      text-align: center;
      height: 0.32rem;
      line-height: .32rem;
      color: #F66A4A;
    }
  }
  .filter-box {
    width: 100%;
    display: flex;
    box-shadow: 0 2px 12px rgb(100 101 102 / 12%);
    .recommend-btn {
      width: 0.8rem;
      background: #fff;
      line-height: .48rem;
      text-align: center;
      border: 1px solid #fff;
      position: relative;
      font-size: .16rem;
      &.is-active {
        color: $theme;
      }
      .van-tag {
        position: absolute;
        position: absolute;
        left: 0.03rem;
        top: 0rem;
        transform: scale(.65);
      }
    }
    .van-dropdown-menu {
      width: calc(100% - .8rem);
      .van-dropdown-menu__bar {
        box-shadow: unset;
      }
      .van-dropdown-menu__item .is-active {
        border-color: $theme;
        color: $theme;
      }
    }
  }
  .dropdown-date {
    .van-dropdown-item__content {
      padding: .2rem .12rem;
      .date-box {
        padding: 0;
        &::after {
          border: 0
        }
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
            line-height: .36rem;
          }
        }
      }
      .confirm-btn {
        margin-top: .2rem;
        height: .4rem;
        display: flex;
        justify-content: space-between;
        .van-button {
          width: calc(50% - .1rem);
        }
      }
    }
  }
  .van-overlay {
    top: 1rem;
  }
  .history-popup {
    top: 1rem;
    padding: .12rem;
    padding-bottom: .3rem;
    min-height: 1.54rem;
    // box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.02);
    .popup-title {
      font-size: .16rem;
      color: #000;
    }
    .popup-content {
      .van-tag {
        height: .30rem;
        line-height: .30rem;
        border-radius: .17rem;
        background: #F2F2F2;
        border: 1px solid #E3E3E3;
        font-weight: 500;
        color: #666;
        margin: .12rem .1rem .02rem 0;
        &>div {
          max-width: calc(100vw - 0.6rem);
        }
        .van-icon {
          color: #D2D2D2;
          margin-left: .05rem;
        }
        &.is-active {
          background: rgba(246, 106, 74, 0.1);
          border-color: $theme;
          color: $theme;
        }
      }
    }
    .van-empty {
      padding: 0;
      .van-empty__image {
        width: .6rem;
        height: .6rem;
      }
    }
  }
  .van-list {
      margin-top: 0;
      min-height: calc(100vh - 1.5rem);
      padding: 0 .12rem;
      .content-item {
          padding: .14rem .16rem;
          background: #fff;
          margin: .12rem 0;
          font-size: .12rem;
          box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.02);
          border-radius: 6px;
      }
      .van-list__loading {
        display: none;
      }
  }
}
</style>
