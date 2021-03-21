<template>
	<view class="center">
		<cu-custom bgColor="topTitle">
			<block slot="content">试题</block>
		</cu-custom>
		<view v-if="!isBegin" class="exam-choice" :style="[{marginTop: -CustomBar + 'px'}]">
			<view class="exam-choice-title">
				<text>请选择难度</text>
			</view>
			<view class="choice-button">
				<button v-for="(item, index) in questionDifficulty" :key="index" class="cu-btn bg-green shadow"
					@tap="showModal(item,$event)" data-target="modal">{{item.name}}</button>
			</view>
			<view class="cu-modal" :class="modalName=='modal'?'show':''">
				<view class="cu-dialog">
					<view class="cu-bar bg-white justify-end">
						<view class="content">{{modalContent.name}}</view>
						<view class="action" @tap="hideModal">
							<text class="cuIcon-close text-red"></text>
						</view>
					</view>
					<view class="padding-xl">{{modalContent.explain}}</view>
					<view class="cu-bar bg-white justify-end">
						<view class="action">
							<button class="cu-btn bg-green" @tap="toBegin(modalContent)">确定</button>
							<button class="cu-btn line-green text-green margin-left" @tap="hideModal">取消</button>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-if="isBegin" class="exam-question" :style="[{marginTop: -CustomBar + 'px'}]">
			<view class="exam-question-title">
				<view class="cu-progress round xs">
					<view class="bg-red" :style="[{ width: loading?'61.8%':''}]"></view>
				</view>
				<text class="count-down">
					<text class="lg text-gray cuIcon-time"></text>
					<text class="time">{{minutes}}:{{seconds}}</text>
				</text>
			</view>
			<view class="exam-question-main">
				<examination-detail></examination-detail>
			</view>
			<view class="exam-question-footer">

			</view>
		</view>
	</view>
</template>

<script>
	import examinationDetail from '@/pages/components/home/examination-detail.vue';
	// import {
	// 	num
	// } from '@/common/countdown.js';
	export default {
		components: {
			examinationDetail
		},
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				isBegin: true,
				examDiff: null,
				modalName: null,
				modalContent: {},
				questionDifficulty: [{
					code: 'easy',
					name: '简单',
					explain: '本测验共有20道题，请在20分钟内完成',
					num: 20,
				}, {
					code: 'normal',
					name: '普通',
					explain: '本测验共有30道题，请在30分钟内完成',
					num: 30,
				}, {
					code: 'difficult',
					name: '困难',
					explain: '本测验共有50道题，请在30分钟内完成',
					num: 50,
				}],
				questionCount: 0,
				hasDoneQuestionCount: 0,
				loading: true,
				minutes: 30,
				seconds: 0,
			};
		},
		// watch: {
		// 	// 倒计时
		// 	second: {
		// 		handler(newVal) {
		// 			this.num(newVal);
		// 		},
		// 	},
		// 	// 倒计时
		// 	minute: {
		// 		handler(newVal) {
		// 			this.num(newVal);
		// 		},
		// 	},
		// },
		// computed: {
		// 	minute: function() {
		// 		return this.num(this.minutes);
		// 	},
		// 	second: function() {
		// 		return this.num(his.seconds);
		// 	}
		// },
		methods: {
			showModal(item, e) {
				this.modalName = e.currentTarget.dataset.target;
				this.modalContent = item;
			},
			hideModal(e) {
				this.modalName = null
			},
			toBegin(item) {
				this.isBegin = true;
				this.examDiff = item.code;
				// this.timer();
			},
			// // 倒计时
			// num(n) {
			// 	// 倒计时结束重新刷新页面
			// 	if (this.minutes === 0 && this.seconds === 2) {
			// 		// this.$message.warning('支付倒计时结束!即将刷新页面!');
			// 	}
			// 	if (this.minutes === 0 && this.seconds === 0) {
			// 		// window.location.reload();
			// 	}
			// 	return n < 10 ? '0' + n : '' + n;
			// },
			// timer() {
			// 	var _this = this;
			// 	var time = window.setInterval(function() {
			// 		if (_this.seconds === 0 && _this.minutes !== 0) {
			// 			_this.seconds = 59;
			// 			_this.minutes -= 1;
			// 		} else if (_this.minutes === 0 && _this.seconds === 0) {
			// 			_this.seconds = 0;
			// 			window.clearInterval(time);
			// 		} else {
			// 			_this.seconds -= 1;
			// 		}
			// 	}, 1000);
			// }
		}
	}
</script>

<style lang="scss">
	.center {
		display: flex;
		flex-direction: column;

		.exam-choice {
			width: 100vw;
			justify-content: space-around;
			align-items: center;

			.exam-choice-title {
				margin-top: 30px;
				padding: 10px 15px;
				font-size: 18px;
				text-align: center;

				text {
					text-shadow: 1px 1px 1px #ccc;
					font-family: serif;
					font-weight: bold;
				}
			}

			.choice-button {
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				align-items: center;


				button {
					font-size: 20px;
					height: 40px;
					width: 100px;
					margin-top: 60px;
					margin-bottom: 20px;
					line-height: 40px;
					text-align: center;

					&:nth-child(1) {
						background-color: #39b54a;
						box-shadow: 6upx 6upx 8upx rgba(48, 156, 63, 0.2);
					}

					&:nth-child(2) {
						background-color: #e58a3f;
						box-shadow: 6upx 6upx 8upx rgba(217, 109, 26, 0.2);
					}

					&:nth-child(3) {
						background-color: #e51114;
						box-shadow: 6upx 6upx 8upx rgba(204, 69, 59, 0.2);
					}
				}

			}
		}

		.exam-question {
			position: relative;
			width: 100vw;
			padding: 10px 15px;

			.exam-question-title {
				position: relative;
				height: 50px;

				.count-down {
					position: absolute;
					right: 0;
					top: 20px;

					.time {
						margin-left: 5px;
					}
				}
			}

			.exam-question-main {}

			.exam-question-footer {}

			width: 100vw;
		}
	}
</style>
