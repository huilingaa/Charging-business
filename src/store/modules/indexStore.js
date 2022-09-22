import API from '../../api/index'
import {
  isEmpty
} from '../../utils/index.js'

// 首页模块
export default (handleRequest) => {
  const state = {
    currentTowerId: uni.getStorageSync('currentTowerId'),
    currentTower: uni.getStorageSync('currentTower') || {}, // 当前塔
    towerList: uni.getStorageSync('towerList'), // 所有塔的简略信息
  }

  const getters = {}

  const mutations = {
    SET_TOWER_LIST(state, list) {
      state.towerList = list
      uni.setStorage({
        key: 'towerList',
        data: list || []
      })
    },

    SET_CURRENT_TOWER(state, data) {
      console.log('SET_CURRENT_TOWER', data);
      state.currentTower = data
      uni.setStorage({
        key: 'currentTower',
        data: data || {}
      })
    },

    SET_CUURRENTTOWER_ID(state, id) {
      state.currentTowerId = id
      uni.setStorage({
        key: 'currentTowerId',
        data: id
      })
    },
  }

  const actions = {
    // 首页查询所有塔的信息
    getTowerList({
      commit,
      dispatch,
      state
    }, params = {}) {
      return handleRequest.get(API["index.dotaList"], {}, {
        params,
        err: true,
        loading: true,
        id: 'index.dotaList'
      }).then((data = {}) => {
        // console.log('首页查询所有塔的信息 >>>>>>', data);
        const rows = data.data || [{}]

        // // 如果没有选中的塔
        if (!state.currentTower || !state.currentTowerId) {
          // commit('SET_CUURRENTTOWER_ID', rows[0].dotaId || '')
          dispatch('getCurrentTower', rows[0].dotaId || '')
        } else if(state.currentTowerId) {
          dispatch('getCurrentTower', state.currentTowerId)
        }

        commit('SET_TOWER_LIST', rows)
        return rows
      })
    },

    // 获取单个塔信息
    getCurrentTower({
      commit,
      state
    }, id) {

      console.log('dotaID++++',id);

      return handleRequest.get(API["index.dotaone"], {
        dotaId: id
      }, {
        err: true,
        loading: true,
        id: 'index.dotaone'
      }).then((res = {}) => {
        commit('SET_CURRENT_TOWER', res.data || {})
        commit('SET_CUURRENTTOWER_ID', res.data.dotaId || '')
        return res.data
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
