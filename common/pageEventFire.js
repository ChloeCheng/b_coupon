import onfire from './onfire.js';

function getCurrentPageUrl(){
    let pages = getCurrentPages(),
        currentPage = pages[pages.length-1],
        url = currentPage.route.replace(/\?.*/, '');
    return url;
}

let EventFire = {
    on: function(eventName, callback){
        let url = getCurrentPageUrl();
        return onfire.on(url+'-'+eventName, callback);
    },
    un: function(){
        onfire.un.apply(null, arguments);
    },
    fire: function(eventName, data){
        let url = getCurrentPageUrl();
        onfire.fire(url+'-'+eventName, data);
    },
}

export default EventFire;