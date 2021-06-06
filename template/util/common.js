
/** console相关  */
export function log(msg) {
    console.log(msg)
}
export function error(msg) {
    const _error = new Error(msg)
    console.error(_error.stack.split('\n')[1],_error)
    return _error
}
// 执行时间
export function executionTime(func = isRequire(()=>{}), ...params) {
    if(isType(func,'function')) {
        const start = getDate()
        const result = func(...params)
        const template = () => `${fn.name}执行时间:${getDate() - start}ms`
        if(isType(result,'promise')) {
            result.finally(() => template())
        } else {
            template()
        }
        return result
    }
}

/** get相关  */
// 获取类型
export function getType(v){
    let type = Object.prototype.toString.call(v)
    type = type.split(' ')[1].slice(0,-1)
    return Object.is(v,NaN) ? 'nan' : type.toLowerCase()
}
// 获取值，链式获取
export function getValue(obj,path = '',defaultValue = ''){
    const keys = path.split('.')
    let result = obj
    if(isReference(obj)) {
        keys.forEach(key => {
            result = isDef(result[key]) ? result[key] : defaultValue
        })
    }
    return result
}
// toString的兼容版本 用于不确定 v 是否 isDef情况
export function getString(v) {
    return isDef(v) ? v.toString() : ''
}
// 获取长度:数组/类数组 对象 字符串
export function getLength(v) {
    return isArrayLike(v) ? Array.from(v).length
    : isType(v,'object') ? Object.keys(v).length
    : v.toString().length
}
// 获取真正的长度：区分汉字
export function getRealLength(v) {
    return isType(v, 'string') ? v.replace(/[\u0391-\uFFE5]/g,"**").length
    : getLength(v)
}
// 获取日期 @formater 'YYYY-MM-DD hh:mm:ss w' [可以缺省，字符串，对象] @number为 +/-多少ms
export function getDate(date, formater, number) {
    date = date ? new Date(date) : new Date()
    const newDate = number ? new Date(date.getTime() + number) : date
    if(!formater) return newDate.getTime()
    let Y = newDate.getFullYear() + '',
    M = fixedwidth(newDate.getMonth() + 1,2),
    D = fixedwidth(newDate.getDate(),2),
    H = fixedwidth(newDate.getHours(),2),
    m = fixedwidth(newDate.getMinutes(),2),
    s = fixedwidth(newDate.getSeconds(),2),
    w = newDate.getDay();
    w = w || 7
    const W = ['','一','二','三','四','五','六','日'][w]
    const formaterType = getType(formater)
    if(formaterType === 'object') {
        return {...formater,Y,M,D,H,m,s,w,W}
    } else if(formaterType === 'string') {
        return formater.replace(/YYYY/g,Y).replace(/YY/g,Y.substring(2))
        .replace(/MM/g,M).replace(/DD/g, D)
        .replace(/hh/g, H).replace(/mm/g, m).replace(/ss/g,s)
        .replace(/w/g,w).replace(/W/g,W)
    }
}
// 获取日期，距现在 过去多久
export function getDateRelative(date , formater = 'YYYY-MM-DD hh:mm') {
    date = date ? new Date(date) : new Date()
    let relativeTime = Date.now() - date.getTime()
    if(relativeTime >= 0) {
        if(relativeTime < 1000 * 60) {
            return `近1分钟`
        } else if(relativeTime < 1000 * 60 * 60) {
            return `${parseInt(relativeTime / (1000 * 60))}分钟前`
        } else {
            return getDate(date, formater)
        }
    } else {
        relativeTime = Math.abs(relativeTime)
        if(relativeTime < 1000 * 60) {
            return  `剩余${parseInt(relativeTime / 1000)}s`
        } else if(relativeTime < 1000 * 60 * 60) {
            return `剩余${parseInt(relativeTime / (1000 * 60))}分钟`
        } else {
            return getDate(date, formater)
        }
    }
}

/** is判断  */
// 是否定义
export function isDef (v){
    return v !== undefined && v !== null
}
// 是否需要参数,不能为undefined
export function isRequire(defaultValue,isStrict = false) {
    const _error = error('need params')
    if(isStrict) {
        throw _error
    } else {
        return defaultValue
    }
}
// 是否相等或字符串时等于其中一个
export function isEqual(v,target) {
    if(isType(v,'string')) {
        target = target.split(',')
        return target.some(i => i === v)
    } else {
        return Object.is(v,target)
    }
}
// 是否是该类型
export function isType(v, type) {
    return getType(v) === type
}
// 是否是引用类型
export function isReference(v) {
    return (typeof v === 'object' || typeof v === 'function') && v !== null
}
// 是否合法的索引
export function isValidArrayIndex (index) {
    index = parseFloat(String(index))
    return index >= 0 && Math.floor(index) === index && isFinite(index)
}
// 是否是类数组 包括array set map 及类数组对象
export function isArrayLike(v) {
    const type = getType(v)
    return isEqual(type,'array,set,map') || (type === 'object' && isValidArrayIndex(v.length))
}

