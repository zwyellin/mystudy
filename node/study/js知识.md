
# 一、数据结构

>* $\color{red}{堆}$
> 先进后出，存放基本类型和对象的引用，每个区块的大小是明确的
>* $\color{red}{栈}$
> 存放引用类型及函数运行
>* $\color{red}{队列}$
> 数组/事件循环

# 二、数据类型

> $\color{blue}{基本数据类型}$
>
>* $\color{red}{undefined、null、string、number、boolean,symbol}$（7种）
>
> $\color{blue}{引用类型}$
>
>* $\color{red}{function、object}$（2种）

# 三、类型判断（4种常用及特殊类型的几个方法）

>$\color{red}{1、typeof}$
>
>* 原理：物理级别(内存编码0101来区分)
>* 优点：最原始
>* 缺点：不能识别null,及引用类型只能识别function/object
>* 总结：适合粗犷的类型判断

```javascript
typeof null === 'object' // true
// 说明：null表示空对象，和object的编码是一样的。所以为'object'
```

>$\color{red}{2、constructor}$
>
>* 原理：访问原型的constructor来判断是不是该类型
>* 优点：支持引用类型(包括自动包装的基本数据类型：如(2).constructor === Number)
>* 缺点：修改原型执行导致识别错误，基本数据类型不支持null、undefined
>* 总结：确保不出错情况下，适合用于自定义类型判断
>* 理解：侧重母亲确认(父亲不变的情况下是稳定的)

```javascript
constructor
语法：obj.constructor;//返回的是对象的构造函数
使用：obj.constructot === Class;
例子：child.constructor === Child;
console.log((2).constructor === Number);
console.log((true).constructor === Boolean);
console.log(('str').constructor === String);
console.log(([]).constructor === Array);
console.log((function() {}).constructor === Function);
console.log(({}).constructor === Object);
```

>$\color{red}{3、instanceof}$
>
>* 原理：obj.`__proto__` === ClassA.property 递归原型上判断
>* 优点：相对于constructor,不局限父级
>* 缺点：相对于constructor,不够精确，不能识别基本数据类型(不会自动包装,基本类型是字面量，不应该是实例，但可以识别 new Number(1))
>* 总结：相当于constructor，适合判断是否是某个类的实例，类型判断不够精确,及不支持基本数据类型
>* 理解：侧重族谱确认(原型(父亲/..))，从原型角度确认
>* 对比：$\color{red}{Object.prototype.isPrototypeOf}$ 是逆向操作

``` javascript
instanceof
语法：obj instanceof Class;
instanceof模拟代码
function instance_of(obj,arg_Class){
    while(true){
       if (obj===null) return false;  //如果对象为空，或者找到对象的最后原型为空，函数返回，为false
       if (obj===arg_Class.property) return true;  //如果和祖先类相等，函数返回，为true
       obj =obj.__proto__; //查找原型链
    }
}
Function instanceof Function;//true Function 继承于base函数，且为了访问方便，Function.prototype = base函数
Object instanceof Function;  //true Object 继承于base函数
Function instanceof Object;  //true Function 继承于base函数，base函数继承于base对象(Object.prototype)
Object instanceof Object;    //true Object继承于base对象(Object.prototype)
Number instanceof Number;    //false Number继承于base函数，和Number.prototype没有关联

// 具体逻辑查看js继承原理
// 这里简单描述下
// base对象(Object.prototype)
// base函数 继承base对象
// 内置引用类型，其实就是从base函数继承下来的
// Object继承base函数，间接继承base对象，且Object挂载prototype为base对象，用于从object继承下去
// Function继承base函数，且Function挂载base函数，用于从Function继承下去
// 好了。开始继承其它的。拿Number来举例
// Number继承base函数，然后自身添加一些属性。及增加自己的prototype用于继承
```

>$\color{red}{4、Object.prototype.toString.call()}$
>
>* 原理：原生对象内部有个`[[Class]]`属性,Object.prototype.toString可以输出该值
>* 优点：完美支持基本数据类型和引用类型
>* 缺点：不支持自定义类型(自定义类型并没有修改`[[class]]`属性)
>* 总结：对于原生基本和引用类型，完美!

```javascript
// 获取类型
export function getType(v) {
  let type = Object.prototype.toString.call(v);
  type = type.split(" ")[1].slice(0, -1);
  return Object.is(v, NaN) ? "nan" : type.toLowerCase();
}

// 补充Object.prototype.toString.call
// 对于arguments 返回 [object Arguments]
// 对于document 返回 "[object HTMLDocument]" / "[object NodeList]" 等
// 也就是说，对于类数组，它返回的并不是数组类型，而是它有自己的类型
```

