const state = () => ({
	/**
	 * 是否需要强制登录
	 */
	forcedLogin: false,
	hasLogin: false,
	userName: "",
	univerifyErrorMsg: "",
	hideUniverify: true
});

const mutations = {
	login(state, userName) {
		state.userName = userName || '新用户';
		state.hasLogin = true;
	},
	logout(state) {
		state.userName = "";
		state.hasLogin = false;
	},
	setUniverifyErrorMsg(state, payload = '') {
		state.univerifyErrorMsg = payload
	},
	setHideUniverify(state, payload = false) {
		state.hideUniverify = payload
	}
}

export default {
	namespaced: true,
	state,
	mutations
}
