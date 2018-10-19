
import ajax from '../../../common/ajax.js';
import URL from '../../../common/api-list.js';
const router = require('../../../common/router.js');
import {parseWeChatQuery} from '../../../common/utils.js';
import PageEventFire from '../../../common/pageEventFire.js';
import throttle from '../../../common/lodash.throttle.js';
const storage = require('../../../common/storage.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        keyword:''
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
    
    /**
     * 监听搜索输入
     */
    searchInput: throttle(function (e) {
        const keyword = e.detail.value;
        if (keyword) {
            this.setData({keyword});
        } else {
            this.setData({
                keyword: ''
            });
        }
    }, 500),
    verificationCode(){
        if(!this.data.keyword){
            return
        }
        ajax.request((URL.verification.code), { 
            ShopId: storage.get('shopId'),
            AccountId: storage.get('userId'),
            RecordCode: this.data.keyword
        }, function(data){
            if(data.code === 0){
                router.routeTo('pages/coupon/verification-result/verification-result');
            } else if(data.code === 100004){
                wx.showToast({
                    title: '该优惠券已经使用！',
                    icon: 'none',
                    duration: 1500
                });
            } else{
                wx.showToast({
                    title: '请输入正确的券号！',
                    icon: 'none',
                    duration: 1500
                });
            }
           
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // this.getServerConfig(); 
        let query = parseWeChatQuery(options)
       
        // this.getInviteIncomeDetail();
        wx.hideShareMenu();
       
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
    onPageScroll(){
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
            imageUrl: 'https://a.vpimg3.com/upload/vtd/creatives/20180428/imageuploadrandom/1524888203054.jpg',
            title: '[有人@我]我发现了个免费开店赚钱机会！你赶紧了解下~',
            path: ''
        }
    }
})