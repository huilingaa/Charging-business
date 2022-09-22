<template>
  {{ isAuthorize }}
  <!-- 授权部分 -->
  <view v-if="!isAuthorize">
    <text>用户授权</text>
    <text>test商城申请你的公开信息（昵称，头像等）</text>
    <button open-type="getUserInfo" @getuserinfo="getWechatUserInfo">
      授权允许
    </button>
    <button @click="refuseAuthorize">拒绝</button>
  </view>

  <uni-popup ref="authorizePopup" type="bottom">
    <view class="show-info">
      允许显示以下信息：
      <text>{{ name }}</text>
      <image :src="img"></image>
      <button @click="showInfo">同意</button>
      <button @click="authorizePopupClose">拒绝</button>
    </view>
  </uni-popup>

  <!-- 注册部分 -->
  <view class="example" v-if="showLogin || isAuthorize">
    <view class="flex">
      <uni-forms-item label="手机号码" required>
        <uni-easyinput v-model="number" placeholder="请输入手机号码" />
      </uni-forms-item>
      <button @click="getPhoneNumber">获取手机号码</button>
    </view>
    <button @click="goLogin">
      {{ isRegister ? "登录" : "同意协议并注册" }}
    </button>
    <button @click="authorizePopupClose">
      暂不{{ isRegister ? "登录" : "注册" }}，随便逛逛
    </button>
  </view>
  <uni-popup ref="phonePopup" type="bottom">
    <view class="show-info">
      允许读取以下手机号：
      <text>{{ name }}</text>
      <button open-type="getPhoneNumber" @getphonenumber="getPhoneClose">
        同意
      </button>
      <button @click="getPhoneClose">拒绝</button>
    </view>
  </uni-popup>
</template>

<script lang="ts" setup>
//TODO 优化封装
//需要判断是否注册 --判断 'scope.userInfo'是否授权---fou授权页面
//是否授权
import { useUserAuthSettingStore } from "@/stores/userAuthSetting";
import { useUserInfoStore } from "@/stores/userInfo";
import { onLoad } from "@dcloudio/uni-app";
import { computed, ref } from "vue";

onLoad(() => {
  uni.login({
    //建议多使用uni-app的参数 不要单独的小程序api  还要进行对比
    success: (res) => {
      if (res.code) {
        //微信登录成功 已拿到code
        uni.request({
          url: "https://www.xx123.com//common/unionId.do", //演示地址，请以你的后端接口为准
          method: "POST",
          data: {
            code: res.code, //wx.login 登录成功后的code
          },
          success: (cts) => {
            // 换取成功后 暂存这些数据  留作后续操作  --等到的数据是加密的(储存再vuex里)
            // this.openid=cts.data.openid     //openid 用户唯一标识
            // this.unionid=cts.data.unionid     //unionid 开放平台唯一标识
            // this.session_key=cts.data.session_key     //session_key  会话密钥 --拿这个参数找后端要token
          },
        });
      } else {
        console.log("登录失败！" + res.errMsg);
      }
    },
  });
});

//注册部分 --获取手机号进行注册(https://blog.csdn.net/m0_49515138/article/details/125478446)
const showLogin = ref(false);
const number = "";
const phonePopup = ref();
const getPhoneNumber = () => {
  phonePopup.value.open();
};
const getPhoneClose = (e) => {
  //同意获取手机号
  if (e.detail.errMsg == "getPhoneNumber:fail user deny") {
    //用户决绝授权
    //拒绝授权后弹出一些提示
  } else {
    //允许授权
    console.log(e.detail.encryptedData);
    e.detail.encryptedData; //加密的用户信息
    e.detail.iv; //加密算法的初始向量  时要用到
    //需要对加密的数据进行解密(crypto-js)
  }
  phonePopup.value.close();
};
const goLogin = () => {
  //之前授权过的话,判断是否登录, --再前面的显示部分就会去判断是否登录了
  //校验手机号
  //发送登录的接口
};

/*----授权部分-----*/
const useUserInfo = useUserAuthSettingStore();
const isAuthorize = computed(() => useUserInfo.hasAuth("scope.userInfo")); //是否授权--先授权才能获取用户信息uni.getUserInfo
const userInfo = useUserInfoStore();
const authorizePopup = ref();
const isRegister = ref();

const authorizePopupClose = () => {
  authorizePopup.value.close();
};

const showInfo = () => {
  authorizePopupClose();
  useUserInfo.setAuth("scope.userInfo");
  isRegister.value = false;
  showLogin.value = true;
};

const refuseAuthorize = () => {
  uni.navigateBack({
    delta: 1,
  });
};

const name = computed(() => userInfo.nickName);
const img = computed(() => userInfo.avatarUrl);

// 微信授权
const getWechatUserInfo = () => {
  //要先授权之后才能获取用户信息
  uni.getUserInfo({
    //用户信息
    success: (res) => {
      console.log("3333", res.userInfo); //获取个人的信息
      userInfo.setUserInfo(res.userInfo);
      authorizePopup.value.open();

      // 进行下一步操作--根据本身的后台接口判断有没有注册
    },
    fail: () => {
      console.log("用户未授权！");
    },
  });
};
</script>

<style lang="scss" scoped>
.show-info {
  width: 100%;
  height: 400rpx;
  background: #fff;
  image {
    height: 60rpx;
    width: 60rpx;
    border-radius: 10rpx;
  }
}
</style>
