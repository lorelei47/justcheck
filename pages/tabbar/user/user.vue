<template>
	<view class="center">
		<view class="logo" @click="bindLogin" :hover-class="!hasLogin ? 'logo-hover' : ''">
			<image class="logo-img" :src="avatarUrl"></image>
			<view class="logo-title">
				<text class="uer-name">{{hasLogin ? userName : '您未登录'}}</text>
				<text class="go-login navigat-arrow" v-if="!hasLogin">&#xe65e;</text>
			</view>
		</view>
		<view class="center-list">
			<view class="center-list-item" v-if="hasLogin && hasPwd" @click="resPwd">
				<text class="list-icon">&#xe60f;</text>
				<text class="list-text">修改密码</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
		</view>
		<view class="center-list">
			<view class="center-list-item border-bottom" v-if="hasLogin" @click="myQuestion">
				<text class="list-icon">&#xe65f;</text>
				<text class="list-text">题目管理</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
			<view class="center-list-item border-bottom" v-if="hasLogin" @click="addQuestion">
				<text class="list-icon">&#xe65f;</text>
				<text class="list-text">新增题目</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
			<view class="center-list-item border-bottom" @click="feedback">
				<text class="list-icon">&#xe60b;</text>
				<text class="list-text">意见反馈</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
			<view class="center-list-item" @click="aboutApp">
				<text class="list-icon">&#xe614;</text>
				<text class="list-text">关于应用</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
		</view>
		<view class="center-list" v-if="hasLogin" :loading="logoutBtnLoading" @tap="toLogout">
			<view class="center-list-item">
				<text class="list-icon">&#xe65e;</text>
				<text class="list-text">退出登录</text>
			</view>
		</view>
		<!-- 对话框 -->
		<uni-popup id="popupDialog" ref="popupDialog" type="dialog">
			<uni-popup-dialog :content="dialogContent" :before-close="true"
				@confirm="dialogConfirm" @close="dialogClose"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import {
		univerifyLogin
	} from '@/common/univerify.js'
	import uniPopup from '@/pages/components/uniUi/uni-popup/uni-popup.vue'
	import uniPopupDialog from '@/pages/components/uniUi/uni-popup-dialog/uni-popup-dialog.vue'
	export default {
		components: {
			uniPopup,
			uniPopupDialog
		},
		data() {
			return {
				dialogContent: '',
				avatarUrl: "/static/img/logo.png",
				inviteUrl: '',
				logoutBtnLoading: false,
				hasPwd: uni.getStorageSync('uni_id_has_pwd')
			};
		},
		onLoad() {
			let uniIdToken = uni.getStorageSync('uni_id_token')
			if (uniIdToken) {
				this.login(uni.getStorageSync('username'))
				uniCloud.callFunction({
					name: 'user-center',
					data: {
						action: 'checkToken',
					},
					success: (e) => {
			
						console.log('checkToken success', e);
			
						if (e.result.code > 0) {
							//token过期或token不合法，重新登录
							if (this.forcedLogin) {
								uni.reLaunch({
									url: '../login/login'
								});
							} else {
								uni.navigateTo({
									url: '../login/login'
								});
							}
						}
					},
					fail(e) {
						uni.showModal({
							content: JSON.stringify(e),
							showCancel: false
						})
					}
				})
			}
		},
		computed: {
			...mapState('userStatus', {
				hasLogin: state => state.hasLogin,
				forcedLogin: state => state.forcedLogin,
				userName: state => state.userName
			})
		},
		methods: {
			...mapMutations('userStatus', ['logout','login']),
			dialogConfirm(done) {
				this.bindLogout();
				done()
			},
			dialogClose(done) {
				done()
			},
			toLogout() {
				this.dialogContent = '确认退出登录';
				this.$refs.popupDialog.open();
			},
			bindLogin() {
				if (!this.hasLogin) {
					univerifyLogin().catch(err => {
						if (err === false) return;

						uni.navigateTo({
							url: '/pages/user/login/login',
						});
					})
				}
			},
			bindLogout() {
				const loginType = uni.getStorageSync('login_type')
				if (loginType === 'local') {
					this.logout();
					if (this.forcedLogin) {
						uni.reLaunch({
							url: '/pages/user/login/login',
						});
					}
					return
				}
				this.logoutBtnLoading = true
				uniCloud.callFunction({
					name: 'user-center',
					data: {
						action: 'logout'
					},
					success: (e) => {

						console.log('logout success', e);

						if (e.result.code == 0) {
							this.logout();
							uni.removeStorageSync('uni_id_token')
							uni.removeStorageSync('username')
							uni.removeStorageSync('uni_id_has_pwd')
							/**
							 * 如果需要强制登录跳转回登录页面
							 */
							this.inviteUrl = ''
							if (this.forcedLogin) {
								uni.reLaunch({
									url: '/pages/user/login/login',
								});
							}
						} else {
							uni.showModal({
								content: e.result.msg,
								showCancel: false
							})
							console.log('登出失败', e);
						}

					},
					fail: (e) => {
						uni.showModal({
							content: JSON.stringify(e),
							showCancel: false
						})
					},
					complete: () => {
						this.logoutBtnLoading = false
					}
				})
			},
			resPwd() {
				uni.navigateTo({
					url: '/pages/user/pwd/update-password'
				})
			},
			myQuestion(){
				uni.navigateTo({
					url: '/pages/tabbar/user/myQuestion'
				})
			},
			addQuestion() {
				uni.navigateTo({
					url: '/pages/tabbar/user/addQuestion'
				})
			},
			feedback() {
				uni.navigateTo({
					url: '/pages/tabbar/user/feedback'
				})
			},
			aboutApp() {
				uni.navigateTo({
					url: '/pages/tabbar/user/aboutApp'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	@font-face {
		font-family: texticons;
		font-weight: normal;
		font-style: normal;
		src: url('https://at.alicdn.com/t/font_984210_5cs13ndgqsn.ttf') format('truetype');
	}

	// page,
	// view {
	// 	display: flex;
	// }

	page {
		background-color: #f8f8f8;
	}

	button {
		width: 100%;
	}

	.center {
		flex-direction: column;
	}

	.logo {
		display: flex;
		width: 750rpx;
		height: 240rpx;
		padding: 20rpx;
		box-sizing: border-box;
		background-color: #237f41;
		flex-direction: row;
		align-items: center;
	}

	.logo-hover {
		opacity: 0.8;
	}

	.logo-img {
		width: 120rpx;
		height: 120rpx;
		border-radius: 150rpx;
	}

	.logo-title {
		display: flex;
		height: 150rpx;
		flex: 1;
		align-items: center;
		justify-content: space-between;
		flex-direction: row;
		margin-left: 20rpx;
	}

	.uer-name {
		height: 60rpx;
		line-height: 60rpx;
		color: #FFFFFF;
	}

	.go-login.navigat-arrow {
		color: #FFFFFF;
	}

	.login-title {
		height: 150rpx;
		align-items: self-start;
		justify-content: center;
		flex-direction: column;
		margin-left: 20rpx;
	}

	.center-list {
		background-color: #FFFFFF;
		margin-top: 20rpx;
		width: 750rpx;
		flex-direction: column;
	}

	.center-list-item {
		display: flex;
		height: 90rpx;
		width: 750rpx;
		box-sizing: border-box;
		flex-direction: row;
		padding: 0rpx 20rpx;
		&:active{
			background-color: #dcdcdc;
		}
	}

	.border-bottom {
		border-bottom-width: 1rpx;
		border-color: #c8c7cc;
		border-bottom-style: solid;
	}

	.list-icon {
		width: 40rpx;
		height: 90rpx;
		line-height: 90rpx;
		color: #0faeff;
		text-align: center;
		font-family: texticons;
		margin-right: 20rpx;
	}

	.list-text {
		height: 90rpx;
		line-height: 90rpx;
		color: #555;
		flex: 1;
		text-align: left;
	}

	.navigat-arrow {
		height: 90rpx;
		width: 40rpx;
		line-height: 90rpx;
		color: #555;
		text-align: right;
		font-family: texticons;
	}
</style>
