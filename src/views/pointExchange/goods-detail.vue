

<template>
  <div class="goods-detail">
    <van-swipe
      :autoplay="3000"
      :duration="1000"
      @change="swipeChange">
      <van-swipe-item
        v-for="image in (goodsInfo.images || [])"
        :key="image.id">
        <van-image
          fit="cover"
          :src="$host + image.filePath" />
      </van-swipe-item>
      <template #indicator>
        <div class="custom-indicator">
          {{ swipeIndex + 1 }}/{{ (goodsInfo.images || []).length }}
        </div>
      </template>
    </van-swipe>
    <div class="detail-head">
      <div class="detail-title">
        <van-tag
          mark
          v-if="goodsInfo.recommendFlag === 'Y'"
          type="danger">
          推荐
        </van-tag>
        <span>{{ goodsInfo.productName }}</span>
      </div>
      <div class="detail-time">
        <div class="price">
          <span class="pri-num">{{ goodsInfo.price }} </span>
          <span>积分/可兑换 {{ goodsInfo.exchangeNum }} 次</span>
        </div>
        <div class="time-out-box">
          <div class="time-out-control">
            <span>剩余兑换时间</span>
            <div
              class="end-status green"
              v-if="goodsInfo.timeOut === -1">
              暂未开始
            </div>
            <div
              class="end-status red"
              v-else-if="goodsInfo.timeOut === -2">
              已截止
            </div>
            <van-count-down
              v-else
              format="DD天 HH:mm:ss"
              :time="goodsInfo.timeOut" />
          </div>
          <div class="time-out-status">
            <div :style="`width: ${goodsInfo.timeOutPercent || 0}%;`" />
          </div>
        </div>
      </div>
    </div>
    <div class="detail-body">
      <div class="recommend-box">
        <div class="recommend-title">
          推荐理由
        </div>
        <div class="recommend-content">
          {{ goodsInfo.recommendReason }}
        </div>
        <div class="recommend-text">
          领取规则：自提
        </div>
        <div class="recommend-text">
          自提地址：{{ goodsInfo.address }}
        </div>
      </div>
      <div class="recommend-goods">
        <div class="recommend-title">
          推荐商品
        </div>
        <div
          class="recommend-item"
          v-for="goods in recommendData"
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
              v-if="goods.filePath"
              :src="goods.filePath"
              alt="暂无图片">
            <van-empty
              image="error"
              description="暂无图片" />
          </div>
          <div class="content-box">
            <div class="g-title cut_font_3">
              {{ goods.productName }}
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
                @click="getGoodsDetail(goods.id)">
                去看看
              </van-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="detail-foot">
      <van-button
        block
        type="warning"
        @click="handlerBuy">
        立即购买
      </van-button>
    </div>
  </div>
</template>

<script>

