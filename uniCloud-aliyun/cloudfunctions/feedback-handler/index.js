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
	console.log('params : ', params);

	let res = {};

	switch (event.action) {
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
