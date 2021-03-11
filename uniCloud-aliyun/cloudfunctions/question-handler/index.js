/**
 * 云函数-试题操作
 * 20210310
 */
'use strict';

const db = uniCloud.database()
const dbCmd = db.command

exports.main = async (event, context) => {
	let params = event.param || {};
	//event为客户端上传的参数
	console.log('event : ', event);

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
