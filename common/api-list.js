let URL = {
    index: {
        list: 'https://z.mln.ren/api/coupon/front/ac/listbytype',
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
        shop: 'https://z.mln.ren/api/shopAccount/front/add',
        getAddress: 'https://z.mln.ren/api/waiterShop/front/shopdetail/'
    },
    verification: {
        code: 'https://z.mln.ren/api/couponGiveOutRecord/front/usecouponrecord',
        list: 'https://z.mln.ren/api/couponGiveOutRecord/front/shopcouponrecord',
    },
    shop: {
        list: 'https://z.mln.ren/api/shopAccount/front/getuncheckedaccount',
        audit: 'https://z.mln.ren/api/shopAccount/front/passshopaccount'
    }
}

export default URL;