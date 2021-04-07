export function timestampToTime(timestamp) {
	var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
	var Y = date.getFullYear() + '-';
	var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
	var D = date.getDate().toString().padStart(2, "0") + ' ';
	var h = date.getHours().toString().padStart(2, "0") + ':';
	var m = date.getMinutes().toString().padStart(2, "0") + ':';
	var s = date.getSeconds().toString().padStart(2, "0");
	return Y + M + D + h + m + s;
}

export function getDeviceUUID() {
	let deviceId = uni.getStorageSync('uni_deviceId') ||
		uni.getSystemInfoSync().deviceId ||
		uni.getSystemInfoSync().system + '_' + Math.random().toString(36).substr(2);

	uni.setStorageSync('uni_deviceId', deviceId)
	return deviceId;
}

export function deepCopy(obj) {
	let itemObj = Array.isArray(obj) ? [] : {}
	if (typeof obj !== 'object') {
		return obj;
	} else {
		for (let i in obj) {
			if (typeof obj[i] === 'object') {
				itemObj[i] = deepCopy(obj[i]);
			} else {
				itemObj[i] = obj[i];
			}
		}
		return itemObj;
	}
}
