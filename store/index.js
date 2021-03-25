import Vue from 'vue'
import Vuex from 'vuex'
import userInfo from '@/store/modules/userStatus.js'
// import sideslip from '@/store/modules/sideslip.js'

Vue.use(Vuex)

const store = new Vuex.Store({
	modules: {
		userInfo,
		// sideslip
	}
})

export default store