/** 数组相关  */
// 数组去重
export function setArray(arr = [], path = '') {
    const set = new Set()
    let value
    let isRepeat = false
    return arr.filter(i => {
       value = getValue(i,path)
       isRepeat = set.has(value)
       if(!isRepeat) set.add(value)
       return !isRepeat
    })
}
// 排序 @isAsc 默认升序
export function sortArray(arr = [], path = '',isAsc = true) {
    let leftValue
    let rightValue
    isAsc = isAsc ? -1 : 1
    return clone(arr).sort((l,r) => {
        leftValue = getValue(l, path)
        rightValue = getValue(r, path)
        return leftValue < rightValue ? isAsc
        : leftValue > rightValue ? !isAsc
        : 0
    })
}
// fill的 深clone版本 主要用于fill的时引用类型，可以用clone斩断关联
export function fillArray(arr = [], ...params) {
    return clone(arr.fill(...params))
}
// Object.fromEntries() 是 Object.entries 的反转 这里做兼容版
export function fromEntries(entries) {
    let result = {}
    if(isArrayLike(entries)) {
        const array = Array.from(entries)
        let isValidItem 
        array.some(i => {
            isValidItem = isType(i,'array') && i.length === 2
            isValidItem ? result[i[0]] = i[1] : result = {}
            return !isValidItem
        })
    }
    return result
}

/** 函数相关  */
// 防抖
export function debounce(cb,delay,isImmeditate) {
    let timeoutId = '' //''代表是空暇时间
    return (...params) => {
        if(timeoutId) clearTimeout(timeoutId)
        if(!timeoutId && isImmeditate) {
            // 空暇时间 且 需要立马执行
            cb(params)
            timeoutId = setTimeout(() => {
                timeoutId = ''
            }, delay)
        } else {
            // 非空暇时间 则 开启新的计时器
            timeoutId = setTimeout(() => {
                cb(params)
                timeoutId = ''
            }, delay)
        }
    }
}
/** dom相关  */
// 查询
export function query (el) {
    let selected = el
    if (isType(el,'string')) {
      selected = document.querySelector(el)
      if (!selected) {
        error(`${el}没有找到`)
        selected = document.createElement('div')
      }
    }
    return selected
}
// 获取元素位置
export function getElePosition(el) {
    el = el ? query(el) : (document.documentElement  || document.body)
    const client = {
        height: el.clientHeight, // 内容区 + padding
        width:  el.clientWidth
    }
    const offset = {
        height: el.offsetHeight, // 内容区 + padding + border
        width: el.offsetWidth,
        top: el.offsetTop, // 查找已定位的父容器 或Body 相对于其内容区
        left:el.offsetLeft
    }
    const scroll = {
        height: el.scrollHeight, // 包括 滚动条 
        width: el.scrollWidth,
        top: el.scrollTop, // 针对容器元素，否则返回0
        left:el.scrollLeft
    }
    return { client,offset,scroll}
}
// 设置/获取文档/容器元素 滚动信息 如果需要过渡效果，可以配合animationModifyValue
// 如果要滚动到某个子节点那里，则需要自身是定位元素，获取该字节的的offsetTop => topNumber 即可
export function scrollPosition(el,topNumber,leftNumber) {
    el = el ? query(el) : (document.documentElement  || document.body)
    if(topNumber) {
        el.scrollTop = topNumber
    }
    if(leftNumber) {
        el.scrollLeft = leftNumber
    } else {
        return {
            top: el.scrollTop,
            left: el.scrollLeft
        }
    }
}
// 下载脚本
export function downloadFile(filename, src){
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.filename = filename
        script.src = src
        script.async = 'async'
        document.head.appendChild(script)
        script.onload = () => resolve()
        script.onerror = () => reject()
    }).finally(()=> document.head.removeChild(script))
}
// js实现dot...
export function dots(str,length = 6,char = '') {
    const strLength = getRealLength(str)
    const charLength = getRealLength(char)
    if(length <= charLength) return error('length 长度不符合')
    return strLength > length ? str.slice(0,length - charLength) + char : str
}
// 存储
export function getLocalStorage(key) {
    let storageValue = localStorage.getItem(key)
    // 是否过了有效期
    if(storageValue) {
        storageValue =  JSON.parse(storageValue)
        // 兼容非setLocalStorage 来存储时的读取
        if(storageValue.expiresDate === undefined) {
            if(storageValue.expiresDate.getTime() < Date.now()) {
                localStorage.removeItem(key)
                return null
            } else return storageValue.value
        }
    }
    return storageValue
}
// 增加有效期@expiresDate 默认有效期一个月
export function setLocalStorage(key, value, expiresDate) {
    const storageValue = {
        value,
        expiresDate: expiresDate ? new Date(expiresDate) : new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    }
    localStorage.setItem(key,JSON.stringify(storageValue))
}
// 获取url参数
export function getUrlParams(url = window.location.href) {
    if(!isType(url,'string')) return error('url 类型 应该为字符串')
    let index = url.indexOf('?')
    let search = index !== -1 ? url.slice(index + 1) : url
    return search.split('&').map(i => {
        let firstEqual = i.indexOf('=')
        return {
            [i.slice(0,firstEqual)] : decodeURIComponent(i.slice(firstEqual + 1))
        }
    })
}
// 帧动画 如果要执行多次，在cb内根据条件再次调用即可
export function requestAnimaFrame (cb) {
    const animaFrame = window.requestAnimationFrame || (cb => setTimeout(cb, 1000 / 60))
    return animaFrame(cb)
}
// 动画修改某个值，至目标值 可以在回调中拿到值进行需要的操作
// @thresholdValue 执行cb的阈值，避免频繁调用浪费资源
function animationModifyValue(v = 0, target = 100,duration = 300, thresholdValue = 1,cb = (v) => {
    // 精度处理formatNumber;赋值操作等    
    console.log(v)
}) {
   let times = (target - v !==0) ? Math.ceil(duration / (1000 / 60 )) : 1
   const diff = (target - v) / times
   let lastCbValue = v
   const animationCb = () => {
       if(--times > 0) {
           v += diff
           if(Math.abs(v - lastCbValue) >= Math.abs(thresholdValue)) {
               lastCbValue = v
               cb(v)
           }
           requestAnimaFrame(animationCb)
       }else {
           cb(target)
       }
   }
   requestAnimaFrame(animationCb)
}

