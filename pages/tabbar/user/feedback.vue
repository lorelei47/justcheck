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
		<!-- 消息提示 -->
		<uni-popup id="popupMessage" ref="popupMessage" type="message">
			<uni-popup-message :type="msgType" :message="message" :duration="2000"></uni-popup-message>
		</uni-popup>
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex';
	import uniPopupMessage from '@/pages/components/uniUi/uni-popup-message/uni-popup-message.vue'
	import uniPopup from '@/pages/components/uniUi/uni-popup/uni-popup.vue'
	export default {
		components: {
			uniPopupMessage,
			uniPopup
		},
		data() {
			return {
				type: 'top',
				msgType: 'success',
				message: '',
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
			popupShow(type, msg) {
				this.msgType = type;
				this.message = msg;
				this.$refs.popupMessage.open()
			},
			textareaInput(e) {
				this.feedbackContent = e.detail.value
			},
			hideModal(e) {
				this.modalName = null
			},
			submit() {
				if(this.feedbackContent == ''){
					this.popupShow('error', '请输入您的问题和意见');
					return;
				}
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
							_self.popupShow('success', '感谢您宝贵的意见');
						}
					},
					fail: (e) => {},
					complete: (e) => {
						_self.hideModal();
					}
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

		.feedback-content {
			textarea{
				height: 50vh;
			}
		}
	}
</style>