export default {
    name: 'GoodsDetail',
    data() {
        return {
            swipeIndex: 0,
            goodsInfo: {
                address: '广东省深圳市南山区科技园100号',
                categoryCode: 'jd',
                categoryName: '家电',
                createdDt: '2022-01-02 00:01:40',
                createdUserId: null,
                enabled: 'Y',
                exchangeBeginDate: '2022-01-01',
                exchangeEndDate: '2022-12-30',
                exchangeNum: 3,
                id: '1477309053105807362',
                price: 25,
                productCategoryId: '1477290472188035073',
                productDesc: '最新iphone 13',
                productName: '最新iphone13非常好用最新iphone13非常好用最新iphone13非常好用最新iphone13非常好用最新iphone13非常好用',
                productNum: 100,
                productStatus: 'PRODUCT_STATUS_2',
                productStatusName: '正常',
                publishStatus: 'Y',
                publishStatusName: null,
                recommendFlag: 'Y',
                recommendFlagName: '是',
                recommendReason: '非常好用非常好用非常好用非常好用非常好用非常好用非常好用非常好用非常好用非常好用非常好用',
                updatedDt: '2022-01-02 00:01:40',
                updatedUserId: null,
                images: [
                    {
                        filePath: '/product/images/2022/01/06/ec8dfc59-393f-464d-8040-3103fd3f7d9e.jpg',
                        fileType: 'PICTURE',
                        id: '1478773455869493249',
                        isFirst: 'N',
                        productInfoId: '1477309053105807362',
                        remark: 'jjhh5565',
                    },
                    {
                        fileOriginalName: '商品图片1641492749463.jpg',
                        filePath: '/product/images/2022/01/07/5b35121f-6038-41ca-b88c-68c662ad3eab.jpg',
                        fileType: 'PICTURE',
                        id: '1479153920421969922',
                        isFirst: 'Y',
                        productInfoId: '1477309053105807362',
                        remark: '',
                    },
                ],
            },
            recommendData: [],
        };
    },
    methods: {
        swipeChange(index) {
            this.swipeIndex = index;
        },
        resetGoodsInfo(info) {
            let timeOut = 0;
            let timeOutPercent = 0;
            try {
                const endTime = new Date(info.exchangeEndDate).getTime();
                const startTime = new Date(info.exchangeBeginDate).getTime();
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
            this.goodsInfo = { ...info, timeOut, timeOutPercent };
        },
        // eslint-disable-next-line no-unused-vars
        getGoodsDetail(id) {
            this.resetGoodsInfo(this.goodsInfo);
            // if (!id) return;
            // this.$http.post('/', this.$qs.stringify({ id }), { loading: true }).then((res) => {
            //     const data = ((res.data || {}).page || {});
            //     this.resetGoodsInfo(data);
            // });
        },
        getRecommendData(id) {
            if (!id) return;
            this.$http.post('/product/info/queryPage', this.$qs.stringify({ id, page: 1, limit: 10 }), { loading: true }).then((res) => {
                // const data = ((res.data || {}).page || {});
                this.recommendData = ((res.data || {}).page || {}).list || [];
            });
        },
        handlerBuy() {},
    },
    created() {
        const goodsId = this.$route.query.id || '';
        this.getGoodsDetail(goodsId);
        this.getRecommendData(goodsId);
    },
};
</script>

<style lang="scss">
@import "@/assets/scss/theme.scss";

.goods-detail {
  padding-bottom: .7rem;
  position: relative;
  .van-swipe {
    height: 3.52rem;
    .van-image {
      width: 100%;
      height: 100%;
    }
    .custom-indicator {
      position: absolute;
      right: .05rem;
      bottom: .05rem;
      padding: .02rem .05rem;
      font-size: .12rem;
      background: rgba(0, 0, 0, 0.3);
      border-radius: .11rem;
      color: #fff;
    }
  }
  .detail-head {
    background: #fff;
    padding: .16rem;
    .detail-title {
      .van-tag {
        margin-right: .05rem;
        position: relative;
        top: -.02rem;
      }
      font-size: .18rem;
      font-weight: 500;
      color: #333333;
      line-height: .25rem;
    }
    .detail-time {
      display: flex;
      justify-content: space-between;
      margin-top: .16rem;
      .price {
        font-size: .12rem;
        font-weight: 500;
        color: #999;
        margin: auto 0;
        .pri-num {
          font-size: .24rem;
          color: #FF6541;
          font-family: DIN-Medium, DIN;
        }
      }
      .time-out-box {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        margin: auto 0;
        .time-out-control {
          display: flex;
          justify-content: flex-end;
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
      }
    }
  }
  .detail-body {
    margin: 0 .12rem;
    .recommend-title {
      font-size: .15rem;
      font-weight: 500;
      color: #333333;
      line-height: .21rem;
    }
    .recommend-box {
      margin: .12rem 0;
      padding: .14rem .16rem;
      box-shadow: 0px .04rem .2rem 0px rgba(0, 0, 0, 0.02);
      border-radius: .06rem;
      background: #fff;
      .recommend-content {
        margin: .07rem 0;
        font-size: .14rem;
        font-weight: 400;
        color: #666666;
        line-height: .2rem;
      }
      .recommend-text {
        padding: .02rem 0;
        margin: .04rem 0;
        font-size: .12rem;
        color: #333;
      }
    }
    .recommend-goods {
      margin: .12rem 0;
      padding: .14rem .16rem;
      box-shadow: 0px .04rem .2rem 0px rgba(0, 0, 0, 0.02);
      border-radius: .06rem;
      background: #fff;
      .recommend-item {
        padding: .13rem 0;
        background: #fff;
        font-size: .12rem;
        display: flex;
        box-shadow: inset 0px -1px 0px 0px rgba(238, 238, 238, 0.5);
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
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .g-title {
            height: .4rem;
            font-size: .14rem;
            font-weight: 500;
            color: #333333;
            line-height: .2rem;
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
        &:nth-last-child(1) {
          box-shadow: unset;
        }
      }
    }
  }
  .detail-foot {
    padding: .12rem;
    background: #fff;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    .van-button {
      background: $theme;
    }
  }
}
</style>
