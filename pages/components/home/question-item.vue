<template>
	<view class="media-item view" v-if="questionItem.questionTitle" @click="click">
		<view class="view" style="flex-direction: column;">
			<text></text>
			<text class="media-title"
				:class="{'media-title2': questionItem.questionType === 1 || questionItem.questionType === 2}">{{questionItem.questionTitle}}</text>
		</view>
		<view class="media-foot flex-row">
			<view class="media-info flex-row">
				<text class="info-text"
					:class="difficultyIcon(questionItem.questionDifficulty)">{{difficultyText(questionItem.questionDifficulty)}}</text>
				<text class="info-text" v-for="(item, index) in questionItem.questionTag">{{item}}</text>
			</view>
			<view class="media-info flex-row">
				<text class="info-text">{{questionItem.uploadDate}}</text>
			</view>
		</view>
		<view class="media-item-line" style="position: absolute;"></view>
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
		methods: {
			click() {
				this.$emit('click');
			},
			close(e) {
				e.stopPropagation();
				this.$emit('close');
			},
			difficultyIcon(e) {
				let iconClass = ''
				switch (e) {
					case 1:
						iconClass = 'easyIcon';
						break;
					case 2:
						iconClass = 'normalIcon';
						break;
					case 3:
						iconClass = 'difficultIcon';
						break;
					default:
						break;
				}
				return iconClass;
			},
			difficultyText(e) {
				let iconText = ''
				switch (e) {
					case 1:
						iconText = '简单';
						break;
					case 2:
						iconText = '中等';
						break;
					case 3:
						iconText = '困难';
						break;
					default:
						break;
				}
				return iconText;
			}
		}
	}
</script>

<style scoped>
	.view {
		flex: 1;
		flex-direction: column;
	}

	.flex-row {
		flex-direction: row;
	}

	.flex-col {
		flex-direction: column;
	}

	.list-cell {
		padding: 0 15px;
	}

	.uni-list-cell-hover {
		background-color: #eeeeee;
	}

	.media-item {
		position: relative;
		flex: 1;
		flex-direction: column;
		padding: 10px 15px 10px 15px;
	}

	.media-item-line {
		position: absolute;
		left: 15px;
		right: 15px;
		bottom: 0;
		height: 1px;
		background-color: #ebebeb;
	}

	.media-image-right {
		flex-direction: row;
	}

	.media-image-left {
		flex-direction: row-reverse;
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

	.media-info {
		flex-direction: row;
		align-items: center;
	}

	.info-text {
		margin-right: 10px;
		color: #999999;
		font-size: 12px;
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

	.media-foot {
		margin-top: 12px;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
</style>
