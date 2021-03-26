import Vue from 'vue'
import Vuex from 'vuex'
import userStatus from '@/store/modules/userStatus.js'
// import sideslip from '@/store/modules/sideslip.js'

Vue.use(Vuex)

const store = new Vuex.Store({
	modules: {
		userStatus,
		// sideslip
	}
})

export default store
