<template>
	<view class="media-item view" v-if="questionItem.title" @click="click">
		<view class="view" style="flex-direction: column;">
			<text class="media-title"
				:class="{'media-title2': questionItem.article_type === 1 || questionItem.article_type === 2}">{{questionItem.title}}</text>
		</view>
		<view class="view" style="flex-direction: column;">
			<text class="media-resume"
				:class="{'media-resume2': questionItem.article_type === 1 || questionItem.article_type === 2}">{{questionItem.title}}</text>
		</view>
		<view class="media-foot flex-row">
			<view class="media-info flex-row">
				<text class="info-text">{{questionItem.source}}</text>
				<text class="info-text">{{questionItem.comment_count}}条评论</text>
				<text class="info-text">{{questionItem.datetime}}</text>
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
	
	.media-resume {
		flex: 1;
	}

	.media-resume {
		lines: 3;
		text-overflow: ellipsis;
		font-size: 15px;
		color: #555555;
	}

	.media-resume2 {
		flex: 1;
		margin-top: 3px;
		line-height: 20px;
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

	.media-foot {
		margin-top: 12px;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
</style>
