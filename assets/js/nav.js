/* nav.js - 右上角导航渲染（纯静态版） */
(function(){
  function createNav(pages){
    var nav = document.createElement('div');
    nav.id = 'app-nav';

    var btn = document.createElement('button');
    btn.className = 'app-nav-toggle';
    btn.type = 'button';
    btn.textContent = '页面';
    nav.appendChild(btn);

    var menu = document.createElement('div');
    menu.className = 'app-nav-menu';

    pages.forEach(function(p){
      var a = document.createElement('a');
      a.href = '#/' + p.id;
      a.textContent = p.title || p.id;
      a.dataset.pageId = p.id;
      menu.appendChild(a);
    });

    nav.appendChild(menu);

    // Toggle
    btn.addEventListener('click', function(e){
      e.stopPropagation();
      nav.classList.toggle('open');
    });

    // Close when clicking outside
    document.addEventListener('click', function(){ nav.classList.remove('open'); });
    // Prevent menu click from closing
    menu.addEventListener('click', function(e){ e.stopPropagation(); });

    // Mount to header if possible
    var header = document.querySelector('header, .site-header, .page-header, .navbar, #header');
    if(header){
      header.appendChild(nav);
    } else {
      document.body.classList.add('has-app-nav');
      document.body.appendChild(nav);
    }
  }

  window.AppNav = { createNav: createNav };
})();
