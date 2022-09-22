import NODE_API from '../../api/node.js'

// 资产
export default (handleRequest) => {
  const state = {
    assets: uni.getStorageSync('assets') || []
  }

  const getters = {}

  const mutations = {
    SAVE_USER_ASSET(state, list) {
      state.assets = list
      uni.setStorage({
        key: 'assets',
        data: list
      })      
    }
  }



  const actions = {
    // 购买节点
    buyNode({
      commit,
      dispatch,
      state
    }, dotaId) {
      return handleRequest.post(NODE_API["node.buy"], {
        dotaId: dotaId
      }, {
        err: true,
        loading: true,
        id: 'node.buy'
      }).then((res = {}) => {
        // console.log('购买节点', res);
        // commit('SET_CURRENT_TOWER', res.data || {})
        return res.data
      })
    },

    // 获取资产
    getAssets({
      state,commit
    }) {
      return handleRequest.get('/api/core/account/accounts', {}, {
        err: true,
        loading: true,
        id: 'getAssets'
      }).then((res = {}) => {
        console.log('获取资产 >>>>>>>>>>>>>>>', res);
        commit('SAVE_USER_ASSET', res || [])
        return res
      })
    }

  }

  return {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
  }
}
