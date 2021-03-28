/**
 * 云函数-试题操作
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
		case 'question-list':
			const questionListCollection = db.collection('question-list');
			let questionList = await questionListCollection.orderBy('upload_date', 'desc').get();
			res = {
				code: 0,
				...questionList
			}
			break;
		case 'question-item':
			const questionItemCollection = db.collection('question-list');
			let questionItem = await questionItemCollection.where({
				_id: params.questionId
			}).get();
			res = {
				code: 0,
				...questionItem
			}
			break;
		case 'examination-question-list':
			const examinationQuestionListCollection = db.collection('question-list');
			let examinationQuestionList = await examinationQuestionListCollection.limit(params.questionNum)
				.field({
					_id: true,
					question_type: true,
					question_content: true,
					question_option: true,
					question_answer: true,
					question_explain: true,
					question_difficulty: true
				}).get();
			res = {
				code: 0,
				...examinationQuestionList
			}
			break;
		case 'submit-exam-report-data':
			const userQuestionReportCollection = db.collection('user-question-report');
			let count = await userQuestionReportCollection.add({
				from_user: params.userName,
				upload_time: params.uploadTime,
				exam_difficulty: params.examDifficulty,
				exam_score: params.reportScore,
				question_list: params.questionList
			})
			res = {
				code: 0,
				updateNum: count
			}
			break;
		case 'get-report-List':
			const getReportListCollection = db.collection('user-question-report');
			let userReportList = await getReportListCollection.where({
				from_user: params.userName
			}).field({
				_id: true,
				upload_time: true,
				exam_difficulty: true,
				exam_score: true
			}).orderBy('upload_time', 'desc').get();
			res = {
				code: 0,
				...userReportList
			}
			break;
		case 'get-report-item':
			const getReportItemCollection = db.collection('user-question-report');
			let reportItem = await getReportItemCollection.where({
				_id: params.reportId
			}).get();
			let reportItemQuestionList = await getReportItemCollection.aggregate().match({
				_id: params.reportId
			}).unwind({
				path: '$question_list',
				preserveNullAndEmptyArrays: true
			}).replaceRoot({
				newRoot: '$question_list'
			}).lookup({
				from: 'question-list',
				let: {
					questionId: '$question_id'
				},
				pipeline: $.pipeline()
					.match(dbCmd.expr($.eq(['$_id', '$$questionId']))).done(),
				as: "question_info"
			}).project({
				user_answer: 1,
				question_info: 1
			}).end();
			
			reportItem.data[0].question_list = reportItemQuestionList.data;

			res = {
				code: 0,
				...reportItem
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
