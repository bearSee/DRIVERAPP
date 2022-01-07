
<template>
  <div class="user-center-index">
    <div class="center-head">
      <div class="user-info-box">
        <img
          class="user-avatar"
          src="@/assets/image/avatar.jpg">
        <div class="user-name">
          <div class="name">
            <span>{{ userInfo.userName || '' }}</span>
            <span class="integral">
              <span class="point-mark" />
              <span class="num">{{ (userInfo.score || 0) | formatMoney(0) }}</span>
            </span>
          </div>
          <div class="invitation-code">
            我的邀请码：{{ userInfo.invitationCode || 'xxxxxx' }}
          </div>
        </div>
      </div>
    </div>
    <div class="center-body">
      <div class="enters">
        <router-link
          class="enter"
          v-for="enter in enters"
          :key="enter.code"
          :to="{ path: enter.path }">
          <img
            v-if="enter.image"
            :src="require(`@/assets/image/${enter.image}`)">
          <van-icon
            v-else
            :name="enter.icon" />
          <span>{{ enter.title }}</span>
        </router-link>
      </div>
      <div class="sign-box">
        <div class="box-title">
          <span>连续签到获得更多积分</span>
          <img
            class="question-icon"
            src="@/assets/image/question.png"
            @click="handlerQuestion('sign')">
        </div>
        <div class="total-point-box">
          <div class="point-detail">
            <div class="point-num">
              {{ userInfo.pointNum || 0 }}
            </div>
            <div class="point-des">
              <span>今日共获得</span>
              <span class="mark">|</span>
              <span>已连续签到</span>
              <span class="sign-days">{{ userInfo.signDays || 0 }}</span>
              <span>天</span>
            </div>
          </div>
          <van-button
            type="primary"
            :disabled="userInfo.hasSign"
            @click="handlerSign">
            签到领积分
          </van-button>
        </div>
      </div>
      <div class="share-box">
        <div
          class="share-code"
          @click="handlerClick('share')">
          <span>我的邀请码：{{ userInfo.invitationCode || 'xxxxxx' }}</span>
          <img
            class="question-icon"
            src="@/assets/image/question.png"
            @click.stop="handlerQuestion('share')">
        </div>
      </div>
      <div class="active-box">
        <div class="box-title">
          <span>我的活动</span>
          <img
            class="question-icon"
            src="@/assets/image/question.png"
            @click="handlerQuestion('active')">
        </div>
        <div class="activities">
          <div
            class="active"
            v-for="(active, index) in activities"
            :key="index">
            <img
              class="ac-image"
              :src="require(`@/assets/image/${active.image}`)">
            <div class="ac-content">
              <div class="ac-title">
                <span class="ac-name">{{ active.name }}</span>
                <span class="point-num">+{{ active.pointNum }}</span>
                <span class="point-mark" />
              </div>
              <div class="ac-describe">
                {{ active.describe }}
              </div>
            </div>
            <van-button
              class="ac-btn"
              type="info"
              size="mini"
              plain
              round
              :disabled="String(active.status) === '1'"
              @click="handlerClick(active.code)">
              {{ String(active.status) === '1' ? '已完成' : active.btnName }}
            </van-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'UserCenterIndex',
    data() {
        return {
            enters: [
                {
                    title: '我的积分',
                    code: 'point',
                    path: '/my-point',
                    // icon: 'points',
                    image: 'my-point.png',
                },
                {
                    title: '我的订单',
                    code: 'order',
                    path: '/my-order',
                    // icon: 'orders-o',
                    image: 'my-order.png',
                },
                {
                    title: '我的消息',
                    code: 'message',
                    path: '/my-message',
                    // icon: 'envelop-o',
                    image: 'my-message.png',
                },
            ],
            activities: [
                {
                    name: '分享',
                    btnName: '去分享',
                    code: 'skip',
                    describe: '随意分享活动，一键get积分奖励',
                    icon: 'share-o',
                    image: 'share.png',
                    pointNum: 100,
                    status: 2,
                },
                {
                    name: '点赞',
                    btnName: '去点赞',
                    code: 'skip',
                    describe: '点赞任意活动，即可收获积分！',
                    icon: 'good-job-o',
                    image: 'thumbs-up.png',
                    pointNum: 80,
                    status: 2,
                },
                {
                    name: '评论',
                    btnName: '去评论',
                    code: 'comment',
                    describe: '升级为精华评论，任务奖励收入囊中！',
                    icon: 'comment-o',
                    image: 'comment.png',
                    pointNum: 80,
                    status: 2,
                },
                {
                    name: '签到',
                    btnName: '去签到',
                    code: 'sign',
                    describe: '今日签到成功，即可获得当日积分！',
                    icon: 'sign',
                    image: 'sign.png',
                    pointNum: 50,
                    status: 1,
                },
                {
                    name: '首次登陆',
                    btnName: '去登陆',
                    code: 'login',
                    describe: '首次登陆成功，轻松获得积分！',
                    icon: 'certificate',
                    image: 'login.png',
                    pointNum: 30,
                    status: 1,
                },
                {
                    name: '首次兑换',
                    btnName: '去兑换',
                    code: 'exchange',
                    describe: '首次参与兑换，还能获得积分！',
                    icon: 'exchange',
                    image: 'exchange.png',
                    pointNum: 50,
                    status: 1,
                },
            ],
        };
    },
    computed: {
        ...mapState(['userInfo']),
    },
    methods: {
        handlerSign() {},
        handlerClick(code) {
            this.$router.push('/point-exchange');
            console.log('handlerClick-code', code);
        },
        handlerQuestion(code) {
            console.log('handlerQuestion-code', code);
        },
    },
    filters: {
        formatMoney: window.formatMoney,
    },
};
</script>

