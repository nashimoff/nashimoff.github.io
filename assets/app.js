(function(){
  function setLang(l,save){
    if(l!=='ru')l='en';
    document.documentElement.lang=l;
    var btns=document.querySelectorAll('.lang button');
    for(var i=0;i<btns.length;i++)btns[i].setAttribute('aria-pressed',btns[i].getAttribute('data-lang')===l?'true':'false');
    var t=document.body.getAttribute('data-title-'+l);if(t)document.title=t;
    if(save){try{localStorage.setItem('lang',l)}catch(e){}}
  }
  var btns=document.querySelectorAll('.lang button');
  for(var i=0;i<btns.length;i++)btns[i].addEventListener('click',function(){setLang(this.getAttribute('data-lang'),true)});
  setLang(document.documentElement.lang,false);
  /* certificate filters */
  var fb=document.querySelectorAll('.filters button');
  for(var j=0;j<fb.length;j++)fb[j].addEventListener('click',function(){
    var k=this.getAttribute('data-topic');
    for(var m=0;m<fb.length;m++)fb[m].setAttribute('aria-pressed',fb[m]===this?'true':'false');
    var s=document.querySelectorAll('.cert');
    for(var n=0;n<s.length;n++)s[n].hidden=!(k==='all'||s[n].getAttribute('data-topic')===k);
  });
})();
