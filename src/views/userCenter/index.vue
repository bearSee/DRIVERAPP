
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
              <span class="num">{{ userInfo.integral || 0 }}</span>
            </span>
          </div>
          <div class="invitation-code">
            我的邀请码：{{ userInfo.invitationCode }}
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
          连续签到获得更多积分 <van-icon name="question-o" />
        </div>
        <!-- <div class="signDays">
          已连续签到 {{ userInfo.signDays || 0 }} 天
        </div>
        <div class="pointNum">
          今日共获得 {{ userInfo.pointNum }} 积分
        </div> -->
        <div class="total-point-box">
          <div class="point-detail">
            <div class="point-num">
              {{ userInfo.pointNum }}
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
            :disabled="userInfo.hasSign">
            签到领积分
          </van-button>
        </div>
      </div>
      <div class="share-box">
        <div class="title">
          邀请新司机，积分轻松得! <van-icon name="question-o" />
        </div>
        <div class="share-code">
          我的邀请码： {{ userInfo.shareCode || 'xxxxxx' }}
        </div>
        <div class="member-box">
          <div class="members">
            <img
              class="member-avatar"
              v-for="(member, index) in userInfo.members"
              :key="index"
              src="@/assets/image/avatar.jpg">
          </div>
          <van-button
            size="mini"
            plain
            round
            @click="handlerClick('share')">
            邀请好友
          </van-button>
        </div>
      </div>
      <div class="active-box">
        <div class="box-title">
          我的活动
        </div>
        <div class="activities">
          <div
            class="active"
            v-for="active in activities"
            :key="active.code">
            <van-icon
              class="ac-icon"
              :name="active.icon" />
            <div class="ac-content">
              <div class="ac-title">
                <span>{{ active.name }}</span>
                <van-icon name="points" />
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

export default {
    name: 'UserCenterIndex',
    data() {
        return {
            userInfo: {
                userName: '司机10000号',
                invitationCode: '668888',
                integral: '123456789999',
                signDays: 6,
                pointNum: 54,
                hsaSign: true,
                shareCode: 'GJUTEFCGHFD',
                members: [
                    {
                        image: '',
                        name: '',
                    },
                    {
                        image: '',
                        name: '',
                    },
                    {
                        image: '',
                        name: '',
                    },
                ],
            },
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
                    status: 2,
                },
                {
                    name: '点赞',
                    btnName: '去点赞',
                    code: 'skip',
                    describe: '点赞任意活动，即可收获积分！',
                    icon: 'good-job-o',
                    status: 2,
                },
                {
                    name: '评论',
                    btnName: '去评论',
                    code: 'comment',
                    describe: '升级为精华评论，任务奖励收入囊中！',
                    icon: 'comment-o',
                    status: 2,
                },
                {
                    name: '签到',
                    btnName: '去签到',
                    code: 'sign',
                    describe: '今日签到成功，即可获得当日积分！',
                    icon: 'sign',
                    status: 1,
                },
                {
                    name: '首次登陆',
                    btnName: '去登陆',
                    code: 'login',
                    describe: '首次登陆成功，轻松获得积分！',
                    icon: 'certificate',
                    status: 1,
                },
                {
                    name: '首次兑换',
                    btnName: '去兑换',
                    code: 'exchange',
                    describe: '首次参与兑换，还能获得积分！',
                    icon: 'exchange',
                    status: 1,
                },
            ],
        };
    },
    methods: {
        handlerClick(code) {
            console.log('code', code);
        },
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
  padding-top: .33rem;
  background-image: url(../../assets/image/center-bg.png);
  background-repeat: no-repeat;
  background-size: 100% 1.5rem;
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
      .van-icon {
        color: $theme;
        font-size: .15rem;
        font-weight: 600;
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
      padding: .13rem .1rem;
      margin: .1rem;
      border-radius: .05rem;
      background: #fff;
      .share-code {
        color: #333;
        font-size: .12rem;
        margin: .13rem 0 .12rem .05rem;
      }
      .member-box {
        display: flex;
        justify-content: space-between;
        padding-left: .05rem;
        .members {
          max-width: calc(100% - 1rem);
          display: flex;
          flex-wrap: wrap;
          .member-avatar {
            width: .2rem;
            height: .2rem;
            border-radius: 50%;
            margin: auto 0;
            margin-right: .05rem;
          }
        }
        .van-button {
          border-color: $theme;
          color: $theme;
          width: .6rem;
        }
      }
    }
  }
  .active-box {
    padding: .13rem .1rem;
    margin: .1rem;
    border-radius: .05rem;
    background: #fff;
    .activities {
      margin-top: .1rem;
      .active {
        display: flex;
        padding: .12rem 0;
        border-bottom: .01rem solid #ebedf0;
        &:last-child {
          border-bottom: 0;
        }
        .ac-icon {
          font-size: .3rem;
          color: $theme;
          margin: auto 0;
        }
        .ac-content {
          width: calc(100% - .9rem);
          padding: 0 .1rem;
          padding-right: .05rem;
          font-size: .12rem;
          color: #333;
          .ac-title {
            .van-icon {
              color: $theme;
              margin-left: .05rem;
            }
          }
          .ac-describe {
            margin-top: .1rem;
            line-height: 1.2;
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
</style>
