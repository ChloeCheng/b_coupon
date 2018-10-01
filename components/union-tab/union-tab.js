// pages/shopstore/shop-tab/union-tab.js

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        tabs: {
            type: Array,
            value: []
        },
        selectedTabIndex: {
            type: Number,
            value: 0,
            observer: '_selectedTabChange'
        },
        padding: {
            type: Number,
            value: 46
        },
        slugWidth: {
            type: Number,
            value: 76
        },
        customClass: {
            type: String,
            value: ''
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        slugTranslate: 0,
        pageWidth: 750,
    },

    /**
     * 组件生命周期函数，在组件布局完成后执行，此时可以获取节点信息
     */
    ready(){
        this.initTab();
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
        }
    }
})