>$\color{red}{5、总结}$
>
> **原生类型角度**$\color{blue}{Object.prototype.toString.call() > typeof > constructor > instanceof}$
>
>* Object.prototype.toString.call()完美
>* typeof不能识别null
>* constroutor会对基本数据类型包装，除了null、undefined
>* instanceof不会对基本数据类型包装，所以不能识别字面量及转化来的，只能识别new实例出来的
>
> **引用类型角度**
>
>* 原生引用角度：$\color{blue}{Object.prototype.toString.call()}$
>* 母亲角度(用于找母亲，用于判断类型，如果原型或原型上的constroutor改变，则是新的母亲，类型判断就会出错)(支持原生和自定义):$\color{blue}{constructor}$
>* 族谱角度(用于判断是否某个类的后代，类型判断不能确认是父亲，只知道是其上代，且原型改变，类型判断不稳定)(支持原生和自定义)：$\color{blue}{instanceof}$
>
> **其它特定类型的判断**
>
>* $\color{blue}{Array.isArray(obj)}$
> 等价于Object.prototype.toString.call(arg) === '[object Array]'
>
>* $\color{blue}{isNaN(obj) / Number.isNaN(obj) / Object.is(obj,NaN)}$

# 四、数据定义及值转化及值相等判断

> $\color{red}{1、数据定义}$
>
>* $\color{blue}{new实例}$(构造函数角度)
>* $\color{blue}{Object.create()}$(原型角度)
>* $\color{blue}{函数转化}$(包括显式和隐式函数转化)
>* $\color{blue}{字面量}$

```javascript
// 关于new/create 参考继承原理
```

> $\color{red}{2、函数转化}$

```js
转Boolean
显式语法：Boolean(value)
隐式方式：条件语句/循环语句和逻辑运算(&&、||、!)

1.Null       // null
2.Undefined  // undefined  
3.Boolean    // false
4.Number     // +0,-0,NaN
5.String     // ""  以上这部分为false
6.Object     // 引用类型转换为布尔，始终为true

// 总结
// 没有值(null和undefined)或有值不是真值，则转真假值后为假

// 逻辑运算
1.&&：expr1 && expr2
// 若 expr1 可转换为 true，则返回 expr2；否则返回 expr1
// 结合条件语句/循环语句/! 可以把表达式转化为真假值
2.||：expr1 || expr2
// 若 expr1 可转换为 true，则返回 expr1；否则，返回 expr2
// 结合条件语句/循环语句/! 可以把表达式转化为真假值
3.!：!expr // 返回真假值的取反
// 若 expr 可转换为 true，则返回 false；否则，返回 true
4.!!：即两个!! // 返回真假值，可用于是否是真值

// 真假值说明
1.布尔值有：true/false
2.真假值有：truthy/falsy // 只是概念上面区分布尔值
```

```js
转Number
显式语法：Number(value)
//其它方法：parseFloat、parseInt、valueOf
隐式方式：一元运算符 +/- 和 其它算术运算符

1.Null      // 0
2.Undefined // NaN
3.Boolean    // false为0，true为1
4.Number     // 可以转其它进制
5.String     // 有其它字符，则返回NaN,如只有连续数字(首位允许有空格)，则返回数字
6.Object     // 返回NaN。除了[]为0，[15]为15，[15,20]也为NaN

// 总结：如果没办法转化为数字，则为NaN
// 其中，Null表示空对象，为0
// Undefined 表示没有定义值，值是未知的，为NaN

// 一元+/-
// 一元+：相当于Number()
// 一元-：相当于-Number()

// 其它运算符：+、-、*、/、%、**、++、--
// 特别说明：+运算符：如果两边有存在为字符串的，则两边都会转化为字符串而不是数值
// 如果是引用类型，则解包后再看两边
```

```js
转String
显式语法：String(s)
// 其它方法：date.toString()
隐式方式：+ 运算符

1.Null        // "null"
2.Undefined   // "undefined"
3.Boolean     // false为"false"，true为"true"
4.Number      // "对应数字" //0,+0,-0结果为"0"
5.String      //
6.Object      // Object为："[object Object]"； function为："function(){[native code]}"；数组为："数组内容1，数组内容2"

// + 运算符： value1 + value2
1.如果value1或value2存在字符串，则为字符串的拼接 // 非字符串会转化为字符串
2.否则为数值的求和 // 非数字的会转化为Number 如：false + false // => 0 + 0
// 如果是引用类型，则解包后再看两边
```

```js
前面有介绍Object和基本数据类型之间的转化
// 其实有以下概念
1.装包 内部方法 ToObject()
2.解包 内部方法 ToPrimitive()

// 装包逻辑
// 场景：访问原型(包括用于类型判断的constroutor)
// 注意instanceof 并不会自动装包，因为这个运算符是判断是否是某个类的实例
// 而基本数据类型，是字面量，不应该是实例。
// 语法：ToObject(value)
// 根据其类型，返回该 new 实例


// 解包逻辑
// 场景：算术运算、==、装包后自动解包
// 语法：toPrimitive(obj,preferedType = Number)
// 日期对象解包是preferedType为String,其它为Number
1.如果期望转化为Number
// 调用obj.valueOf()，如果结果是原始值，返回结果
// 否则，调用input.toString()。如果结果是原始值，返回结果
// 否则，报错
2.如果期望转化为String
// 调用input.toString()。如果结果是原始值，返回结果
// 否则，报错
```

> $\color{red}{3、值相等判断(3种)}$
>
>* $\color{blue}{==}$ 抽象（非严格）相等
>* $\color{blue}{===}$ 严格相等
>* $\color{blue}{Object.is}$ ECMAScript 2015/ ES6 新特性

