
import ajax from '../../common/ajax.js';
const router = require('../../common/router.js');
import URL from '../../common/api-list.js';
import {parseWeChatQuery} from '../../common/utils.js';
import PageEventFire from '../../common/pageEventFire.js';
import throttle from '../../common/lodash.throttle.js';
import {autoLogin} from '../../common/login.js';
import storage from '../../common/storage.js';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        auditing: false,
        merchantCode: '', //商户编号
        name: '', //申请人姓名
        mobileNum: '',  // 手机号
        address: '',   //地址
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
     * 监听商户编号输入
     */
    merchantCodeInput: throttle(function (e) {
        const merchantCode = e.detail.value;
        if (merchantCode) {
            this.setData({merchantCode});
        } else {
            this.setData({
                merchantCode: ''
            });
        }
    }, 500),
    getAddressInfo(){
        let self = this;
        if(!self.data.merchantCode){
            return;
        }
        ajax.request(`${URL.customer.getAddress}${self.data.merchantCode}`, 
           {},  function(data){
            if(data.code === 0) {
                self.setData({
                   address: data.entity.shopAddress
               })
            } else {
                wx.showToast({
                    title: '请输入正确的商户编号!',
                    icon: 'none',
                    duration: 1500
                });
                self.setData({
                    address: ''
                }) 
            }
        })
    },
    nameInput: throttle(function (e) {
        const name = e.detail.value;
        if (name) {
            this.setData({name});
        } else {
            this.setData({
                name: ''
            });
        }
    }, 500),

    mobileNumInput: throttle(function (e) {
        const mobileNum = e.detail.value;
        if (mobileNum) {
            this.setData({mobileNum});
        } else {
            this.setData({
                mobileNum: ''
            });
        }
    }, 500),
    /**
     * 提交审核
     */
    submitInfo(){
        if(!this.data.merchantCode){
            wx.showToast({
                title: '请输入商户编号!',
                icon: 'none',
                duration: 1500
            });
            return;
        }
        if(!this.data.name){
            wx.showToast({
                title: '请输入申请人姓名!',
                icon: 'none',
                duration: 1500
            });
            return;
        }
        if(!this.data.mobileNum){
            wx.showToast({
                title: '请输入手机号!',
                icon: 'none',
                duration: 1500
            });
            return;
        }
        if (!getApp().globalData.regexPhone.test(this.data.mobileNum)) {
            wx.showToast({
                title: '手机号格式有误!',
                icon: 'none',
                duration: 1500
            });
            return;
        }
        ajax.request(URL.customer.shop, {
            method:'POST',
            ShopNumber: this.data.merchantCode,
            AccountCustomerId: storage.get('userId'),
            Name: this.data.name,
            Mobile: this.data.mobileNum
        }, data => {
            if (data.code === 0) {
                this.setData({
                    auditing: true
                  })
            }
        });
    },

    showAudit(){
      let option = getCurrentPages()[(getCurrentPages().length-1)].options;  
      console.log(option)
      this.setData({
        auditing: option.audit == 1 ? true : false
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
        this.showAudit();

       
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
        autoLogin().then(data => {
            if(data.login) {
                this.showAudit();
            }
        })
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