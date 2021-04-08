<template>
	<view class="center">
		<form class="add-form">
			<view class="cu-form-group">
				<view class="title">类型</view>
				<picker @change="questionTypeChange" :value="questionTypeIndex" :range="questionTypePicker">
					<view class="picker">
						{{questionTypePicker[questionTypeIndex]}}
					</view>
				</picker>
			</view>
			<view class="cu-form-group">
				<view class="title">难度</view>
				<picker @change="questionDifficultyChange" :value="questionDifficultyIndex"
					:range="questionDifficultyPicker">
					<view class="picker">
						{{questionDifficultyPicker[questionDifficultyIndex]}}
					</view>
				</picker>
			</view>
			<view class="cu-form-group">
				<view class="title">添加标签</view>
				<input maxlength="20" placeholder="输入标签" name="input" v-model="tagInput"></input>
				<button class="cu-btn cuIcon-add bg-green shadow" @tap="addTag"></button>
			</view>
			<view class="tag-content padding-sm flex flex-wrap">
				<view class="tag-content-item padding-xs" v-for="(item,index) in questionTagList" :key="index">
					<view class="remove-btn" @tap="clearTag(index)">×</view>
					<view class='cu-tag bg-blue radius'>{{item}}</view>
				</view>
			</view>

			<view class="cu-form-group align-start margin-top">
				<view class="title">题目</view>
				<textarea maxlength="100" v-model="questionContent" :disabled="modalName!=null" @input="textareaQuestionContent"
					placeholder="输入题目内容"></textarea>
			</view>
			<view class="cu-form-group" v-if="!questionTypeIndex">
				<view class="title">添加选项</view>
				<button class="cu-btn cuIcon-add bg-green shadow" @tap="addOption"></button>
			</view>
			<radio-group class="question-option-container" @change="radioChange">
				<view class="cu-form-group" v-for="(item,index) in questionOptionList" :key="index">
					<view class="title">{{item.choice_code}}</view>
					<input placeholder="输入选项内容" name="input" @input="textareaOptionConetntInput(index,$event)"></input>
					<radio :value="item.choice_code" :checked="index == questionOptionIndex" />
					<button class="cu-btn cuIcon-delete bg-green shadow margin-left"
						@tap="removeOption(index)"></button>
				</view>
			</radio-group>

			<view class="cu-form-group align-start margin-top">
				<view class="title">答案</view>
				<textarea maxlength="-1" v-model="questionAnswer" :disabled="modalName!=null" @input="textareaAnswer"
					placeholder="输入题目答案"></textarea>
			</view>
			<view class="cu-form-group align-start">
				<view class="title">解析</view>
				<textarea maxlength="-1" v-model="questionExplain" :disabled="modalName!=null" @input="textareaExplain"
					placeholder="输入题目解析"></textarea>
			</view>
		</form>
		<view class="add-btn flex flex-direction">
			<button class="cu-btn bg-green margin-tb-lg lg" @tap="submit">提交</button>
		</view>
		<!-- 消息提示 -->
		<uni-popup id="popupMessage" ref="popupMessage" type="message">
			<uni-popup-message :type="msgType" :message="message" :duration="2000"></uni-popup-message>
		</uni-popup>
		<!-- 对话框 -->
		<uni-popup id="popupDialog" ref="popupDialog" type="dialog">
			<uni-popup-dialog type="success" title="提示" :content="dialogContent" :before-close="true"
				@confirm="dialogConfirm" @close="dialogClose"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex';
	import uniPopupMessage from '@/pages/components/uniUi/uni-popup-message/uni-popup-message.vue'
	import uniPopup from '@/pages/components/uniUi/uni-popup/uni-popup.vue'
	import uniPopupDialog from '@/pages/components/uniUi/uni-popup-dialog/uni-popup-dialog.vue'
	import {
		deepCopy
	} from '@/common/util.js'
	export default {
		components: {
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
				questionTypeIndex: 0,
				questionTypePicker: ['选择题', '简述题'],
				questionDifficultyIndex: 0,
				questionDifficultyPicker: ['简单', '中等', '困难'],
				tagInput: '',
				questionTagList: [],
				questionOptionIndex: 0,
				questionOptionList: [],
				questionContent: '',
				questionAnswer: '',
				questionExplain: '',
			}
		},
		watch: {
			questionContent: function() {
				if (this.questionContent.length >= 100) {
					this.popupShow('error', '题目不能超过100个字');
				}
			},
			questionOptionIndex: function() {
				this.questionOptionList.map((item, index) => {
					item.is_answer = index == this.questionOptionIndex ? true : false;
				});
			}
		},
		computed: {
			...mapState('userStatus', {
				hasLogin: state => state.hasLogin,
				userName: state => state.userName
			}),
		},
		methods: {
			initPage() {
				this.questionTypeIndex = 0;
				this.questionDifficultyIndex = 0;
				this.tagInput = '';
				this.questionTagList = [];
				this.questionOptionIndex = 0;
				this.questionOptionList = [];
				this.questionContent = '';
				this.questionAnswer = '';
				this.questionExplain = '';
			},
			popupShow(type, msg) {
				this.msgType = type;
				this.message = msg;
				this.$refs.popupMessage.open()
			},
			questionTypeChange(e) {
				this.questionTypeIndex = e.detail.value
			},
			questionDifficultyChange(e) {
				this.questionDifficultyIndex = e.detail.value
			},
			textareaQuestionContent(e) {
				this.questionContent = e.detail.value
			},
			textareaAnswer(e) {
				this.questionAnswer = e.detail.value
			},
			textareaExplain(e) {
				this.questionExplain = e.detail.value
			},
			addTag() {
				if (this.tagInput == "") {
					this.popupShow('error', '标签内容不能为空');
					return;
				}
				if (this.questionTagList.indexOf(this.tagInput) > -1) {
					this.popupShow('error', '该标签已添加');
					return;
				}
				if (this.questionTagList.length >= 5) {
					this.popupShow('error', '最多可以添加5个标签');
					return;
				}
				this.questionTagList.push(this.tagInput);
				this.tagInput = '';
			},
			clearTag(index) {
				this.questionTagList.splice(index, 1);
			},
			addOption() {
				if (this.questionOptionList.length >= 5) {
					this.popupShow('error', '最多可以添加5个选项');
					return;
				}
				let obj = {
					choice_code: String.fromCharCode(this.questionOptionList.length + 65),
					choice_content: "",
					is_answer: (this.questionOptionList.length == this.questionOptionIndex) ? true : false
				}
				this.questionOptionList.push(obj);
			},
			removeOption(index) {
				let tempArray = deepCopy(this.questionOptionList);
				tempArray.splice(index, 1);
				this.questionOptionList = this.updateQuestionOptionList(tempArray);
				this.questionOptionIndex = index <= this.questionOptionIndex ? this.questionOptionIndex - 1 : this
					.questionOptionIndex;
			},
			updateQuestionOptionList(questionOptionArray) {
				if (!Array.isArray(questionOptionArray)) {
					return;
				}
				questionOptionArray.map((item, index) => {
					item.choice_code = String.fromCharCode(index + 65);
				});
				return questionOptionArray;
			},
			textareaOptionConetntInput(index, e) {
				this.questionOptionList[index].choice_content = e.detail.value;
			},
			radioChange(evt) {
				for (let i = 0; i < this.questionOptionList.length; i++) {
					if (this.questionOptionList[i].choice_code === evt.target.value) {
						this.questionOptionIndex = i;
						break;
					}
				}
			},
			checkForm() {
				if (this.questionTagList.length == 0) {
					this.popupShow('error', '至少需要添加1个标签');
					return false;
				}
				//选择题才需要对选项做判断
				if (this.questionTypeIndex == 0) {
					let checkOptionIsNull = false;
					this.questionOptionList.forEach((item, index) => {
						if (item.choice_content == "") {
							checkOptionIsNull = true;
							return;
						}
					})
					if (checkOptionIsNull) {
						this.popupShow('error', '不允许有空内容选项');
						return false;
					}
					let hash = {};
					this.questionOptionList.forEach((item, index) => {
						if (!hash[item.choice_content]) {
							hash[item.choice_content] = item.choice_content;
						} else {
							checkOptionIsNull = true
						}
					})
					if (checkOptionIsNull) {
						this.popupShow('error', '不允许有重复选项');
						return false;
					}
				}
				if (this.questionContent == '') {
					this.popupShow('error', '题目内容不能为空');
					return false;
				}
				if (this.questionAnswer == '') {
					this.popupShow('error', '题目答案不能为空');
					return false;
				}
				if (this.questionExplain == '') {
					this.popupShow('error', '题目解析不能为空');
					return false;
				}
				return true;
			},
			submit() {
				if (!this.checkForm()) {
					return;
				}
				this.dialogContent = '确认上传题目';
				this.$refs.popupDialog.open();
			},
			dialogConfirm(done) {
				this.submitQuestion().then(() => {
					this.popupShow('success', '上传成功，感谢您对题库的贡献');
					done()
				}).then(()=>{
					this.initPage();
				});
			},
			dialogClose(done) {
				this.popupShow('info', '您取消了上传');
				done()
			},
			submitQuestion() {
				return new Promise((resovle, reject) => {
					let _self = this;
					if (this.hasLogin) {
						uniCloud.callFunction({
							name: 'question-handler',
							data: {
								action: 'submit-question',
								param: {
									uploadUser: _self.userName,
									uploadDate: new Date().getTime(),
									questionType: _self.questionTypeIndex,
									questionContent: _self.questionContent,
									questionOption: _self.questionTypeIndex ? null : _self
										.questionOptionList,
									questionAnswer: _self.questionAnswer,
									questionExplain: _self.questionExplain,
									questionTag: _self.questionTagList,
									questionDifficulty: _self.questionDifficultyIndex + 1,
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
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.center {
		.add-form {
			.tag-content {
				.tag-content-item {
					position: relative;

					.remove-btn {
						width: 15px;
						height: 15px;
						position: absolute;
						top: -2px;
						right: -2px;
						border-radius: 50%;
						z-index: 1;
						background-color: #a3a3a3;
						color: #ffffff;
						text-align: center;
						line-height: 15px;
					}
				}
			}

			.question-option-container {
				border-top: 1upx solid #eee;
				width: 100%;
			}

		}

		.add-btn {
			padding: 0 10px;
		}
	}
</style>