```js
==
可能进行类型转化，然后值对比

1. 如果类型相同 则 A === B 直接对比值
2. 非Number类型的会先进行类型转化
如果是对象：ToPrimitive()

否则，如果是null/undefined：Boolean(A/B)
// => null == undefined; null == null; undefined == undefined
// null和undefined都表示没有值

否则，ToNumber(A/B)

// 总结：
// 存在隐式类型转化，语义不明确
// 不能区分null/undefined、0/-0、NaN/NaN
```

```js
===
值对比，不会类型转化

1.如果类型相同，A === B 直接对比值
2.如果类型不相同，返回false

// 总结：
// 因为类型不相同，直接返回false => 所以可以区分null和undefined
// 还是不能区分，0/-0、NaN/NaN
```

```js
Object.is
===的加强版
//pollify:
Object.is = function(x,y){
    if(x === y) {
        // 如果严格相等，此时，还未区分，0/-0
        // 利用1 / 0 === Infinity; 1 / -0 === Infinity来区分
        if(x === 0) {
            return 1 / x === 1 / y
        }else {
            return true
        }
    }else {
        // 此时，x !== y ，但还未区分NaN，利用 x !== x 的只有NaN
        // 说明以下x和y都是NaN时，才为true。否则为false
       return x !== x && y !== y
    }
}
// 总结：可以区分 0 !== -0, NaN === NaN

1.isNaN(x)
// pollify:
function isNaN(value){let n = Number(value); return n !== n}
// 即先会类型转化为Number
// 然后同为数字的情况下，再利用 x !== x 的只有NaN
// 作用：
// 用于判断x是否是NaN
// 用于先判断表达式中的某个值是否NaN，如果该值为NaN，则不进行表达式运算

2.Number.isNaN(x)
// 是全局 isNaN() 的更稳妥的版本：不会先Number转化来判断
// pollify:
Number.isNaN = function(value){return value !== value}
// 利用 x !== x 的只有NaN
```

>$\color{red}{3.1、值相等判断总结}$

```js
1.==
// 存在隐式类型转化，语义不明确
// 不能区分null/undefined、0/-0、NaN/NaN
2.===
// 因为类型不相同，直接返回false => 所以可以区分null和undefined
// 还是不能区分，0/-0、NaN/NaN
3.Object.is
// 可以区分0/-0
// 利用1 / 0 === Infinity; 1 / -0 === Infinity来区分
// 可以区分NaN
// 利用 x !== x 的只有NaN

对于区分是否时NaN
推荐使用：Object.is、Number.isNaN
// 内部逻辑都是利用 x !== x 的只有NaN
也可以直接 x !== x 来判断
不推荐：isNaN  // 存在Number转化，再利用 x !== x 的只有NaN
```

# 五、继承原理

>$\color{red}{1、继承机制}$
>$\color{red}{构造函数，通过new来实例}$：实现从构造函数的继承
>$\color{red}{proto}$：实现从原型的继承
> 每个函数都有prototype属性，用于继承；每个对象都有__proto__属性，用于访问

```js
对象访问属性机制：(原型继承机制)
1.当前对象中找
2.如果没有找到，则从当前对象的__proto__找
3.如果还没有找到，迭代第二步，直到其__proto__为null
```

>$\color{red}{2、继承基础原理}$

```js
new 实现 伪代码
// new Foo(...args) =>
function(..args){
    const obj = {}
    Foo.call(obj,...args)
    // 此时obj有了Foo的内部属性
    obj.__proto__ = Foo.prototype
    // 此时obj有了Foo的原型属性
    return obj
}

// 以下代码有直接使用__proto__,只是为了理解方便
// 实际使用，可以用直接设置其原型
// 但最好还是通过new来实现
Object.setPrototypeOf(obj, prototype)
// 或 直接创建已该原型为对象的对象
// 适合创建新对象时使用
Object.create(prototype)

// 以下为单一继承，主要是为了理解原理
1.纯粹从构造函数继承
// 此时虽然boy.__proto__指向Persion.prototype 但是没有定义
function Persion(name){
    this.name=name
}
let boy = new Persion('张三')
console.log(boy.name) // '张三'

2.纯粹从原型继承
function Persion(){}
Persion.prototype.sayHello = function(){console.log('hello')}
let boy = new Persion()
// 或 不建议直接访问__proto__
let boy = {__proto__:Persion.prototype}
// 或 相对于new,这里create语义要更明确
let boy = Object.create(Persion.prototype)
boy.sayHello() // 'hello'

3.组合构造函数和原型
function Persion(name){
    this.name=name
}
Persion.prototype.sayHello = function(){console.log('hello')}
let boy = new Persion('张三')
console.log(boy.name) // '张三'
boy.sayHello() // 'hello'
```

>$\color{red}{2、复杂继承}$

