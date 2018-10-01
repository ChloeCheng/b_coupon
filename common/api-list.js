let URL = {
    index: {
        list: 'https://z.mln.ren/api/coupon/list'  //api/coupon/front/ac/listbytype
    },
    coupon: {
        detail: 'https://z.mln.ren/api/coupon/front/detail/',
        get:'https://z.mln.ren/api/couponGiveOutRecord/front/receive/',
        verification: 'https://z.mln.ren/api/couponGiveOutRecord/front/usecouponrecord'
    },
    user: {
        list: 'https://z.mln.ren/api/couponGiveOutRecord/list',
        login: 'https://z.mln.ren/api/accountCustomer/front/getoradd',
        findunionid: 'https://z.mln.ren/api/wechat/findunionid'
    },
    customer: {
        shop: 'https://z.mln.ren/api/shopAccount/front/add'
    }
}

export default URL;