<template>
	<view class="center">
		<view class="question-line"></view>
		<view class="question-title">
			<text class="question-title-type cu-tag round sm">选择题</text>
			<text class="question-title-content">双向事件绑定 v-model 的实现原理</text>
		</view>
		<view class="question-content">
			<text>写一个左中右布局占满屏幕，其中左右两块是固定宽度200 ，中间自适应宽，要求先加载中间块，请写出结构及样式</text>
		</view>
		<view class="question-answer">
			<view class="question-answer-content">
				<text>答案</text>
			</view>
			<view class="question-answer-option">
				<text>选项</text>
			</view>
			<view class="question-answer-explain">
				<text>解析</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {

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
			.question-line {
				margin-top: 25px;
				height: 1px;
				background-color: #ebebeb;
			}
			.question-title {
				position: relative;
				margin-top: 5px;
				padding-top: 5px;
				.question-title-type {
					background-color: #1cbbb4;
					color: #eafff5;
					vertical-align: middle;
				}
				.question-title-content {
					vertical-align: middle;
					margin-left: 5px;
					font-size: 16px;
					font-weight: bold;
				}
			}
			.question-content {
				margin-top: 10px;
				text-indent:2em;
				font-size: 15px;
			}
			.question-answer {
				margin-top: 20px;
				flex-direction: column;
				.question-answer-content {
					
				}
				.question-answer-option{
					
				}
				.question-answer-explain{
					
				}
			}
		}
	}
</style>