```js
1.纯粹从构造函数继承
function Persion(bodyArgs,soulArgs,selfArgs){
    // 从Body继承身体的一些属性
    Body.call(this,bodyArgs)
    // 从Soul继承灵感的属性
    Soul.call(this,soulArgs)
    // 补充自己特有的属性
    // 为了避免同名覆盖，自己属性放在最后实现
    this.name = selfArgs
}
let boy = new Persion(,,'张三')
console.log(boy.name) // '张三'
// 优点：实现了多继承
// 缺点：没有实现原型继承；且存在容易导致同名覆盖

2.纯粹从原型继承
function Active(){}
Active.prototype.smile = function(){console.log('smile')}

function Persion(){}
// 不采用boy.__proto__的原因是，不希望改变其原来原型为Persion
Persion.prototype.__proto__ = Active.prototype
// 补充自己的原型属性
Persion.prototype.sayHello = function(){console.log('hello')}
let boy = new Persion()
boy.smile() // 'smile' 访问的是：boy.__proto__.__proto__.smile
boy.sayHello() // 'hello' 访问的是：boy.__proto__.sayHello
// 优点：实现了从原型的继承
// 缺点：不能多继承

3.组合构造函数和原型
function Active(){}
Active.prototype.smile = function(){console.log('smile')}

function Persion(name){
    // 从Body继承身体的一些属性
    Body.call(this,bodyArgs)
    // 从Soul继承灵感的属性
    Soul.call(this,soulArgs)
    // 补充自己特有的属性
    // 为了避免同名覆盖，自己属性放在最后实现
    this.name = selfArgs
}
Persion.prototype.__proto__ = Active.prototype
Persion.prototype.sayHello = function(){console.log('hello')}
let boy = new Persion('张三')
console.log(boy.name) // '张三'
boy.smile() // 'smile' 访问的是：boy.__proto__.__proto__.smile
boy.sayHello() // 'hello' 访问的是：boy.__proto__.sayHello

// 优点：实现了从构造函数的多继承，和原型链的继承
// 缺点：语义不够明确，其实上面写法语义都不明确

组合构造函数和原型中的一个特例
即extends另外一个对象，要继承其构造函数和原型
其实也就是class的语法糖

function Active(){
    this.eq = eq
}
Active.prototype.smile = function(){console.log('smile')}

function Persion(name){
    Active.call(this,eq)
    // 补充自己特有的属性
    // 为了避免同名覆盖，自己属性放在最后实现
    this.name = selfArgs
}
Persion.prototype.sayHello = function(){console.log('hello')}
Persion.prototype.__proto__ = Active.prototype
let boy = new Persion('张三')
console.log(boy.name) // '张三'
boy.smile() // 'smile' 访问的是：boy.__proto__.__proto__.smile
boy.sayHello() // 'hello' 访问的是：boy.__proto__.sayHello
```

>$\color{red}{3、继承语义化}$
>$\color{red}{解决继承语义不明确的问题}$

```js
1.new ClassA()
// 语义：从构造函数继承实体属性和从构造函数原型继承原型属性

2.Object.create()
// 语义：纯粹继承原型属性
// 实质上是 JavaScript 现有的基于原型的继承的语法糖
语法：Object.create(prototype,{x:{value: 1,writable: true}})
//pollify
Object.create = function(prototype) {
    function _F(){}
    // 这里是prototype 被赋值了，即没有_F.prototype其它内容了
    _F.prototype = prototype
    return new _F()
    // eg. let a = Object.create(A)
    // => a.__proto === _F.prototype // 即 a.__proto === A
}

3.class
// 解决构造函数和原型继承写在不同地方问题，及词法上面更像继承
// 实质上是 JavaScript 现有的基于原型的继承的语法糖

//语法：
function Active(){
    this.eq = eq
}
Active.prototype.smile = function(){console.log('smile')}

class Persion extends Body {
    constructor(name,height){
        // 继承构造函数属性
        // super要写在最前面，也是前面说的同名覆盖问题
        super(height)
        // 继承自身构造函数属性
        this.name = name
    }
    // 自身原型方法
    sayHello(){console.log('hello')}
    // 自身类静态方法
    static staticFn(){ return this}
}

let boy = new Persion('张三',180)

// 转化后代码
function Active(){
    this.eq = eq
}
Active.prototype.smile = function(){console.log('smile')}

// 首先构造自执行函数，返回构建后的Persion
var Persion = function (_Active) {
    'use strict'
    function Persion(name,height){
        // 继承构造函数属性
        // super要写在最前面，也是前面说的同名覆盖问题
        _Active.call(Persion,height)
         // 继承自身构造函数属性
        this.name = name
    }
    // 自身原型方法
    Persion.prototype = function(){console.log('hello')}
    // 自身类静态方法
    Persion.staticFn = function(){ return this}
    // 继承原型方法
    Persion.prototype.__proto__ = _Active.prototype
    return Persion;
}(Active);

let boy = new Persion('张三',180)

// 从转化后代码来看
class 不会声明提升，因为是函数表达式
```

# 六、内置对象的继承及方法总结

>$\color{red}{内置对象其实都是构造函数，通过new来实例化 实例对象}$
>$\color{red}{内置对象都是原型继承(只提供共享的方法)}$

