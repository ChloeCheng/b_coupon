
const storage = require('./storage.js')
const ajax = require('./ajax.js')
import URL from './api-list.js';
const getUrl = require('./getPageUrl.js')
const dateFormat = require('./dateFormat.js')
const app = getApp()
var isLogining = false


exports.autoLogin = function(){
  return new Promise(resolve=>{
    if(!storage.get('openId') || !storage.get('userId')){
      wx.getSetting({
        success(res) {
            if (res.authSetting['scope.userInfo']) {
               getApp().globalData.authSettingUserInfo = true;
                // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                wx.getUserInfo({
                  withCredentials: true,
                  success: function(res) {
                    app.globalData.userInfo = res.userInfo;
                    //调用登录接口
                    wx.login({
                      success: function (e) {
  
                        // 获取openid跟unionid缓存到storage
                        wx.request({
                          url: URL.user.findunionid,
                          data: {
                            jscode: e.code,
                            encryptedData: res.encryptedData,
                            iv: res.iv
                          },
                          method: "POST",
                          header: {
                            'content-type': 'application/json',
                            'comgHeader': "69f2ec31-3fd1-4cbb-9763-51bbe59982ad" // 默认值
                          }, 
                          dataType: 'application/x-www-form-urlencoded',
                          success: function (ids) {
                               let obj = JSON.parse(ids.data);
                               if(obj.isSuccessful) {
                                 
                                  storage.setSync('openId',  obj.resultObject.openId);
                                  storage.setSync('unionId',  obj.resultObject.unionId);
  
                                  ajax.request((URL.user.login), {
                                    method: 'POST',
                                    OpenId: storage.get('openId'),
                                    UnionId: storage.get('unionId'),
                                    WxName: app.globalData.userInfo.nickName,
                                    WxHeadimgurl: app.globalData.userInfo.avatarUrl,
                                    Gender: app.globalData.userInfo.gender
                                  }, function(data){
                                        storage.setSync('userId',  data.entity.id);
                                        resolve({login: true});
                                  })
                               }
                          }
                        })
                      }
                    });
                  }
                })
            } else {
                resolve({login: false});
            }
        },
        fail: function(err){
            resolve({login: false});
            console.log('checkAuth fail!!!!')
        }
     })
    } else {
      resolve({login: true});
    }
  });
  
}

// 入口统一是否登录判断
exports.checkLogin = function (callback = () => { }) {
  var session_id = wx.getStorageSync('JSESSIONID')
  var JSESSIONID_EXPIRED = wx.getStorageSync('JSESSIONID_EXPIRED')
  if (session_id && JSESSIONID_EXPIRED) {
    var is_expired = dateFormat.checkBeyondTime(JSESSIONID_EXPIRED, new Date())
    if (is_expired) {
      login()
    } else {
      goRegister(callback)
    }
  } else {
    login()
  }
}

function goRegister(callback) {
  var is_registered = wx.getStorageSync('is_registered')
  if (is_registered == 'false') {
    // 未注册
    var callbackUrl = wx.getStorageSync('callbackUrl')
    var option = getUrl.paramStr2paramObj(callbackUrl)
    var hash = option.hash || ''
    if (callbackUrl.includes('pages/login/index')) {
      return
    }
    wx.reLaunch({
      url: `/pages/login/index?hash=${hash}=callbackUrl=` + encodeURIComponent(callbackUrl)
    })
  }
  callback && callback()
}

function login(option) {
  console.log('用户是否授权..........');
  /// 是否需要用户授权待定？？？？
  checkAuth(function (json) {
    if (json.auth) {
      //调用登录接口
      wx.login({
        success: function (e) {
           
        }
      });
    }
  })
}

function thirdLogin(code, encryptedData, iv, data) {
  if (isLogining){
    return
  }
  isLogining = true
  ajax.request(
    '/wechat-mp/oauth/' + encodeURIComponent(code),
    {
      'encrypted-data': encryptedData,
      iv: iv
    },
    function (json) {
      if (json.code == 200) {
        wx.setStorageSync('is_login', 'true')
        wx.setStorageSync('JSESSIONID_EXPIRED', (new Date()).getTime())
        //json.data.is_register = false
        //wx.setStorageSync('JSESSIONID', json.data.session_id)
        if (json.data && json.data.is_register == false) {
          // 未注册
          wx.setStorageSync('is_registered', 'false')
          goRegister()
        } else {
          wx.setStorageSync('is_registered', 'true')
        }
        console.log('my  login successd........');
      } else {
        wx.showModal({
          showCancel: false,
          content: json.message || '登录失败',
        })
      }
    },
    function(){
      
    }
    ,
    function(){
      setTimeout(function(){
        isLogining = false;
      },10000)
    }
  )

}

// 检查是否授权
function checkAuth(callback) {
  wx.getSetting({
    success(res) {
      if (!res['scope.userInfo']) {
        wx.authorize({
          scope: 'scope.userInfo',
          fail: function (err) {
            callback && callback({ auth: false });
            console.log('未授权，失败' + JSON.stringify(err));
          },
          success: function () {
            callback && callback({ auth: true });
          }
        })
      } else {
        callback && callback({ auth: true });
      }
    },
    fail: function (err) {
      console.log('checkAuth fail!!!!')
    }
  })
}
