import Vue from 'vue'
import Vuex from 'vuex'
import handleRequest from '../utils/request.js'
import globalStore from './globalStore'

Vue.use(Vuex)

const modulesContext = require.context('./modules', false, /\.js$/)

const chunks = modulesContext.keys().reduce((modules, key) => {
  modules[key.replace(/(^\.\/)|(\.js$)/g, '')] = modulesContext(key).default
  return modules
}, {})

const moduleNames = Object.keys(chunks)

const initMudules = (handleRequest, API) => moduleNames.reduce((modules, moduleName) => {
  modules[moduleName] = chunks[moduleName](handleRequest, API)
  return modules
}, {})

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  strict: debug,
  ...globalStore(handleRequest),
  modules: initMudules(handleRequest)
})
