const noop = function() {};
const nonCyclePageInterceptor = [];
let nonCyclePageReturnPageInterceptor = { onShareAppMessage: [] };
const appInterceptor = {
    onLaunch: [], onShow: [], onHide: [], onError: []
};
export const pageInterceptor = {
    onLoad: [], onReady: [], onShow: [], onHide: [], onUnload: []
};
export const nonCycleComponentInterceptor = [];
/**
 * 增加对App生命周期方法的拦截器
 * @param cycleMethodName
 * @param handler
 */
export function addAppInterceptor(cycleMethodName, handler) {
    appInterceptor[cycleMethodName].push(handler);
}

/**
 * 增加对Page生命周期方法的拦截器
 * @param cycleMethodName
 * @param handler
 */
export function addPageInterceptor(cycleMethodName, handler) {
    pageInterceptor[cycleMethodName].push(handler);
}

/**
 * 拦截Page中除了生命周期方法以外的所有方法
 * @param handler
 */
export function addPageInterceptorAllExceptCycle(handler) {
    nonCyclePageInterceptor.push(handler);
}

/**
 * 拦截Page中除生命周期方法以外指定方法的返回值
 * @param methodName
 * @param handler
 */
export function addPageInterceptorAllExceptCycleReturn(methodName, handler) {
    if (!nonCyclePageReturnPageInterceptor[methodName]) nonCyclePageReturnPageInterceptor[methodName] = [];

    nonCyclePageReturnPageInterceptor[methodName].push(handler);
}

/**
 * 拦截Component所有方法
 * @param handler
 */
export function addComponentInterceptorAllExceptCycle(handler) {
    nonCycleComponentInterceptor.push(handler);
}

/**
 * 小程序App方法的替代实现，目的是在框架层面上为app.js中定义的对象增加一些统一的能力
 * 这里写的代码都是业务无关的。与业务相关的，请放在app.js对应的声明周期方法中实现
 */

const wxApp = App;

export function commonIntercept(sourceMethod, interceptList, methodName = '') {
    return function () {
        interceptList.forEach(interceptMethod => {
            interceptMethod.apply(this, Array.prototype.slice.call(arguments).concat([sourceMethod ? sourceMethod.name : methodName]));
        });
        return sourceMethod && sourceMethod.apply(this, arguments);
    }
}

/**
 * 拦截函数返回值
 */
function _combineReturnIntercept(sourceMethod, interceptList) {
    if (!interceptList || !interceptList.length) return sourceMethod;

    return function () {
        let ret = sourceMethod && sourceMethod.apply(this, arguments);

        interceptList.forEach(interceptMethod => {
            ret = interceptMethod.apply(this, [ret].concat(Array.prototype.slice.call(arguments)))
        });

        return ret;
    }
}

/**
 * 统一拦截声明周期方法
 * @param appObject
 */
App = function (appObject) {
    Object.keys(appInterceptor).forEach(cycleMethod => {
        const sourceMethod = appObject[cycleMethod];
        appObject[cycleMethod] = commonIntercept(sourceMethod, appInterceptor[cycleMethod], cycleMethod);
    });
    return wxApp(appObject);
};

/**
 * 小程序Page方法的替代实现
 */

const wxPage = Page;
/**
 *
 * @param pageObject
 */
Page = function (pageObject) {
    Object.keys(pageInterceptor).forEach(cycleMethod => {
        if(!pageObject[cycleMethod]) {
            pageObject[cycleMethod] = noop;
        }
    });
    Object.keys(pageObject).forEach(keyName => {
        if (typeof pageObject[keyName] === 'function') {
            const sourceMethod = pageObject[keyName];
            if (pageInterceptor[keyName]) {//生命周期方法
                pageObject[keyName] = commonIntercept(sourceMethod, pageInterceptor[keyName]);
            } else {
                pageObject[keyName] = commonIntercept(sourceMethod, nonCyclePageInterceptor);
                // 拦截方法的返回
                pageObject[keyName] = _combineReturnIntercept(pageObject[keyName], nonCyclePageReturnPageInterceptor[keyName]);
            }
        }
    });
    return wxPage(pageObject);
};

const wxComponent = Component;
if (wxComponent) {
    Component = function (componentObject) {
        const methods = componentObject.methods;
        if (methods) {
            Object.keys(methods).forEach(keyName => {
                const sourceMethod = methods[keyName];
                methods[keyName] = commonIntercept(sourceMethod, nonCycleComponentInterceptor);
            });
        }
        return wxComponent(componentObject);
    };
}
