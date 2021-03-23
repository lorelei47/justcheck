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
					<view class="bg-red" :style="[{ width: loading ? progressWidth : ''}]"></view>
				</view>
				<text class="count-down">
					<text class="lg text-gray cuIcon-time"></text>
					<text class="time">{{minutes}}:{{seconds}}</text>
				</text>
			</view>
			<view class="exam-question-main">
				<examination-detail :questionDetail="getQuestionDetail"
					@examinationDetailValue="getExaminationDetailValue" :key="examinationDetailKey">
				</examination-detail>
			</view>
			<view class="exam-question-footer">
				<button class="cu-btn bg-green margin-tb-sm" @tap="toPrve(rownum)"
					v-show="!isFirst">{{prveBtn}}</button>
				<button class="cu-btn bg-green margin-tb-sm" @tap="toNext(rownum)">{{nextBtn}}</button>
			</view>
		</view>
		<view class="cu-modal" :class="modalName=='showModal'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">操作超时，请重试</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
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
				progressWidth: '',
				examinationDetailKey: 1,
				isBegin: false,
				isCompele: false,
				modalName: null,
				modalContent: {},
				questionDifficulty: [],
				hasDoneQuestionCount: 0,
				loading: true,
				minutes: "00",
				seconds: "00",
				timer: "",
				questionList: [],
				questionDetail: null,
				isFirst: true,
				isLast: false,
				prveBtn: '上一题',
				nextBtn: '下一题',
				rownum: 0 //题目游标
			};
		},
		created() {
			this.questionDifficulty = [{
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
			}]
		},
		watch: {
			questionList: {
				handler(value){
					let len = value.filter((i)=>i.userAnswer !== null).length;
					if(len > this.hasDoneQuestionCount){
						this.hasDoneQuestionCount++;
						this.progressWidth = Math.round(this.hasDoneQuestionCount/this.questionList.length,2) * 100 + '%';
					}
				},
				deep: true
			},
			getQuestionDetail() {
				this.examinationDetailKey++;
			}
		},
		computed: {
			getQuestionDetail: function() {
				return this.questionList[this.rownum];
			}
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
				let _self = this;
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
						_self.questionList = data.map((question, index) => {
							return {
								rowId: index,
								questionId: question._id,
								questionType: question.question_type,
								questionDifficulty: question.question_difficulty,
								questionContent: question.question_content,
								questionOption: question.question_option,
								questionAnswer: question.question_answer,
								questionExplain: question.question_explain,
								userAnswer: null
							};
						});
						// _self.questionCount = _self.questionList.length;
						_self.questionDetail = _self.questionList[0];

						let time = 0;
						_self.isBegin = true;
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
						_self.createCountdownTimer(time);
						_self.progressWidth = '0%';
					},
					fail: (e) => {
						_self.modalName = 'showModal';
					},
					complete: (e) => {}
				});
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
			},
			getExaminationDetailValue(data) {
				this.questionList[this.rownum] = data;
			},
			toPrve(e) {
				this.rownum = e - 1;
				this.isLast = false;
				this.nextBtn = '下一题';
				if (this.rownum == 0) {
					this.isFirst = true;
				} else {
					this.isFirst = false;
				}
			},
			toNext(e) {
				if (!this.isLast) {
					this.rownum = e + 1;
					this.isFirst = false;
					if (this.rownum == this.questionList.length - 1) {
						this.isLast = true;
						this.nextBtn = '完成';
					} else {
						this.isLast = false;
					}
				}
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

			.exam-question-footer {
				position: relative;
				margin-top: 20px;
				height: auto;

				button {
					position: absolute;

					&:nth-child(1) {
						left: 20px;
					}

					&:nth-child(2) {
						right: 20px;
					}
				}
			}
		}
	}
</style>
