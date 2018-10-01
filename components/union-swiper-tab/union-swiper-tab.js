// components/union-swiper-tab/union-swiper-tab.js
/**
 * onfire.fire('page-scroll', scrollTop);
 */

import * as util from '../../common/utils.js';
import {endounce} from "../../common/utils";
import PageEventFire from '../../common/pageEventFire.js';

Component({
    options: {
        multipleSlots: true
    },
    /**
     * 组件的属性列表
     */
    properties: {
        tabs: {
            type: Array,
            value: [],
            observer: '_handleTabDataChange'
        },
        tabPadding: {
            type: Number,
            value: 46
        },
        tabSlugWidth: {
            type: Number,
            value: 76
        },
        tabCustomClass: {
            type: String,
            value: ''
        },
        marginStyle: {
          type: Boolean,
          value: false
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        activeTabIndex: 0,
        swiperHeight: 150,
        tabFixed: false,
        swiperMinHeight: 150
    },

    /**
     * 组件生命周期函数，在组件布局完成后执行，此时可以获取节点信息
     */
    ready(){
        this.tabStickyEvent = PageEventFire.on('page-scroll', scrollTop=>{
            endounce(()=>{
                this.handleTabSticky(scrollTop);
            }, this, 20);
        });
        this.updateSwiperMinHeight();
    },

    detached(){
        PageEventFire.un(this.tabStickyEvent);
    },

    /**
     * 组件的方法列表
     */
    methods: {
        _handleTabDataChange(){
            this.updateSwiperHeight();
        },
        updateSwiperMinHeight(){
            this.getWindowHeight().then(windowHeight=>{
                this.getTabHeight().then(tabHeight=>{
                    this.setData({
                        swiperMinHeight: windowHeight-tabHeight
                    });
                });
            });
        },
        getWindowHeight(){
            return new Promise(resolve=>{
                wx.getSystemInfo({
                    success: obj=>{
                        resolve(obj.windowHeight);
                    }
                });
            });
        },
        getTabHeight(){
            if(!wx.createSelectorQuery) return Promise.resolve(34);
            return new Promise(resolve=>{
                let querySelector = wx.createSelectorQuery().in(this),
                    nodeRef = querySelector.select('.tab-inner');
                nodeRef.boundingClientRect(rect=>{
                    resolve(rect.height);
                });
                querySelector.exec();
            });
        },
        updateSwiperHeight(){
            util.throttle(function(){
                let index = this.data.activeTabIndex;
                if(wx.createSelectorQuery){
                    let selectorQuery = wx.createSelectorQuery().in(this),
                        nodesRef = selectorQuery.selectAll('.union-swiper-tab-item');
                    nodesRef.boundingClientRect(rects=>{
                        let rect = rects[index],
                            height = rect.height;
                        if(height<this.data.swiperMinHeight) height = this.data.swiperMinHeight;
                        this.setData({
                            swiperHeight: height
                        });
                    });
                    selectorQuery.exec();
                } else {
                    let tabData = this.data.tabs[index].data;
                    //一个item差不多250高
                    this.setData({
                        swiperHeight: tabData.length * 250
                    });
                }
            }, this, 50);
        },
        updateActiveTab(index){
            let tab = this.data.tabs[index];
            this.setData({
                activeTabIndex: index
            });
            this.triggerEvent('tabchange', {index, tab});
            this.updateSwiperHeight();
        },
        handleTabInput(event){
            this.updateActiveTab(event.detail.index);
        },
        handleSwiperChange({detail}){
            if(detail.source === 'touch'){
                this.updateActiveTab(detail.current);
            }
        },
        /**
         * 处理页面滚动，tab置顶效果
         * @param scrollTop
         */
        handleTabSticky(scrollTop){
            if(!wx.createSelectorQuery) return;
            if(!this.tabQuerySelector){
                let querySelector = wx.createSelectorQuery().in(this),
                    nodeRef = querySelector.select('.tab-wrapper');
                nodeRef.boundingClientRect(rect=>{
                    let top = rect.top,
                        isFixed = this.data.tabFixed;
                    if(top<=0 && !isFixed){
                        this.setData({
                            tabFixed: true
                        });
                    } else if(top>0 && isFixed) {
                        this.setData({
                            tabFixed: false
                        });
                    }
                });
                this.tabQuerySelector = querySelector;
            }
            this.tabQuerySelector.exec();
        },
        handleRefreshTap(){
            let index = this.data.activeTabIndex,
                tab = this.data.tabs[index];
            this.triggerEvent('refresh', {index, tab});
        }
    }
})