```js
// 技巧：console.log({Object}) 可以查看内置对象的结构
// 我们来想一下，js大厦是如何搭建起来的
// 我理解为三步走，逐步完成
// 1.创建大厦的基本结构(7中数据结构)
// 2.创建可拓展的基本单元(base对象、base函数)
// 3.创建独立设备(内置对象，有完整独立的功能)

// 以下为了描述方便描述属性：
// 用 属性(代表变量属性和函数属性)、变量属性、函数属性 来描述

1.大厦的基本结构
// 也就是js的null、undefined、boolean、string、number、symbol、引用(Object,Function) 7种
// 他们在内存中是有不同的存储方式的
// 也就是为什么typeof可以区分他们的原因
// 把他们当作不同的结构

2.创建可拓展的基本单元
// 也就是要从引用(Object,Function)的最基本结构，分别创建出基本单元
// 为了描述方便，称为base对象、base函数
2.1 创建base对象
2.2 创建base函数：base函数.__proto__ = base对象
// 函数也是对象，需要base对象的属性

// 再完善base函数
// 因为函数属性也是函数，所以需要继承base函数
// 即 base函数.__proto__ = base函数
// 添加自己的变量属性：name/arguments/length
// 添加自己的函数属性：call/apply/bind 等方法

// 至此，base函数创建好了

// 再完善base对象
// 添加自己的函数属性：
// asOwnProperty,isPrototypeOf,propertyIsEnumerable,toString,valueOf

// 至此，base对象和base函数 构建好了

// 代码模拟(主要观察继承结构是不是符合)
// 最基本的引用，用{}来代替下(可添加属性)
let base对象 = {}
let base函数 = {}

base函数.__proto__ = base对象
base函数.name = undefined

let call = {}
call.__proto__ = base函数
base函数.call = call
// 至此，base函数创建好了

let toString = {}
toString.__proto__ = base函数
base对象.toString = toString
// 至此，base对象和base函数 构建好了
// 控制台打印出结构观察下
console.log({base对象})
console.log({base函数})

3.创建独立设备(内置对象，有完整独立的功能)
// 分析内置对象的构建(继承)
// 为了更达意，使用继承属性和工具属性(静态属性) 来描述

1.Object
Object.__proto__ = base函数
 // 为了base对象的继承，挂载在Object的原型上
Object.prototype = Base对象
 // 添加自己的工具属性
create/keys/values/entries/is/...

// 为了使用方便，创建了一个字面量：{}
// 直接从Object派生
// 所以{}.__proto__ === Object.prototype === base对象

2.Function
Function.__proto__ =  base函数
// 为了base函数的继承，挂载在Function的原型上
Function.prototype = base函数
// Function没有提供额外的工具属性

// 为了使用方便，创建了一个字面量：function A(){}
// 直接从base函数派生
// 所以A.__proto__ === base函数 === Function.prototype


// 拿String再来说明下其继承过程
String.__proto__ = base函数
// 为了继承String的原型属性
// 于是在String.prototype添加继承属性
length/toString/valueOf/slice/repeat/concat/...
// 添加自己的工具属性
fromCharCode/fromCodePoint
```

>$\color{red}{内置对象的构建(继承)}$
>$\color{red}{内置对象都是构造函数}$
>$\color{red}{所以直接继承于base函数，间接继承于base对象)}$

***

>**1.Object**

```js
// 为了更达意，使用继承属性(原型属性)和工具属性(静态属性) 来描述

一、继承属性
// Object.prototype:提供对象最基本的功能
1、判断自身属性(是否存在，是否可枚举)
    1.1、hasOwnProperty() 返回布尔值，指示对象自身属性中是否具有指定的属性
    // 说明：遍历自身，包括不可枚举属性，但不会遍历原型
    // 对比：Object.getOwnPropertyNames() 这个方法是返回该对象的所有属性，包括不可枚举
    // 对比：in 是遍历对象及原型
    1.2、propertyIsEnumerable() 返回布尔值，表示指定的属性是否可枚举,不包括原型上的
2、判断原型
    2.1、isPrototypeOf() 判断当前对象是否处于B原型上
    // 对比：instanceOf 是这个运算的逆向操作
3、解包相关：
    3.1、toString() 方法返回一个表示该对象的字符串
    3.2、valueOf() 方法返回指定对象的原始值
// 解包逻辑 在值相等判断那里有详细描述
// 除了Date/字符串，是先调valueOf()

二、工具属性
// 提供了对象完整的工具功能(自身、属性、遍历、及其它功能)
1、创建对象本身
    1.1、setPrototypeOf(obj, prototype) / getPrototypeOf(object) 设置/返回 原型对象
    1.2、create(pC:roto[, descriptors]) 创建 指定原型对象及自身属性 的对象
    1.3、fromEntries() 方法把键值对列表转换为一个对象
    1.4、assign(target, ...sources) 浅拷贝一个或多个对象 自身 且 可枚举 属性到target
2、设置对象本身类型：防篡改（拓展、密封、冻结）
    2.1、preventExtensions / isExtensible:扩展特性: 阻止向对象添加新属性
    2.2、seal / isSealed:密封特性 密封 === 对象不可拓展+不可配置(configurable:false)
    2.3、freeze / isFrozen:冻结特性 冻结 === 密封+不可写(writable:false)
3、定义属性：更精准的定义/修改 属性/s
    3.1、defineProperty(obj,property,descriptor) / defineProperties(obj,descriptors)
4、遍历属性相关：都是遍历自身
    4.1、遍历自身且可枚举属性：keys、values、entries、assign
    4.2、遍历自身所有属性：getOwnPropertyNames() / getOwnPropertySymbols() / getOwnPropertyDescriptor(obj, prop) / getOwnPropertyDescriptors()
5、其它：
    5.1、is() 方法判断两个值是否为同一个值:可以区分
    //说明：Object.is(+0,-0) // false  Object.is(NaN,NaN) // true

// 总结：
对象遍历相关
1、遍历自身且可枚举属性
// keys、values、entries、assign
2、遍历自身所有属性
// Object.prototype.hasOwnProperty()
// getOwnPropertyNames()
// getOwnPropertySymbols()
// getOwnPropertyDescriptor(obj, prop) / etOwnPropertyDescriptors()
3、遍历自身和原型且可枚举属性
// for in
// 原生对象属性默认是不可枚举的
4、遍历自身和原型所有属性
// in

// 对于深拷贝，可以用for in
function extend (to, _from) {
    for (var key in _from) {
        to[key] = _from[key];
    }
    return to
}
```

