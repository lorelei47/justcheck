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
				<examination-detail :questionItem="questionDetail"></examination-detail>
			</view>
			<view class="exam-question-footer">

			</view>
		</view>
	</view>
</template>

<script>
	import examinationDetail from '@/pages/components/examination/examination-detail.vue';
	export default {
		components: {
			examinationDetail
		},
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				isBegin: false,
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
				minutes: "00",
				seconds: "00",
				timer: "",
				questionList: [],
				questionDetail: null
			};
		},
		methods: {
			showModal(item, e) {
				this.modalName = e.currentTarget.dataset.target;
				this.modalContent = item;
			},
			hideModal(e) {
				this.modalName = null
			},
			async toBegin(item) {
				await uniCloud.callFunction({
					name: 'question-handler',
					data: {
						action: 'question-list',
						param: {
							questionNum: item.num
						}
					},
					success: (res) => {
						const data = res.result.data;
						console.log(data);
						const data_list = data.map((question) => {
							return {
								questionId: question._id,
								questionType: question.question_type,
								questionDifficulty: question.question_difficulty,
								questionContent: question.question_content,
								questionOption: question.question_option,
								questionAnswer: question.question_answer,
								questionExplain: question.question_explain,
							};
						});
						this.questionList = data_list;
					},
					fail: (e) => {},
					complete: (e) => {}
				});
				let time = 0;
				this.isBegin = true;
				switch (item.code) {
					case "easy":
						this.minutes = "20";
						this.seconds = "00";
						time = 1200;
						break;
					case "normal":
					case "difficult":
						this.minutes = "30";
						this.seconds = "00";
						time = 1800;
						break;
					default:
						break;
				}
				this.createCountdownTimer(time);
			},
			createCountdownTimer(time) {
				this.timer = setInterval(() => {
					time = time - 1;
					this.minutes = parseInt(time / 60).toString().padStart(2, "0");
					this.seconds = parseInt(time % 60).toString().padStart(2, "0");
				}, 1000);
			},
			destroyCountdownTimer() {
				clearInterval(this.timer);
			}
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
