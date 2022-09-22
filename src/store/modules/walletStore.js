// 节点
import handleRequest from '../../utils/request'
const Web3 = require('web3');
let web3 = new Web3();
const bip39 = require('bip39');
const hdkey = require('ethereumjs-wallet/dist/hdkey').default;
const util = require('ethereumjs-util');
const ethers = require('ethers');
const LANG_DATA = uni.getStorageSync('LANG_DATA')
import {
  TOKEN_KEY
} from '../../api/config'
export const handleExchangeJWT = async (form) => {
  /*
  * 用户信息换token， 等同于登陆功能， 在切换时、导入时使用
  * */
  try{
    const res = await handleRequest.post('/api/auth/jwt/public/user', {mnemonicCode:form.mnemonic}, {[TOKEN_KEY]: form.token})
    if (res.code === 'user_not_found' || res.code === 'error' ){
      /*
      * 如果用户创建时 没有保存成功到服务器中 时， 在切换会重新尝试创建token一次。
      * */
      // uni.showToast({
      //   icon: 'none',
      //   title: this.$t('importErrorNotSupportAddress'||'导入失败，不支持地址'),
      //   duration: 2000
      // });
      throw res.code || res.message
    }
    form = {
      ...form,
      ...res.data
    }
  } catch (e) {
    throw e.message || e.code
  }
  return form
}
export const handleCreateJWT = async (form) => {
  /*
  * 创建账户 创建完后会进行登陆
  * */
  try{
    const createRes = await handleRequest.post('/api/core/user/public/createAccount', form.mnemonic.split(' '), {[TOKEN_KEY]: ' '});
    if (createRes.data){
      /*
      * 创建成功，尝试登陆，如果登陆失败 认为账户没创建成功。 直接抛出错误
      * */
      try{
        form = await handleExchangeJWT(form)
      } catch(e){
        throw e
        return
      }
      return form
    }
    throw createRes.message || 'Error'
  } catch (e){
    throw e || 'Error'
    return
  }
}
export const handleGetUserInfo = async (form) => {
  if (!form.token){
    form = await handleExchangeJWT(form);
  }
  try{
    try{
      const userInfoRes = await handleRequest.get('/api/core/user/userInfo', {}, {[TOKEN_KEY]: form.token});
        if (userInfoRes.code === 'user_not_found' || userInfoRes.code === 'error' ) {
          throw res.message
          return
        }
        form = {
        ...form,
        ...userInfoRes.data
      }
      return form
    } catch (e){
      throw e
      return
    }
  } catch (e) {
    throw e.code || e.message || e || '出现错误，请重试'
  }
}
const searchWallet = (list, id) =>{
  return list.find(item=>String(item.id) === String(id))
}

