

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
          :title-class="searchParams.productStatus !== '' && 'is-active' || ''"
          :options="goodsStatusOptions"
          @change="handlerRefresh" />
        <van-dropdown-item
          class="goods-type"
          v-model="searchParams.productCategoryId"
          :title-class="searchParams.productCategoryId !== '' && 'is-active' || ''"
          :options="goodsTypeOptions"
          @change="handlerRefresh" />
        <van-dropdown-item
          class="dropdown-date"
          :title-class="(searchParams.beginDate || searchParams.endDate) && 'is-active'"
          title="上新时间"
          ref="dropdownItem">
          <van-cell class="date-box">
            <div
              class="start-date"
              @click="handlerChooseDate('beginDate')">
              <span v-if="searchParams.beginDate">{{ searchParams.beginDate }}</span>
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
          v-for="goods in goodsData"
          :key="goods.id">
          <div class="image-box">
            <van-tag
              mark
              type="danger"
              v-if="goods.recommendFlag === 'Y'">
              推荐
            </van-tag>
            <img
              class="goods-img"
              v-if="goods.productPic"
              :src="goods.productPic"
              alt="暂无图片">
            <van-empty
              v-else
              image="error"
              description="暂无图片" />
          </div>
          <div class="content-box">
            <div class="g-title cut_font_2">
              {{ goods.productName }}
            </div>
            <div class="time-out-control">
              <span>剩余兑换时间</span>
              <div
                class="end-status green"
                v-if="goods.timeOut === -1">
                暂未开始
              </div>
              <div
                class="end-status red"
                v-else-if="goods.timeOut === -2">
                已截止
              </div>
              <van-count-down
                v-else
                format="DD天 HH:mm:ss"
                :time="goods.timeOut" />
            </div>
            <div class="time-out-status">
              <div :style="`width: ${goods.timeOutPercent || 0}%;`" />
            </div>
            <div class="price-box">
              <div class="price">
                <span class="pri-num">{{ goods.price }} </span>
                <span>积分/可兑换 {{ goods.exchangeNum }} 次</span>
              </div>
              <van-button
                round
                class="exchange"
                size="mini"
                type="primary"
                :disabled="goods.productStatus !== 'PRODUCT_STATUS_2' || goods.timeOut <= 0"
                @click="handlerExchange(goods)">
                立即兑换
              </van-button>
            </div>
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
import { mapMutations } from 'vuex';

export default {
    name: 'PointExchangeIndex',
    data() {
        return {
            searchParams: {
                recommendFlag: 'Y',
                productName: '',
                productStatus: '',
                productCategoryId: '',
                beginDate: '',
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
        ...mapMutations(['setCurrentGoodsInfo']),
        getGoodsType() {
            this.$http.post('/product/category/queryPage', this.$qs.stringify({ page: 1, limit: 999 })).then((res) => {
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
                const data = list.map((d) => {
                    let timeOut = 0;
                    let timeOutPercent = 0;
                    try {
                        const endTime = new Date(d.exchangeEndDate).getTime();
                        const startTime = new Date(d.exchangeBeginDate).getTime();
                        const currentTime = new Date().getTime();
                        // -1 暂未开始 -2 已经结束
                        if (startTime > currentTime) {
                            timeOut = -1;
                        } else if (currentTime > endTime) {
                            timeOut = -2;
                        } else {
                            timeOut = endTime - currentTime;
                            timeOutPercent = ((timeOut / (endTime - startTime) * 100) || 0).toFixed(2);
                        }
                    } catch (error) {
                        console.error('兑换日期格式错误', error);
                    }
                    return { ...d, timeOut, timeOutPercent };
                });
                this.goodsData.splice(this.goodsData.length, 0, ...data);
                this.page += 1;
                if (this.goodsData.length >= totalCount) {
                    this.tipText = '已经到底了喔';
                    this.finished = true;
                }
            }).catch(() => {
                this.finished = true;
            }).finally(() => {
                this.loading = false;
                this.refreshing = false;
                if (!this.goodsData.length) this.tipText = '暂无商品';
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
            const { beginDate, endDate } = this.searchParams;
            if (beginDate && endDate && (beginDate > endDate)) {
                this.$toast('开始日期不能大于结束日期');
                this.$set(this.searchParams, this.currentDateCode, '');
            }
            this.calendarVisible = false;
        },
        handlerClearDate() {
            this.searchParams = {
                ...this.searchParams,
                beginDate: '',
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
            this.searchParams.recommendFlag = this.searchParams.recommendFlag === 'Y' ? '' : 'Y';
            this.handlerRefresh();
        },
        handlerExchange(goodsInfo) {
            this.setCurrentGoodsInfo(goodsInfo);
            this.$router.push('/goods-detail');
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
          display: flex;
          .image-box {
            position: relative;
            .van-tag {
              position: absolute;
              left: 0;
              top: 0;
            }
            .goods-img {
              width: 1rem;
              min-width: 1rem;
              height: 1rem;
            }
            .van-empty {
              width: 1rem;
              min-width: 1rem;
              height: 1rem;
              border: .01rem solid #f6f6f6;
              .van-empty__image {
                width: .6rem;
                height: .6rem;
              }
              .van-empty__description {
                padding: 0;
              }
            }
          }
          .content-box {
            margin-left: .08rem;
            width: calc(100% - 1.08rem);
            .g-title {
              height: .4rem;
              font-size: .14rem;
              font-weight: 500;
              color: #333333;
              line-height: .2rem;
            }
            .time-out-control {
              margin-top: .1rem;
              display: flex;
              color: #999;
              font-size: .12rem;
              line-height: .2rem;
              &>span {
                margin: auto 0;
              }
              .end-status {
                color: $theme;
                margin-left: .09rem;
                .green {
                  color: #59C13F;
                }
              }
              .van-count-down {
                margin-left: .05rem;
                color: $theme;
                font-size: .12rem;
              }
            }
            .time-out-status {
              width: 1.3rem;
              height: .05rem;
              margin-top: .04rem;
              background: #EEEEEE;
              border-radius: 3px;
              & > div {
                height: 5px;
                background: linear-gradient(270deg, #FF6A34 0%, #FFB048 100%);
                border-radius: 3px;
              }
            }
            .price-box {
              font-size: .12rem;
              font-weight: 500;
              color: #999;
              display: flex;
              justify-content: space-between;
              .price {
                margin-top: .05rem;
                .pri-num {
                  color: #FF6541;
                  font-family: DIN-Medium, DIN;
                }
              }
              .exchange {
                margin: auto 0;
                width: .62rem;
                height: .21rem;
                background: #F66A4A;
                border-radius: .11rem;
                border: 0;
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
