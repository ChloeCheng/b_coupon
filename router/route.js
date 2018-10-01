function mapRoute (obj) {
    const map = {}
    for (let i in obj) {
        if (obj[i].path) {
            map[obj[i].path] = i
        }
    }
    return map
}

// 目前机制是跳转和跳转前判断是分开的，所以新旧路由都要写上
export const reLaunchPath = /\/?pages\/index\/index/;
export const navigatePath = [{
    current: 'fulishe/pages/checkout/checkout',
    extra: 'fulishe/pages/productDetail/productDetail'
}];
export const route = {
    // 'main/pages/test': {
    //     path: 'fulishe/pages/special/special',
    //     mapParams: {
    //         a: function (name, value) {
    //             return {
    //                 name: 'aa',
    //                 value: value * 10
    //             }
    //         }
    //     }
    // },
    'main/main_page': {
        path: 'pages/index/index',
        mapParams: {
            'channel_code': 'channelCode'
        }
    },
    'main/channel': {
        path: 'fulishe/pages/main/channel/index',
    },
    'checkout/address_list': {
        path: 'fulishe/pages/addressList/addressList',
    },
    'productlist/brand': {
        path: 'fulishe/pages/brand/brand',
        mapParams: {
            'brand_id': 'brandId'
        }
    },
    'productdetail/main': {
        path: 'fulishe/pages/productDetail/productDetail',
        mapParams: {
            'product_id': 'goodsId',
            'brand_id': 'brandId'
        }
    },
    'user/center': {
        path: 'fulishe/pages/userCenter/userCenter',
    },
    'user/coupon': {
        path: 'fulishe/pages/myCoupon/myCoupon',
    },
    'userorder/all_deal': {
        path: 'fulishe/pages/orderList/orderList',
    },
    'userorder/detail': {
        path: 'fulishe/pages/order/detail/index',
    },
    'userfav/my_favor': {
        path: 'fulishe/pages/favouriteList/favouriteList',
    },
    'search/classify': {
        path: 'fulishe/pages/classifyProduct/classifyProduct',
    },
    'productlist/classify_search': {
        path: 'fulishe/pages/searchSuggest/searchSuggest',
    },
    'productlist/new_filter_product_list': {
        path: 'fulishe/pages/classifyList/classifyList',
        mapParams: {
            'category_id': 'categoryId',
            'category_title': 'title'
        }
    },
    'productlist/search_product_list': {
        path: 'fulishe/pages/searchList/searchList',
    },
    'login/wx': {
        path: 'fulishe/pages/loginWx/loginWx',
    },
    'login/fds': {
        path: 'fulishe/pages/loginFds/loginFds'
    },
    'login': {
        path: 'fulishe/pages/login/login'
    },
    'login/phone': {
        path: 'fulishe/pages/loginPhone/loginPhone'
    },
    'law_protocal': {
        path: 'fulishe/pages/lawProtocol/index'
    },
    'special/webview': {
        path: 'fulishe/pages/special/special'
    }
}

export const routeMap = mapRoute(route)