>**2.base函数/Function/function**

```js
base函数：
// base函数.__proto__ = base对象
// 添加自己的变量属性：name/arguments/length
// 添加自己的函数属性：call/apply/bind 等方法
// 至此base函数创建完成

Function:继承于base函数
=> Function.__proto__ =  base函数
// 添加自己的属性，name/arguments/length
// 为了base函数的继承，挂载在Function的原型上
// Function.prototype = base函数
// 至此Function创建完成

function(){}:继承于base函数。这里是字面量
// 拥有name/arguments/length
// fn.__proto__ =  base函数
```

>**3.String**

```js
// UTF-16编码(0 到 65535) ： 字符串是不可改变的。
一、继承属性
// 提供创建及检索(查)的功能

1、重写相关：
    1.1、toString() 方法返回指定对象的字符串形式
    1.2、valueOf() 等同于 toString()
2、创建
// 因为字符串是不可改变的，所以没有增删改操作
// 都是在原字符串的操作返回新的字符串，不影响原字符串。
    2.1、slice(beginIndex[, endIndex]) 返回原字符串指定位置的新字符串
    2.2、repeat(count) 返回包含指定字符串的指定数量副本的新字符串
    2.3、concat(str2, [, ...strN])：强烈建议使用赋值操作符（+, +=）代替 concat 方法，性能要好
    2.4、padStart()/padEnd()、trim()/trimStart()/trimEnd()、toLowerCase()/toUpperCase()
3、查相关
    3.1、index检索:charAt() 返回指定位置的字符、charCodeAt() 返回指定位置的字符的code码(0 到 65535)
    3.2、value检索:startsWith()/endsWith()、includes()、indexOf()/lastIndexOf()
    3.3、正则检索：match()/matchAll()、search()

二、工具属性
1、length
2、自身方法：提供一些 不常用但很有用的方法
    2.1、raw() 解析模板字符串 会自动帮我们调用
    2.2、创建相关：
        A:fromCharCode(num1[, ...[, numN]]) 返回指定UTF-16编码(0 到 65535)的字符串
        B:fromCodePoint(num1[, ...[, numN]]) 返回指定的UTF-32(UTF-16编码超集)编码的字符串
```

>**4.Number**

```js
// Number类型为双精度IEEE 64位浮点类型 范围在-(253 - 1) 到 253 - 1
一、继承属性
// 重写属性 及 格式化功能
1、重写相关：
    1.1、toString([radix]) 方法返回指定对象的字符串形式。radix：基数，2到36。
        说明：因为可能有字符出现，所以放在这里实现，而不是valueOf(),注意返回的是字符串：2.toString(10) !== 2
    1.2、valueOf()
2、格式化，返回字符串
    A:toExponential(fractionDigits) 返回指定小数个数的 指数表示法
    A:toFixed(digits) 指定精度[0,20]
    B:toPrecision(precision) 指定总宽度多少，如果给定宽度少于实际整数宽度，会以 指数表示法返回

二、工具属性
1、MAX_SAFE_INTEGER：最大安全整数 2^53 -1:9,007,199,254,740,991:9万兆
2、MIN_SAFE_INTEGER：最小安全整数-9007199254740991：-9万兆
3、自身方法
    3.3.1、isSafeInteger(testValue) 返回是否是安全整数，布尔值
    3.3.2、parseFloat() 方法可以把一个字符串解析成浮点数，注意内部首先会先转化成字符串
    3.3.3、parseInt() 方法可以把一个字符串解析成浮点数，注意内部首先会先转化成字符串
```

>**4.Array**

