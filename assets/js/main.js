/* main.js - 初始化流程：动态注入 CDN 依赖并启动导航/路由/渲染 */
(function(){
  function loadCss(href){
    return new Promise(function(resolve){
      if(document.querySelector('link[rel="stylesheet"][href="'+href+'"]')) return resolve();
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = function(){ resolve(); };
      document.head.appendChild(link);
    });
  }
  function loadScript(src){
    return new Promise(function(resolve, reject){
      if(document.querySelector('script[src="'+src+'"]')) return resolve();
      var s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = function(){ resolve(); };
      s.onerror = function(){ reject(new Error('加载脚本失败: '+src)); };
      document.head.appendChild(s);
    });
  }

  function injectDependencies(){
    var cdn = {
      katex_css: 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css',
      katex_js:  'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js',
      md_it:     'https://cdn.jsdelivr.net/npm/markdown-it@13.0.1/dist/markdown-it.min.js',
      md_katex:  'https://cdn.jsdelivr.net/npm/markdown-it-katex@2.0.3/dist/markdown-it-katex.min.js'
    };
    return Promise.all([
      loadCss(cdn.katex_css)
    ])
    .then(function(){ return loadScript(cdn.katex_js); })
    .then(function(){ return loadScript(cdn.md_it); })
    .then(function(){ return loadScript(cdn.md_katex); });
  }

  function fetchPages(){
    return fetch('./config/pages.json', { cache: 'no-store' })
      .then(function(res){ if(!res.ok) throw new Error('无法加载 pages.json: HTTP '+res.status); return res.json(); })
      .then(function(json){
        if(Array.isArray(json.pages)) return json.pages;
        if(Array.isArray(json)) return json; // 兼容数组根
        throw new Error('pages.json 格式错误，需要 { "pages": [...] }');
      });
  }

  function buildPagesMap(pages){
    var map = {};
    pages.forEach(function(p){ map[p.id] = p; });
    return map;
  }

  function init(){
    injectDependencies()
      .then(fetchPages)
      .then(function(pages){
        // 初始化导航
        window.AppNav && window.AppNav.createNav(pages);
        var pagesMap = buildPagesMap(pages);

        function handle(id){
          if(!id){
            // 默认加载第一个页面
            if(pages[0] && pages[0].id){ window.AppRouter.navigate(pages[0].id); }
            return;
          }
          window.AppMarkdown && window.AppMarkdown.renderPageById(pagesMap, id);
        }

        window.AppRouter.onChange(handle);
        // 初始渲染
        handle(window.AppRouter.parseHash());
      })
      .catch(function(err){ console.error('[PURE] 初始化失败:', err); });
  }

  // 启动
  (function(){ init(); })();
})();
