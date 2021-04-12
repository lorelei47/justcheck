<template>
	<view class="center">
		<view class="cu-bar bg-white solid-bottom">
			<view class="action">
				<text class="cuIcon-title text-blue "></text>题目列表
			</view>
		</view>
		<uni-list ref="list" class="listview question-list" :enableBackToTop="true" :scroll-y="true">
			<view class="cu-list menu-avatar">
				<view class="cu-item question-item" :class="modalName=='move-box-'+ index?'move-cur':''"
					v-for="(item,index) in dataList" :key="index" @touchstart="ListTouchStart"
					@touchmove="ListTouchMove" @touchend="ListTouchEnd" :data-target="'move-box-' + index">
					<view class="isVerify"></view>
					<view class="question-content">
						<question-item :questionItem="item" @click="goDetail(item)">
						</question-item>
					</view>
					<view class="move">
						<view class="bg-red">删除</view>
					</view>
				</view>
			</view>
		</uni-list>
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex';
	import {
		timestampToTime
	} from '@/common/util.js';
	import uniList from '@/pages/components/colorUi/uni-list.vue';
	import questionItem from '@/pages/components/home/question-item.vue';
	export default {
		components: {
			uniList,
			questionItem
		},
		data() {
			return {
				modalName: null,
				listTouchStart: 0,
				listTouchDirection: null,
				dataList: [],
			}
		},
		created() {
			this.getMyQuestion();
		},
		computed: {
			...mapState('userStatus', {
				hasLogin: state => state.hasLogin,
				userName: state => state.userName
			}),
		},
		methods: {
			// ListTouch触摸开始
			ListTouchStart(e) {
				this.listTouchStart = e.touches[0].pageX
			},
			// ListTouch计算方向
			ListTouchMove(e) {
				this.listTouchDirection = e.touches[0].pageX - this.listTouchStart > 0 ? 'right' : 'left'
			},
			// ListTouch计算滚动
			ListTouchEnd(e) {
				if (this.listTouchDirection == 'left') {
					this.modalName = e.currentTarget.dataset.target
				} else {
					this.modalName = null
				}
				this.listTouchDirection = null
			},
			getMyQuestion() {
				return new Promise((resovle, reject) => {
					let _self = this;
					uniCloud.callFunction({
						name: 'question-handler',
						data: {
							action: 'question-list',
							param: {
								userName: _self.hasLogin,
							}
						},
						success: (res) => {
							if (res.result.code == 0) {
								const data = res.result.data;
								const data_list = data.map((question) => {
									return {
										questionId: question._id,
										questionType: question.question_type,
										uploadDate: timestampToTime(parseInt(question
											.upload_date)),
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
								_self.dataList = data_list;
								resovle();
							} else {
								reject();
							}
						},
						fail: (e) => {
							reject(e);
						},
						complete: (e) => {}
					})
				});
			},
			goDetail(detail) {
				uni.navigateTo({
					url: '/pages/tabbar/user/addQuestion?detail=' + encodeURIComponent(JSON.stringify(detail).replace(
						/%/g, "%25")),
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.center {
		.question-list {
			height: calc(100vh - 100px);

			.question-item {
				.isVerify {
					width: 50px;
				}
				.question-content {
					width: calc(100% - 50px)
				}

				.remove-btn {}
			}
		}
	}
</style>
