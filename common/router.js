const util = require('./utils');

import {route, routeMap, reLaunchPath, navigatePath} from '../router/route'

const routeType = {
    navigateTo: 'navigateTo',
    redirectTo: 'redirectTo',
    reLaunch: 'reLaunch',
    navigateBack: 'navigateBack'
}

let beforeEachHandler

/**
 * 参数比较、from的参数如果to都包含并正确就符合、因为自动参数转换会导致新参数和旧参数不能像以前一样严格比较
 * @param from
 * @param to
 */
function compareTo(to, from){
    for(let i in from){
        if(from[i] != to[i]){
            return false
        }
    }
    return true
}

/**
 * 页面跳转
 * @param {string} path 为页面路径，建议使用以下格式为：pages/index/index，前面不含/，并且不含任何参数
 * @param {object} options 为页面参数，是 object 对象
 * @param {function} success 成功回调
 * @param {function} fail 失败回调
 */
exports.routeTo = function(path, options, success, fail) {
    let pageCount = util.getPagesCount();
    let currentPage = getCurrentPages()[pageCount - 1];
    let currentRoute = currentPage.route || currentPage.__route__;
    if (path.indexOf('/') == 0) {
        path = path.slice(1);
    }
    let realPath = path.replace(/\?.*$/, '')
    realPath = route[realPath] && route[realPath].path || realPath
    // 若前往页面的路径和参数跟页面栈中的上一个是一致，直接回退；若非一致，新打开
    if (pageCount > 1) {
        let lastPage = getCurrentPages()[pageCount - 2];
        let lastRoute = lastPage.route || lastPage.__route__;
        if (realPath.indexOf(lastRoute) == 0 && compareTo(lastPage.options, options)) {
            exports.goBack();
            return ;
        }
    }
    // 若为 reLaunch 页面
    if (reLaunchPath.test(realPath)) {
        // 当前版本支持 reLaunch
        if (wx.reLaunch) {
            navigator(routeType.reLaunch, path, options, success, fail);
        } else {
            navigator(routeType.redirectTo, path, options, success, fail);
        }
        return ;
    }

    // 当前页面栈深度不超过9，目前页面栈最大深度为10，需预留1层
    if (pageCount < 9) {
        navigator(routeType.navigateTo, path, options, success, fail);
    } else {
        let flag = false;
        let item = null;
        // 满9层后，正常是替换redirect。若为配置中的current页面，判断是否extra页面，若是，则替换，若不是，则新开页面
        for (let i = 0; i < navigatePath.length; i++) {
            item = navigatePath[i];
            if (item['current'].indexOf(currentRoute) == 0) { // 为配置中的特殊页面
                if (item['extra'].indexOf(realPath) == 0 ) {
                    flag = false;
                    break;
                } else { // 需新开页面
                    flag = true;
                }
            }
        }
        if (!flag) {
            navigator(routeType.redirectTo, path, options, success, fail);
        } else {
            navigator(routeType.navigateTo, path, options, success, fail);
        }
    }
}

/**
 * 重定向到某个页面
 * @param {string} path 路径
 * @param {Object} options 请求参数
 * @param {function} success 成功回调
 * @param {function} fail 失败回调
 */
exports.redirectTo = function(path, options, success, fail) {
    navigator(routeType.redirectTo, path, options, success, fail);
}

/**
 * 页面回退
 * @param {int} delta 回退的页面数，默认为1
 */
exports.goBack = function(delta = 1) {
    wx.navigateBack({
        delta
    })
}

/**
* 重启生命周期到某个页面
* @param {string} path 路径
* @param {Object} options 请求参数
* @param {function} success 成功回调
* @param {function} fail 失败回调
*/
exports.reLaunch = function(path, options, success, fail) {
    navigator(routeType.reLaunch, path, options, success, fail);
}

/**
 * 全局路由钩子
 * @param {Function} callback 回调函数
 */

/**
 * 全局路由钩子回调.
 * @callback callback
 * @param {Object} to 目标路由对象
 * @param {Object} from 来源路由对象
 * @param {Function} next 一定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参数, next(false)中断当前的导航
 */

/**
 * 路由对象
 * @param {String} path 统一路由路径（没对匹配的会返回真实路径）
 * @param {String} realPath 页面真实路径
 * @param {Object} param 统一路由参数(没有参数会传入空对象{}）
 */
exports.beforeEach = function(callback) {
    beforeEachHandler = callback
}


/**
 * 实现跳转
 * @param {*} type 跳转的类型
 * @param {*} path 跳转的路径
 * @param {*} options url参数
 * @param {function} success 成功回调
 * @param {function} fail 失败回调
 */
function navigator (type, path, options = {}, success, fail) {
    const pageCount = util.getPagesCount();
    const currentPage = getCurrentPages()[pageCount - 1];
    const currentRoute = currentPage.route || currentPage.__route__;
    const pathArr = /^\/?([^?]+)\??(.*)$/.exec(path)
    // 解析path、可能会带具体的参数比如 /pages/index/index?a=1、进行标准化
    const toPath = pathArr[1]
    const toPathOptions = util.stringToObj(pathArr[2], false)
    for(let i in toPathOptions){
        if(!options.hasOwnProperty(i)){
            options[i] = toPathOptions[i]
        }
    }

    const toRoute = route[toPath]
    const jump = function () {
        if(toRoute){
            for(let i in toRoute.mapParams){
                const key = toRoute.mapParams[i]
                if(options[i]){
                    if(typeof key === 'string'){
                        options[key] = options[i]
                    }else if(typeof key === 'function'){
                        const ans = key(i, options[i])
                        if(ans && ans.name){
                            options[ans.name] = ans.value
                        }
                    }
                }
            }
        }
        const option = {
            url: util.assemblPath(toRoute ? toRoute.path : toPath, options)
        }
        if(typeof success === 'function'){
            option.success = success
        }
        if(typeof fail === 'function'){
            option.fail = fail
        }
        wx[type](option);
    }

    if (beforeEachHandler) {
        try {
            beforeEachHandler({
                path: routeMap[toPath] || toPath,
                realPath: toRoute ? toRoute.path : toPath,
                param: options
            }, {
                path: routeMap[currentRoute] || currentRoute,
                realPath: currentRoute,
                param: {}
            }, function (next) {
                if(next !== false){
                    jump()
                }
            })
        } catch (e) {
            console.warn('beforeEachHandler Error', e)
            jump()
        }
    } else {
        jump()
    }
}


