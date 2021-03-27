<template>
	<view class="center">
		<cu-custom bgColor="topTitle">
			<block slot="content">测验</block>
		</cu-custom>
		<scroll-view scroll-x class="bg-white nav text-center fixed" :style="[{top:CustomBar + 'px'}]">
			<view class="cu-item" :class="item.tabCode==TabCur?'text-blue cur':''" v-for="(item,index) in tab"
				:key="index" @tap="tabSelect" :data-cur="item.tabCode">
				{{item.tabCur}}
			</view>
		</scroll-view>
		<view v-if="!isBegin && !isRecord" class="exam-choice">
			<view class="exam-choice-title">
				<text>请选择难度</text>
			</view>
			<view class="choice-button">
				<button v-for="(item, index) in questionDifficulty" :key="index" class="cu-btn bg-green shadow"
					@tap="showModal(item,$event)" data-target="modal">{{item.name}}</button>
			</view>
			<view class="cu-modal" :class="modalName=='modal'?'show':''">
				<view class="cu-dialog">
					<view class="cu-bar bg-white justify-end">
						<view class="content">{{modalContent.name}}</view>
						<view class="action" @tap="hideModal">
							<text class="cuIcon-close text-red"></text>
						</view>
					</view>
					<view class="padding-xl">{{modalContent.explain}}</view>
					<view class="cu-bar bg-white justify-end">
						<view class="action">
							<button class="cu-btn bg-green" @tap="toBegin(modalContent)">确定</button>
							<button class="cu-btn line-green text-green margin-left" @tap="hideModal">取消</button>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-if="isBegin && !isRecord" class="exam-question">
			<view class="exam-question-title">
				<view class="cu-progress round xs">
					<view class="bg-red" :style="[{ width: loading ? progressWidth : ''}]"></view>
				</view>
				<text class="count-down">
					<text class="lg text-gray cuIcon-time"></text>
					<text class="time">{{minutes}}:{{seconds}}</text>
				</text>
			</view>
			<view class="exam-question-main">
				<examination-detail :questionDetail="getQuestionDetail"
					@examinationDetailValue="getExaminationDetailValue" :key="examinationDetailKey">
				</examination-detail>
			</view>
			<view class="exam-question-footer">
				<button class="cu-btn bg-green margin-tb-sm" @tap="toPrve(rownum)"
					v-show="!isFirst">{{prveBtn}}</button>
				<button class="cu-btn bg-green margin-tb-sm" @tap="toNext(rownum)">{{nextBtn}}</button>
			</view>
			<view class="cu-modal" :class="modalName=='completeModal'?'show':''">
				<view class="cu-dialog">
					<view class="cu-bar bg-white flex-direction">
						<view class="padding-top">本次测试共有<text
								:class="questionList.length == hasDoneQuestionCount? 'text-green':'text-red'">{{questionList.length}}</text>小题
						</view>
						<view>您已完成<text
								:class="questionList.length == hasDoneQuestionCount? 'text-green':'text-red'">{{hasDoneQuestionCount}}</text>小题
						</view>
					</view>
					<view class="cu-bar bg-white justify-center">
						<view class="action">
							<button class="cu-btn bg-green" @tap="submitExam">确认提交</button>
							<button class="cu-btn line-green text-green margin-left" @tap="hideModal">检查一下</button>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-if="isRecord" class="exam-report">
			<view class="exam-report-title cu-bar solid-bottom">
				<view class="action">
					<text class="cuIcon-title text-blue"></text>历史记录
				</view>
			</view>
			<uni-list ref="list" scroll-y class="exam-report-list listview">
				<view class="exam-report-list-item cu-bar solid-bottom" v-for="(item, index) in reportList" :key="index"
					@tap="getRecordDetail(item.reportId)">
					<text class="shadow bg-cyan">{{item.rowId}}</text>
					<text class="text-xl radius shadow"
						:class="getRecordDifficultyClass(item.examDifficulty)">{{getRecordDifficultyText(item.examDifficulty)}}</text>
					<text class="text-gray">{{item.uploadTime}}</text>
				</view>
			</uni-list>
			<view class="cu-modal report-modal" :class="modalName=='reportModal'?'show':''">
				<view class="cu-dialog">
					<view class="cu-bar bg-white justify-end">
						<view class="content">测验结果</view>
						<view class="action" @tap="hideModal">
							<text class="cuIcon-close text-red"></text>
						</view>
					</view>
					<view class="padding-xl">
						<text>作答人: {{reportItem.from_user}}</text>
						<text>测验难度: {{reportItem.exam_difficulty}}</text>
						<text>测验时间: {{changeTimestampToTime(reportItem.upload_time)}}</text>
					</view>
					<view class="cu-bar bg-white justify-end">
						
					</view>
				</view>
			</view>
		</view>
		<view class="cu-modal" :class="modalName=='showModal'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-center">
					<view class="content">操作超时，请重试</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
			</view>
		</view>
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
	import examinationDetail from '@/pages/components/examination/examination-detail.vue';
	export default {
		components: {
			uniList,
			examinationDetail
		},
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				tab: [],
				TabCur: 'exam',
				scrollLeft: 0,
				progressWidth: '',
				examinationDetailKey: 1,
				isBegin: false,
				isRecord: false,
				isComplete: false,
				examDifficulty: null,
				modalName: null,
				modalContent: {},
				questionDifficulty: [],
				hasDoneQuestionCount: 0,
				loading: true,
				minutes: "00",
				seconds: "00",
				timer: "",
				questionList: [],
				isFirst: true,
				isLast: false,
				prveBtn: '上一题',
				nextBtn: '下一题',
				rownum: 0, //题目游标
				reportList: [],
				reportItem: {}
			};
		},
		created() {
			this.questionDifficulty = [{
				code: 'easy',
				name: '简单',
				explain: '本测验共有20道题，请在20分钟内完成',
				num: 20,
			}, {
				code: 'normal',
				name: '普通',
				explain: '本测验共有30道题，请在30分钟内完成',
				num: 30,
			}, {
				code: 'difficult',
				name: '困难',
				explain: '本测验共有50道题，请在30分钟内完成',
				num: 50,
			}];
			this.tab = [{
				tabCur: '测验',
				tabCode: 'exam'
			}, {
				tabCur: '记录',
				tabCode: 'record'
			}];
			this.getRecordList().catch(err => {
				console.log(err);
			});
		},
		watch: {
			questionList: {
				handler(value) {
					let len = value.filter((i) => i.userAnswer !== null).length;
					if (len > this.hasDoneQuestionCount) {
						this.hasDoneQuestionCount++;
						this.progressWidth = Math.round(this.hasDoneQuestionCount / this.questionList.length * 10000, 2) /
							100 + '%';
					}
				},
				deep: true
			},
			getQuestionDetail() {
				this.examinationDetailKey++;
			}
		},
		computed: {
			...mapState('userStatus', {
				hasLogin: state => state.hasLogin,
				forcedLogin: state => state.forcedLogin,
				userName: state => state.userName
			}),
			changeTimestampToTime: function(){
				return function(time){
					return timestampToTime(time);
				}
			},
			getQuestionDetail: function() {
				return this.questionList[this.rownum];
			},
			getRecordDifficultyText: function() {
				return function(item) {
					switch (item) {
						case 'easy':
							return '简单';
						case 'normal':
							return '中等';
						case 'difficult':
							return '困难';
						default:
							return '';
					}
				}
			},
			getRecordDifficultyClass: function() {
				return function(item) {
					return {
						"bg-olive": item === 'easy',
						"bg-orange": item === 'normal',
						"bg-red": item === 'difficult'
					}
				}
			}
		},
		methods: {
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.cur;
				if (this.TabCur == 'record') {
					this.isRecord = true;
				} else {
					this.isRecord = false;
				}
			},
			showModal(item, e) {
				this.modalName = e.currentTarget.dataset.target;
				this.modalContent = item;
			},
			hideModal(e) {
				this.modalName = null
			},
			async toBegin(item) {
				this.hideModal();
				let _self = this;
				await uniCloud.callFunction({
					name: 'question-handler',
					data: {
						action: 'question-list',
						param: {
							questionNum: item.num
						}
					},
					success: (res) => {
						const data = res.result.data;
						_self.questionList = data.map((question, index) => {
							return {
								rowId: index + 1,
								questionId: question._id,
								questionType: question.question_type,
								questionDifficulty: question.question_difficulty,
								questionContent: question.question_content,
								questionOption: question.question_option,
								questionAnswer: question.question_answer,
								questionExplain: question.question_explain,
								userAnswer: null
							};
						});

						let time = 0;
						_self.isBegin = true;
						switch (item.code) {
							case "easy":
								this.minutes = "20";
								this.seconds = "00";
								time = 1200;
								break;
							case "normal":
							case "difficult":
								this.minutes = "30";
								this.seconds = "00";
								time = 1800;
								break;
							default:
								break;
						}
						_self.examDifficulty = item.code;
						_self.createCountdownTimer(time);
						_self.progressWidth = '0%';
						_self.hasDoneQuestionCount = 0;
					},
					fail: (e) => {
						_self.modalName = 'showModal';
					},
					complete: (e) => {}
				});
			},
			createCountdownTimer(time) {
				this.timer = setInterval(() => {
					time = time - 1;
					this.minutes = parseInt(time / 60).toString().padStart(2, "0");
					this.seconds = parseInt(time % 60).toString().padStart(2, "0");
					if (this.seconds === "00" && this.minutes === "00") {
						this.submitExam();
					}
				}, 1000);
			},
			destroyCountdownTimer() {
				clearInterval(this.timer);
			},
			getExaminationDetailValue(data) {
				this.questionList[this.rownum] = data;
			},
			toPrve(e) {
				this.rownum = e - 1;
				this.isLast = false;
				this.nextBtn = '下一题';
				if (this.rownum == 0) {
					this.isFirst = true;
				} else {
					this.isFirst = false;
				}
			},
			toNext(e) {
				if (!this.isLast) {
					this.rownum = e + 1;
					this.isFirst = false;
					if (this.rownum == this.questionList.length - 1) {
						this.isLast = true;
						this.nextBtn = '完成';
					} else {
						this.isLast = false;
					}
				} else {
					this.modalName = 'completeModal';
				}
			},
			initExam() {

			},
			submitExam(e) {
				this.hideModal();
				this.destroyCountdownTimer();
				this.isBegin = false;
				this.isRecord = true;
				this.TabCur = 'record';
				if (this.hasLogin) {
					this.toSubmitExamData().then(() => {
						this.getRecordList().catch(err => {
							console.log(err);
						});
					}).catch(err => {
						console.log(err);
					})
				}
			},
			toSubmitExamData() {
				return new Promise((resovle, reject) => {
					let _self = this;
					uniCloud.callFunction({
						name: 'question-handler',
						data: {
							action: 'submit-exam-report-data',
							param: {
								examDifficulty: _self.examDifficulty,
								questionList: _self.questionList.map((item) => {
									return {
										question_id: item.questionId,
										user_answer: item.userAnswer ? String.fromCharCode(item
											.userAnswer +
											65) : '' //讲选项数字转成ascii码
									}
								}),
								userName: _self.userName,
								uploadTime: new Date().getTime()
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
							reject();
						},
						complete: (e) => {}
					});
				});
			},
			getRecordList() {
				return new Promise((resovle, reject) => {
					if (this.hasLogin) {
						let _self = this;
						uniCloud.callFunction({
							name: 'question-handler',
							data: {
								action: 'get-report-List',
								param: {
									userName: _self.userName
								}
							},
							success: (res) => {
								if (res.result.code == 0) {
									const data = res.result.data;
									if (data.length > 0) {
										_self.reportList = data.map((report, index) => {
											return {
												rowId: index + 1,
												reportId: report._id,
												uploadTime: timestampToTime(parseInt(report
													.upload_time)),
												examDifficulty: report.exam_difficulty,
											};
										});
									}
									resovle();
								} else {
									reject();
								}
							},
							fail: (e) => {
								reject();
							},
							complete: (e) => {}
						});
					} else {

					}
				});
			},
			async getRecordDetail(reportId) {
				let _self = this;
				await uniCloud.callFunction({
					name: 'question-handler',
					data: {
						action: 'get-report-item',
						param: {
							reportId: reportId
						}
					},
					success: (res) => {
						if(res.result.affectedDocs > 0){
							_self.reportItem = res.result.data[0];
						}
					},
					fail: (e) => {},
					complete: (e) => {}
				})
				this.modalName = 'reportModal';
			}
		}
	}
