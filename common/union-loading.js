/**
 * Created by white.wang on 2018/5/15.
 */

class UnionLoading {
    constructor(options = {}){
        this.loadingNumber = 0;
        this.loadingHideTimer = null;
        this.isNavigationBarLoading = typeof options.isNavigationBarLoading === 'boolean' ? options.isNavigationBarLoading : false;
    }
    show({title}={}){
        this.loadingNumber++;
        clearTimeout(this.loadingHideTimer);
        if(this.isNavigationBarLoading){
            wx.showNavigationBarLoading();
        } else {
            wx.showLoading({
                title: title || ''
            });
        }
    }
    hide(){
        this.loadingNumber--;
        clearTimeout(this.loadingHideTimer);
        if(this.loadingNumber<=0){
            this.loadingNumber = 0;
            this.loadingHideTimer = setTimeout(()=>{
                if(this.isNavigationBarLoading){
                    wx.hideNavigationBarLoading()
                } else {
                    wx.hideLoading();
                }
            }, 200);
        }
    }
}

let unionLoading = new UnionLoading();
let unionBarLoading = new UnionLoading({isNavigationBarLoading: true});
export {unionLoading, unionBarLoading};