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

	let res = {};

	switch (event.action) {
		case 'question-list':
			const questionListCollection = db.collection('question-list');
			let questionList = await questionListCollection.where(
				dbCmd.or([{
						question_content: new RegExp(params.searchWord, 'i')
					},
					{
						question_tag: new RegExp(params.searchWord, 'i')
					}
				]).and({
					is_auditing: 1
				})
			).orderBy('upload_date', 'desc').get();
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
		case 'get-random-question-item':
			const getRandomQuestionItemCollection = db.collection('question-list');
			let getRandomQuestionItem = await getRandomQuestionItemCollection.aggregate().match({
				is_auditing: 1
			}).sample({
				size: 1
			}).end();
			res = {
				code: 0,
				...getRandomQuestionItem
			}
			break;
		case 'examination-question-list':
			const examinationQuestionListCollection = db.collection('question-list');
			let examinationQuestionList = await examinationQuestionListCollection.aggregate().match({
				question_type: 0,
				is_auditing: 1
			}).sample({
				size: params.questionNum
			}).project({
				_id: 1,
				question_type: 1,
				question_content: 1,
				question_option: 1,
				question_answer: 1,
				question_explain: 1,
				question_difficulty: 1
			}).end();
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
		case 'submit-question':
			const submitQuestionCollection = db.collection('question-list');
			let submitQuestionCount = await submitQuestionCollection.add({
				upload_user: params.uploadUser,
				upload_date: params.uploadDate,
				question_type: params.questionType,
				question_title: params.questionContent,
				question_content: params.questionContent,
				question_option: params.questionOption,
				question_answer: params.questionAnswer,
				question_explain: params.questionExplain,
				is_wrong: 0,
				question_tag: params.questionTag,
				question_difficulty: params.questionDifficulty,
				is_auditing: 0
			});
			res = {
				code: 0,
				updateNum: submitQuestionCount
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
