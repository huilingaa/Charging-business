// Vue.directive('scroll', {
//   inserted: function(el, binding) {
//     let f = function(evt) {
//       if (binding.value(evt, el)) {
//         window.removeEventListener('scroll', f);
//       }
//     };
//     window.addEventListener('scroll', f);
//   },
// });
import Vue from 'vue'
import { debounce } from '../utils/index.js'
// 防抖自定义指令
Vue.directive('debounce', {
  bind (el, binding) {
    const executeFunction = debounce(binding.value, 1000)
    el.addEventListener('click', executeFunction)
  }
})
