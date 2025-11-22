/* markdown.js - 使用 markdown-it + markdown-it-katex 渲染内容（纯静态版） */
(function(){
  function ensureContainer(){
    var container = document.getElementById('app-content');
    if(!container){
      container = document.createElement('div');
      container.id = 'app-content';
      var main = document.querySelector('main, .site-main, .page-body, .article-container, #content, .container');
      if(main){
        main.insertBefore(container, main.firstChild);
      } else {
        document.body.appendChild(container);
      }
    }
    return container;
  }

  function createMd(){
    var opts = { html: true, linkify: true, breaks: true };
    var md = window.markdownit ? window.markdownit(opts) : null;
    if(!md) throw new Error('markdown-it 未加载');
    if(window.markdownitKatex){ md.use(window.markdownitKatex); }
    return md;
  }

  function renderMarkdown(text){
    var container = ensureContainer();
    try {
      var md = createMd();
      var html = md.render(text || '');
      container.innerHTML = html;
    } catch(err){
      container.innerHTML = '<div class="alert" style="padding:12px;border:1px solid #eee;border-radius:8px;background:#fff3f3;color:#d33;">Markdown 渲染失败：' + (err && err.message ? err.message : String(err)) + '</div>';
    }
  }

  function renderPageById(pagesMap, id){
    var meta = pagesMap[id];
    var container = ensureContainer();
    if(!meta){
      container.innerHTML = '<div style="padding:12px;border:1px solid #eee;border-radius:8px;background:#fff;">未找到页面：' + id + '</div>';
      return;
    }
    var path = meta.mdPath;
    if(!path){
      container.innerHTML = '<div style="padding:12px;border:1px solid #eee;border-radius:8px;background:#fff;">该页面未配置 mdPath。</div>';
      return;
    }
    fetch(path, { cache: 'no-store' })
      .then(function(res){ if(!res.ok) throw new Error('HTTP ' + res.status); return res.text(); })
      .then(function(text){ renderMarkdown(text); })
      .catch(function(err){
        container.innerHTML = '<div style="padding:12px;border:1px solid #eee;border-radius:8px;background:#fff;">加载失败：' + (err && err.message ? err.message : String(err)) + '</div>';
      });
  }

  window.AppMarkdown = { renderMarkdown: renderMarkdown, renderPageById: renderPageById };
})();
