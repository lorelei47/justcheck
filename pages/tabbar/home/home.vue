<template>
	<view>
		<view class="cu-bar bg-white search fixed">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input type="text" v-model="searchWord" placeholder="输入搜索的关键词" confirm-type="search"></input>
				<view v-if="searchWord !== ''" class="uni-searchbar__box-icon-clear" @click="clearInput">
					<slot name="clearIcon">
						<uni-icons color="#c0c4cc" size="18" type="clear" />
					</slot>
				</view>
			</view>
		</view>
		<view class="page-news">
			<!-- #ifdef MP-QQ -->
			<scroll-view class="listview" style="flex: 1;" enableBackToTop="true" scroll-y @scrolltolower="loadMore()">
				<view v-for="(item, index) in dataList" :key="item.id" @click="goDetail(item)">
					<question-item :questionItem="item" @close="closeItem(index)">
					</question-item>
				</view>
				<view class="loading-more" v-if="isLoading || dataList.length > 4">
					<text class="loading-more-text">{{loadingText}}</text>
				</view>
			</scroll-view>
			<!-- #endif -->
			<!-- QQ multipleSlots=true bug -->
			<!-- #ifndef MP-QQ -->
			<uni-list ref="list" class="listview" :enableBackToTop="true" :scroll-y="true" @scrolltolower="loadMore()">
				<uni-refresh class="refresh" @refresh="onrefresh" @pullingdown="onpullingdown"
					:display="refreshing ? 'show' : 'hide'">
					<div class="refresh-view">
						<image class="refresh-icon" :src="refreshIcon"
							:style="{width: (refreshing || pulling) ? 0: '32px'}"
							:class="{'refresh-icon-active': refreshFlag}"></image>
						<uni-load-more v-if="refreshing" class="loading-icon" status="loading"
							:contentText="loadingMoreText"></uni-load-more>
						<text class="loading-text">{{refreshText}}</text>
					</div>
				</uni-refresh>
				<uni-cell v-for="(item, index) in dataList" :key="index">
					<question-item :questionItem="item" @tagText="getTagText" @click="goDetail(item)">
					</question-item>
				</uni-cell>
				<uni-cell v-if="isLoading || dataList.length > 4">
					<view class="loading-more">
						<text class="loading-more-text">{{loadingText}}</text>
					</view>
				</uni-cell>
			</uni-list>
			<!-- #endif -->
			<no-data class="no-data" v-if="isNoData" @retry="loadMore"></no-data>
		</view>
	</view>
</template>

