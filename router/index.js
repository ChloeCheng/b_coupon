/**
 * 路由跳转规则
 * @author jackieLin <dashi_lin@163.com>
 */
module.exports = {
    // 首页
    'pages/index/index': {
        'rankList/rankList': [
            {
                path: [],
                method: 'back',
                matchAll: false
            }
        ],
        'fulishe/pages/redPacket/redPacket': [
            {
                path: ['fulishe/pages/redPacket/redPacket'],
                method: 'back',
                matchAll: false
            }
        ]
    },
    '*': { // 表示任意页面
        '*': [
            {
                path: ['fulishe/pages/myCoupon/myCoupon'],
                matchAll: false
            }
        ]
    }
}
