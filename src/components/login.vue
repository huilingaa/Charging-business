<template>
	<view class="login" :class="{show:show}">
		<view class="mask" @tap="closeLogin" bind:tap="cancel" catch:touchmove="emptyHandler"></view>
		<view class="container">

			<view class="close-box" @tap="closeLogin" bind:tap="cancel">
			 <icon type="cancel" size="26"/>
			</view>
			
			<!-- #ifdef MP-WEIXIN -->
			<view class="p-name" v-if="getUserInfoTag">
				前端交流学习中心欢迎你
			</view>
			<button class="submit-btn" open-type="getUserInfo" @getuserinfo="getWechatUserInfo" v-if="getUserInfoTag">
					 <icon type="personal" size="26"/>
				<text>点击获取微信用户信息</text>
			</button>
			<!-- #endif  -->
			

			<uni-form  ref="uForm" v-show="!getUserInfoTag">
				<uni-forms-item label="手机号码"  label-width="150" required >
					<uni-easyinput v-model="number" placeholder='输入手机号/邮箱/昵称' />
						<button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">获取手机号码</button>
				</uni-forms-item>
			
				<view class="btns">
					<uni-button class="ubtn" @click="submit">同意协议并注册</uni-button>
					<uni-button class="ubtn" @click="cancel">暂不注册，随便逛逛</uni-button>
				</view>
			</uni-form>


			<view class="serve-info">已阅读并同意</view>
			<view class="serve-text">
				<view @tap="gotoWeb('https://uniapp.dcloud.io/component/mp-weixin-plugin')">《隐私政策》</view>
				<view @tap="gotoWeb('https://developers.weixin.qq.com/miniprogram/dev/framework/')">《用户协议》</view>
			</view>
		</view>
	</view>
</template>

<script>
//只要手机授权进行微信的登录--判断有没有注册过--授权手机号进行登录
	export default {
		data() {
			return {
				// 登陆组件是否显示
				show: true,

				// 是否获取用户信息
				// #ifndef MP-WEIXIN
				getUserInfoTag : false,
				// #endif
				// #ifdef MP-WEIXIN
				getUserInfoTag: true,
				// #endif
			number:null,
			}
		},
		async created() {
			// 每次这个组件展开，我们就去判断一下当前 token 是否可以获取新的 token 如果可以获取，咱们就关闭登陆状态
			// let res = await this.$u.api.getUserMsg()
			// // 点赞消息数量
			// if (res.statusCode === 200) {
			// 	this.show = false
			// 	return
			// } else {
			// 	this.show = true
			// }
			// #ifdef MP-WEIXIN
			wx.getSetting({ //判断用户是否授权
				success: res => {
					if (res.authSetting["scope.userInfo"]) {
						uni.getUserInfo({
							success: res => {
								console.log('res个人内容',res)
								// 如果用户授权了，则做两件事，第一件事是判断当前微信用户是否注册
								// this.number = res.userInfo.nickName
								// 第二件事当前用户若是已完成注册则直接登录，如果未完成注册则用户在点击登录时完成登录
								// this.getUserInfoTag = false 
							},
							fail: () => {
								console.log('用户未授权！')
							}
						})
					}
				}
			})
			// #endif
			
		},
		methods: {
			getPhoneNumber(e){
       console.log('11111',e.detail.code) //code 需要传到后台，获取手机号的接口需要  之后返回手机号
			},
			// 关闭弹窗
			closeLogin() {
				this.show = false
			},
			// 打开登陆弹窗
			openLogin() {
				this.show = true
			},
			// 跳转到 H5 页面
			gotoWeb(url) {
				wx.navigateTo({
					url: '/pages/webview/webview?url=' + encodeURI(url)
				});
			},
			// 微信授权
			getWechatUserInfo() {
				uni.getUserInfo({
					success: res => {
						console.log('3333',res); //获取个人的信息
						// 进行下一步操作
						this.getUserInfoTag = false;
						// this.form.login = res.userInfo.nickName;
						// this.form.name = res.userInfo.nickName;
						// this.form.avatar = res.userInfo.avatarUrl;
					},
					fail: () => {
						console.log('用户未授权！')
					}
				})
			},
			// 注册、登陆成功后设置相关逻辑
			async loginAfter(token) {
				this.show = false
				uni.setStorageSync('token', token)
				
				console.log("登陆之后触发的操作")
				
				// 获取未读消息提示
				let res = {}
				let name = this.form.name
				// if (this.loginType === 'login') {
				// 	name = this.form.login
				// }
				let loginInfo = {
					name,
					avatar: this.form.avatar,
					liked: res.data.user.liked,
					commented: res.data.user.commented
				}
				this.userLoginAction(loginInfo)
				uni.$emit('meUserLogin')
				uni.$emit('indexUserLogin')
			},
		}
	}
</script>

<style lang="scss" scoped>
	.login {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		display: flex;
		align-items: flex-end;
		opacity: 0;
		transition: opacity 300, z-index 0 300;
		pointer-events: none;
		z-index: 999;

		&.show {
			z-index: 9999;
			opacity: 1;
			pointer-events: auto;
		}

		.mask {
			position: fixed;
			width: 100%;
			height: 100%;
			background-color: rgba($color: #000000, $alpha: 0.3);
		}

		.container {
			z-index: 999;
			display: flex;
			flex-direction: column;
			width: 100%;
			padding: 40upx 20upx;
			background-color: #f1f1f1;
			border-radius: 20upx;
			align-items: center;
			position: relative;

			.p-name {
				margin-top: 48upx;
				font-size: 36upx;
				font-weight: normal;
			}

			.close-box {
				position: absolute;
				right: 32upx;
				top: 38upx;
				width: 56.56upx;
				height: 56.56upx;
				padding: 10upx;

				.close-img {
					width: 100%;
					height: 100%;
				}
			}
		}

		.header {
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: 28upx;

			.logo-wrap {
				width: 144upx;
				height: 144upx;
				overflow: hidden;
				border-radius: 20upx;
			}

			.logo {
				width: 100%;
				height: 100%;
			}
		}

		.info {
			color: #333;
		}

		.submit-btn {
			width: 642upx;
			height: 88upx;
			margin-top: 60upx;
			margin-bottom: 60upx;
			border-radius: 44upx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			color: #fff;
			background-color: #0046f5;
			font-size: 36upx;

			.wechat-img {
				width: 44upx;
				height: 34upx;
				margin: 0 18upx;
			}
		}

		.phone-login {
			color: #0046f5;
			font-size: 28upx;
			margin-top: 40upx;
			border: none;
			background-color: #f1f1f1;
		}

		.cancel-btn {
			width: 100%;
			margin-top: 60upx;
			color: #333;
			background-color: #f1f1f1;
		}

		.serve-info {
			font-size: 22upx;
			margin-top: 20upx;
		}

		.serve-text {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			font-size: 22upx;
			color: #6079b8;
			margin-top: 10upx;
		}
	}

	button::after {
		border: none;
	}

	.btns {
		margin-top: 20upx;
		text-align: center;

		.ubtn {
			display: inline-block;
			margin: 0 20upx;
		}
	}

	.type {
		margin-top: 80upx;
	}
</style>
