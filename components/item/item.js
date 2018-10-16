// pages/shopstore/shop-tab/union-tab.js
const router = require('../../common/router.js');
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        item: {
            type: Object,
            value: {}
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        slugTranslate: 0,
        pageWidth: 750,
        wxShareData: {}
    },

    /**
     * 组件生命周期函数，在组件布局完成后执行，此时可以获取节点信息
     */
    ready(){
        // this.initTab();

        this.setData({
            wxShareData: {
                title: this.data.item.couponDesc,
                path: `/pages/coupon/index?id=${this.data.item.id}`,
                imageUrl: `${getApp().globalData.imgHost}${this.data.item.couponImgURL}`
            }
        })
        console.log(this.data.wxShareData)
    },

    /**
     * 组件的方法列表
     */
    methods: {
        _selectedTabChange(){
            this.updateSlugTranslate();
        },
        initTab(){
            this.updateSlugTranslate();
        },
        updateSlugTranslate(){
            let data = this.data,
                index = data.selectedTabIndex,
                tabWidth = (data.pageWidth - data.padding*2) / data.tabs.length;
            let translate = data.padding;
            translate += (tabWidth-data.slugWidth) / 2;
            translate += tabWidth * index;
            this.setData({
                'slugTranslate': translate
            });
        },
        handleTabTap(event){
            let dataset = event.currentTarget.dataset,
                index = dataset.tabIndex || 0;
            let tab = this.data.tabs[index];
            this.triggerEvent('input', {index, tab});
        },
        gotoDetail(e){
            const {currentTarget:{dataset: {item}}} = e;
            router.routeTo('/pages/coupon/index?id=' + item.id);
        }
    }
})