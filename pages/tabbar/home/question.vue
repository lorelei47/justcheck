<template>
	<view class="center">
		<view class="question-line"></view>
		<view class="question-title">
			<text class="question-title-type cu-tag round sm">{{getQuestionType(questionData.questionType)}}</text>
			<text class="question-title-content">{{questionData.questionTitle}}</text>
		</view>
		<view class="question-content">
			<text>{{questionData.questionContent}}</text>
		</view>
		<view class="question-answer">
			<view class="question-answer-option" v-if="isChoice">
				<view class="question-answer-option-item" @click="toAnswer(item)" v-for="(item, index) in optionList"
					:key="item.choice_code">
					<text class="question-answer-option-code">{{item.choice_code}}</text>
					<text class="question-answer-option-content">{{item.choice_content}}</text>
				</view>
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
					<text>{{questionData.questionAnswer}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isAnswer: false,
				isChoice: true,
				questionData: {},
				questionTypeList: ['选择题', '简答题'],
				optionList: [{
						"choice_code": "A",
						"choice_content": "A",
						"isAnswer": 0
					},
					{
						"choice_code": "B",
						"choice_content": "B",
						"isAnswer": 1
					}
				],
			}
		},
		onLoad(option) {
			this.questionData = JSON.parse(decodeURIComponent(option.detail));
		},
		methods: {
			getQuestionType(e) {
				return [0, 1].indexOf(e) != -1 ? this.questionTypeList[e] : '';
			},
			toAnswer(e) {
				e.isAnswer ? this.bingo() : this.wrong();
			},
			bingo(e) {
				this.isAnswer = true;
			},
			wrong(e) {

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
							border: #0FAEFF 1px solid;
							font-weight: bold;
						}

						.question-answer-option-content {
							margin-left: 15px;
							vertical-align: middle;
						}

						&:active {
							background-color: #EEEEEE;
						}
					}
				}

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
			}
		}
	}
</style>
