<template>
	<view class="center">
		<view class="feedback-title">问题描述</view>
		<view class="feedback-content">
			<view class="cu-form-group margin-top">
				<textarea maxlength="-1" @input="textareaInput"
					placeholder="如果您有什么问题和意见,请告诉我们"></textarea>
			</view>
		</view>
		<view class="padding flex flex-direction">
			<button class="cu-btn bg-green margin-tb-lg lg" @tap="submit">提交</button>
		</view>
		<view class="cu-modal" :class="modalName=='completeModal'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">感谢您宝贵的意见</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex';
	export default {
		data() {
			return {
				modalName: null,
				feedbackContent: ''
			}
		},
		computed: {
			...mapState('userStatus', {
				hasLogin: state => state.hasLogin,
				userName: state => state.userName
			})
		},
		methods: {
			textareaInput(e) {
				this.feedbackContent = e.detail.value
			},
			hideModal(e) {
				this.modalName = null
			},
			submit() {
				let _self = this;
				uniCloud.callFunction({
					name: "feedback-handler",
					data: {
						action: 'submit-feedback-content',
						param: {
							feedbackUser: _self.hasLogin ? _self.userName : '',
							feedbackContent: _self.feedbackContent,
							feedbackDate: new Date().getTime()
						}
					},
					success: (res) => {
						if (res.result.code == 0) {
							_self.modalName = 'completeModal';
						}
					},
					fail: (e) => {},
					complete: (e) => {}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.center {
		padding: 10px;

		.feedback-title {
			margin-top: 10px;
			font-size: 18px;
			font-weight: bold;
		}

		.feedback-content {}
	}
</style>
