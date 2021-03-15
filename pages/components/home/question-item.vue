<template>
	<view class="media-item view" v-if="questionItem.questionTitle" @click="click">
		<view class="view flex-col">
			<text class="question-type">{{typeTextIcon(questionItem.questionType)}}</text>
			<text class="media-title"
				:class="{'media-title2': questionItem.questionType === 1 || questionItem.questionType === 2}">{{questionItem.questionTitle}}</text>
		</view>
		<view class="media-foot flex-row">
			<view class="media-info flex-row">
				<text class="info-text"
					:class="difficultyIcon(questionItem.questionDifficulty)">{{difficultyText(questionItem.questionDifficulty)}}</text>
				<text class="tag-icon" v-for="(item, index) in questionItem.questionTag">{{item}}</text>
			</view>
			<view class="media-info flex-row">
				<text class="info-text">{{questionItem.uploadDate}}</text>
			</view>
		</view>
		<view class="media-item-line"></view>
	</view>
</template>

<script>
	export default {
		props: {
			questionItem: {
				type: Object,
				default: function(e) {
					return {}
				}
			}
		},
		data() {
			return {
				difficultyIconList: ['easyIcon','normalIcon','difficultIcon'],
				difficultyTextList: ['简单','中等','困难'],
				typeTextList: ['选','简'],
			}
		},
		methods: {
			click() {
				this.$emit('click');
			},
			close(e) {
				e.stopPropagation();
				this.$emit('close');
			},
			typeTextIcon(e){
				let val = [0,1].indexOf(e) != -1 ? this.typeTextList[e] : '';
				return val;
			},
			difficultyIcon(e) {
				return e ? this.difficultyIconList[e-1] : '';
			},
			difficultyText(e) {
				return e ? this.difficultyTextList[e-1] : '';
			}
		}
	}
</script>

<style lang="scss" scoped>
	view {
		.view {
			flex: 1;
			flex-direction: column;
			.flex-row {
				flex-direction: row;
			}
			.flex-col {
				flex-direction: column;
				.question-type {
					margin: 0 5px;
					padding: 4px 5px;
					width: 20px;
					height: 20px;
					color: #FFFFFF;
					background-color: #5bad69;
					font-size: 14px;
					border-radius: 50%;
				}
				.media-title {
					flex: 1;
					lines: 1;
					text-overflow: ellipsis;
					overflow: hidden;
					/* white-space: nowrap; */
				}
				.media-title {
					font-size: 17px;
					font-weight: 600;
					color: #555555;
				}
				.media-title2 {
					flex: 1;
					margin-top: 5px;
					line-height: 25px;
				}
			}
			.media-foot {
				margin-top: 5px;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				.media-info {
					flex-direction: row;
					align-items: center;
					padding: 3px 0;
					.info-text {
						margin-right: 10px;
						color: #999999;
						font-size: 12px;
					}	
					.tag-icon {
						margin: 0 5px;
						padding: 0 3px;
						font-size: 12px;
						color: #FFFFFF;
						background-color: #4aa8ff;
						border: #35aeff 1px solid;
						border-radius: 5px;
						box-shadow: 0.5px 0px 1px #a6caec;
					}
					.easyIcon {
						color: #39b54b;
					}
					.normalIcon {
						color: #ffaa00;
					}
					.difficultIcon {
						color: #ff3030;
					}
				}
			}
		}
		.media-item {
			position: relative;
			flex: 1;
			flex-direction: column;
			padding: 10px 15px 10px 15px;
			.media-item-line {
				position: absolute;
				left: 15px;
				right: 15px;
				bottom: 0;
				height: 1px;
				background-color: #ebebeb;
			}
		}
	}
</style>
