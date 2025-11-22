/* router.js - Hash 路由解析与页面切换（纯静态版） */
(function(){
  function parseHash(){
    var h = window.location.hash || '';
    var m = h.match(/^#\/(.+)$/);
    return m ? decodeURIComponent(m[1]) : '';
  }

  function onChange(cb){
    window.addEventListener('hashchange', function(){ cb(parseHash()); });
    document.addEventListener('DOMContentLoaded', function(){ cb(parseHash()); });
  }

  function navigate(id){
    if(!id) return;
    var target = '#/' + encodeURIComponent(id);
    if(window.location.hash !== target){
      window.location.hash = target;
    } else {
      // 强制触发一次渲染
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    }
  }

  window.AppRouter = { parseHash: parseHash, onChange: onChange, navigate: navigate };
})();