<script>
	import {
		timestampToTime
	} from '@/common/util.js';
	import uniList from '@/pages/components/colorUi/uni-list.vue';
	import uniCell from '@/pages/components/colorUi/uni-cell.vue';
	import uniRefresh from '@/pages/components/colorUi/uni-refresh.vue';
	import uniLoadMore from '@/pages/components/colorUi/uni-load-more.vue';
	import noData from '@/pages/components/colorUi/nodata.nvue';
	import questionItem from '@/pages/components/home/question-item.vue';
	export default {
		components: {
			uniList,
			uniCell,
			uniRefresh,
			uniLoadMore,
			noData,
			questionItem
		},
		props: {
			nid: {
				type: [Number, String],
				default: 0
			}
		},
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				searchWord: '',
				dataList: [],
				navigateFlag: false,
				pulling: false,
				refreshing: false,
				refreshFlag: false,
				refreshText: "",
				isLoading: false,
				loadingText: '加载中...',
				isNoData: false,
				pulling: false,
				angle: 0,
				loadingMoreText: {
					contentdown: '',
					contentrefresh: '',
					contentnomore: ''
				},
				refreshIcon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAB5QTFRFcHBw3Nzct7e39vb2ycnJioqK7e3tpqam29vb////D8oK7wAAAAp0Uk5T////////////ALLMLM8AAABxSURBVHja7JVBDoAgDASrjqj//7CJBi90iyYeOHTPMwmFZrHjYyyFYYUy1bwUZqtJIYVxhf1a6u0R7iUvWsCcrEtwJHp8MwMdvh2amHduiZD3rpWId9+BgPd7Cc2LIkPyqvlQvKxKBJ//Qwq/CacAAwDUv0a0YuKhzgAAAABJRU5ErkJggg==",
				startData: {
					clientX: 0,
					clientY: 0
				}
			};
		},
		created() {
			this.pullTimer = null;
			this.requestParams = {
				columnId: this.nid,
				minId: 0,
				pageSize: 10,
				column: 'id,post_id,title,author_name,cover,published_at,comments_count'
			};

			this._isWidescreen = false;
			// #ifdef H5
			var mediaQueryOb = uni.createMediaQueryObserver(this)
			mediaQueryOb.observe({
				minWidth: 768
			}, matches => {
				this._isWidescreen = matches;
			})
			// #endif
			this.loadData();
		},
		watch: {
			searchWord: function() {
				this.loadData(true);
			}
		},
		methods: {
			clearInput() {
				this.searchWord = "";
			},
			loadData(refresh) {
				if (this.isLoading) {
					return;
				}
				this.isLoading = true;
				this.isNoData = false;
				this.requestParams.time = new Date().getTime() + '';
				let _self = this;

				uniCloud.callFunction({
					name: 'question-handler',
					data: {
						action: 'question-list',
						param: {
							searchWord: _self.searchWord,
							isAuditing: 1
						}
					},
					success: (res) => {
						const data = res.result.data;
						_self.isNoData = (data.length <= 0);

						const data_list = data.map((question) => {
							return {
								questionId: question._id,
								questionType: question.question_type,
								uploadDate: timestampToTime(parseInt(question.upload_date)),
								questionTitle: question.question_title,
								questionTag: question.question_tag,
								questionDifficulty: question.question_difficulty,
								questionContent: question.question_content,
								questionOption: question.question_option,
								questionAnswer: question.question_answer,
								questionExplain: question.question_explain,
								uploadUser: question.upload_user
							};
						});

						if (refresh) {
							_self.dataList = data_list;
							_self.requestParams.minId = 0;
						} else {
							_self.dataList = _self.dataList.concat(data_list);
							_self.requestParams.minId = data[data.length - 1].id;
						}

						if (_self.dataList.length > 0 && _self._isWidescreen && _self.dataList.length <= 10) {
							_self.goDetail(_self.dataList[0]);
						}
					},
					fail: (e) => {
						if (_self.dataList.length == 0) {
							_self.isNoData = true;
						}
					},
					complete: (e) => {
						_self.isLoading = false;
						if (refresh) {
							_self.refreshing = false;
							_self.refreshFlag = false;
							_self.refreshText = "已刷新";
							if (_self.pullTimer) {
								clearTimeout(_self.pullTimer);
							}
							_self.pullTimer = setTimeout(() => {
								_self.pulling = false;
							}, 1000);
						}
					}
				})
			},
			loadMore(e) {
				this.loadData();
			},
			clear() {
				this.dataList.length = 0;
				this.requestParams.minId = 0;
			},
			goDetail(detail) {
				uni.navigateTo({
					url: '/pages/tabbar/home/question?detail=' + encodeURIComponent(JSON.stringify(detail).replace(
						/%/g, "%25")),
				});
			},
			closeItem(index) {
				uni.showModal({
					content: '不感兴趣？',
					success: (res) => {
						if (res.confirm) {
							this.dataList.splice(index, 1);
						}
					}
				})
			},
			refreshData() {
				if (this.isLoading) {
					return;
				}
				this.pulling = true;
				this.refreshing = true;
				this.refreshText = "正在刷新...";
				this.loadData(true);
			},
			onrefresh(e) {
				this.refreshData();
				this.$refs.list.resetLoadmore();
			},
			onpullingdown(e) {
				if (this.refreshing) {
					return;
				}

				// var angle = (e.pullingDistance) / e.viewHeight * 180;
				// if (angle > 180) {
				// 	angle = 180;
				// }
				// tab.angle = angle;

				this.pulling = false;
				if (Math.abs(e.pullingDistance) > Math.abs(e.viewHeight)) {
					this.refreshFlag = true;
					this.refreshText = "释放立即刷新";
				} else {
					this.refreshFlag = false;
					this.refreshText = "下拉可以刷新";
				}
			},
			newGuid() {
				let s4 = function() {
					return (65536 * (1 + Math.random()) | 0).toString(16).substring(1);
				}
				return (s4() + s4() + "-" + s4() + "-4" + s4().substr(0, 3) + "-" + s4() + "-" + s4() + s4() + s4())
					.toUpperCase();
			},
			getTagText(data) {
				this.searchWord = data;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.search {
		/* #ifndef MP-WEIXIN */
		margin-top: 45px;
		/* #endif */
	}

	.no-data {
		flex: 1;
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 10;
	}

	.page-news {
		margin-top: 50px;
		flex: 1;
		flex-direction: column;
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
	}

	.listview {
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		/* #ifndef APP-NVUE */
		display: flex;
		flex-direction: column;
		/* #endif */
		/* #ifndef MP-ALIPAY */
		flex-direction: column;
		/* #endif */
	}

	.refresh {
		justify-content: center;
	}

	.refresh-view {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		width: 750rpx;
		height: 64px;
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: center;
	}

	.refresh-icon {
		width: 32px;
		height: 32px;
		transition-duration: .5s;
		transition-property: transform;
		transform: rotate(0deg);
		transform-origin: 15px 15px;
	}

	.refresh-icon-active {
		transform: rotate(180deg);
	}

	.loading-icon {
		width: 28px;
		height: 28px;
		margin-right: 5px;
		color: gray;
	}

	.loading-text {
		margin-left: 2px;
		font-size: 16px;
		color: #999999;
	}

	.loading-more {
		align-items: center;
		justify-content: center;
		padding-top: 14px;
		padding-bottom: 14px;
		text-align: center;
	}

	.loading-more-text {
		font-size: 28upx;
		color: #999;
	}

	.uni-searchbar__box-icon-clear {
		align-items: center;
		line-height: 24px;
		padding-left: 8px;
		padding-right: 8px;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}
</style>
