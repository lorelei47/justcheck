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
					<view class="isVerify">
						<text
							:class="item.isAuditing ? 'text-green' : 'text-red' ">{{getIsAuditing(item.isAuditing)}}</text>
					</view>
					<view class="question-content">
						<question-item :questionItem="item" @click="goDetail(item)">
						</question-item>
					</view>
					<view class="move" @click="deleteQuestion(item.questionId,$event)">
						<view class="bg-red">删除</view>
					</view>
				</view>
			</view>
		</uni-list>
		<!-- 消息提示 -->
		<uni-popup id="popupMessage" ref="popupMessage" type="message">
			<uni-popup-message :type="msgType" :message="message" :duration="2000"></uni-popup-message>
		</uni-popup>
		<!-- 对话框 -->
		<uni-popup id="popupDialog" ref="popupDialog" type="dialog">
			<uni-popup-dialog :content="dialogContent" :before-close="true" @confirm="dialogConfirm"
				@close="dialogClose"></uni-popup-dialog>
		</uni-popup>
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
	import uniPopupMessage from '@/pages/components/uniUi/uni-popup-message/uni-popup-message.vue'
	import uniPopup from '@/pages/components/uniUi/uni-popup/uni-popup.vue'
	import uniPopupDialog from '@/pages/components/uniUi/uni-popup-dialog/uni-popup-dialog.vue'
	export default {
		components: {
			uniList,
			questionItem,
			uniPopupMessage,
			uniPopup,
			uniPopupDialog
		},
		data() {
			return {
				type: 'top',
				msgType: 'success',
				message: '',
				dialogContent: '',
				modalName: null,
				listTouchStart: 0,
				listTouchDirection: null,
				dataList: [],
				deleteId: ''
			}
		},
		created() {
			this.getMyQuestion();
		},
		onShow() {
			this.getMyQuestion();
		},
		computed: {
			...mapState('userStatus', {
				hasLogin: state => state.hasLogin,
				userName: state => state.userName
			}),
			getIsAuditing: function() {
				return function(isAuditing) {
					return isAuditing ? '已审核' : '未审核';
				}
			}
		},
		methods: {
			popupShow(type, msg) {
				this.msgType = type;
				this.message = msg;
				this.$refs.popupMessage.open()
			},
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
							action: 'my-question-list',
							param: {
								userName: _self.userName,
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
										uploadUser: question.upload_user,
										isAuditing: question.is_auditing
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
					url: '/pages/tabbar/user/addQuestion?detail=' + encodeURIComponent(JSON.stringify(detail)
						.replace(
							/%/g, "%25")),
				});
			},
			deleteQuestion(id,e) {
				e.stopPropagation();
				if (id) {
					this.deleteId = id;
					this.dialogContent = '确认删除该题目';
					this.$refs.popupDialog.open();
				}
			},
			dialogConfirm(done) {
				this.deleteQuestionSubmit().then(()=>{
					this.popupShow('success', '删除成功');
					this.getMyQuestion();
				});
				done()
			},
			dialogClose(done) {
				done()
			},
			deleteQuestionSubmit() {
				if(this.hasLogin){
					return;
				}
				let _self = this;
				return new Promise((resovle, reject) => {
					let _self = this;
					uniCloud.callFunction({
						name: 'question-handler',
						data: {
							action: 'delete-question',
							param: {
								questionId: _self.deleteId,
							}
						},
						success: (res) => {
							if (res.result.code == 0) {
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
			}
		}
	}
</script>

<style lang="scss" scoped>
	.center {
		.question-list {
			height: calc(100vh - 100px);

			.question-item {
				.isVerify {
					text-align: center;
					width: 50px;
					font-weight: bold;
				}

				.question-content {
					width: calc(100% - 50px)
				}

				.remove-btn {}
			}
		}
	}
</style>
