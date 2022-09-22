import { api, TOKEN_KEY } from '@/enums/httpEnum';

const checkStatus = (statusCode: number) => {
  console.log('statusCode',statusCode);
  let errMessage = '';
  switch (statusCode) {
    case 400:
      errMessage = api.errMsg400;
      break;
    case 401:
      errMessage = api.errMsg401;
      uni.setStorageSync(TOKEN_KEY, '');
      // 跳转登录页
      uni.navigateTo({ url: '/login' });
      break;
    case 403:
      errMessage = api.errMsg403;
      break;
    case 404:
      errMessage = api.errMsg404;
      break;
    case 405:
      errMessage = api.errMsg405;
      break;
    case 408:
      errMessage = api.errMsg408;
      break;
    case 420:
      errMessage = api.errMsg420;
      break;
    case 421:
      errMessage = api.errMsg421;
      break;
    case 500:
      errMessage = api.errMsg500;
      break;
    case 501:
      errMessage = api.errMsg501;
      break;
    case 502:
      errMessage = api.errMsg502;
      break;
    case 503:
      errMessage = api.errMsg503;
      break;
    case 504:
      errMessage = api.errMsg504;
      break;
    case 505:
      errMessage = api.errMsg505;
      break;
    default:
      errMessage = api.errMsgDefault;
  }

  uni.showToast({
    title: errMessage,
    duration: 2000
  });
};

export default checkStatus;
