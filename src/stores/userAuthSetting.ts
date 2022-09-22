/*
 * @Author: hsq
 * @Date: 2022-07-11 14:54:45
 * @LastEditors: hsq
 * @LaseEditTime: Do not edit
 * @Description: file content
 */
// 用户授权的信息 --直接在这里授权了
import { defineStore } from 'pinia';

export type WeixinAuthSettingType = 'scope.userLocation' | 'scope.userLocationBackground';
export interface AuthSetting {
  /**
   * 是否授权用户信息
   */
  'scope.userInfo': boolean;
  /**
   * 是否授权地理位置
   */
  'scope.userLocation': boolean;
  /**
   * 是否授权通讯地址
   */
  'scope.address': boolean;
  /**
   * 是否授权发票抬头
   */
  'scope.invoiceTitle': boolean;
  /**
   * 是否授权获取发票
   */
  'scope.invoice': boolean;
  /**
   * 是否授权微信运动步数
   */
  'scope.werun': boolean;
  /**
   * 是否授权录音功能
   */
  'scope.record': boolean;
  /**
   * 是否授权保存到相册
   */
  'scope.writePhotosAlbum': boolean;
  /**
   * 是否授权摄像头
   */
  'scope.camera': boolean;
}
export type AuthSettingKey =
  | 'scope.userInfo'
  | 'scope.userLocation'
  | 'scope.address'
  | 'scope.invoiceTitle'
  | 'scope.invoice'
  | 'scope.werun'
  | 'scope.record'
  | 'scope.writePhotosAlbum'
  | 'scope.camera';

export interface SubscriptionsSetting {
  /**
   * 订阅消息总开关
   */
  mainSwitch: boolean;
  /**
   * 每一项订阅消息的订阅状态
   */
  itemSettings: any;
}
export interface userAuthSettingState {
  //总的汇总用户操作的类型
  /**
   * 用户授权结果
   */
  authSetting: AuthSetting;
  /**
   * 用户订阅消息设置
   */
  subscriptionsSetting: SubscriptionsSetting;
}

export const useUserAuthSettingStore = defineStore('userAuthSetting', {
  state: (): userAuthSettingState => {
    return {
      authSetting: {
        'scope.userInfo': false,
        'scope.userLocation': false,
        'scope.address': false,
        'scope.invoiceTitle': false,
        'scope.invoice': false,
        'scope.werun': false,
        'scope.record': false,
        'scope.writePhotosAlbum': false,
        'scope.camera': false,
      },
      subscriptionsSetting: {
        mainSwitch: false,
        itemSettings: null,
      },
    };
  },

  actions: {
    hasAuth(key: string) {
      //是否有对应的权限
      return this.authSetting[key] === true;
    },
    setAuth(key: string) {
      //开启对应的权限
     
      return this.authSetting[key] = true;
      // console.log('key',this.authSetting[key]);
    },
    authorize(authorKey: AuthSettingKey) {
      //操作用户授权---用户信息授权，不能使用API， 而是使用按钮授权
      return new Promise<any>((resolve, reject) => {
        if (!this.hasAuth(authorKey)) {
          uni.authorize({
            //请求为管道的形式
            scope: authorKey,
            success: () => {
              this.authSetting[authorKey] = true;
              resolve({ result: 'success' });
              console.log('授权成功')
            },
            fail: (fail: any) => {
              reject({ msg: '授权失败', result: 'fail', errObj: fail });
              console.log('授权失败');
            },
          });
        } else {
          resolve({ result: 'success', msg: '已授权' });
          console.log('已授权');
        }
      });
    },
    //系统授权失败的时候再次发起询问
   openSetting(authouName:string){ 
      uni.showModal({
          title: '授权',
          content: '获取授权' + authouName + '失败,是否前往授权设置？',
          success: function(result) {
              if (result.confirm) {
                 uni.openSetting({
                    success(res) {
                     const list = Object.keys(res.authSetting)
                     
                     console.log('222',list[0])
                      this.authSetting[`${list[0]}`] = true;

                    }
                  });
                  console.log('1111',result);
              }
          },
          fail: function() {
              uni.showToast({
                  title: '系统错误！',
                  icon: 'none'
              });
          }
      })
  },
    initAuthSetting() {
      //初始化获取用户当前的设置
      // #ifdef MP-WEIXIN
      uni.getSetting({
        withSubscriptions: true,
        success: (res) => {
          this.authSetting = res.authSetting;
          this.subscriptionsSetting = res.subscriptionsSetting;
        },
        fail: (fail) => {
          console.log('failAuthSetting', fail);
          console.log('用户未授权！')
        },
      });
      // #endif
    },
  },
});
