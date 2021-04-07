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
				<textarea maxlength="-1" :disabled="modalName!=null" @input="textareaQuestionContent"
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
				<textarea maxlength="-1" :disabled="modalName!=null" @input="textareaAnswer"
					placeholder="输入题目答案"></textarea>
			</view>
			<view class="cu-form-group align-start">
				<view class="title">解析</view>
				<textarea maxlength="-1" :disabled="modalName!=null" @input="textareaExplain"
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
	</view>
</template>

<script>
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
				modalName: null,
				questionTypeIndex: 0,
				questionTypePicker: ['选择题', '简述题'],
				questionDifficultyIndex: 0,
				questionDifficultyPicker: ['简单', '中等', '困难'],
				tagInput: '',
				questionTagList: [],
				questionOptionIndex: 0,
				questionOptionList: [],
				isAnswer: true,
				questionContent: '',
				questionAnswer: '',
				questionExplain: '',
			}
		},
		watch: {
			questionOptionIndex: function() {
				this.questionOptionList.map((item, index) => {
					item.is_answer = index == this.questionOptionIndex ? true : false;
				});
			}
		},
		methods: {
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
					this.msgType = 'error'
					this.message = '标签内容不能为空';
					this.$refs.popupMessage.open()
					return;
				}
				if (this.questionTagList.indexOf(this.tagInput) > -1) {
					this.msgType = 'error'
					this.message = '该标签已添加';
					this.$refs.popupMessage.open()
					return;
				}
				if (this.questionTagList.length >= 5) {
					this.msgType = 'error'
					this.message = '最多可以添加5个标签';
					this.$refs.popupMessage.open()
					return;
				}
				this.questionTagList.push(this.tagInput);
			},
			clearTag(index) {
				this.questionTagList.splice(index, 1);
			},
			addOption() {
				if (this.questionOptionList.length >= 5) {
					this.msgType = 'error'
					this.message = '最多可以添加5个选项';
					this.$refs.popupMessage.open()
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
				this.questionOptionIndex = index <= this.questionOptionIndex ? this.questionOptionIndex-1 : this.questionOptionIndex;
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
			submit() {
				let checkOptionIsNull = false;
				this.questionOptionList.forEach((item,index)=>{
					if(item.choice_content == ""){
						checkOptionIsNull = true;
						return;
					}
				})
				if(checkOptionIsNull){
					this.msgType = 'error'
					this.message = '不允许有空内容选项';
					this.$refs.popupMessage.open()
					return;
				}
				let hash = {};
				this.questionOptionList.forEach((item,index)=>{
					if(!hash[item.choice_content]){
						hash[item.choice_content] = item.choice_content;
					}else{
						checkOptionIsNull = true
					}
				})
				if(checkOptionIsNull){
					this.msgType = 'error'
					this.message = '不允许有重复选项';
					this.$refs.popupMessage.open()
					return;
				}
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
