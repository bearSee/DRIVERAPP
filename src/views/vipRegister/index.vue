<!--
 * @Author: 熊望
 * @Date: 2022-01-05 21:38:50
 * @LastEditors: 熊望
 * @LastEditTime: 2022-01-09 18:06:18
 * @FilePath: /nginx/Users/bear/projects/project-bear/DRIVERAPP/src/views/vipRegister/index.vue
 * @Description:
-->


<template>
  <div class="vip-register-index">
    <div class="register-head">
      <img
        class="logo"
        src="@/assets/image/logo.jpg"
        alt=""
        srcset="">
    </div>
    <van-form
      :show-error="false"
      @submit="handlerSubmit">
      <van-field
        size="large"
        label="人员类型"
        name="userTypeName"
        placeholder="点击选择人员类型"
        readonly
        clearable
        clickable
        required
        :rules="rules.userType"
        :value="params.userTypeName"
        @click="pickerVisible = true" />
      <van-field
        size="large"
        label="真实姓名"
        name="userName"
        placeholder="请输入真实姓名"
        clearable
        required
        v-model="params.userName"
        :rules="rules.userName"
      />
      <van-field
        size="large"
        label="手机号码"
        name="mobile"
        placeholder="请输入手机号码"
        readonly
        clickable
        clearable
        required
        :value="params.mobile"
        :rules="rules.mobile"
        @click.native.stop="mobileKeyboardVisible = true"
      />
      <!-- <van-field
        size="large"
        label="短信验证码"
        name="verificationCode"
        placeholder="请输入短信验证码"
        center
        clearable
        required
        v-model="params.verificationCode"
        :maxlength="6"
        :rules="rules.verificationCode">
        <template #button>
          <van-button
            class="verification-btn"
            native-type="button"
            size="small"
            type="primary"
            :disabled="!!verificationTimeout"
            @click="handlerSendCode">
            发送验证码{{ verificationTimeout ? `(${verificationTimeout}s)` : '' }}
          </van-button>
        </template>
      </van-field> -->
      <van-field
        size="large"
        label="身份证号"
        name="identityNo"
        placeholder="请输入身份证号"
        readonly
        clickable
        clearable
        required
        :value="params.identityNo"
        :rules="rules.identityNo"
        @click.native.stop="IDKeyboardVisible = true"
      />
      <van-field
        size="large"
        label="公司/平台"
        name="company"
        placeholder="请输入公司/平台"
        clearable
        required
        v-model="params.company"
        :rules="rules.company"
      />
      <van-field
        class="vehicleNo"
        size="large"
        label="车牌号"
        name="vehicleNo"
        placeholder="请输入车牌号"
        clearable
        required
        v-model="params.vehicleNo"
        :maxlength="6"
        :rules="rules.vehicleNo" />
      <van-field
        size="large"
        label="邀请码"
        name="invitationCode"
        placeholder="请输入邀请码"
        clearable
        v-model="params.invitationCode"
        :maxlength="20" />
      <div class="button-list">
        <van-button
          round
          block
          type="info"
          native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>
    <van-popup
      position="bottom"
      v-model="pickerVisible">
      <van-picker
        show-toolbar
        :columns="pickerData"
        @confirm="handlerChooseUserType"
        @cancel="pickerVisible = false"
      />
    </van-popup>
    <van-number-keyboard
      v-model="params.mobile"
      :show="mobileKeyboardVisible"
      :maxlength="11"
      @blur="mobileKeyboardVisible = false"
    />
    <van-number-keyboard
      extra-key="X"
      close-button-text="完成"
      v-model="params.identityNo"
      :show="IDKeyboardVisible"
      :maxlength="18"
      @blur="IDKeyboardVisible = false"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex';

let timer;

