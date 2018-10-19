
import ajax from '../../../common/ajax.js';
import URL from '../../../common/api-list.js';
const router = require('../../../common/router.js');
import {parseWeChatQuery} from '../../../common/utils.js';
import PageEventFire from '../../../common/pageEventFire.js';
import {autoLogin} from '../../../common/login.js';
import storage from '../../../common/storage.js';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        headImage: '',
        detail: [],
        noData: false,
        dataResponse: false,
        list: [
            /*{
                couponName: "法拉利专用洗车券",
                id: "0ffbd3ea-6e44-41d8-b040-6f7df801f424",
                usedTime: "2018-10-12 00:00:00",
                verificationName: 'coco'
            }*/
        ],
        tabs: [
            {name: '全部',id: 'ALL', data: [], pageStart: 0, isEnd: false, loading: false},
            {name: '洗车',id: 'carWash', data: [], pageStart: 0, isEnd: false, loading: false},
            {name: '保养',id: 'carKeep', data: [], pageStart: 0, isEnd: false, loading: false}
        ],
        activeTabIndex: 0,
        hideDialog: false,
        itemArray: ['全部','洗车','保养'],   //项目
        itemArrayIndex: 0,
        typeArray: ['全部', '免费券', '代金券', '减免券'],  //分类
        typeArrayIndex: 0,
        isEnd: false,
        page: 0
    },
    gotoSearchSuggest(){
      router.routeTo('/pages/search/search');
    },
    gotoAddCoupon(){
      router.routeTo('/pages/coupon/verification-way/verification-way');
    },
    bindPickerChangeForItem(e){
        this.setData({
            itemArrayIndex: e.detail.value,
            list: [],
            page: 0,
            isEnd: false
        });
        this.getList();
    },

    bindPickerChangeForType(e){
        this.setData({
            typeArrayIndex: e.detail.value
        });

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
     * 洗车/保养/全部
     */
    getTabItemData(tabIndex){
        let tab = this.data.tabs[tabIndex];
        if(tab.loading) return Promise.resolve();
        // if(homeModel[tab.func]){
            let param = `?page=${tab.pageStart+1}&limit=20&couponitem=洗车`;
    
            tab.loading = true;
            // console.log(param)
            return ajax.request((URL.index.list+ '?' + param), {}, function(data){
                tab.loading = false;
                console.log(data);
            })
            
            /*[tab.func](param).then(({list, category})=>{
                tab.loading = false;
                let data = {},
                    tabStr = `activitiesModule.tabs[${tabIndex}]`;
                if(tab.id === 'rank' && !categoryIndex && category.length>0){
                    data[`${tabStr}.categoryList`] = category;
                    this.setData({
                        [`activitiesModule.tabs[${tabIndex}].categoryList`]:category
                    });
                }
                data[`${tabStr}.page`] = tab.page+1;
                data[`${tabStr}.data`] = tab.data.concat(list);
                if(list.length<20){
                    data[`${tabStr}.isEnd`] = true;
                    this.setData({
                        [`${tabStr}.isEnd`]:true
                    });

                }
                // this.setData(data);
                this.setData({
                    [`activitiesModule.tabs[${tabIndex}].activeCategoryIndex`]: categoryIndex || 0,
                    [`activitiesModule.tabs[${tabIndex}].page`]: tab.page+1,
                    [`activitiesModule.tabs[${tabIndex}].data`]: tab.data.concat(list)
                });
                return list;
            });*/
        // }
    },

    getList(pullDown){
        let param = `?shopId=${storage.get('shopId')}&page=${this.data.page+1}&limit=20`;
       
        let self = this;
        if(self.data.isEnd) return;
        wx.showLoading();
        return ajax.request((URL.verification.list + param), {}, function(data){
            wx.hideLoading();
            if(pullDown){
                wx.stopPullDownRefresh();
            }
            if(data.isSuccess === true){
                if(data.data.length < 20){
                    self.setData({
                        isEnd: true
                    }); 
                }
                self.setData({
                    page: self.data.page + 1,
                    list: self.data.list.concat(data.data)
                });
               return self.data.list;
            }
           
        })

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // this.getServerConfig(); 
        let query = parseWeChatQuery(options)
        // wx.hideShareMenu();
        
       
    },

    updateInfo(){
        autoLogin().then(data => {
            if(data.login) {
                this.getList();
            }
            
        })
        this.setData({
            hideDialog: false
        });
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
        this.getList();
        
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
     * 用户滚动页面
     */
    onPageScroll({ scrollTop }){
      PageEventFire.fire('page-scroll', scrollTop);
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.setData({
            itemArrayIndex: 0,
            typeArrayIndex: 0,
            page: 0,
            list: [],
            isEnd: false
        });
        this.getList(true);
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this.getList();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
       
    }
})