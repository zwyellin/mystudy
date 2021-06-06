// 逻辑
// Promise 是为了解决 回调地狱 设计的
// 语法主要是平铺了。即把原先回调一层层写进去。现在通过then注册

//  单独一个Promise逻辑
// 1、通过new 返回一个新的Promise => MyPromise是一个构造函数
// 2、MyPromise有自己的状态(state/value/reason) 然后执行参数fn
// 3、fn(resolve,reject) 内部会在合适的时间调用resolve(value)/reject(reason),
//    然后异步执行then(fn)/catch(fn)注册的回调(保证回调已经被then/catch注册了)。 
//    resolve: fn(value); reject: fn(reason) 调用执行(传参)
// 4、通过then来注册成功回调(catch来注册失败回调)
// 5、一个简单的Promise就是这么回事。

// 以下描述链式调用及逻辑
// 1、then/catch返回一个新的Promise，就可以实现链式调用了
// 2、那新的Promise什么时候执行自己的resolve/reject呢？
// 3、上一个Promise执行完自己回调，根据回调的结果，来判断执行自己的resolve/reject 
//    实现：注册then/catch 时，要在回调函数外面再套一个function(value) { cb(value); 逻辑判断新的Promise的resolve/reject的执行逻辑 }
//    那如果要执行reject,却没有对应的回调:此时是then注册的，那新的Promise的resolve/reject怎么获得?
//    也就是不管是then还是catch注册，返回的新Promise的resolve,reject，保存在当前Promise实例上，这样就能获取到

(function(){
    // 构造函数，返回一个新的promise对象
    function MyPromise(fn,name) {
        // 属性
        this.name = name // 方便调试
        this.state = MyPromise.State.pending
        this.value = undefined
        this.reason = undefined
        this.resolveFunList = []
        this.rejectFunList = []
        this.nextPromise = undefined
        // 内部方法
        const resolve = (value) => {
            if(this.state === MyPromise.State.pending) {
                    // 异步执行回调
                    setTimeout(() => {
                        this.value = value
                        this.state = MyPromise.State.resolved
                        if(this.resolveFunList.length) {
                            try {
                                this.resolveFunList.every( cb => {
                                    cb(value)
                                }) 
                            } catch (res) {
                                // 如果执行回出错了。则执行reject
                                reject(res)
                            }
                        } else {
                            // 如果自己没有，交给下一个Promise处理
                            if(this.nextPromise) {
                                this.nextPromise.resolve(value)
                            }
                        }
                }, 0)
            }
        }
        const reject = (reason) => {
            if(this.state === MyPromise.State.pending) {
                // 异步执行回调
                setTimeout(() => {
                    this.reason = reason
                    this.state = MyPromise.State.rejected
                    if(this.rejectFunList.length) {
                        try {
                            this.rejectFunList.every( cb => {
                                cb(reason)
                            })  
                        } catch (res) {
                            // 如果执行回出错了。交给下一个Promise处理
                            if(this.nextPromise) {
                                this.nextPromise.reject(reason)
                            }
                        }
                    } else {
                        // 如果自己没有，交给下一个Promise处理
                        if(this.nextPromise) {
                            this.nextPromise.reject(reason)
                        }
                    }
                }, 0);
            }
        }
        // 执行fn
        try {
            fn.call(this,resolve,reject)
        } catch (res) {
            reject(res)
        }
    }
    // 静态属性
    MyPromise.State = {
        pending:'pending',
        resolved:'resolved',
        rejected:'rejected'
    }
    // 传导给下一个Promise
    MyPromise.returnHandle = function (nextPromise,prevResult,resolve,reject) {
        if(nextPromise === prevResult) {
            // 如果下一个上一个Promise返回的是自己。如 p1 = p.then(()=> p1)
            reject(new TypeError('Chaining cycle'))
        } else if(prevResult instanceof MyPromise) {
            // 等待
            prevResult.then(res => {
                console.log('内部注册then，回调执行下一个Promise')
                resolve(res)
            },'inner-then')
            prevResult.catch(res => {
                console.log('内部注册catch，回调执行下一个Promise')
                reject(res)
            },'inner-catch')
        } else {
            resolve(prevResult)
        }
    }
    
    // 原型方法 then/catch/finally
    // 作用：注册回调；返回新的Promise
    // 根据前一个的执行结果，来执行新Promise里面的resolve/reject
    MyPromise.prototype.then = function (cb,name) {
        const that = this
        return new MyPromise(function (resolve,reject) {
            that.nextPromise = {
                promise:this,
                resolve,
                reject
            }
            // 判断前一个Promise的情况
            let result 
            if(that.state === MyPromise.State.resolved) {
                // 直接执行
                result = cb(that.value)
                MyPromise.returnHandle(this, result, resolve, reject)
            } else if(that.state === MyPromise.State.rejected) {
                // 不执行，传导
                MyPromise.returnHandle(this, that.reason, resolve, reject)
            } else {
                // 如果还在等待状态。则注册进去
                that.resolveFunList.push(()=>{
                    result = cb(that.value)
                    MyPromise.returnHandle(this, result, resolve, reject)
                })
            }
        },name)
    }
    MyPromise.prototype.catch = function (cb,name) {
        const that = this
        return new MyPromise(function(resolve,reject) {
            that.nextPromise = {
                promise:this,
                resolve,
                reject
            }
            // 判断前一个Promise的情况
            let result 
            if(that.state === MyPromise.State.rejected) {
                // 直接执行
                result = cb(that.reason)
                MyPromise.returnHandle(this, result, resolve, reject)
            } else if(that.state ===  MyPromise.State.resolved) {
                // 不执行，传导
                MyPromise.returnHandle(this, that.value, resolve, reject)
            } else {
                // 如果还在等待状态。则注册进去
                that.rejectFunList.push(()=>{
                    result = cb(that.reason)
                    MyPromise.returnHandle(this, result, resolve, reject)
                })
            }
        },name)
    }
    
    const p1 = new MyPromise((resolve,reject) => {
        setTimeout(() => {
            resolve(1)
        }, 3000)
    },'p1')
    
    const p2 = p1.then( res => {
        console.log(res)
        return new MyPromise((resolve,reject) => {
            setTimeout(()=>{
                reject(2)
            },3000)
        },'inner')
    },'p2')
    
    const p3 = p2.then(res => {
        console.log(res)
    },'p3')
    
    const p4 = p3.catch(res => {
        console.log('catch',res)
    },'p4')
    })()