export default {
    name: 'VipRegisterIndex',
    data() {
        return {
            pickerVisible: false,
            userTypes: [],
            pickerData: [],
            mobileKeyboardVisible: false,
            IDKeyboardVisible: false,
            verificationTimeout: 0,
            rules: {
                userType: [
                    { required: true, message: '请选择人员类型' },
                ],
                mobile: [
                    { required: true, message: '请输入手机号码' },
                    { pattern: /^[1][3,4,5,6,7,8,9][0-9]{9}$|^\s*$/, message: '请输入正确的手机号码' },
                ],
                verificationCode: [
                    { required: true, message: '请输入短信验证码' },
                ],
                identityNo: [
                    { validator: val => window.isIdentityCode(val), message: '请输入正确的身份证号' },
                ],
                company: [
                    { required: true, message: '请输入公司/平台' },
                ],
                vehicleNo: [
                    { required: true, message: '请输入车牌号' },
                    { pattern: /^[A-Z0-9]{5,6}$/, message: '请输入正确的车牌号' },
                ],
                userName: [
                    { required: true, message: '请输入真实姓名' },
                ],
            },
            params: {
                userType: '',
                userTypeName: '',
                userName: '',
                mobile: '',
                verificationCode: '',
                identityNo: '',
                company: '',
                vehicleNo: '',
                invitationCode: '',
            },
        };
    },
    methods: {
        ...mapActions(['handlerLogin']),
        handlerChooseUserType(value, index) {
            this.params.userType = this.userTypes[index].dicKey;
            this.$set(this.params, 'userTypeName', value);
            this.pickerVisible = false;
        },
        handlerSendCode() {
            if (!this.params.mobile) {
                this.$toast('请填写手机号码');
                return;
            }
            this.$http.post('/', { mobile: this.params.mobile }).then(() => {
                this.$toast.success('发送成功');
                this.verificationTimeout = 60;
                timer = setInterval(() => {
                    this.verificationTimeout -= 1;
                    if (!this.verificationTimeout) clearInterval(timer);
                }, 1000);
            });
        },
        handlerSubmit() {
            let { vehicleNo } = this.params;
            if (vehicleNo && !vehicleNo.includes('粤B')) vehicleNo = `粤B${vehicleNo}`;
            this.$http.post('/init/register', this.$qs.stringify({ ...this.params, vehicleNo })).then(async () => {
                this.$toast.success('注册成功');
                await this.handlerLogin(this.params.mobile);
                setTimeout(() => {
                    this.$router.push('/user-center');
                }, 100);
            });
        },
        getUserTypes() {
            this.$http.get('/dict/select/list/USER_TYPE').then((res) => {
                this.userTypes = ((res.data || {}).list || []);
                this.pickerData = this.userTypes.map(({ dicValue }) => dicValue);
            });
        },
    },
    created() {
        this.getUserTypes();
        const { invitationCode } = this.$route.query;
        if (invitationCode) this.params = { ...this.params, invitationCode };
    },
};
</script>

<style lang="scss">
@import "@/assets/scss/theme.scss";

.vip-register-index {
  position: relative;
  padding-bottom: .8rem;
  overflow-y: auto;
  .register-head {
    width: 100%;
    padding: .1rem;
    background: #fff;
    .logo {
      width: 100%;
      padding-right: .1rem;
      max-width: 100%;
    }
  }
  .verification-btn {
    width: 1.1rem;
    background: $theme;
    border-color: $theme;
  }
  .vehicleNo {
    .van-field__body {
      display: inline-block;
      display: flex;
      &::before {
        content: '粤B';
        color: #333;
        display: inline-block;
        width: .4rem;
        background: #eee;
        padding: 0 .05rem;
        vertical-align: top;
      }
      input {
        width: calc(100% - .72rem);
        padding-left: .05rem;
      }
      .van-icon-clear {
        vertical-align: top;
      }
    }
  }
  .button-list {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #f9f9f9;
    padding: .1rem;
    .van-button {
      background: $theme;
      border-color: $theme;
    }
  }
}
</style>
