(function(){
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function two(o){return '<span class="en">'+esc(o.en||o.ru||'')+'</span><span class="ru">'+esc(o.ru||o.en||'')+'</span>'}
  var box=document.getElementById('posts');
  if(box){
    var limit=parseInt(box.getAttribute('data-limit')||'0',10);
    fetch('posts.json',{cache:'no-store'}).then(function(r){return r.json()}).then(function(list){
      list.sort(function(a,b){return a.date<b.date?1:-1});
      if(limit)list=list.slice(0,limit);
      if(!list.length){box.innerHTML='<p class="empty"><span class="en">No posts yet.</span><span class="ru">Пока нет записей.</span></p>';return}
      box.innerHTML=list.map(function(p){
        return '<article class="post-card"><time datetime="'+esc(p.date)+'">'+esc(p.date)+'</time><h3><a href="post.html?p='+encodeURIComponent(p.slug)+'">'+two(p.title)+'</a></h3><p>'+two(p.summary||{})+'</p></article>';
      }).join('');
    }).catch(function(){box.innerHTML='<p class="empty"><span class="en">Posts could not be loaded.</span><span class="ru">Не удалось загрузить записи.</span></p>'});
  }
  var art=document.getElementById('article');
  if(art){
    var slug=new URLSearchParams(location.search).get('p')||'';
    if(!/^[a-z0-9-]+$/i.test(slug)){art.innerHTML='<p class="empty">Not found / Не найдено</p>';return}
    Promise.all([fetch('posts.json').then(function(r){return r.json()}),
      fetch('posts/'+slug+'.en.md').then(function(r){return r.ok?r.text():null}).catch(function(){return null}),
      fetch('posts/'+slug+'.ru.md').then(function(r){return r.ok?r.text():null}).catch(function(){return null})]).then(function(res){
      var meta=res[0].filter(function(p){return p.slug===slug})[0];
      var en=res[1],ru=res[2];
      if(!meta||(!en&&!ru)){art.innerHTML='<p class="empty"><span class="en">Post not found.</span><span class="ru">Запись не найдена.</span></p>';return}
      var note={en:'<p class="empty"><em>This post is available in Russian only.</em></p>',ru:'<p class="empty"><em>Эта запись доступна только на английском.</em></p>'};
      function md(t){return window.marked?window.marked.parse(t):'<pre>'+esc(t)+'</pre>'}
      var html='<time datetime="'+esc(meta.date)+'">'+esc(meta.date)+'</time><h1>'+two(meta.title)+'</h1>';
      html+='<div class="md en">'+(en?md(en):note.en+md(ru))+'</div><div class="md ru">'+(ru?md(ru):note.ru+md(en))+'</div>';
      art.innerHTML=html;
      document.body.setAttribute('data-title-en',meta.title.en+' | Nurlan Ashimov');
      document.body.setAttribute('data-title-ru',(meta.title.ru||meta.title.en)+' | Нурлан Ашимов');
      document.title=document.body.getAttribute('data-title-'+document.documentElement.lang);
    });
  }
})();