```js
一、继承属性
1、重写相关：
    1.1、toString() 方法返回指定对象的字符串形式。
        说明：如果是数组调用，等同于.join(',')
    1.2、valueOf() 返回数组本身； arr.valueOf() === arr
2、创建相关：不改变原数组
    2.1、slice([begin[, end]])
    2.2、old_array.concat(value1[, value2[, ...[, valueN]]])
    2.3、flat([depth]) 拍平 flatMap()
3、增删相关：增加时返回新数组的长度，删时返回删除的item
    3.1、栈尾操作：push(element1, ..., elementN) / pop()
    3.2、栈头操作：unshift(element1, ..., elementN) / shift() 反向操作：可以用于反转数组。
    3.3、增删：splice(start[, deleteCount[, item1[, item2[, ...]]]]) 返回删除item组成的数组
4、改相关：不改变长度，返回改变后的数组。都是浅拷贝
    4.1、copyWithin(targetIndex[, start[, end]])
    4.2、fill(value[, start[, end]])
    4.3、reverse() 反转
    4.4、sort([compareFunction]) 排序，如果没有指定排序函数，默认是item转字符串，然后比较UTF-16 的code码 升序排序
5、查相关：
    5.1、value检索:indexOf()/lastIndexOf()、includes()
    5.2、测试函数：find() / findIndex()
    5.3、遍历相关：
        A:forEach() / map() / filter() / some() /  every()
        B:reduce() / reduceRight()
        c:keys() / values() / entries()
6、其它：
    6.1、转字符串：join([separator]) separator默认是","

二、工具属性
1、length
2、自身方法：
    2.1、创建相关：
        A:from(arrayLike[, mapFn[, thisArg]]) 类数组转数组
        B:of(element0[, element1[, ...[, elementN]]]) 用于修复 new Array(4) => [empty × 4]
        说明： new Array(1,2,3) => [1,2,3]; new Array(5) => 如果只有一项，则会生成长度为该值的数组：[empty × 5]
    2.2、判断是否是数组：isArray(obj)


// 知识补充：稀疏数组

1、会产生的情况：
// 构造函数声明一个没有元素的数组
var a = new Array(5);    // [empty × 5]
// 指定的索引值大于数组长度
var a = [];
a[5] = 4;                // [empty × 5, 4]
// 指定大于元素个数的数组长度
var a = [];
a.length = 5;            // [empty × 5]
// 数组直接量中省略值
var a = [0,,,,];         // [0, empty × 3]
// 删除数组元素
var a = [0, 1, 2, 3, 4];
delete a[4];             // [0, 1, 2, 3, empty]

2、转化为密集数组：'' => undefined
// 如 Array.from(new Array(2)) => [undefined, undefined]
A: Array.apply(null,targetArr)
B：Array.from(targetArr)
c：[...targetArr]

3、稀疏数组注意事项：
A: 该稀疏项，其实不属于数组的属性：(new Array(2)).hasOwnProperty(0) => false
B：es5那些迭代会 if(k in Object(this)){} 来过滤掉非自身属性
C: forEach 实现核心代码：
while (k < len) {
    var kValue;
    if (k in O) { // in 会从自身及原型查看是否有这个属性
        kValue = O[k];
        callback.call(T, kValue, k, O);
    }
    k++;
}
```

>**4.Math**

```js
// Math只是提供工具属性，所以Math直接从Object.prototype 继承下来的
// Math是一个对象不是函数。不能用于new

一、工具属性
1、自身属性
    1.1、提供一些数学常量/公式：E、PI、LN2/LN10
2、自身方法
    2.1：正弦/余弦/正切/余切：sin/asin / cos/acos / tan/atan
    2.2:常用方法： abs / ceil / floor / min / max / round / random
```

# 六、内存空间和函数运行上下文

>**生命周期**

```js
执行上下文(函数调用栈)  ECStack(execution content stack)

1、栈结构：先进后出，后进先出
2、生命周期
    2.1、创建阶段(解析阶段)
    2.2、执行阶段
    2.3、出栈、等待回收
3、创建阶段：(站在对象角度能更好的理解)
    3.1、生成变量对象 VO (variable Object)：自身有哪些属性
    3.2、确定作用域链：scopeChain，查找上一级作用域链，类似__proto__
    3.3、确定this指向：这个是函数才有的，对象没有
```

>**创建阶段**

