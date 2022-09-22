<template>
  <view>
    <view>
      <text>用户名:</text>
    </view>
    <button @click="goLogin">去登陆</button>
    <!-- <Login></Login> -->
    222
    <button
      open-type="contact"
      @contact="handleContact"
      session-from="sessionFrom"
    >
      客服采用小程序内置的
    </button>
  </view>
</template>

<script lang="ts" setup>
//利用token去判断有没有登录
const goLogin = () => {
  uni.navigateTo({
    url: "/subpages/login/login",
  });
};
const handleContact = (e) => {
  console.log(e.detail.path);
  console.log(e.detail.query);
};
</script>

<style></style>
