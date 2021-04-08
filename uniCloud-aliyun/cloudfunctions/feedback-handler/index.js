/**
 * 云函数-意见反馈
 * 20210310
 */
'use strict';

const db = uniCloud.database()
const dbCmd = db.command
const $ = dbCmd.aggregate

exports.main = async (event, context) => {
	let params = event.param || {};
	//event为客户端上传的参数
	console.log('event : ', event);

	let res = {};

	switch (event.action) {
		//意见反馈提交
		case 'submit-feedback-content':
			const submitFeedbackContentCollection = db.collection('application-feedback');
			let count = await submitFeedbackContentCollection.add({
				feedback_user: params.feedbackUser,
				feedback_content: params.feedbackContent,
				feedback_date: params.feedbackDate,
			});
			res = {
				code: 0,
				updateNum: count
			}
			break;
			//题目报错提交
		case 'submit-question-wrong':
			const submitQuestionWrongCollection = db.collection('question-wrong-notes');
			let wrongRes = await submitQuestionWrongCollection.add({
				submit_user: params.submitUser,
				question_id: params.questionId,
				wrong_reason: params.wrongReason,
				submit_date: params.submitDate,
				is_finish: 0
			});
			const updateQuestionWrongCollection = db.collection('question-list');
			let wrongCount = await updateQuestionWrongCollection.where({
				_id: params.questionId
			}).update({
				is_wrong: 1
			})
			res = {
				code: 0,
				updateNum: wrongCount
			}
			break;
		default:
			res = {
				code: 403,
				msg: '非法访问'
			}
			break;
	}

	//返回数据给客户端
	return res
};
