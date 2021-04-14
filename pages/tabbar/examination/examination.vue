<template>
	<view class="center">
		<!-- 		<cu-custom bgColor="topTitle">
			<block slot="content">测验</block>
		</cu-custom> -->
		<scroll-view scroll-x class="tab-scroll bg-white nav text-center fixed">
			<view class="cu-item" :class="item.tabCode==TabCur?'text-blue cur':''" v-for="(item,index) in tab"
				:key="index" @tap="tabSelect" :data-cur="item.tabCode">
				{{item.tabCur}}
			</view>
		</scroll-view>
		<view class="exam-container" :style="[{top:CustomBar + 'px'}]">
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
					<view class="text-red warn-text">
						<text>*测验开始请不要切换页面，否则将强制提交结果</text>
					</view>
				</view>
				<view class="exam-question-main">
					<examination-detail v-if="hackReset" :questionDetail="getQuestionDetail"
						@examinationDetailValue="getExaminationDetailValue">
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
				<view class="exam-report-login" v-if="!hasLogin">
					<view class="padding flex flex-direction">
						<button class="cu-btn bg-green margin-tb-lg lg" @tap="toLogin">欢迎登录</button>
					</view>
				</view>
				<view class="page-news">
					<uni-list v-if="hasLogin" ref="list" scroll-y class="exam-report-list listview">
						<view class="exam-report-list-item cu-bar solid-bottom" v-for="(item, index) in reportList"
							:key="index" @tap="getRecordDetail(item.reportId)">
							<text class="shadow bg-cyan">{{item.rowId}}</text>
							<text class="text-xl radius shadow" :class="{'bg-olive': item.examDifficulty==='easy'
							, 'bg-orange' : item.examDifficulty==='normal' , 'bg-red' :
							item.examDifficulty==='difficult' }">{{getRecordDifficultyText(item.examDifficulty)}}</text>
							<text :class="item.examScore < 60 ? 'text-red' : 'text-green' ">{{item.examScore}}分</text>
							<text class="text-gray">{{item.uploadTime}}</text>
						</view>
					</uni-list>
				</view>
				<view class="cu-modal report-modal" :class="modalName=='reportModal'?'show':''">
					<view class="cu-dialog">
						<view class="cu-bar bg-white justify-end">
							<view class="content">测验结果</view>
							<view class="action" @tap="hideModal">
								<text class="cuIcon-close text-red"></text>
							</view>
						</view>
						<view class="cu-bar bg-white justify-around">
							<view class="report-modal-info">
								<view>作答人: {{reportItem.from_user}}</view>
								<view>难度: {{getRecordDifficultyText(reportItem.exam_difficulty)}}</view>
							</view>
							<view class="report-modal-info">
								<view>分数: {{reportItem.exam_score}}</view>
								<view>{{changeTimestampToTime(reportItem.upload_time)}}</view>
							</view>
						</view>
						<view class="report-modal-question">
							<uni-list v-if="hackReset" ref="list" :scroll-y="true"
								class="report-modal-question-list listview">
								<view class="report-modal-question-list-item cu-bar solid-bottom"
									v-for="(item, index) in reportItem.question_list" :key="index">
									<view class="list-item-question-content">
										<text>{{item.rowId}}.{{item.question_content}}</text>
									</view>
									<view class="list-item-question-option" v-for="(qo, idx) in item.question_option"
										:key="idx">
										<text :class="qo.is_answer ? 'bg-green' : ''">{{qo.choice_code}}</text>
										<text>{{qo.choice_content}}</text>
									</view>
									<view class="list-item-user-answer">
										<text>您选择的答案：{{item.user_answer}}</text>
									</view>
								</view>
							</uni-list>
						</view>
					</view>
				</view>
			</view>
		</view>
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
		mapMutations
	} from 'vuex';
	import {
		univerifyLogin
	} from '@/common/univerify.js';
	import {
		timestampToTime
	} from '@/common/util.js';
	import uniList from '@/pages/components/colorUi/uni-list.vue';
	import examinationDetail from '@/pages/components/examination/examination-detail.vue';
	import uniPopupMessage from '@/pages/components/uniUi/uni-popup-message/uni-popup-message.vue'
	import uniPopup from '@/pages/components/uniUi/uni-popup/uni-popup.vue'
	import uniPopupDialog from '@/pages/components/uniUi/uni-popup-dialog/uni-popup-dialog.vue'
	export default {
		components: {
			uniList,
			examinationDetail,
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
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				tab: [], //tab列表
				TabCur: 'exam', //tab选中样式
				progressWidth: '', //答题完成情况进度条
				isBegin: false, //是否开始答题
				isRecord: false, //是否是查询记录
				isComplete: false, //是否完成
				examDifficulty: null, //测验难度
				modalName: null, //当前模态框
				modalContent: {}, //模态框内容
				questionDifficulty: [], //测验各难度说明
				hasDoneQuestionCount: 0, //已作答题目数
				loading: true, //进度条开启
				minutes: "00", //倒计时-分
				seconds: "00", //倒计时-秒
				timer: "", //计时器
				questionList: [], //测验题目列表
				isFirst: true, //是否处于第一题
				isLast: false, //是否最后一题
				prveBtn: '上一题',
				nextBtn: '下一题',
				rownum: 0, //题目游标
				reportList: [], //报告列表
				reportItem: {}, //测验报告明细
				hackReset: false //组件刷新标志
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
		onLoad() {
			let uniIdToken = uni.getStorageSync('uni_id_token')
			if (uniIdToken) {
				this.login(uni.getStorageSync('username'))
				uniCloud.callFunction({
					name: 'user-center',
					data: {
						action: 'checkToken',
					},
					success: (e) => {
			
						if (e.result.code > 0) {
							//token过期或token不合法，重新登录
							if (this.forcedLogin) {
								uni.reLaunch({
									url: '/pages/user/login/login'
								});
							} else {
								this.logout();
							}
						}
					},
					fail(e) {
						uni.showModal({
							content: JSON.stringify(e),
							showCancel: false
						})
					}
				})
			}
		},
		onHide() {
			if(this.isBegin && this.questionList.length > 0){
				this.submitExam();
			}
		},
		watch: {
			getQuestionDetail() {
				this.hackReset = false;
				this.$nextTick(() => {
					this.hackReset = true;
				});
			},
			reportItem() {
				this.hackReset = false;
				this.$nextTick(() => {
					this.hackReset = true;
				});
			},
			hasLogin() {
				this.getRecordList().catch((res) => {
					console.log(res);
				});
			}
		},
		computed: {
			...mapState('userStatus', {
				hasLogin: state => state.hasLogin,
				forcedLogin: state => state.forcedLogin,
				userName: state => state.userName
			}),
			changeTimestampToTime: function() {
				return function(time) {
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
			...mapMutations('userStatus', ['logout','login']),
			popupShow(type, msg) {
				this.msgType = type;
				this.message = msg;
				this.$refs.popupMessage.open()
			},
			dialogConfirm(done) {
				this.submitExam();
				done()
			},
			dialogClose(done) {
				done()
			},
			resComponent() {
				this.hackReset = false;
				this.$nextTick(() => {
					this.hackReset = true;
				});
			},
			tabSelect(e) {
				if (this.isBegin) {
					this.dialogContent = '确认结束测验';
					this.$refs.popupDialog.open();
					return;
				}
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
			toLogin() {
				if (!this.hasLogin) {
					univerifyLogin().catch(err => {
						if (err === false) return;

						uni.navigateTo({
							url: '/pages/user/login/login',
						});
					})
				}
			},
			async toBegin(item) {
				let _self = this;
				await uniCloud.callFunction({
					name: 'question-handler',
					data: {
						action: 'examination-question-list',
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
						_self.createCountdownTimer(time);
						_self.examDifficulty = item.code;
						_self.initExam();
					},
					fail: (e) => {
						_self.popupShow('error', '操作超时，请重试');
					},
					complete: (e) => {
						_self.hideModal();
					}
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
				let len = this.questionList.filter((i) => i.userAnswer !== null).length;
				if (len > this.hasDoneQuestionCount) {
					this.hasDoneQuestionCount++;
					this.progressWidth = Math.round(this.hasDoneQuestionCount / this.questionList.length * 10000, 2) /
						100 + '%';
				}
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
				this.isFirst = true;
				this.isLast = false;
				this.isBegin = true;
				this.rownum = 0;
				this.progressWidth = '0%';
				this.hasDoneQuestionCount = 0;
				this.nextBtn = '下一题';
				this.reportItem = {};
			},
			submitExam(e) {
				this.hideModal();
				this.destroyCountdownTimer();
				this.isBegin = false;
				this.isRecord = true;
				this.TabCur = 'record';

				this.toSubmitExamData().then(() => {
					this.getRecordList().catch(err => {
						console.log(err);
					});
				}).catch(err => {
					console.log(err);
				})
			},
			toSubmitExamData() {
				return new Promise((resovle, reject) => {
					let _self = this;
					let score = _self.getReportScore(_self.questionList);
					let answerTime = new Date().getTime();
					if (this.hasLogin) {
						uniCloud.callFunction({
							name: 'question-handler',
							data: {
								action: 'submit-exam-report-data',
								param: {
									examDifficulty: _self.examDifficulty,
									questionList: _self.questionList.map((item) => {
										return {
											question_id: item.questionId,
											user_answer: item.userAnswer != null ? String
												.fromCharCode(
													item
													.userAnswer +
													65) : '' //讲选项数字转成ascii码
										}
									}),
									reportScore: score,
									userName: _self.userName,
									uploadTime: answerTime
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
						});
					}
					let arrQuestionList = _self.questionList.map((item, index) => {
						return {
							rowId: index + 1,
							user_answer: item.userAnswer != null ? String
								.fromCharCode(item
									.userAnswer +
									65) : '未答',
							question_content: item.questionContent,
							question_option: item.questionOption
						}
					});
					_self.reportItem = {
						exam_difficulty: _self.examDifficulty,
						from_user: _self.userName,
						upload_time: answerTime,
						exam_score: score,
						question_list: arrQuestionList
					}
					_self.modalName = 'reportModal';
				});
			},
			getReportScore(questionList) {
				if (!Array.isArray(questionList)) {
					return;
				}
				let trueAnswerNum = 0;
				questionList.map((item) => {
					return {
						answer: item.questionOption.filter((itemOption) => {
							return itemOption.is_answer
						}),
						userAnswer: item.userAnswer
					}
				}).forEach((i) => {
					if (i.answer[0].choice_code === (i.userAnswer != null ? String.fromCharCode(i
							.userAnswer +
							65) : '')) {
						trueAnswerNum++;
					}
				});
				return Math.floor(trueAnswerNum / questionList.length * 100);
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
												examScore: report.exam_score
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
						this.reportList = [];
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
						if (res.result.affectedDocs > 0) {
							_self.reportItem = res.result.data[0];
							const data = res.result.data[0].question_list;
							let arrQuestionList = data.map((item, index) => {
								return {
									rowId: index + 1,
									user_answer: item.user_answer ? item.user_answer : '未答',
									question_content: item.question_info[0].question_content,
									question_option: item.question_info[0].question_option
								}
							});
							_self.reportItem.question_list = arrQuestionList;
						}
						this.modalName = 'reportModal';
					},
					fail: (e) => {},
					complete: (e) => {}
				})
			}
		}
	}
</script>

<style lang="scss">
	.center {
		display: flex;
		flex-direction: column;

		.tab-scroll {
			/* #ifndef MP-WEIXIN */
			top: 45px;
			/* #endif */
		}

		.exam-container {
			/* #ifdef MP-WEIXIN */
			height: calc(100vh - 60px);
			/* #endif */
			/* #ifndef MP-WEIXIN */
			height: calc(100vh - 150px);
			/* #endif */
			margin-top: 45px;

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
					height: 40px;

					.count-down {
						position: absolute;
						right: 0;
						top: 20px;

						.time {
							margin-left: 5px;
						}
					}

					.warn-text {
						margin-top: 5px;
						font-size: 10px;
						font-family: serif;
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
				height: 100%;
				width: 100vw;
				padding: 5px;

				.exam-report-title {}

				.exam-report-login {}

				.page-news {
					display: flex;
					height: calc(100% - 50px);
					flex: 1;
					flex-direction: column;
					left: 0;
					top: 0;
					right: 0;
					bottom: 0;

					.exam-report-list {
						height: 100%;
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

								&:nth-child(3) {
									height: 25px;
									width: 50px;
									padding: 3px 8px;
									line-height: 25px;
									text-align: center;
								}
							}
						}
					}
				}


				.report-modal {
					.cu-dialog {
						height: 80vh;

						.report-modal-info {
							view {
								margin: 10px 15px;
							}
						}

						.report-modal-question {
							/* #ifdef MP-WEIXIN */
							height: calc(100% - 120px);
							/* #endif */
							padding: 5px;

							.report-modal-question-list {
								height: calc(80vh - 150px);

								.report-modal-question-list-item {
									flex-direction: column;
									align-items: self-start;
									margin: 10px 5px;
									padding: 5px 15px;
									font-size: 15px;
									text-align: start;

									.list-item-question-content {}

									.list-item-question-option {
										margin-top: 10px;

										text {
											&:nth-child(1) {
												display: inline-block;
												height: 20px;
												width: 20px;
												text-align: center;
												line-height: 20px;
												border-radius: 50%;
												margin-right: 10px;
												border: #39b54a 1px solid;
											}
										}
									}

									.list-item-user-answer {
										margin-top: 10px;
									}
								}
							}
						}
					}
				}
			}
		}
	}
</style>
