/**
 * 商品相关api
 */
 import {
  http
} from '@/utils/http'

/**
 * 查询商品列表
 * @param {Object} params - 查询参数  
 */
export const getGoodsList = () => {
  return http.post('/api/p-zdh/uct/all-courses/by-live')
}