```js
// 一、 生成变量对象 VO
1、类型：global local block (调试区看看到)
2、收集和提升：收集函数调用栈内所有的函数/变量 声明，并且前置（提升）
3、先收集函数（优先级比变量是不是更重要），因为函数有值，所以同名覆盖；
4、对象声明是值为undefined，及避免影响同名函数，所以同名跳过
// 5、大概结构为
// {
//     fun1:<fun1 reference>,
//     fun2:<fun2 reference>,
//     a:undefined,
//     b:undefined
// }

// 二、 确定作用域链 scopeChain
1、执行本函数时，赋值给本函数作用域链
2、父函数出栈时，赋值给本函数作用域链

// 三、确定this指向
1、谁调用指向谁
2、call/apply/bind可以指定this指向
3、箭头函数的this为上一级非箭头函数的this

// call/apply/bind模拟
模拟call：支持多参
Function.prototype.call1 = function (ctx,...args) {
    // 对ctx装包
    ctx = ctx && new Object(ctx) || window
    const proto = Symbol()
    ctx[proto] = this
    const result = ctx[proto](...args)
    delete ctx[proto]
    return result
}
模拟apply：只支持传一个形参
Function.prototype.apply1 = function (ctx,args) {
    // 对ctx装包
    ctx = ctx && new Object(ctx) || window
    const proto = Symbol()
    ctx[proto] = this
    const result = ctx[proto](args)
    delete ctx[proto]
    return result
}
模拟bind :不会立马执行，只是指定了this(后续改不了)及部分参数
Function.prototype.bind1 = function (ctx,...args) {
    // 对ctx装包
    ctx = ctx && new Object(ctx) || window
    const proto = Symbol()
    ctx[proto] = this
    // 既然绑定的this是后续改不了的。也就是这里返回的是一个函数，内部固定这个对象调用
    return function(...newArgs) {
        const result = ctx[proto](...args,...newArgs)
        delete ctx[proto]
        return result
    }
}

// call/apply/bind作用总结
1、设置this指向
2、执行通用方法，有的还有伪数组=>数组 功能
3、apply 还有 ...args作用
```

>**执行阶段**

```js
// VO(variable Object)->AO(activation Object)

1、对 变量对象VO 执行 读取操作（赋值，取值）
// 创建阶段VO只是收集和提升，变量值为undefined，只有执行阶段赋值之后才有值

2、例子
// 作用：描述函数和变量提升的区别，及创建阶段和指向阶段做了什么
// function f1(){console.log('1')}
// var a = 1
// function f1(){console.log('2')}
// f1()
// var f1 = 3
// console.log(f1)
// f1 = 4
// console.log(f1)

创建阶段，创建AO
// 提升f1
AO = {
    f1: function(){console.log('1')},
}
// 提升f1(是同名函数，直接覆盖)
AO = {
    f1: function(){console.log('2')},
}
// 已经没有函数声明了，再提升变量，提升a变量
AO = {
    f1: function(){console.log('2')},
    a：undefined
}
// 提升f1变量，和前面同名，跳过

//此时，已经完成AO的创建

执行阶段,AO->AO
// 执行 f1()：此时输出 AO中的f1,执行后输出2
// 执行 f1 = 3：此时 AO中的f1赋值为，3
// 执行  console.log(f1) ： 此时 输出 AO中的f1为 3
// 执行 f1 = 4：此时 AO中的f1赋值为，4
// 执行  console.log(f1) ： 此时 输出 AO中的f1为 4
```

>**闭包概念**

```js
1、上面有分析，执行上下文会创建VO:这是内部变量的访问机制

2、那外部变量的访问机制是什么呢？ 其实就是作用域链：scopeChain
    // 相比于对象的_proto_,函数的要复杂一些
    // 对象的_proto_，保存在函数(构造函数)的prototype中
    // 函数的作用域链，保存在函数的scopeChain中，存放的是父函数栈的部分ES
3、scopeChain生成时机：
// 执行本函数时，赋值给本函数作用域链
// 父函数出栈时，赋值给本函数作用域链
// 所以：用域链是定义时确定，永远不会改变（符合思维逻辑）

4、由以上概念，得到闭包概念：即函数执行，访问了外部（非global）中的变量，就会产生闭包， => 调试中的 Closure


5、梳理下函数内访问机制：（类比对象的继承，触类旁通）
// 1、内部变量访问机制：收集及提升内部函数/变量
// 2、上级及../变量访问机制：作用域链，对应 调试中的 Closure（函数内部的函数都有！！）
// 3、全局变量访问机制：global
// 以上所有变量的访问：对应 调试 中的 scope

6、闭包作用：
1、作用域链
2、私有属性 => 模块化
```

>**内存管理**

```js
内存分配：当我们申明变量、函数、对象的时候，系统会自动为他们分配内存
内存使用：即读写内存，也就是使用变量、函数等
内存回收：使用完毕，由垃圾回收机制自动回收不再使用的内存

内存回收算法

1、引用计数
// 简单理解就是没有地址指向该内存
// 弊端：存在循环引用 如A.a === B地址；B.b === A地址
// 导致AB的内存都有对象指向。虽然AB不再使用

2、标记清除
// 无法达到的对象的对象释放内存
// 解决了循环引用的问题

3、策略
// 由上可知，系统会自动回收内存
// 毕竟时系统自动回收，所以有些变量系统会认为我们还需要 就会造成内存泄漏
// 如：定时器，闭包，变量等
3.1、减少全局变量的定义
3.2、减少非必要的闭包使用
3.3、减少非必要的回调的使用
3.4、对于不需要的设置null即可。这样就会让其内存无法到达自动释放
```

# 七、js单线程和事件循环(Event Loop)

```js
js是多线程执行
还有有一个基于事件循环的并发模型

机制：
先执行宏任务队列中的一个，执行完后，检查微任务队列，执行所有可执行的微任务


宏任务：
1、DOM Binding模块：事件绑定
2、network模块：ajax / fetch
3、timer模块：setTimeout / setInterval / setImmediate (Node环境中)
4、requestAnimationFrame

微任务：
1、Promise
2、MutationObserver
```
