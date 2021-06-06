
# 说明

非全面总结，这里仅挑取几个概念理解清楚

# 一、let/const

```js
目前为止：声明变量的方法(6种):
let,const,import,class
var,function

一、区别：
1.1、var 会变量提升,；let/const会暂时性死区
1.2、var 是函数级作用域，let/const是块级作用域
1.3、同一作用域，var可以重复声明(创建阶段同名跳过，执行阶段执行赋值操作)，let/const不可以
1.4、新的声明变量(let,const,import,class不会与全局变量挂钩)

二、对上面区别分别理解：
2.1、let/const 也会声明变量提升，但不能提升使用
// 因为：运行上下文，创建阶段，let/const声明了该变量，但没有默认值undefined。
// Uncaught ReferenceError: a is not defined
// 只有执行阶段，才会有值(定义值 或undefined),即之后才能使用该变量

2.2、块作用域：可以理解为立即执行函数
// 如：
// for(let i = 0; i< 10; i++) {console.log(i)}
// =>
// for(var i = 0; i< 10; i++) { (fn(i){console.log(i)})(i)}
// babel有的地方会通过换个变量名来达到相同效果

2.3、这个是词法分析要处理的。说明：就算另一个是var定义也不行
说明：因为let/const不可以重复声明，所以在语句后面不使用{}声明变量是会报错的。
// 如 if(true) let a = 1;
// 此时没有{},没有形成自己的作用域。
// 这就给是否会同名带来检查难度。所以不允许这么写
```

# 二、Iterator（遍历器）

```js
一、概念：它是一种接口，为各种不同的数据结构
(object,array,set,map或自定义的)提供统一的访问机制
1.1、一种数据结构只要部署了 Iterator 接口，我们就称这种数据结构是“可遍历的”
1.2、默认的 Iterator 接口部署在数据结构的Symbol.iterator属性

二、默认有的解构有：
数组(类数组执行数组的)
set/map
string

三、自动调用环境：
3.1、for of / keys/values/entries
3.2、数组的解构  // 对象的解构是找同名属性
3.3、扩展运算符 ...
3.4、Array.from
3.5、yield*
3.6、Promise.all() / Promise.race()
```

```js
一、实现机制
1.1、部署了Iterator接口
// 返回一个对象
// next:实现单步迭代逻辑
// return:提前退出会执行return逻辑,用于清理或释放资源
// isExecureReturn：是否执行return逻辑
// throw：迭代过程中捕获到异常的处理逻辑
1.2、实现迭代逻辑(默认实现为for of)

二、代码模拟
2.1 Iterator接口实现

let arr = [1,2,3,4,5]
arr[Symbol.iterator] = function() {
    let currentPoint = 0
    let that = this
    let len = that.length
    let isDone = false // 是否迭代完
    let hasError = false
     return {
        next:function() {
            console.log('next')
            isDone = currentPoint === (len - 1)
            return isDone ? {done: isDone} :  {value:that[currentPoint++],done: isDone}
        },
        throw:function() {
          console.log('throw')
          hasError = true
        },
        return:function() {
          console.log('return')
        },
        isExecuteReturn:function() {
            try {
                if(!isDone) this.return()
            } finally {
                if (hasError) throw err;
            }

        },

    }
}

2.2 实现迭代逻辑(本质是while循环)

// 返回迭代器接口
for(let item of arr){}

=>

let _iterator = arr[Symbol.iterator]()
// 迭代逻辑实现
try {
    let item
    while(!(item = _iterator.next()).done) {
        console.log(item.value)
    }
} catch(err) {
    // 迭代逻辑的异常捕获
    // 先捕获，最后会抛出
    _iterator.throw()
} finally {
    // 是否执行return
    // !isDone
    _iterator.isExecuteReturn()
}

```
