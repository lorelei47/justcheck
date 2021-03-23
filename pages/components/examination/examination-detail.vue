<template>
	<view class="center">
		<view class="question-title">
			<text class="question-title-type cu-tag round sm">{{getQuestionType(questionDetail.questionType)}}</text>
		</view>
		<view class="question-content">
			<text>{{questionDetail.questionContent}}</text>
		</view>
		<view class="question-answer">
			<view class="question-answer-option" v-if="isChoice">
				<view class="question-answer-option-item onActive" @click="toAnswer(item,index)"
					v-for="(item, index) in questionDetail.questionOption" :key="item.choice_code">
					<text :class="questionAnswerOptionClass(index)">{{item.choice_code}}</text>
					<text class="question-answer-option-content">{{item.choice_content}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			questionDetail: {
				type: Object,
				default: function(e) {
					return {}
				}
			}
		},
		data() {
			return {
				examinationDetailValue: this.questionDetail,
				isAnswer: this.questionDetail.userAnswer ? true : false,
				isChoice: true,
				clickOptionAnswer: this.questionDetail.userAnswer ? this.questionDetail.userAnswer : -1,
				questionTypeList: ['选择题', '简答题'],
			}
		},
		computed: {
			// 选中时样式变更
			questionAnswerOptionClass: function() {
				return function(index) {
					return {
						'question-answer-option-code': this.clickOptionAnswer != index,
						'question-answer-option-answer': this.clickOptionAnswer == index,
					}
				}
			},
		},
		methods: {
			getQuestionType(e) {
				return [0, 1].indexOf(e) != -1 ? this.questionTypeList[e] : '';
			},
			toAnswer(e, i) {
				this.isAnswer = true;
				this.clickOptionAnswer = i;
				this.examinationDetailValue.userAnswer = i;
				this.$emit("examinationDetailValue",this.examinationDetailValue);
			}
		}
	}
</script>

<style lang="scss" scoped>
	page,
	view {
		display: flex;
		background-color: #f8f8f8;

		.center {
			flex-direction: column;
			margin: 10px;
			padding: 5px;

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

						.question-answer-option-answer {
							width: 20px;
							height: 20px;
							line-height: 20px;
							text-align: center;
							border-radius: 50%;
							color: #FFFFFF;
							border: #00aa00 1px solid;
							background-color: #00aa00;
							box-shadow: 1px 2px 1px rgba(0, 170, 0, 0.33);
						}

						.question-answer-option-content {
							margin-left: 15px;
							vertical-align: middle;
						}
					}

					.onActive {
						&:active {
							background-color: #EEEEEE;
						}
					}
				}
			}
		}
	}
</style>
