function render () {
    console.log('模拟视图渲染')
}
// 依赖收集
// 实现一个订阅者 Dep 类，用于解耦属性的依赖收集和派发更新操作
class Dep {
    constructor () {
        /* 用来存放Watcher对象的数组 */
        this.subs = [];
    }
    /* 在subs中添加一个Watcher对象 */
    addSub (sub) {
        this.subs.push(sub);
    }
    /* 通知所有Watcher对象更新视图 */
    notify () {
        this.subs.forEach((sub) => {
            sub.update();
        })
    }
}
// 观察者 Watcher
class Watcher {
    constructor(obj, key, cb) {
      // 将 Dep.target 指向自己
      // 然后触发属性的 getter 添加监听
      // 最后将 Dep.target 置空
      console.log(this)
      Dep.target = this
      this.cb = cb
      this.obj = obj
      this.key = key
      this.value = obj[key] // 读取的时候会触发get
      Dep.target = null
    }
    update() {
      // 获得新值
      this.value = this.obj[this.key]
     // 我们定义一个 cb 函数，这个函数用来模拟视图更新，调用它即代表更新视图
      this.cb(this.value)
    }
  }
// 在getter中收集依赖，在setter中触发依赖
function observe (obj) {
Object.keys(obj).forEach(key => {
  defineReactive(obj, key, obj[key])
})
function defineReactive (obj, key, value) {
  observe(value)  // 递归子属性
  let dp = new Dep() //新增  对每一个属性添加订阅
  Object.defineProperty(obj, key, {
    enumerable: true, //可枚举（可以遍历）
    configurable: true, //可配置（比如可以删除）
    get: function reactiveGetter () {
      console.log('get', value) // 监听
   // 将 Watcher 添加到订阅
    console.log(Dep.target)
     if (Dep.target) {
       dp.addSub(Dep.target) // 新增
     }
      return value
    },
    set: function reactiveSetter (newVal) {
      observe(newVal) //如果赋值是一个对象，也要递归子属性
      if (newVal !== value) {
        console.log('set', newVal) // 监听
        render()
        value = newVal
        // 执行 watcher 的 update 方法
        dp.notify() //新增
      }
    }
  })
}
}

let data = {
    x:1,
    y:2
}
// 此时data是劫持的
observe(data)
// 对其中某个属性进行监听
new Watcher(data,'x',function() {
 console.log('watch x')
});

new Watcher(data,'y',function() {
    console.log('watch y 1')
});

// 都是针对属性。
// 总结 obsetver 是对对象的属性 劫持 读取
// dep 是用于收集某个属性的订阅和发布，每个属性有一个实例。
// watch 是用于绑定属性修改的cb。及触发该属性的get，进而dep收集该watch。
// 进一步
// computed逻辑
// 对x watch 的cb执行时，会读取其它的对象，即触发get
// 此时，如果属性也是active的，则把当前回调添加到该对象那里。
// 即：pushTarget(this)，直到getter/deep执行完后才会pop。即执行过程中，访问其它对象属性，也会添加这个target依赖。