export default () => {
  const state = {
    temporaryCacheMnemonic: [],/*临时缓存待验证的助记词*/
    walletList: uni.getStorageSync('walletList') || [],
    currentWallet: String(uni.getStorageSync('currentWallet')) || '',
    lastWalletId: uni.getStorageSync('lastWalletId')||0
  }
  const getters = {
    currentWallet: (state) => searchWallet(state.walletList,state.currentWallet),
    walletList: (state) => state.walletList,
    temporaryCacheMnemonic: (state) => state.temporaryCacheMnemonic,
  }
  const mutations = {
    changeCurrentWallet(state, id){
      /*
      * 切换选中节点
      * */
      state.currentWallet = '';
      state.currentWallet = id
      uni.setStorageSync('currentWallet', state.currentWallet);
    },
    addWallet(state,item){
      /*
      * 添加节点,
      * */
      state.walletList.unshift(item);
      uni.setStorageSync('walletList', state.walletList);
      state.lastWalletId+=1;
      uni.setStorageSync('lastWalletId', state.lastWalletId)
      uni.showToast({
        title: LANG_DATA['createWalletSuccess']||'创建节点成功',
        icon: 'none',
        duration: 2000
      })
    },
    removeWallet(state, removeWalletId){
      /*
      * 删除指定节点
      * */
      return new Promise((resolve,reject) => {
        try{
          let removeWalletIndex = state.walletList.findIndex(item=>String(item.id) === String(removeWalletId));
          let walletList = [...state.walletList];
          walletList.splice(removeWalletIndex, 1)
          state.walletList = [...walletList]
          uni.setStorageSync('walletList', state.walletList);
          // uni.showToast({
          //   title: LANG_DATA['deleteWalletSuccess'|| '删除节点成功'],
          //   icon: 'none',
          //   duration: 1000,
          // })
          if (String(removeWalletId) === String(state.currentWallet)){
            /*
            * 如果删除的节点是当前节点时，
            * */
            if (!state.walletList.length){
              state.currentWallet = null;
              uni.setStorageSync('currentWallet', null)
              uni.reLaunch({
                url: "/pages/wallet/index"
              })
              reject()
              return
            }
            /*
            * 如果当前节点列表数据存在  使用第一条数据作为currentWallet
            * */
            state.currentWallet = state.walletList[0].id;
            uni.setStorageSync('currentWallet', state.currentWallet)
          }
          resolve();
        }catch(e){
          reject(e)
        }
      })
    },
    changeWallet(state, form){
      /*
      * 更改节点,
      * 因为不好判断用户更改了什么 所以直接把更改后的item 传递修改
      * */
      let walletList = [...state.walletList];
      walletList.map((item, index, that)=>{
        if (String(item.id) === String(form.id)){
          that[index] = {...form}
        }
      })
      state.walletList = [...walletList];
      uni.setStorageSync('walletList', state.walletList);
      uni.showToast({
        title: LANG_DATA["changeWalletSuccess"] || '修改节点成功',
        icon: 'none',
        duration: 2000
      })
    },
    temporaryCacheMnemonic(state, value){
      /*
      * 临时助记词存储
      * */
      state.temporaryCacheMnemonic = value;
    },
    closeAllWalletData(state){
      state.walletList = [];
      state.currentWallet = null
      uni.clearStorageSync();
      uni.reLaunch({
        url: "/pages/wallet/index"
      })
    },
    login(state, form){
      /*
  * 登陆,
  * */
      let walletList = [...state.walletList];
      walletList.map((item, index, that)=>{
        if (String(item.id) === String(form.id)){
          that[index] = {...form}
        }
      })
      state.walletList = [...walletList];
      uni.setStorageSync('walletList', state.walletList);
    }
  }
  const actions = {
    searchWallet({state}, id){
      return searchWallet(state.walletList,id)
    },
    async addWallet({commit,state},item){
      /*
      * 添加节点,
      * */
      item = {
        inviteCode: '',
        ...item
      }
      /*
      * id 默认数组长度自增
      * */
      try{
        delete item.checkPassword;
        /*
        * 防止错误
        * */
      } catch{}
      commit('addWallet',item)
      // if (state.currentWallet !== undefined && !String(state.currentWallet)) {
      commit('changeCurrentWallet', item.id)
      // }
    },
    removeWallet({commit}, removeWalletIndex){
      /*
      * 删除指定节点 传递id 删除指定
      * */
      return commit('removeWallet',removeWalletIndex)
    },
    changeWallet({commit}, item){
      /*
      * 更改节点,
      * 因为不好判断用户更改了什么 所以直接把更改后的item 传递修改
      * */
      try{
        delete item.checkPassword
      }catch{}
      commit('changeWallet',item)
    },
    temporaryCacheMnemonic({commit}, value){
      /*
      * 临时存储助记词
      * */
      commit('temporaryCacheMnemonic', value)
    },

    async changeCurrentWallet({commit, state, dispatch, getters}, selectWalletIndex){
      /*
      * 更换选中节点
      * 创建、导入第一个节点、登陆、都会调用
      * */
      await commit('changeCurrentWallet', selectWalletIndex)
    },
    checkPassword({state}, {password, id}){
      id = String(id) || state.currentWallet
      /*
      * 检查密码
      * */
      return new Promise((resolve, reject) => {
        console.log(searchWallet(state.walletList, id).password, password,searchWallet(state.walletList, id).password === password,'verificationPassword')
       if (searchWallet(state.walletList, id).password === password){
         // uni.showToast({
         //   title: LANG_DATA['inspectionPasswd'||"检验通过"],
         //   icon: 'none'
         // })
         resolve()
         return;
       }
       reject()
      })
    },
    verifyInviteCode({commit,state,dispatch}, {inviteCode, header, id}){
      /*
      * 验证激活码 -
      * */
      inviteCode = inviteCode || ''
      header = header || '';
      id = String(id) && String(id) !== 'undefined'? String(id) : state.currentWallet
      let currentWallet = searchWallet(state.walletList, id)
      header = header || {
        [TOKEN_KEY]: currentWallet.token
      }
      return new Promise(async (resolve, reject) => {
        uni.showLoading({
          mask: true
        })
        try{
          const res = await handleRequest.post(`/api/core/invite/activation/${inviteCode}`, {}, header)
          uni.hideLoading();
          if (res.status === 200 && res.data === true){
            let form = await handleGetUserInfo(currentWallet)
            await commit('changeWallet', form)
            resolve(form)
            return
          }
          reject(LANG_DATA[res.code] || res.code)
        } catch (e){
          reject(e.message || e.code || '激活失败，请检查激活码')
        }
      })
    },
    checkCurrentWalletInviteStatus({state}){
      /*
      * 检查当前账户是否激活，
      * */
      return new Promise((resolve,reject)=>{
        if (searchWallet(state.walletList, state.currentWallet).inviteCode){
          resolve()
          return
        }
        reject();
      })
    },
    importMnemonicWallet({commit, state, dispatch}, {name, password, mnemonic}){
      /*
      * 通过助记词导入节点， 使用web3组件  接口导入校对
      * */
      mnemonic = mnemonic.replace(/ /ig, ' ')
      return new Promise(async (resolve, reject) => {
        if (state.walletList.some(item=>item.mnemonic === mnemonic)){
          /*
          * 如果用户输入的助记词最后解析的地址和已有的存在一致， 则认为当前要导入的节点存在。
          * */
          reject('repeatWallet');
          return
        }
        try{
          //2、将助记词转成seed
          let seed = bip39.mnemonicToSeedSync(mnemonic);
          console.log(seed,'seed')
          //3、通过hdkey 将seed生成HD Wallet
          let hdWallet = hdkey.fromMasterSeed(seed);
          //4、生成节点中在m/44'/60'/0'/0/0路径的keypair
          let key = hdWallet.derivePath("m/44'/60'/0'/0/0");
          //5、从keypair中获取私钥
          let privateKey = util.bufferToHex(key._hdkey._privateKey);
          //6、从keypair中获取公钥
          let publicKey = util.bufferToHex(key._hdkey._publicKey);
          //7、使用keypair中的公钥生成地址
          let address = util.pubToAddress(util.toBuffer(publicKey), true);
          address = util.toChecksumAddress(util.bufferToHex(address).toString('hex'));
          //8、生成keystore
          let keystore = web3.eth.accounts.encrypt(privateKey, password);
          let form = {
            // privateKey,/*私钥*/
            mnemonic,/*助记词*/
            publicKey,/*公钥*/
            address,/*地址*/
            keystore,
            password,/*明文密码 - 接口数据用 */
            name,
            id: state.lastWalletId + 1,
            createTime: new Date()
          }
          try{
            form = await handleExchangeJWT(form)
            form = await handleGetUserInfo(form);
            dispatch('addWallet', form)
            resolve(form)
          } catch(e){
            reject(e)
          }
        } catch (e){
          reject(e)
        }
      })
    },
    createWallet({commit, state,dispatch}, {password, name}){
      return new Promise(async (resolve, reject) => {
        try{
          /*
        * 使用web3 创建节点.
        * web3js文档: https://web3js.readthedocs.io/
        *
        * */
          //1、生成助记词
          let mnemonic = bip39.generateMnemonic();
          //2、将助记词转成seed
          let seed = bip39.mnemonicToSeedSync(mnemonic);
          //3、通过hdkey 将seed生成HD Wallet
          let hdWallet = hdkey.fromMasterSeed(seed);
          //4、生成节点中在m/44'/60'/0'/0/0路径的keypair
          let key = hdWallet.derivePath("m/44'/60'/0'/0/0");
          //5、从keypair中获取私钥
          let privateKey = util.bufferToHex(key._hdkey._privateKey);
          //6、从keypair中获取公钥
          let publicKey = util.bufferToHex(key._hdkey._publicKey);
          //7、使用keypair中的公钥生成地址
          let address = util.pubToAddress(util.toBuffer(publicKey),true);
          address = util.toChecksumAddress(util.bufferToHex(address).toString('hex'));
          //8、生成keystore
          let keystore = web3.eth.accounts.encrypt(privateKey,password);
          let form = {
            // privateKey,/*私钥*/
            publicKey,/*公钥*/
            address,/*地址*/
            keystore,
            mnemonic,/*明文助记词 - 接口数据用*/
            password,/*明文密码 - 接口数据用 */
            name,
            id: state.lastWalletId + 1,
            createTime: new Date()
          }
          form = await handleCreateJWT(form)
          commit('temporaryCacheMnemonic',  mnemonic.split(' '))
          dispatch('addWallet', form)
          resolve(form)
        }catch(e){
          reject(e)
        }
      })
    },
    closeAllWalletData({commit}){
      commit('closeAllWalletData')
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
