import Vuex from 'vuex'
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    localApps: [],
    downList: [],
    updateNum: 0,
    updataList: [],
    users: '123'
  },

  actions: {
    FETCH_USER({ commit }, { id }) {
      // 获取新的用户数据，然后提交给 mutation
      // return fetchUser(id).then(user => commit('SET_USER', { user}))
    }
  },

  mutations: {
    SET_USER(state, { user }) {
      // 修改 users 中的数据，并且触发界面更新
      // Vue.set(state.users, user.id, user)
    },
    localApps(state, arr) {
      console.log('存储本地应用-----------')
      let newArr = []
      for (let i = 0; i < arr.length; i++) {
        const element = arr[i].update
        if (element) {
          newArr.push(arr[i])
        }
      }
      state.updateNum = newArr.length
      state.updataList = newArr
      state.localApps = arr
    },
    downList(state, packageName) {
      console.log('下载队列更新=============')
      state.downList.push(packageName)
    },
    popList(state, packageName) {
      console.log('剔除下载队列=========', packageName)
      state.downList.shift()
    },
    updataList(state, arr) {
      console.log('本地应用需更新列表')
    }
  }

})
