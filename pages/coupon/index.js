
import ajax from '../../common/ajax.js';
import URL from '../../common/api-list.js';
const router = require('../../common/router.js');
import {parseWeChatQuery} from '../../common/utils.js';
import PageEventFire from '../../common/pageEventFire.js';
const storage = require('../../common/storage.js')
import {autoLogin} from '../../common/login.js';
Page({

    /**
     * 页面的初始数据
     */
    data: {
       useBtn: false, //立即使用按钮
       couponObj: {},   // 券详情
       hideDialog: false,
       hasOverTime: false
    },


    getServerConfig(){
        let app = getApp();
        API.get('user.serverConfig', {
            platform: 'ios',
            appversion: app.globalData.version
        }).then(data=>{
            if(data && data.data){
                this.setData({
                    headImage: data.data.newVerInviteBannerUrl
                });
            }
        });
    },
    handleTabChange({detail}){
        let {tab, index} = detail;
        if(tab.data.length===0){
            // this.getTabItemData(index);
        }
        this.setData({
            'activeTabIndex': index
        });
        // console.log(index)
    },
    handleDoubtTap(){
        wx.showModal({
            content: '1、被邀请的好友自动加入你的团队成为你的队员\r\n2、队员每推广一单，您将额外获得此单收益的10%（您的等级越高，比例越高），队员的收益不受影响\r\n3、自2018年6月14日0点之后的订单才贡献团队收益',
            showCancel: false
        });
    },

    updateInfo(){
        autoLogin().then(data => {
            if(data.login) {
                this.getDetail(query.id);
            }
            
        })
        this.setData({
            hideDialog: false
        });
    },

  
    getCoupon(){
        
        let userid = storage.get('userId');
       
        let self = this;
        return ajax.request((URL.coupon.get + userid + '/' + this.data.couponObj.id), {}, function(data){

            if(data.isSuccess === true){
                wx.showToast({
                    title: '领取成功',
                    icon: 'success',
                    duration: 1500
                });
                setTimeout(function(){
                    wx.switchTab({
                        url: '/pages/user/user'
                    })
                }, 1500)
            } else {
                wx.showToast({
                    title: '你已经领取过，可不能贪心哟～',
                    icon: "none",
                    duration: 1500
                }); 
            }
           
        })

    },
    getDetail(id){
        
        wx.showLoading();
        let self = this;
        return ajax.request((URL.coupon.detail + id), {}, function(data){
            wx.hideLoading();
    
            if(data.isSuccess === true){
                let obj = data.data;
                obj.usefulStartTime = obj.usefulStartTime.split(' ')[0]; //formatTime.formatTime(new Date(obj.usefulStartTime));
                obj.usefulEndTime = obj.usefulEndTime.split(' ')[0]; //formatTime.formatTime(new Date(obj.usefulEndTime));

                self.setData({
                    couponObj: obj,
                    hasOverTime: (new Date().getTime() > new Date(data.data.usefulEndTime).getTime()) ? true : false
                });

               
            }
           
        })

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // this.getServerConfig(); 
        let query = parseWeChatQuery(options);
       
        // this.getInviteIncomeDetail();
        wx.hideShareMenu();
        console.log(query.use)
        this.setData({
            useBtn: (query.use === 'true' ? true : false)
        })
        this.getDetail(query.id);
        /* autoLogin().then(data => {
            if(data.login) {
                this.getDetail(query.id);
            }
        })*/
       
    },

    gotoHome(){
        router.reLaunch('/pages/index/index');
    },

    gotoCPort(){

    },

    gotoCode(){
        router.routeTo('/pages/coupon/code/code');
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
       
    },
    /**
     * 用户滚动页面
     */
    onPageScroll({ scrollTop }){
       
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
      
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
           
        }
    }
})