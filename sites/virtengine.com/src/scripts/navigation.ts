export function initNavigation() {
 const el=document.querySelector<HTMLElement>('#site-navigation');
 if(!el)return;
 const header: HTMLElement = el;
 const groups=Array.from(header.querySelectorAll<HTMLDetailsElement>('.mega-group'));
 const toggle=header.querySelector<HTMLButtonElement>('#nav-toggle')!;
 const scrim=document.querySelector<HTMLElement>('.nav-scrim')!;
 const mobile=matchMedia('(max-width: 1099px)');
 const search=header.querySelector<HTMLInputElement>('#navigation-search')!;
 const list=header.querySelector<HTMLUListElement>('#navigation-results')!;
 const data: {label:string;href:string;description:string}[]=JSON.parse(header.querySelector('#navigation-index')!.textContent!);
 header.classList.add('nav-enhanced');
 function sync(){
  groups.forEach(g=>g.querySelector('summary')!.setAttribute('aria-expanded',String(g.open)));
  const expanded=groups.some(g=>g.open)||toggle.getAttribute('aria-expanded')==='true';
  scrim.hidden=!expanded;
  header.style.setProperty('--menu-top',`${header.getBoundingClientRect().bottom}px`);
 }
 function closeAll(returnFocus=false){
  const open=groups.find(g=>g.open);
  groups.forEach(g=>g.open=false);
  toggle.setAttribute('aria-expanded','false');
  if(returnFocus)(mobile.matches?toggle:open?.querySelector('summary'))?.focus();
  sync();
 }
 function selectCategory(group:HTMLDetailsElement,button:HTMLButtonElement){
  group.querySelectorAll<HTMLButtonElement>('[data-category]').forEach(b=>{const selected=b===button;b.setAttribute('aria-selected',String(selected));b.tabIndex=selected?0:-1;});
  group.querySelectorAll<HTMLElement>('[data-topic]').forEach(p=>p.hidden=p.dataset.topic!==button.dataset.category);
 }
 groups.forEach(group=>{
  const summary=group.querySelector<HTMLElement>('summary')!;
  const categories=Array.from(group.querySelectorAll<HTMLButtonElement>('[data-category]'));
  const tablist=group.querySelector('.mega-categories');
  tablist?.setAttribute('role','tablist');tablist?.setAttribute('aria-orientation','vertical');
  group.querySelectorAll('[data-topic]').forEach(p=>p.setAttribute('role','tabpanel'));
  categories.forEach(button=>{
   button.setAttribute('role','tab');
   button.addEventListener('click',()=>selectCategory(group,button));
   button.addEventListener('keydown',event=>{
    const index=categories.indexOf(button);let next=index;
    if(event.key==='ArrowDown')next=(index+1)%categories.length;
    else if(event.key==='ArrowUp')next=(index-1+categories.length)%categories.length;
    else if(event.key==='Home')next=0;
    else if(event.key==='End')next=categories.length-1;
    else return;
    event.preventDefault();selectCategory(group,categories[next]);categories[next].focus();
   });
  });
  if(categories.length){const active=group.querySelector<HTMLElement>('a[aria-current="page"]')?.closest<HTMLElement>('[data-topic]');selectCategory(group,categories.find(b=>b.dataset.category===active?.dataset.topic)||categories[0]);}
  summary.addEventListener('click',event=>{event.preventDefault();const next=!group.open;groups.forEach(g=>g.open=false);group.open=next;sync();if(next&&group.dataset.navGroup==='search')search.focus();});
  summary.addEventListener('keydown',event=>{
   if(['ArrowRight','ArrowLeft','Home','End'].includes(event.key)&&!mobile.matches){event.preventDefault();const i=groups.indexOf(group);const n=event.key==='Home'?0:event.key==='End'?groups.length-1:(i+(event.key==='ArrowRight'?1:-1)+groups.length)%groups.length;groups[n].querySelector<HTMLElement>('summary')!.focus();}
   if(event.key==='ArrowDown'){event.preventDefault();groups.forEach(g=>g.open=g===group);sync();(categories.find(b=>b.getAttribute('aria-selected')==='true')||search).focus();}
  });
  group.addEventListener('toggle',sync);
 });
 toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')==='true';if(open)closeAll();else{toggle.setAttribute('aria-expanded','true');sync();}});
 header.querySelectorAll<HTMLButtonElement>('[data-close-menu]').forEach(b=>b.addEventListener('click',()=>closeAll(true)));
 scrim.addEventListener('click',()=>closeAll());
 document.addEventListener('click',e=>{if(!header.contains(e.target as Node))closeAll();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&(groups.some(g=>g.open)||toggle.getAttribute('aria-expanded')==='true')){e.preventDefault();closeAll(true);}});
 document.addEventListener('focusin',e=>{if(!header.contains(e.target as Node))closeAll();});
 header.querySelectorAll<HTMLAnchorElement>('a').forEach(a=>a.addEventListener('click',()=>closeAll()));
 mobile.addEventListener('change',()=>{const focusInside=header.contains(document.activeElement);closeAll();if(focusInside)(mobile.matches?toggle:header.querySelector<HTMLElement>('.nav-brand'))?.focus();});
 window.addEventListener('resize',sync);window.addEventListener('scroll',sync,{passive:true});
 function filter(){
  const query=search.value.trim().toLowerCase();const words=query.split(/\s+/).filter(Boolean);
  const results=query?data.filter(l=>words.every(w=>(l.label+' '+l.description+' '+l.href).toLowerCase().includes(w))).sort((a,b)=>Number(b.label.toLowerCase().includes(query))-Number(a.label.toLowerCase().includes(query))):data.slice(0,6);
  list.replaceChildren();
  results.forEach(item=>{const li=document.createElement('li');const a=document.createElement('a');a.href=item.href;const title=document.createElement('span');title.textContent=item.label;const desc=document.createElement('small');desc.textContent=item.description;a.append(title,desc);a.addEventListener('click',()=>closeAll());li.append(a);list.append(li);});
  header.querySelector('#search-count')!.textContent=query?`${results.length} ${results.length===1?'page':'pages'} found`:'Popular destinations';
  header.querySelector<HTMLElement>('#search-empty')!.hidden=results.length!==0;
 }
 search.addEventListener('input',filter);
 header.querySelector('#clear-navigation-search')!.addEventListener('click',()=>{search.value='';filter();search.focus();});
 sync();
}
