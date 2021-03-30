<template>
	<view class="center" @touchstart="start" @touchend="end">
		<!-- <view class="question-line"></view> -->
		<view class="question-title">
			<text class="question-title-type cu-tag round sm">{{getQuestionType(questionData.questionType)}}</text>
			<!-- <text class="question-title-content">{{questionData.questionTitle}}</text> -->
		</view>
		<view class="question-content">
			<text>{{questionData.questionContent}}</text>
		</view>
		<view class="question-answer">
			<view class="question-answer-option" v-if="isChoice">
				<view class="question-answer-option-item" :class="toCtrlClass" @click="toAnswer(item,index)"
					v-for="(item, index) in questionData.questionOption" :key="item.choice_code">
					<text
						:class="questionAnswerOptionClass(index)">{{questionOptionStatus(item.choice_code,index)}}</text>
					<text class="question-answer-option-content">{{item.choice_content}}</text>
				</view>
			</view>
			<view class="question-sketch-btn" v-if="!isChoice">
				<button class="cu-btn bg-green" @tap="openSketchAnswer">
					<text class="question-sketch-btn-text">偷偷看一眼答案</text>
				</button>
			</view>
			<view class="question-answer-content" v-if="isAnswer">
				<view class="question-answer-content-title">
					<text>答案</text>
				</view>
				<view class="question-answer-content-content">
					<text>{{questionData.questionAnswer}}</text>
				</view>
			</view>
			<view class="question-answer-explain" v-if="isAnswer">
				<view class="question-answer-explain-title">
					<text>解析</text>
				</view>
				<view class="question-answer-explain-content">
					<text>{{questionData.questionExplain}}</text>
				</view>
			</view>
			<view class="question-answer-next" v-if="isAnswer">
				<button class="cu-btn bg-green" @tap="nextQuestion">
					<text class="question-sketch-btn-text">随机一题</text>
				</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		timestampToTime
	} from '@/common/util.js';
	export default {
		data() {
			return {
				isAnswer: false,
				isChoice: true,
				questionData: {},
				questionTypeList: ['选择题', '简答题'],
				clickOptionTrue: -1, //下标，选对的时候
				clickOptionfalse: -1, //下标，选错的时候
				startData: {
					clientX: 0,
					clientY: 0
				}
			}
		},
		onLoad(option) {
			if (JSON.stringify(option) === "{}") {
				this.getRandomQuestion();
			} else {
				this.clickOptionTrue = -1;
				this.cclickOptionfalse = -1;
				this.questionData = JSON.parse(decodeURIComponent(option.detail));
				if (this.questionData.questionType === 1) {
					this.isChoice = false;
				}
			}
		},
		computed: {
			//选中时样式变更
			questionAnswerOptionClass: function() {
				return function(index) {
					return {
						'question-answer-option-code': this.clickOptionTrue != index && this.clickOptionfalse !=
							index,
						'question-answer-option-true': this.clickOptionTrue == index,
						'question-answer-option-false': this.clickOptionfalse == index,
					}
				}
			},
			//选中时选项头文本变更，选中则显示√，选错则为×
			questionOptionStatus: function() {
				return function(choiceCode, index) {
					if (this.clickOptionTrue == index) {
						return '√';
					} else if (this.clickOptionfalse == index) {
						return '×';
					} else {
						return choiceCode;
					}
				}
			},
			//控制点击伪类显示
			toCtrlClass: function() {
				return {
					'onActive': !this.isAnswer,
				}
			}
		},
		methods: {
			initState() {
				if (this.questionData.questionType === 1) {
					this.isChoice = false;
				}
				this.isAnswer = false;
				this.clickOptionTrue = -1;
				this.clickOptionfalse = -1;
			},
			getRandomQuestion() {
				let _self = this;
				return new Promise((resolve, reject) => {
					uniCloud.callFunction({
						name: "question-handler",
						data: {
							action: 'get-random-question-item',
							param: {}
						},
						success: (res) => {
							const data = res.result.data[0];
							_self.questionData = {
								questionId: data._id,
								questionType: data.question_type,
								uploadDate: timestampToTime(parseInt(data.upload_date)),
								questionTitle: data.question_title,
								questionTag: data.question_tag,
								questionDifficulty: data.question_difficulty,
								questionContent: data.question_content,
								questionOption: data.question_option,
								questionAnswer: data.question_answer,
								questionExplain: data.question_explain,
								uploadUser: data.upload_user
							}
							_self.initState();
							resolve();
						},
						fail: (res) => {
							reject(res);
						},
						complete: (res) => {}
					})
				});
			},
			nextQuestion() {
				this.getRandomQuestion().catch((err)=>{
					console.log(err)
				});
			},
			getQuestionType(e) {
				return [0, 1].indexOf(e) != -1 ? this.questionTypeList[e] : '';
			},
			openSketchAnswer() {
				this.isAnswer = true;
			},
			toAnswer(e, i) {
				if (this.isAnswer) {
					return;
				}
				this.isAnswer = true;
				e.is_answer ? this.bingo(i) : this.wrong(i);
			},
			bingo(e) {
				this.clickOptionTrue = e;
			},
			wrong(e) {
				this.clickOptionfalse = e;
			},
			start(e) {
				this.startData.clientX = e.changedTouches[0].clientX;
				this.startData.clientY = e.changedTouches[0].clientY;
			},
			end(e) {
				const subX = e.changedTouches[0].clientX - this.startData.clientX;
				const subY = e.changedTouches[0].clientY - this.startData.clientY;
				if (subY > 50 || subY < -50) {
					// this.getRandomQuestion();
				} else {
					if (subX > 100) {
						console.log('右滑')
					} else if (subX < -100) {
						console.log('左滑')
					} else {
						console.log('无效')
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@mixin beforeIcon {
		flex-direction: column;
		margin-top: 20px;

		view:first-child {
			&::before {
				content: '';
				position: absolute;
				left: 15px;
				width: 5px;
				height: 20px;
				background-color: green;
			}
		}
	}

	page,
	view {
		display: flex;
		background-color: #f8f8f8;

		.center {
			flex-direction: column;
			margin: 10px;
			padding: 5px;
			width: 100vw;

			.question-line {
				margin-top: 25px;
				height: 1px;
				background-color: #ebebeb;
			}

			.question-title {
				align-items: center;
				margin-top: 5px;
				padding-top: 5px;

				.question-title-type {
					background-color: #1cbbb4;
					color: #eafff5;
					box-shadow: 1px 2px 1px rgba(56, 160, 127, 0.2);
				}

				.question-title-content {
					flex: 1;
					lines: 1;
					text-overflow: ellipsis;
					overflow: hidden;
					margin-left: 5px;
					font-size: 16px;
					font-weight: bold;
				}
			}

			.question-content {
				margin-top: 20px;
				text-indent: 2em;
				font-size: 15px;
			}

			.question-answer {
				margin-top: 20px;
				flex-direction: column;

				.question-answer-option {
					display: block;

					.question-answer-option-item {
						padding: 5px;
						align-items: center;

						.question-answer-option-code {
							width: 20px;
							height: 20px;
							line-height: 20px;
							text-align: center;
							border-radius: 50%;
							border: #afd4e7 1px solid;
							font-weight: bold;
						}

						.question-answer-option-true {
							width: 20px;
							height: 20px;
							line-height: 20px;
							text-align: center;
							border-radius: 50%;
							color: #FFFFFF;
							border: #00aa00 1px solid;
							background-color: #00aa00;
							box-shadow: 1px 2px 1px rgba(0, 170, 0, 0.33);
							font-weight: bold;
							font-family: initial;
							font-size: 17px;
						}

						.question-answer-option-false {
							width: 20px;
							height: 20px;
							line-height: 20px;
							text-align: center;
							border-radius: 50%;
							color: #FFFFFF;
							border: #ff0000 1px solid;
							background-color: #ff0000;
							box-shadow: 1px 2px 1px rgba(255, 0, 0, 0.33);
							font-weight: bold;
							font-family: cursive;
							font-size: 17px;
						}

						.question-answer-option-content {
							margin-left: 15px;
							vertical-align: middle;
							flex: 1;
							lines: 1;
							text-overflow: ellipsis;
							overflow: hidden;
						}
					}

					.onActive {
						&:active {
							background-color: #EEEEEE;
						}
					}
				}

				.question-sketch-btn {}

				.question-sketch-btn-text {}

				.question-answer-content {
					border-top: #d5dceb 2px dashed;
					padding: 20px 10px 5px;
					@include beforeIcon;

					.question-answer-content-content {
						margin-top: 15px;
					}
				}

				.question-answer-explain {
					border-top: #d5dceb 1px solid;
					padding: 20px 10px 5px;
					@include beforeIcon;

					.question-answer-explain-content {
						margin-top: 15px;
					}
				}
				.question-answer-next {
					margin-top: 15px;
					justify-content: center;
				}
			}
		}
	}
</style>
