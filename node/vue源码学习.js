// 一、 启动，加载配置。配置 加载的是哪个vue
script:{serve: "vue-cli-service serve"}

//2、哪个Vue版本呢?
// -> vue-cli-service文件中：service.run 
// -> Service文件中：this.loadEnv()
// config/base.js中
alias
.set('@', api.resolve('src'))
.set(
  'vue$',
  options.runtimeCompiler
    ? 'vue/dist/vue.esm.js'
    : 'vue/dist/vue.runtime.esm.js'
)
// 所以分别启动的是这两个目录下的vue源码

// 二、分析 vue.runtime.esm.js 的生成
// 去vue源码库下载源码：https://github.com/vuejs/vue
// 对应 vue包的webpack.js 中以下脚本
// "dev:esm": "rollup -w -c scripts/config.js --environment TARGET:web-runtime-esm",
// 即 执行 scripts/config.js
// 参数为 web-runtime-esm
// 找到web-runtime-esm 对应的打包配置。即
// Runtime only ES modules build (for bundlers)
'web-runtime-esm': {
    entry: resolve('web/entry-runtime.js'),
    dest: resolve('dist/vue.runtime.esm.js'),
    format: 'es',
    banner
}
// 找到入口
const aliases = require('./alias')
//  web: resolve('src/platforms/web'),
const resolve = p => {
  const base = p.split('/')[0]
  if (aliases[base]) {
    return path.resolve(aliases[base], p.slice(base.length + 1))
  } else {
    return path.resolve(__dirname, '../', p)
  }
}
// 即入口为：src/platforms/web/entry-runtime.js
// 内容为
import Vue from './runtime/index'
export default Vue
// 继续查找 './runtime/index' 即：src\platforms\web\runtime\index.js
// 内容为
import Vue from 'core/index'
// 其它内容：Vue.prototype.$mount 及添加一个跨平台相关的一些：如Vue.prototype.__patch__
// 继续查找 'core/index'  即：src\core\index.js
// 内容为
import Vue from './instance/index'
// 其它内容：initGlobalAPI(Vue) 底下有分析
// 继续查找'./instance/index' 即：src\core\instance\index.js
// 内容为
import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'
// 创建Vue构造函数
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}
// Vue.prototype上挂载_init方法，然后会执行以下挂载的方法。此方法会 new Vue()时执行，如上。
initMixin(Vue) 
// Vue.prototype上挂载$data/$props/$set/$delete/$watch 数据相关的Api
// Object.defineProperty(Vue.prototype, '$data', {get:this._data})
stateMixin(Vue)
// Vue.prototype上挂载$on/$once/$emit 事件相关Api
eventsMixin(Vue)
// Vue.prototype上挂载_update/$forceUpdate/$destroy 视图更新相关Api
lifecycleMixin(Vue)
// Vue.prototype上挂载$nextTick/_render 视图渲染相关Api
renderMixin(Vue)

export default Vue

// 三、开始源码分析(也可以通过构建后的vue来对应打beggble来分析)
// src\core\instance\index.js
// 1、创建Vue构造函数
// 2、一堆Mixin
// 3、至此，流程完成。我们再往上分析其它细节

// 四、分析initGlobalAPI 做了什么
// 总结为：Vue挂载静态方法(工具函数/Vue函数)/属性
// 1、Object.defineProperty(Vue, 'config', configDef)
// 2、Vue.util = {warn,extend,mergeO)ptions,defineReactive}
// 3、Vue.set = set
// 4、Vue.delete = del
// 5、Vue.nextTick = nextTick
// 6、Vue.observable
// 7、Vue.options = {components: {},directives: {},filters: {},_base:Vue}
// 8、Vue.options的components添加自带的KeepAlive => components: {KeepAlive: {…}}
// 9、挂载Vue.use
// 10、挂载Vue.mixin
// Vue.mixin = function (mixin: Object) {this.options = mergeOptions(this.options, mixin)return this}
// 11、挂载Vue.extend   挂载Vue.cid = 0 等
// 12、initAssetRegisters Vue上挂载"component"/"directive"/"filter"对应的函数

// 五、以上。把init之前的所有做了什么有个概念，以下分析 this._init(options) 做了什么
// 1、合并Options到实例vm:  mergeOptions(Vue.options,options,vm)
// 2、给实例一系列初始化工作
// 初始化$parent/$root/$children/$refs
// 及vm._watcher = null;vm._inactive = null;vm._directInactive = false;vm._isMounted = false;vm._isDestroyed = false;vm._isBeingDestroyed
// 总结：节点相关，及生命周期标识变量
initLifecycle(vm);
// 更新监听
initEvents(vm);
// 理清$slot/$scopeSlot/$attrs/$listeners  及Vm.$createElement
initRender(vm);
// 执行生命周期
callHook(vm, 'beforeCreate');
initInjections(vm); // resolve injections before data/props
// 顺序为：props/methods/data/computed/watch
initState(vm);
// 这里说明下，提供在自身完成initState后提供给后代(很好理解)。
// inject注入的话，在自身未initState之前注入，以便自身初始化state时就可以使用。
initProvide(vm); // resolve provide after data/props
callHook(vm, 'created');

// 如果有挂载el，则执行$mount
// $mount 在src\platforms\web\runtime\index.js 在原型上有注册
// 如果这里没有挂载el，则当执行到vm.$mount()会执行(手动调用)
if (vm.$options.el) {
  vm.$mount(vm.$options.el);
}

// 六、分析下$mount做了什么
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)
}
// 也就是分析updateComponent做了是什么
updateComponent = function () {
  console.log('vm','_update', vm._update)
  vm._update(vm._render(), hydrating);
};
// watch：渲染Watch isRenderWatcher
//  vm,expOrFn,cb,options,isRenderWatcher
new Watcher(vm, updateComponent, noop, {
  before: function before () {
    if (vm._isMounted && !vm._isDestroyed) {
      callHook(vm, 'beforeUpdate');
    } 
  }
}, true /* isRenderWatcher */);
// Wathch内容,做了依赖收集，及执行expOrFn
this.getter = expOrFn
this.get()
//get函数内容
// 也就是会执行vm.expOrFn 即：vm.updateComponent
value = this.getter.call(vm, vm)

// 回过头来看updateComponent：_update
// 前面有分析
// Vue.prototype上挂载_update/$forceUpdate/$destroy 视图更新相关Api
// lifecycleMixin(Vue)
// 我们先来看 vm._render() => Vnode过程
// 前面有分析
// Vue.prototype上挂载$nextTick/_render 视图渲染相关Api
// renderMixin(Vue)
// ----
// 我们来看_render做了什么
const { render, _parentVnode } = vm.$options
vnode = render.call(vm._renderProxy, vm.$createElement)
// 执行 vm.$createElement
//vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)
// 
export function createElement (
  context: Component,
  tag: any,
  data: any,
  children: any,
  normalizationType: any,
  alwaysNormalize: boolean
): VNode | Array<VNode> {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children
    children = data
    data = undefined
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE
  }
  return _createElement(context, tag, data, children, normalizationType)
}
// _createElement
export function _createElement (
  context: Component,
  tag?: string | Class<Component> | Function | Object,
  data?: VNodeData,
  children?: any,
  normalizationType?: number
): VNode | Array<VNode> {
  // 略
}

// vNode => create => diff => patch