/** 其它常用utils  */
// 格式化数字
export function formatNumber(v,options){
    const defaultOptions = {
        adjust: true, // 是否自适应 => 万/亿/万亿
        decimals: 2, // 精确度
        isFixed: false, // 精确度是否固定
        separator: '', // 分隔符
        width:'', // 固定宽度为多少
        unit:'', // 后缀单位
        char:'--' // 非数字返回的填充字符
    }
    const mergeOptions = {
        ...defaultOptions,
        ...options
    }
    const {adjust,decimals,isFixed,separator,width,unit,char} = mergeOptions
    if(getType(v) === 'number') {
        v = Number(v)
        let NumberUnit = ''
        // 自适应
        if(adjust) {
            ({value:v,unit:NumberUnit} = _adjustNumber(v))
        }
        // 精确度
        if(isDef(decimals)) {
            v = _decimalsNumber(v, decimals,isFixed)
        }
        // 分隔符
        if(separator) {
            v = _separatorNumber(v, separator)
        }
        // 固定多少位
        if(width) {
            v = fixedwidth(v, width)
        }
        // 单位
        v += NumberUnit + unit
    } else {
        v = char
    }
    return v
}
// 数字自适应单位
function _adjustNumber(v) {
    v = Number(v)
    const unitMap= [
        {unit:'万亿',length:13},
        {unit:'亿',lenght:9},
        {unit:'万',length:5}
    ]
    let unit = ''
    const integerLength = (v +'.').indexOf('.')
    const execute = (i) => {
        v = v / Math.pow(10,i.length - 1)
        unit = i.unit
        return true
    }
    unitMap.some(i => {
        return integerLength > i.length && execute(i)
    })
    return {
        value:v,
        unit
    }
}
// 精确数字 @isFixed 是否固定这个精确度
function _decimalsNumber(v,decimals = 2,isFixed = false) {
    v = Number(`${Math.round(`${v}e${decimals}`)}e-${decimals}`)
    if(isFixed) {
        v = v.toString().split('.')
        v = v[0] +'.' + fixedwidth(v[1],decimals,'0','after')
    }
    return v
}
// 分割数字
function _separatorNumber(v,separator = ',') {
    v = getString(v).split('.')
    v[0]=v[0].split('').reverse()
    .reduce((total,i,index,arr) => total += i + (index % 3 === 2 && (index !== arr.length - 1) ? separator : ''),'')
    .split('').reverse().join('')
    v[1] = v[1] ? ('.' + v[1]) : ''
    return v[0] + v[1]
}
// 固定多少位
export function fixedwidth(v, width, char = '0', fillBeforeOrAfter = 'before') {
    v = getString(v)
    return fillBeforeOrAfter === 'before' ? (Array(width).fill(char).join('') + v).slice(-width)
    : (v + Array(width).fill(char).join('')).slice(0,width)
}
// 拷贝 @isErialize from是否可以序列化 注意copy也会斩断自身key对相同对象的引用关系
export function clone(from = isRequire({}), isErialize = true) {
    const deepClone = (_from) => {
        const type = getType(_from)
        let to =  _from
        if(type === 'object') {
            to = {}
            for(const key in _from) {
                to[key] = deepClone(_from[key])
            }
        } else if(type === 'array') {
            to = []
            for(const value of _from) {
                to.push(deepClone(value))
            }
        } else if(type === 'set') {
            to = new Set()
            for(const value of _from) {
                to.add(deepClone(value))
            }
        } else if(type === 'map') {
            to = new Map()
            for(const [key,value] of _from) {
               to.set(key,deepClone(value))
            }
        }
        return to
    }
    return isErialize ? JSON.parse(JSON.stringify(from)) : deepClone(from)
}
// 常用正则表达式校验：列表根据业务需求添加进来
export function test(v,type) {
    const regexp = {
        'phone': /^1[3|4|5|6|7|8][0-9]{9}$/, //手机号
      };
      return regexp[type].test(v)
}
