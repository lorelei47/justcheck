<template>
	<view class="content-login">
		<view class="input-group">
			<view class="input-row border">
				<text class="title">账号：</text>
				<m-input type="text" focus clearable v-model="username" placeholder="请输入账号"></m-input>
			</view>
			<view class="input-row border">
				<text class="title">密码：</text>
				<m-input type="password" displayable v-model="password" placeholder="请输入密码"></m-input>
			</view>
			<view class="input-row">
				<text class="title">确认密码：</text>
				<m-input type="password" displayable v-model="confirmPassword" placeholder="请确认密码"></m-input>
			</view>
		</view>
		<view class="btn-row">
			<button class="bg-green" @tap="register">注册并登录</button>
		</view>
	</view>
</template>

<script>
	import mInput from '@/pages/user/m-input.vue';

	export default {
		components: {
			mInput
		},
		data() {
			return {
				username: '',
				password: '',
				confirmPassword: ''
			}
		},
		methods: {
			register() {
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
				if (this.password !== this.confirmPassword) {
					uni.showToast({
						icon: 'none',
						title: '两次密码输入不一致'
					});
					return;
				}

				const data = {
					username: this.username,
					password: this.password
				}
				uniCloud.callFunction({
					name: 'user-center',
					data: {
						action: 'register',
						params: data
					},
					success(e) {
						if (e.result.code === 0) {
							uni.showToast({
								title: '注册成功'
							});
							uni.setStorageSync('uni_id_token', e.result.token)
							uni.setStorageSync('username', e.result.username)
							uni.reLaunch({
								url: '../../tabbar/user/user',
							});
						} else {
							uni.showModal({
								content: JSON.stringify(e.result),
								showCancel: false
							})
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
		}
	}
</script>

<style>

</style>
