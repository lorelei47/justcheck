<template>
	<view class="content-login">
		<view class="input-group">
			<view class="input-row border">
				<text class="title">账号：</text>
				<m-input class="m-input" type="text" clearable focus v-model="username" placeholder="请输入账号"></m-input>
			</view>
			<view class="input-row border">
				<text class="title">密码：</text>
				<m-input type="password" displayable v-model="password" placeholder="请输入密码"></m-input>
			</view>
			<view v-if="needCaptcha" class="input-row">
				<text class="title">验证码：</text>
				<m-input type="text" v-model="captchaText" placeholder="请输入验证码"></m-input>
				<view class="send-code-btn captcha-view" @click="captcha('refreshCaptcha')">
					<i v-if="captchaing" class="uni-icon_toast uni-loading"></i>
					<img v-if="!captchaing" :src="captchaBase64" width="100%" height="100%"></img>
				</view>
			</view>
		</view>
		<view class="btn-row">
			<button class="bg-green" :loading="loginBtnLoading" @tap="bindLogin">登录</button>
		</view>
		<view class="action-row">
			<navigator url="../reg/reg">注册账号</navigator>
		</view>
<!-- 		<view class="oauth-row" v-if="hasProvider" v-bind:style="{top: positionTop + 'px'}">
			<view class="oauth-image" v-for="provider in providerList" :key="provider.value">
				<image :src="provider.image" @tap="toLogin(provider.value)"></image> -->
				<!-- #ifdef MP-WEIXIN -->
				<!-- <button v-if="!isDevtools" open-type="getUserInfo" @getuserinfo="getUserInfo"></button> -->
				<!-- #endif -->
			<!-- </view>
		</view>
		<view class="oauth-row" v-if="hasProvider && !hasAppleLogin && platform ==='ios'"
			v-bind:style="{top: (positionTop - 50) + 'px'}">
			<text style="color: #C8C7CC;text-align: center;">暂无法使用苹果登录，请查阅&nbsp;&nbsp;
				<text style="color: #C8C7CC;text-decoration: underline;" @click="openAppleLoginDoc">Apple登录集成教程</text>
			</text>
		</view> -->
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import mInput from '@/pages/user/m-input.vue'
	import {
		univerifyLogin,
		univerifyErrorHandler
	} from '@/common/univerify.js'
	import {
		getDeviceUUID
	} from '@/common/util.js'

	let weixinAuthService;
	const captchaOptions = {
		deviceId: getDeviceUUID(),
		scene: 'login'
	};

	export default {
		components: {
			mInput
		},
		data() {
			return {
				platform: uni.getSystemInfoSync().platform,
				mobile: '',
				code: '',
				providerList: [],
				hasProvider: false,
				username: '',
				password: '',
				positionTop: 0,
				isDevtools: false,
				loginBtnLoading: false,
				hasAppleLogin: false,
				needCaptcha: uni.getStorageSync('uni-needCaptcha'),
				captchaing: false,
				captchaBase64: '',
				captchaText: ''
			}
		},
		computed: mapState('userStatus',{
			forcedLogin: state=>state.forcedLogin,
			hasLogin: state=>state.hasLogin,
			univerifyErrorMsg: state=>state.univerifyErrorMsg,
			hideUniverify: state=>state.hideUniverify
		}),
		onLoad() {
			// #ifdef APP-PLUS
			plus.oauth.getServices((services) => {
				weixinAuthService = services.find((service) => {
					return service.id === 'weixin'
				})
				if (weixinAuthService) {
					this.hasWeixinAuth = true
				}
			});
			// #endif
			if (this.needCaptcha) {
				this.captcha('createCaptcha')
			}
		},
		methods: {
			...mapMutations('userStatus',['login']),
			initProvider() {
				const filters = ['weixin', 'qq', 'sinaweibo', 'univerify'];
				uni.getProvider({
					service: 'oauth',
					success: (res) => {
						if (res.provider && res.provider.length) {
							if (res.provider.indexOf('apple') !== -1) {
								this.hasAppleLogin = true;
							}
							for (let i = 0; i < res.provider.length; i++) {
								const curProvider = res.provider[i];
								if (~filters.indexOf(curProvider)) {
									this.providerList.push({
										value: curProvider,
										image: '../../static/img/' + curProvider + '.png'
									});
								}
							}
							this.hasProvider = true;
						}
					},
					fail: (err) => {
						console.error('获取服务供应商失败：' + JSON.stringify(err));
					}
				});
			},
			initPosition() {
				/**
				 * 使用 absolute 定位，并且设置 bottom 值进行定位。软键盘弹出时，底部会因为窗口变化而被顶上来。
				 * 反向使用 top 进行定位，可以避免此问题。
				 */
				this.positionTop = uni.getSystemInfoSync().windowHeight - 100;
			},
			async loginByPwd() {
				/**
				 * 客户端对账号信息进行一些必要的校验。
				 * 实际开发中，根据业务需要进行处理，这里仅做示例。
				 */
				if (this.username.length < 3) {
					uni.showToast({
						icon: 'none',
						title: '账号最短为 3 个字符'
					});
					return;
				}
				if (this.password.length < 6) {
					uni.showToast({
						icon: 'none',
						title: '密码最短为 6 个字符'
					});
					return;
				}
				const data = {
					username: this.username,
					password: this.password,
					captcha: this.captchaText,
					...captchaOptions
				};
				this.loginBtnLoading = true
				uniCloud.callFunction({
					name: 'user-center',
					data: {
						action: 'login',
						params: data
					},
					success: (e) => {
						if (e.result.code == 0) {
							this.needCaptcha = false;
							uni.setStorageSync('uni-needCaptcha', this.needCaptcha)

							uni.setStorageSync('uni_id_token', e.result.token)
							uni.setStorageSync('username', e.result.username)
							uni.setStorageSync('login_type', 'online')
							uni.setStorageSync('uni_id_has_pwd', true)
							this.toMain(this.username);
						} else {
							uni.showModal({
								content: e.result.message,
								showCancel: false
							})

							this.needCaptcha = e.result.needCaptcha;
							uni.setStorageSync('uni-needCaptcha', this.needCaptcha)
							if (this.needCaptcha) {
								this.captcha('createCaptcha')
							}
						}
					},
					fail: (e) => {
						uni.showModal({
							content: JSON.stringify(e),
							showCancel: false
						})
					},
					complete: () => {
						this.loginBtnLoading = false
					}
				})
			},
			loginBySms() {
				if (!/^1\d{10}$/.test(this.mobile)) {
					uni.showModal({
						content: '手机号码填写错误',
						showCancel: false
					})
					return
				}
				if (!/^\d{6}$/.test(this.code)) {
					uni.showModal({
						title: '验证码为6位纯数字',
						showCancel: false
					});
					return;
				}

				uniCloud.callFunction({
					name: 'user-center',
					data: {
						action: 'loginBySms',
						params: {
							mobile: this.mobile,
							code: this.code
						}
					},
					success: (e) => {

						if (e.result.code == 0) {
							const username = e.result.username || '新用户'
							uni.setStorageSync('uni_id_token', e.result.token)
							uni.setStorageSync('username', username)
							uni.setStorageSync('login_type', 'online')
							this.toMain(username);
						} else {
							uni.showModal({
								content: e.result.msg,
								showCancel: false
							})
							console.log('登录失败', e);
						}

					},
					fail(e) {
						uni.showModal({
							content: JSON.stringify(e),
							showCancel: false
						})
					}
				})
			},
			bindLogin() {
				this.loginByPwd()
			},
			oauth(value) {
				return new Promise((resolve, reject) => {
					// #ifdef APP-PLUS
					weixinAuthService.authorize(function(res) {
						resolve(res.code)
					}, function(err) {
						console.error(err)
						reject(new Error('微信登录失败'))
					});
					// #endif
					// #ifdef MP-WEIXIN
					uni.login({
						provider: 'weixin',
						success(res) {
							resolve(res.code)
						},
						fail(err) {
							console.error('授权登录失败：' + JSON.stringify(err));
							reject(new Error('微信登录失败'))
						}
					})
					// #endif
				})
			},
			getUserInfo({
				detail
			}) {
				console.log('三方登录只演示登录api能力，暂未关联云端数据');
				if (detail.userInfo) {
					this.loginLocal(detail.userInfo.nickName);
				} else {
					uni.showToast({
						icon: 'none',
						title: '登陆失败'
					});
				}
			},
			loginLocal(nickName) {
				uni.setStorageSync('login_type', 'local')
				uni.setStorageSync('username', nickName)
				this.toMain(nickName);
			},
			toMain(userName) {
				this.login(userName);
				/**
				 * 强制登录时使用reLaunch方式跳转过来
				 * 返回首页也使用reLaunch方式
				 */
				uni.reLaunch({
					url: '../../tabbar/user/user',
				});
			},
			toLogin(value) {
				if (value === 'apple') {
					this.loginByApple(value)
					return;
				}
				if (value === 'weixin') {
					this.loginByWeixin(value)
					return;
				}
				if (value === 'univerify') {
					univerifyLogin().catch(err => {
						if (typeof err === 'boolean') return;
						univerifyErrorHandler(err);
					})
					return;
				}
				uni.showModal({
					content: `${value}登录只演示登录api能力，暂未关联云端数据`,
					showCancel: false,
					complete: () => {
						uni.login({
							provider: value,
							success: (res) => {
								uni.getUserInfo({
									provider: value,
									success: (infoRes) => {
										/**
										 * 实际开发中，获取用户信息后，需要将信息上报至服务端。
										 * 服务端可以用 userInfo.openId 作为用户的唯一标识新增或绑定用户信息。
										 */
										this.loginLocal(infoRes.userInfo.nickName);
									},
									fail() {
										uni.showToast({
											icon: 'none',
											title: '登陆失败'
										});
									}
								});
							},
							fail: (err) => {
								console.error('授权登录失败：' + JSON.stringify(err));
							}
						});
					}
				})
			},
			loginByWeixin(value) {
				this.oauth(value).then((code) => {
					return uniCloud.callFunction({
						name: 'user-center',
						data: {
							action: 'loginByWeixin',
							params: {
								code,
							}
						}
					})
				}).then((res) => {
					if (res.result.code === 0) {

						uni.setStorageSync('uni_id_token', res.result.token)
						uni.setStorageSync('uni_id_token_expired', res.result.tokenExpired)
						uni.setStorageSync('login_type', 'online')
						uni.setStorageSync('username', '微信用户')
						this.toMain('微信用户')
					}
				}).catch((e) => {
					console.error(e)
					uni.showModal({
						showCancel: false,
						content: '微信登录失败，请稍后再试'
					})
				})
			},
			async loginByApple(value) {
				if (!this.hasAppleLogin) {
					uni.showModal({
						showCancel: false,
						content: `暂无法使用苹果登录，Apple登录集成教程：\nhttps://ask.dcloud.net.cn/article/36651`
					})
					return
				};
				let Provider = value;
				const [loginErr, loginData] = await uni.login({
					provider: Provider
				});
				if (loginErr) {
					uni.showModal({
						showCancel: false,
						content: '苹果登录失败，请稍后再试'
					})
					return;
				}
				// 获取用户信息
				const [getUserInfoErr, result] = await uni.getUserInfo({
					provider: Provider
				});
				if (getUserInfoErr) {
					let content = getUserInfoErr.errMsg;
					if (~content.indexOf('uni.login')) {
						content = '请先完成登录操作';
					}
					uni.showModal({
						title: '获取用户信息失败',
						content: '错误原因' + content,
						showCancel: false
					});
					return;
				}
				// uni-id 苹果登录
				uniCloud.callFunction({
					name: 'user-center',
					data: {
						action: 'loginByApple',
						params: result.userInfo
					},
					success: (e) => {
						if (!e.success) {
							uni.showModal({
								showCancel: false,
								content: JSON.stringify(e.message)
							})
							return;
						}
						const username = e.result.username || e.result.nickname;

						uni.setStorageSync('uni_id_token', e.result.token)
						uni.setStorageSync('login_type', 'online')

						this.toMain(username);
					},
					fail: (e) => {
						uni.showModal({
							content: `苹果登录失败: ${JSON.stringify(e)}`,
							showCancel: false
						})
					}
				})
			},
			async captcha(action, args) {
				if (this.captchaing) return;

				// 验证不loading
				this.captchaing = true;

				let {
					result: res
				} = await uniCloud.callFunction({
					name: 'user-center',
					data: {
						action,
						params: {
							...captchaOptions,
							...args
						}
					}
				})
				this.captchaing = false;
				if (res.code === 0) {
					this.captchaBase64 = res.captchaBase64
				} else {
					uni.showToast({
						icon: 'none',
						title: res.message,
						duration: 1000
					})
				}
				return res;
			},
			openAppleLoginDoc() {
				// #ifdef APP-PLUS
				plus.webview.open('https://ask.dcloud.net.cn/article/36651')
				// #endif
			}
		},
		onReady() {
			this.initPosition();
			this.initProvider();
			// #ifdef MP-WEIXIN
			this.isDevtools = uni.getSystemInfoSync().platform === 'devtools';
			// #endif
		}
	}
</script>

<style scoped>
	.login-type {
		display: flex;
		justify-content: center;
	}

	.login-type-btn {
		line-height: 30px;
		margin: 0px 15px;
	}

	.login-type-btn.act {
		color: #0FAEFF;
		border-bottom: solid 1px #0FAEFF;
	}

	.action-row {
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	.action-row navigator {
		color: #237f41;
		padding: 0 10px;
	}

	.oauth-row {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
		flex-wrap: wrap;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
	}

	.oauth-image {
		position: relative;
		width: 50px;
		height: 50px;
		border: 1px solid #dddddd;
		border-radius: 50px;
		background-color: #ffffff;
	}

	.oauth-image image {
		width: 30px;
		height: 30px;
		margin: 10px;
	}

	.oauth-image button {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
	}

	.captcha-view {
		line-height: 0;
		justify-content: center;
		align-items: center;
		display: flex;
		position: relative;
		background-color: #f3f3f3;
	}
</style>
