/*
存放和业务无关的工具函数
 */

// import {assemblPath} from '../fulishe/common/util.js';

export function assemblPath(path = '', params = {}) {
    let arr = [];
    let url = path;
    // 判断前缀是否有/字符
    if (path.charAt(0) !== '/') {
        url = '/' + path;
    }
    Object.keys(params).forEach(function(item) {
        arr.push(item + '=' + params[item]);
    });
    if (arr.length > 0) {
        if (path.indexOf('?') > -1) {
            url += '&' + arr.join('&');
        } else {
            url += '?' + arr.join('&');
        }
    }
    return url;
};

export function throttle (fn, context, interval, ...args){
    clearTimeout(fn.id)
    fn.id = setTimeout(function (){
        fn.apply(context, args)
    }, interval)
}

export function endounce(fn, context, interval = 20, ...args) {
    const t = +new Date()

    clearTimeout(fn.id)
    if (!fn.time || (t - fn.time) > interval) {
        setTimeout(() => {
            fn.apply(context, args)
        }, 0)
    } else {
        fn.id = setTimeout(() => {
            fn.apply(context, args)
        }, interval)
    }
    fn.time = t
}

// 安卓环境下，部分手机的opts.query返回的string，并非object，需将其转换成object
export function parseWeChatQuery(query){
    let obj = {};
    if (typeof query === 'string') {
        query = query.replace(/{|}|\s/g, '');
        let tmpArr = query.split(',');
        let objArr = [];
        for (let str of tmpArr) {
            objArr = str.split('=');
            obj[objArr[0]] = objArr[1];
        }
    } else if(typeof query === 'object') {
        obj = query;
    }
    return obj;
}

export function getValueByPath(object, prop) {
    prop = prop || '';
    const paths = prop.split('.');
    let current = object;
    let result = null;
    for (let i = 0, j = paths.length; i < j; i++) {
        const path = paths[i];
        if (!current) break;

        if (i === j - 1) {
            result = current[path];
            break;
        }
        current = current[path];
    }
    return result;
};

export function stringToQueryObject(str){
    let qIndex = str.indexOf('?');
    if(qIndex!==-1){
        str = str.substring(qIndex+1);
    }
    let obj = {};
    let strs = str.split('&');
    for(let st of strs){
        if(st){
            let sts = st.split('=');
            sts.length>0 && (obj[sts[0]] = sts[1] || '');
        }
    }
    return obj;
}

export function queryObjectToString(obj, options={}) {
    let str = '';
    if(options.url){
        let urlQueryObj = stringToQueryObject(options.url);
        obj = Object.assign(urlQueryObj, obj);
        str = options.url.replace(/\?.*/, '')+'?';
    }
    let queryString = Object.keys(obj).map(key=>{
        return key+'='+obj[key];
    }).join('&');
    str += queryString;
    return str;
}
export function getCurrentPageUrl() {
    const pageStack = getCurrentPages();
    const length = pageStack.length;
    const currPage = pageStack[length - 1];
    const currPath = currPage.route || currPage.__route__;
    return assemblPath(currPath, currPage.options);
}

/**
 * 返回裁切后的文案
 * @param text
 * @param length 字个数
 */
export function textEllipsis(text, {length}={}){
    //length属性读出来的汉字长度为1
    if(text.length*2 <= length) {
        return text;
    }
    let strlen = 0;
    let s = '';
    for(let i = 0;i < text.length; i++) {
        s = s + text.charAt(i);
        if (text.charCodeAt(i) > 128) {
            strlen = strlen + 2;
            if(strlen >= length){
                return s.substring(0,s.length-1) + "...";
            }
        } else {
            strlen = strlen + 1;
            if(strlen >= length){
                return s.substring(0,s.length-2) + "...";
            }
        }
    }
    return s;
}

/**
 * randomChar: '[a-z]、[A_Z]、[0-9]'
 * @param {*} len 
 */
export function randomCharForSopt(len = 5) {
    var x = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
        tmp = "",
        i = 0;
        len = len || 32;
    for (; i < len; i++) {
        tmp += x.charAt(Math.ceil(Math.random() * 100000000) % x.length);
    }
    return tmp;
}

// 当前页面栈深度
exports.getPagesCount = function () {
    return getCurrentPages().length;
}

/**
 * 将参数字符串转化为对象
 */
exports.stringToObj = function(str, decode = true) {
    str = str.replace(/^[^\?#]*[\?#]/, "");
    let arr
    const obj = {}
    const reg = new RegExp('(?:^|\\&)([^\\=\\&]+)(?:\\=([^\\&]*))?', "g");
    while (arr = reg.exec(str)) {
        const key = decode ? decodeURIComponent(arr[1]) : arr[1]
        obj[key] = decode ? decodeURIComponent(arr[2] || "") : arr[2] || ""
    }
    return obj;
}

/**
 * 组装小程序页面URL和参数
 */
exports.assemblPath = function(path = '', params = {}) {
    let arr = [];
    let url = path;
    // 判断前缀是否有/字符
    if (path.charAt(0) !== '/') {
        url = '/' + path;
    }
    Object.keys(params).forEach(function(item) {
        arr.push(item + '=' + params[item]);
    });
    if (arr.length > 0) {
        if (path.indexOf('?') > -1) {
            url += '&' + arr.join('&');
        } else {
            url += '?' + arr.join('&');
        }
    }
    return url;
};