<style lang="scss">
@import "@/assets/scss/theme.scss";

.user-center-index {
  background: #f1eeee;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  padding: 0 .12rem;
  padding-top: .28rem;
  background-image: url(../../assets/image/center-bg.png) !important;
  background-repeat: no-repeat !important;
  background-size: 100% 1.5rem !important;
  overflow-y: auto;
  .center-head {
    color: #fff;
    .user-info-box {
      display: flex;
      .user-avatar {
        width: .42rem;
        height: .42rem;
        border-radius: 50%;
        margin-right: .12rem;
      }
      .user-name {
        .name {
          font-weight: 500;
          font-size: .15rem;
          line-height: .25rem;
          height: .25rem;
          display: flex;
          overflow: hidden;
          .integral {
            height: 40px;
            transform: scale(0.5);
            transform-origin: left;
            background: rgba(0, 0, 0, 0.14);
            border-radius: .2rem;
            font-weight: 500;
            color: #FFE367;
            padding: .04rem .08rem;
            padding-right: .12rem;
            display: flex;
            position: relative;
            top: -.07rem;
            left: .07rem;
            .point-mark {
              width: .28rem;
              height: .28rem;
              &::before {
                width: .1rem;
                height: .1rem;
              }
            }
            .num {
              display: inline-block;
              font-size: .2rem;
              position: relative;
              top: .02rem;
              margin-left: .03rem;
            }
          }
        }
        .invitation-code {
          font-size: .12rem;
        }
      }
    }
  }
  .center-body {
    .box-title {
      font-size: .15rem;
      font-weight: 500;
      color: #333333;
      line-height: .21rem;
      display: flex;
      span {
        margin: auto 0;
      }
      .question-icon {
        color: $theme;
        margin: auto .05rem;
        position: relative;
        top: -.01rem;
      }
    }
    .enters {
      display: flex;
      flex-wrap: wrap;
      padding: .2rem 0;
      background: #fff;
      margin-top: .15rem;
      margin-bottom: .12rem;
      border-radius: .06rem;
      box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.02);
      .enter {
        width: 33.33%;
        display: flex;
        flex-direction: column;
        img, .van-icon {
          width: .4rem;
          height: .4rem;
          margin: 0 auto;
        }
        .van-icon {
          font-size: .4rem;
          color: $theme;
        }
        span {
          margin: auto;
          margin-top: .1rem;
          color: #999;
          font-size: .12rem;
        }
        &:hover {
          opacity: .7;
        }
      }
    }
    .sign-box {
      padding: .14rem;
      margin: .12rem 0;
      border-radius: .06rem;
      box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.02);
      background: #fff;
      .total-point-box {
        margin-top: .15rem;
        display: flex;
        justify-content: space-between;
        .point-detail {
          .point-num {
            font-size: .3rem;
            font-family: DIN-Medium, DIN;
            font-weight: 500;
            color: #F66A4A;
            line-height: .35rem;
          }
          .point-des {
            margin-top: .04rem;
            span {
              font-size: .12rem;
              font-weight: 500;
              color: #333333;
              line-height: .17rem;
            }
            .mark {
              margin: 0 .05rem;
            }
            .sign-days {
              color: #FFA217;
              margin: 0 .05rem;
            }
          }
        }
        &>.van-button {
          width: .85rem;
          height: .35rem;
          line-height: .35rem;
          font-size: .13rem;
          padding: 0;
          border-color: $theme;
          background: $theme;
          margin: auto 0;
        }
      }
    }
    .share-box {
      border-radius: .05rem;
      margin: .12rem 0;
      height: .86rem;
      border-radius: .06rem;
      box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.02);
      background-image: url(../../assets/image/invitation-bg.png);
      background-repeat: no-repeat;
      background-size: cover;
      position: relative;
      .share-code {
        height: .23rem;
        line-height: .17rem;
        background: #FFFFFF;
        padding: .03rem .1rem;
        border-radius: .13rem;
        position: absolute;
        top: .45rem;
        left: .16rem;
        z-index: 2;
        font-size: .12rem;
        font-weight: 500;
        color: #000000;
        display: flex;
        .question-icon {
          margin: auto .05rem;
          margin-right: 0;
          position: relative;
          top: -.01rem;
          right: -.02rem;
        }
      }
    }
    .active-box {
      padding: .14rem;
      border-radius: .06rem;
      background: #fff;
      box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.02);
      .activities {
        margin-top: .09rem;
        .active {
          display: flex;
          padding: .11rem 0;
          box-shadow: inset 0px -1px 0px 0px rgba(238, 238, 238, 0.5);
          &:last-child {
            border-bottom: 0;
          }
          .ac-image {
            width: .52rem;
            height: .52rem;
            color: $theme;
            margin: auto 0;
          }
          .ac-content {
            width: calc(100% - .9rem);
            padding: 0 .09rem;
            padding-right: .05rem;
            font-size: .16rem;
            color: #333;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            .ac-title {
              .point-num {
                margin: 0 .04rem;
                font-size: .12rem;
                font-weight: 500;
                color: #F66A4A;
                position: relative;
                top: -.02rem;
              }
            }
            .ac-describe {
              line-height: 1.2;
              font-size: .12rem;
              font-weight: 400;
              color: #666666;;
            }
          }
          .ac-btn {
            width: .6rem;
            margin: auto 0;
            border-color: $theme;
            color: $theme;
          }
        }
      }
    }
  }
}
</style>
