<template>
	<view class="center">
		<view class="question-title">
			<text class="question-title-type cu-tag round sm">{{getQuestionType(questionDetail.questionType)}}</text>
		</view>
		<view class="question-content">
			<text>{{questionDetail.questionContent}}</text>
		</view>
		<view class="question-answer-option" v-if="isChoice">
			<view class="question-answer-option-item" :class="toCtrlClass" @click="toAnswer(item,index)"
				v-for="(item, index) in questionDetail.questionOption" :key="item.choice_code">
				<text :class="questionAnswerOptionClass(index)">{{questionOptionStatus(item.choice_code,index)}}</text>
				<text class="question-answer-option-content">{{item.choice_content}}</text>
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
				isChoice: true,
				questionTypeList: ['选择题', '简答题'],
			}
		},
		methods: {
			getQuestionType(e) {
				return [0, 1].indexOf(e) != -1 ? this.questionTypeList[e] : '';
			},
		}
	}
</script>

<style>
</style>
