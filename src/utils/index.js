export function getParameter(param) {
  const reg = new RegExp('[&,?,&amp;]' + param + '=([^\\&]*)', 'i')
  const value = reg.exec(decodeURIComponent(decodeURIComponent(location.search || location.hash)))
  return value ? value[1] : ''
}

// 小于10补0
export function zero(val) {
  if (!val) return '00'
  return val > 9 ? val : '0' + val
}

/**
 * @desc 函数防抖
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param immediate true 表立即执行，false 表非立即执行
 */
export function debounce(func, wait, immediate = true) {
  let timeout
  return function() {
    if (timeout) clearTimeout(timeout)
    if (immediate) {
      var callNow = !timeout
      timeout = setTimeout(() => {
        timeout = null
      }, wait)
      if (callNow) func.apply(this, arguments)
    } else {
      timeout = setTimeout(function() {
        func.apply(context, args)
      }, wait)
    }
  }
}


export function getHost() {
	return 'https://www.warrin.org'
  // return location.hostname === 'localhost' ? '' : location.hostname.indexOf('ccmdefi.com') !== -1 ?
  //   'https://www.ccmdefi.com' : location.protocol + '//' + location.hostname
}

/**
 * 判断数据类型
 * @param data：需要判断的元素
 * @returns {blealen}
 */
export function getType(data) {
  if (typeof data !== 'object' && typeof data !== 'function') {
    return typeof data
  }
  if (data === null) {
    return 'null'
  }
  return toString.call(data).slice(8, -1)
}

/**
 * 对日期进行格式化，
 * @param date 要格式化的日期
 * @param format 进行格式化的模式字符串 dateFormat(yyyy-MM-dd hh:mm:ss)
 * @return String
 */
export function dateFormat(date, fmt = 'YYYY-MM-DD HH:mm:ss') {
  if (!date) {
    return ''
  }
  if (typeof date === 'string') {
    date = new Date(date.replace(/-/g, '/'))
  }
  if (typeof date === 'number') {
    date = new Date(date)
  }
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'D+': date.getDate(),
    'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
    'H+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds()
  }
  const week = {
    0: '\u65e5',
    1: '\u4e00',
    2: '\u4e8c',
    3: '\u4e09',
    4: '\u56db',
    5: '\u4e94',
    6: '\u516d'
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  if (/(Y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '\u661f\u671f' : '\u5468') : '') +
      week[date.getDay() + ''])
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

/**
 * 判断是否为空
 * @param v：需要判断的数据
 * @returns {boolean}
 */
export function isEmpty(v) {
  switch (typeof v) {
    case 'undefined':
      return true
    case 'string':
      if (v.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length === 0 || v == 'null') return true
      break
    case 'boolean':
      if (!v) return true
      break
    case 'number':
      if (v === 0 || isNaN(v)) return true
      break
    case 'object':
      if (v === null || v.length === 0) return true
      for (var i in v) {
        return false
      }
      return true
  }
  return false
}

// 乘
export function mul(a = '', b = '') {
  if (!a) return ''
  let c = 0,
    d = a.toString(),
    e = b.toString()
  try {
    c += d.split('.')[1].length
    c += e.split('.')[1].length
  } catch (f) {}
  return Number(d.replace('.', '')) * Number(e.replace('.', '')) / Math.pow(10, c)
}

// export function setNumberDigit(val, pre) {
//   if (!val) {
//     return ''
//   } else {
//     let ds = '\\d?'.repeat(pre)
//     let reg = new RegExp('(\\d+\\.?' + ds + ')', 'g')
//     let vals = (val + '').match(reg)
//     if (vals) {
//       return vals[0]
//     } else {
//       return ''
//     }
//   }
// },


/**
 * 千分符
 * @param n {Number} 要格式的数字
 * @param cent {Number} 保留小数位
 * @param y {Boolean} 是否对值进行四舍五入
 * @returns {string|*}
 */
export function qff(n, cent = 8, y = false) {
  let num = Number(n)
  // 如果是整数,不取小数位
  if (Number.isInteger(num)) {
    cent = 0
  }
  num = num.toString().replace(/\$|\,/g, '')
  if (isNaN(num)) {
    num = 0
  }
  let sign = (num * 1 === (num = Math.abs(num)))
  num = Math.floor(num * Math.pow(10, cent) + (y ? 0 : 0.50000000001))
  let cents = num % Math.pow(10, cent)
  num = Math.floor(num / Math.pow(10, cent)).toString()
  cents = cents.toString()
  // 补足小数位到指定的位数
  while (cents.length < cent) {
    cents = '0' + cents
  }
  // 对整数部分进行千分位格式化.
  for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
    num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3))
  }
  if (cent > 0) {
    return (((sign) ? '' : '-') + num + '.' + cents)
  } else {
    return (((sign) ? '' : '-') + num)
  }
}

/**
 *  手机号加*号
 * @param {String | Number} val 手机号
 */
export function phoneEncrypt(val) {
  return val.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}


/**
 * 深拷贝
 * @param data
 */
export function deepcClone(data) {
  // 如果是值类型，直接返回结果
  if (typeof data !== 'object' || data == null) {
    return data
  }

  var res
  if (data instanceof Array) {
    res = []
  } else {
    res = {}
  }

  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      res[key] = deepcClone(data[key])
    }
  }
  return res
}
