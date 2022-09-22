import { defineStore } from 'pinia';

export const loginStore = defineStore('login',{
  state:()=>({
		loginState: !!uni.getStorageSync('loginState') ? true : false,
		userInfo: !!uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : {
			name: '未知用户',
			avatar: '/static/nopic.png',
			liked: 0,
			commented: 0
		}
	}),
  actions:{
    userLogin(userInfo: any) {
			this.loginState = true
			this.userInfo = userInfo
			uni.setStorageSync('loginState', 'ok')
			uni.setStorageSync('userInfo', JSON.stringify(userInfo))
		},
		userLogout(state: { loginState: boolean; userInfo: { name: string; avatar: string; liked: number; commented: number; }; }) {
			state.loginState = false
			state.userInfo = {
				name: '未知用户',
				avatar: '/static/nopic.png',
				liked: 0,
				commented: 0
			}
			uni.removeStorageSync('userInfo')
			uni.removeStorageSync('loginState')
			uni.removeStorageSync('token')
		}
  }
})