</script>

<style lang="scss">
	.center {
		display: flex;
		flex-direction: column;

		.exam-choice {
			width: 100vw;
			justify-content: space-around;
			align-items: center;

			.exam-choice-title {
				margin-top: 30px;
				padding: 10px 15px;
				font-size: 18px;
				text-align: center;

				text {
					text-shadow: 1px 1px 1px #ccc;
					font-family: serif;
					font-weight: bold;
				}
			}

			.choice-button {
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				align-items: center;


				button {
					font-size: 20px;
					height: 40px;
					width: 100px;
					margin-top: 60px;
					margin-bottom: 20px;
					line-height: 40px;
					text-align: center;

					&:nth-child(1) {
						background-color: #8dc63f;
						box-shadow: 6upx 6upx 8upx rgba(48, 156, 63, 0.2);
					}

					&:nth-child(2) {
						background-color: #f37b1d;
						box-shadow: 6upx 6upx 8upx rgba(217, 109, 26, 0.2);
					}

					&:nth-child(3) {
						background-color: #e54d42;
						box-shadow: 6upx 6upx 8upx rgba(204, 69, 59, 0.2);
					}
				}

			}
		}

		.exam-question {
			position: relative;
			width: 100vw;
			padding: 10px 15px;

			.exam-question-title {
				position: relative;
				height: 50px;

				.count-down {
					position: absolute;
					right: 0;
					top: 20px;

					.time {
						margin-left: 5px;
					}
				}
			}

			.exam-question-main {}

			.exam-question-footer {
				position: relative;
				margin-top: 20px;
				height: auto;

				button {
					position: absolute;

					&:nth-child(1) {
						left: 20px;
					}

					&:nth-child(2) {
						right: 20px;
					}
				}
			}
		}

		.exam-report {
			height: calc(100% - 45px);
			width: 100vw;
			padding: 5px;

			.exam-report-title {}

			.exam-report-list {
				height: calc(100vh - 200px);
				padding: 10px;

				.exam-report-list-item {
					justify-content: space-around;

					&:active {
						background-color: #dfdfdf;
					}

					text {
						&:nth-child(1) {
							height: 25px;
							width: 25px;
							text-align: center;
							line-height: 25px;
							border-radius: 50%;
						}

						&:nth-child(2) {
							padding: 3px 8px;
						}
					}
				}
			}

			.report-modal {
				.cu-dialog {
					height: 80vh;
				}
			}
		}
	}
</style>
