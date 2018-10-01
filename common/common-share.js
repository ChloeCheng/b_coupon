import {addPageInterceptorAllExceptCycleReturn} from "./interceptor.js";
import * as utils from './utils.js';

const storage = require('./storage.js');



export function onShareAppMessage(ret, shareEvent){
    let shareData = {};
    if(!ret){
        ret = {};
    }
    if(shareEvent.from==='button'){
        shareData = onShareFromButton(ret, shareEvent);
    } else {
        shareData = onShareFromPage(ret, shareEvent);
    }
    console.log(shareData)
    // shareData.path = updateSharePathToStore(shareData.path);

    // https://developers.weixin.qq.com/blogdetail?action=get_post_info&lang=zh_CN&token=&docid=000ce8c3c68e381b9bc609f9d56c01
    // shareData.success = ()=>{
    //     wx.showToast({
    //         title: '分享成功',
    //         icon: 'success'
    //     });
    // }
    // shareData.fail = (error)=>{
    //     let errMsg = error.errMsg;
    //     errMsg = errMsg.replace('shareAppMessage:fail ', '');
    //     if(errMsg!=='cancel'){
    //         wx.showToast({
    //             title: `分享失败${errMsg}`,
    //             icon: 'none'
    //         });
    //     }
    // }
    return shareData;
}

export function onShareFromButton(ret, shareEvent){
    let target = shareEvent.target,
        buttonData = null, pageData = onShareFromPage(ret, shareEvent);
    try{
        buttonData = JSON.parse(JSON.stringify(target.dataset.shareData));
    } catch(e){}
    if(!buttonData){
        return pageData;
    } else {
        return Object.assign(pageData, buttonData);
    }
}

export function onShareFromPage(ret, shareEvent){
    let path = ret.path || utils.getCurrentPageUrl();
    let params = utils.stringToQueryObject(ret.path||'');
    if(params.tra_from) return ret;
    let ucode = storage.get('union_ucode');
    if(ucode){
        //唯享客用户，从列表页点击商品后，会存储商品中的wxSmallCpsSuffix为union-share-cps
        //唯享客用户，直接进入商品详情页，取用户默认scheme（storage中的traInfo）
        params.tra_from = storage.get('union-share-cps') || storage.get('traInfo') || '';
    } else {
        //非唯享客用户，从店铺页面点击商品后，会存储商品的wxSmallCpsSuffixShareBy为union-share-cps
        //非唯享客用户，直接进入商品详情页，取用url中的tra_from（storage中的cps）
        params.tra_from = storage.get('union-share-cps') || storage.get('cps') || '';
    }
    ret.path = utils.queryObjectToString(params, {url: path});
    return ret;
}

export function InterceptOnShare(){
    addPageInterceptorAllExceptCycleReturn('onShareAppMessage', function(ret, shareEvent){
        return onShareAppMessage(ret, shareEvent);
    });
}

export function setCpsTraInfo(){
    let ucode = getUCode();
    if(ucode){
        API.get('account.traInfo', {
            saturn: storage.get('saturn')
        }).then(res=>{
            if(res.data){
                storage.set('traInfo', res.data.replace('tra_from=', ''));
            }
        })
    }
}