import { api, ResultEnum } from '@/enums/httpEnum';
import { Result } from '@/types/axios';

const transformResult = (data: Result) => {
  if (!data) {
    throw new Error(api.apiRequestFailed);
  }

  const { result_code, data: result, msg } = data;

  const hasSuccess = Reflect.has(data, 'result_code') && result_code == ResultEnum.SUCCESS;
  if (hasSuccess) {
    return result;
  }

  const message = msg || '服务器接口报错';

  uni.showToast({
    title: message,
    duration: 2000
  });
  throw new Error(message);
};

export default transformResult;
