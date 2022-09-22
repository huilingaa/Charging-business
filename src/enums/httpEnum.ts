/**
 * @description: Request result set
 */
 export enum ResultEnum {
  SUCCESS = 200,
  ERROR = 1,
  TIMEOUT = 401,
  FORCED_OFFLINE = 'Q1010', //管理员强制下线
  TYPE = 'success',
}

/**
 * @description: request method
 */
export enum RequestEnum {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

/**
 * @description:  contentType
 */
export enum ContentTypeEnum {
  // json
  JSON = 'application/json;charset=UTF-8',
  // form-data qs
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  // form-data  upload
  FORM_DATA = 'multipart/form-data;charset=UTF-8',
}

export const HTTP = { 
  BASEURL_DEV: 'http://zdh.zwdc.com/zdh-svc',
  BASEURL_PRO: 'https://zdh.hicustom.com/zdh-svc',
};

export const TOKEN_KEY = 'TOKEN__';

export const api = {
  operationFailed: '操作失败',
  errorTip: '错误提示',
  errorMessage: '操作失败,系统异常!',
  timeoutMessage: '登录超时,请重新登录!',
  apiTimeoutMessage: '接口请求超时,请刷新页面重试!',
  apiRequestFailed: '请求出错，请稍候重试',
  networkException: '网络异常',
  networkExceptionMsg: '网络异常，请检查您的网络连接是否正常!',
  forcedOffline: '管理员强制下线',
  errMsg400: '参数错误，请联系管理员!',
  errMsg401: '当前未登陆，请退出重新登录!',
  errMsg403: '用户得到授权，但是访问是被禁止的。!',
  errMsg404: '路径不存在，请联系管理员!',
  errMsg405: '网络请求错误,请求方法未允许!',
  errMsg408: '网络请求超时!',
  errMsg420: '	签名错误，请联系管理员!',
  errMsg421: '该操作无权限，请联系主账户进行权限赋予!',
  errMsg500: '系统异常，请联系管理员!',
  errMsg501: '网络未实现!',
  errMsg502: '网络错误!',
  errMsg503: '服务不可用，服务器暂时过载或维护!',
  errMsg504: '网络超时!',
  errMsg505: 'http版本不支持该请求!',
  errMsgDefault: '系统异常，请联系管理员!',
};
