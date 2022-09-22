/*
 * @Author: hsq
 * @Date: 2022-07-11 14:54:45
 * @LastEditors: hsq
 * @LaseEditTime: Do not edit
 * @Description: file content
 */

import { defineStore } from "pinia";

export interface UserInfo {
  /**
   * 用户昵称
   */
  nickName?: string;
  /**
   * 该服务商唯一用户标识
   */
  openId: string | null; //用户唯一标识
  unionId?: string | null; //开放平台唯一标识
  /**
   * 用户头像
   */
  avatarUrl?: string;
  gender?: string;
  province?: string;
  city?: string;
  country?: string;
  session_key?: string; //判断登录是否过期
  watermark?: {
    appid: string;
    timestamp: string;
  };
}

export const useUserInfoStore = defineStore("userInfo", {
  state: (): UserInfo => ({
    openId: null,
    nickName: "",
    avatarUrl: "",
    city: "",
    gender: "",
    province: "",
  }),

  actions: {
    getUserInfo() {},
    setUserInfo(info: UserInfo) {
      this.nickName = info.nickName;
      this.avatarUrl = info.avatarUrl;
      this.openId = info.openId;
      this.unionId = info.unionId;
      this.session_key = info.session_key;
    },
    async login() {
      try {
        const result = (await uni.getProvider({ service: "oauth" })) as any; //uni.getProvider  获取服务供应商--oauth授权登录的
        if (result?.provider?.length > 0) {
          const loginResult = (await uni.login({
            provider: result?.provider[0],
          })) as any;
          const code = loginResult.code;
          console.log("code: " + code, loginResult);
        }
      } catch (error) {}
    },
  },
  getters: {
    getOpenId(): string | null {
      return this.openId;
    },
  },
});
