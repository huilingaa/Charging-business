//! 全局store

export default (handleRequest) => {
  const state = {
    networkType: '', // 网络状态
    lang: uni.getStorageSync('lang') || 'zh-TW',
    langData: uni.getStorageSync('LANG_DATA') || [],
    chains: uni.getStorageSync('chains') || [],
    updateSubNView: null
  }

  const getters = {
    // 是否无网络
    isNoNetwork: (state) => state.networkType == 'none' ? true : false
  }

  const mutations = {
    // 清空缓存
    RESET(state, payload = {}) {
      state.user = {}
    },
    // 设置语言
    SET_LANG(state, data) {
      state.lang = data
      uni.setStorageSync('lang', data)
    },
    // 保存网络状态
    SAVE_NETWORKTYPE(state, data) {
      state.networkType = data
    },
    SET_CHAINS(state, data) {
      state.chains = data
      uni.setStorageSync('chains', data)
    },
    // 保存后台返回国际化
    set_LangData(state, params) {
      state.langData = params
      uni.setStorageSync('LANG_DATA', params)
    },
    updateSubNView(state, event) {
      state.updateSubNView = event;
    }
  }

  const actions = {
    // 请求国际化数据
    setLangData({
      state,
      commit
    }) {
      return handleRequest.get('/api/tools/i18n/v1/public/getI18nByLang').then((res = {}) => {
        res.data = res.data || {}
        commit('set_LangData', res.data)
        return res.data
      }).catch(error => {
        commit('set_LangData', {})
      })
    },

    // 保存网络状态
    saveNetworkType({
      commit
    }, data) {
      commit('SAVE_NETWORKTYPE', data)
    },

    setlang({
      commit
    }, data) {
      commit('SET_LANG', data)
    },

    reset({
      commit
    }, data = {}) {
      commit('RESET')
    },
    // App热更新
    getHotUpload({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        // #ifdef APP-PLUS
        plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
          handleRequest.get('/api/core/public/update').then((result) => {
            // uni.showToast({
            //   title: result.data.wgtVersion
            // })
            /*
             * 如果是wgt更新，默认不提醒强制更新
             * 如果是app更新，需要根据接口的字段来判断是否强制更新。
             * */
            var data = result.data;
            data.wgtVersion = data.wgtVersion || '1.0.0' // 设定初始化版本， 防止出错
            data.pkgVersion = data.pkgVersion || '1.0.0' // 设定初始化版本， 防止出错
            data.wgtUpdate = false;
            data.pkgUpdate = false;
            let version = Number(widgetInfo.version.split('.').join(''));
            let serverWgtVersioNumber = Number(data.wgtVersion.split('.').join(''));
            let serverPkgVersionNumber = Number(data.pkgVersion.split('.').join(''));
            if (version < serverWgtVersioNumber) {
              data.wgtUpdate = true;
            }
            if (version < serverPkgVersionNumber) {
              data.pkgUpdate = true;
            }
            /*
             * 如果存在pkg更新时，需要弹窗提示 是否更新，
             * 如果是可选更新时： 如果用户更新，则不进入wgt更新， 如果用户不选择更新，则进入后台更新wgt
             * 如果是强制更新时：弹出提示用户更新，不进入wgt更新。
             * 如果不存在pkg更新时，默认进入后台更新wgt功能。
             * */
            console.log(data, '=======getHotUpload=======')

            if (data.pkgUpdate || data.wgtUpdate) {
              if (data.pkgUpdate) {
                uni.navigateTo({
                  url: '/pages/subView/update/index',
                  success: () => {
                    uni.$emit('update', data)
                  }
                })
                return Promise.resolve()
              }
              uni.downloadFile({
                url: data.wgtUrl,
                success: ({
                  statusCode,
                  tempFilePath
                }) => {
                  if (statusCode === 200) {
                    plus.runtime.install(tempFilePath, {
                      force: false
                    }, function() {
                      console.log('install success...');
                      if (data.restart || plus.os.name === 'iOS') {
                        /*
                         * 如果需要强制重启的话。 只存在与热更新时需要重启。 安装app的话会退出后台 因此不需要重启
                         * */
                        plus.runtime.restart();
                      }
                    }, function(e) {
                      console.error(e, 'install fail...');
                    });
                  }
                },
                fail: (error) => {
                  console.log(error, 'error fail')
                }
              });
              return Promise.resolve()
            }
            uni.hideLoading()
            resolve(result)
          }).catch(error => {
            console.log(error, 'error')
            reject(error)
          })
        });
        // #endif
        reject();
      })
    },
  }

  return {
    state,
    mutations,
    actions,
    getters
  }
}
