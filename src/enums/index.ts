/*

 */
const modulesFiles = require.context('./modules', true, /\.js$/)

const modules = modulesFiles.keys().reduce((modules:any, modulePath:any) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

let allEnums = {}

Object.keys(modules).forEach(key => {
  Object.assign(allEnums, { ...modules[key] })
})
export default allEnums
