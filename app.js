const CONTENT_URL = './content.json';
const STORAGE_KEY = 'hung-vinh-portfolio-content-v2';
let originalContent = null;
let content = null;
let activeFilter = 'ALL';
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const splitLines = value => String(value || '').split('\n').map(s=>s.trim()).filter(Boolean);

async function init(){
  try {
    const response = await fetch(CONTENT_URL);
    if(!response.ok) throw new Error('content fetch failed');
    originalContent = await response.json();
  } catch(err) {
    // file:// previews cannot fetch JSON in many browsers; use the embedded starter data.
    originalContent = window.PORTFOLIO_CONTENT ? structuredClone(window.PORTFOLIO_CONTENT) : fallbackContent();
  }
  let saved = null; try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch(e){}
  content = saved || structuredClone(originalContent);
  // Migrate newly added project resources into older browser-saved content without overwriting user edits.
  if (saved && Array.isArray(content.projects)) {
    for (const project of content.projects) {
      const source = (originalContent.projects || []).find(item => item.id === project.id);
      if (source?.resources?.length && !project.resources?.length) project.resources = structuredClone(source.resources);
    }
  }
  render(); bindEvents();
}
function fallbackContent(){return {name:'HUNG VINH',eyebrow:'CREATIVE STRATEGY · INNOVATION · DESIGN',headline:'Where imagination meets intention.',intro:'I connect research, creative thinking, and strategic execution to turn complex challenges into meaningful experiences.',about:'I am a multidisciplinary creative and business innovation professional interested in the space where people, technology, and storytelling meet.',projects:[],education:[],skills:[],process:['RESEARCH','INSIGHT','STRATEGY','INNOVATION','EXECUTION']};}
function persist(){localStorage.setItem(STORAGE_KEY,JSON.stringify(content));render();}
function render(){
  document.title = content.siteTitle || `${content.name} | Portfolio`;
  $('#brand-name').textContent = content.name || 'HUNG VINH';
  $('#hero-eyebrow').textContent = content.eyebrow || '';
  $('#hero-headline').innerHTML = escapeHTML(content.headline || '').replace(/\n/g,'<br>');
  $('#hero-intro').textContent = content.intro || '';
  $('#about-text').textContent = content.about || '';
  $('#process-ribbon').innerHTML = (content.process || []).map(x=>`<span>${escapeHTML(x)}</span>`).join('');
  $('#education-list').innerHTML = (content.education || []).map(x=>`<li>${escapeHTML(x)}</li>`).join('');
  $('#skills-list').innerHTML = (content.skills || []).map(x=>`<span>${escapeHTML(x)}</span>`).join('');
  $('#year').textContent = new Date().getFullYear();
  $('#contact-email').href = content.email ? `mailto:${content.email}` : '#contact';
  $('#contact-email').querySelector('small').textContent = content.email || 'Add an email in Edit Chronicle';
  const resume = $('#resume-link'); resume.href = content.resumeUrl || '#'; resume.classList.toggle('hidden',!content.resumeUrl); 
  renderProjects();
}
function categories(){return ['ALL',...new Set((content.projects||[]).map(p=>(p.category||'OTHER').split('·')[0].trim()))];}
function renderProjects(){
  const filters = categories();
  $('#filters').innerHTML = filters.map(f=>`<button class="filter-chip ${f===activeFilter?'active':''}" data-filter="${escapeHTML(f)}">${escapeHTML(f)}</button>`).join('');
  const list = (content.projects||[]).filter(p=>activeFilter==='ALL'||(p.category||'').split('·')[0].trim()===activeFilter).sort((a,b)=>Number(!!b.featured)-Number(!!a.featured));
  $('#project-grid').innerHTML = list.length ? list.map((p,i)=>`<article class="project-card" data-project="${escapeHTML(p.id)}" tabindex="0" role="button" aria-label="Open ${escapeHTML(p.title)} project"><div class="project-art">${p.image?`<img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.title)} preview" loading="lazy" onerror="this.remove();this.parentElement.classList.add('image-missing')">`:`<span class="placeholder-sigil">${['✧','⚜','✦','❖','✥','✶'][i%6]}</span>`}</div>${p.featured?'<span class="featured-mark">FEATURED PROJECT</span>':''}<span class="project-category">${escapeHTML(p.category)}</span><h3>${escapeHTML(p.title)}</h3><p>${escapeHTML(p.tagline||p.summary||'')}</p><div class="card-bottom"><span>${escapeHTML(p.year||'SELECTED WORK')}</span><b>↗</b></div></article>`).join('') : '<div class="empty-note">No projects in this category yet.</div>';
}
function openProject(id){const p=(content.projects||[]).find(x=>x.id===id);if(!p)return;$('#modal-category').textContent=p.category||'';$('#modal-title').textContent=p.title||'';$('#modal-tagline').textContent=p.tagline||'';const isIBM = p.id === 'ibm-strategic-foresight' || /^IBM\b/i.test(p.title||'');$('#ibm-fbc-quicklink').hidden = !isIBM;
  const section=(title,txt)=>txt?`<h3>${title}</h3><p>${escapeHTML(txt)}</p>`:'';
  const gallery=(p.gallery||[]).filter(g=>g&&g.src).length?`<h3>PROJECT GALLERY</h3><div class="project-gallery">${p.gallery.filter(g=>g&&g.src).map(g=>`<a class="gallery-item" href="${escapeHTML(g.src)}" target="_blank" rel="noopener"><img loading="lazy" src="${escapeHTML(g.src)}" alt="${escapeHTML(g.caption||p.title)}" onerror="this.remove();this.parentElement.classList.add('image-missing')"><span>${escapeHTML(g.caption||'View image')}</span></a>`).join('')}</div>`:'';
  const projectResources = [...(p.resources || [])];
  if (p.link && !projectResources.some(r => r.url === p.link)) projectResources.unshift({label: p.id === 'ibm-strategic-foresight' ? 'Open the IBM Flourishing Business Canvas (FBC)' : 'Open project link', url: p.link});
  // Explicit IBM fallback ensures the FBC remains visible even if an older saved project record lacks its resource metadata.
  if (p.id === 'ibm-strategic-foresight' && !projectResources.some(r => r.url === 'https://hunginku.github.io/Flourishing-Business-Canvas/')) projectResources.unshift({label: 'Open the IBM Flourishing Business Canvas (FBC)', url: 'https://hunginku.github.io/Flourishing-Business-Canvas/'});
  $('#modal-body').innerHTML=section('OVERVIEW',p.summary)+(projectResources.length?`<section class="project-resource-panel"><h3>${p.id === 'ibm-strategic-foresight' ? 'INTERACTIVE IBM TOOL' : 'PROJECT RESOURCES'}</h3><ul class="resource-links">${projectResources.map(r=>`<li><a href="${escapeHTML(r.url)}" target="_blank" rel="noopener">${escapeHTML(r.label)} <span aria-hidden="true">↗</span></a></li>`).join('')}</ul></section>`:'')+gallery+section('THE CHALLENGE',p.challenge)+section('THE APPROACH',p.approach)+section('OUTCOME',p.outcome)+(p.contributions?.length?`<h3>MY CONTRIBUTIONS</h3><ul>${p.contributions.map(x=>`<li>${escapeHTML(x)}</li>`).join('')}</ul>`:'')+(p.metrics?.length?`<div class="metric-row">${p.metrics.map(x=>`<span class="metric-pill">${escapeHTML(x)}</span>`).join('')}</div>`:'');
$('#project-modal').classList.add('open');$('#project-modal').setAttribute('aria-hidden','false');}
function closeModal(id){const el=document.getElementById(id);el.classList.remove('open');el.setAttribute('aria-hidden','true');}
function bindEvents(){
  document.addEventListener('click',e=>{
    const card=e.target.closest('[data-project]');if(card){openProject(card.dataset.project);return;}
    const filter=e.target.closest('[data-filter]');if(filter){activeFilter=filter.dataset.filter;renderProjects();return;}
    const close=e.target.closest('[data-close]');if(close){closeModal(close.dataset.close);return;}
    const tab=e.target.closest('[data-tab]');if(tab){switchTab(tab.dataset.tab);return;}
  });
  document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('[data-project]')){e.preventDefault();openProject(e.target.dataset.project);}if(e.key==='Escape'){$$('.modal-backdrop.open').forEach(m=>closeModal(m.id));}});
  $('#mobile-menu').addEventListener('click',()=>document.body.classList.toggle('mobile-nav-open'));
  $$('.top-nav a').forEach(a=>a.addEventListener('click',()=>document.body.classList.remove('mobile-nav-open')));
  $('#edit-open').addEventListener('click',openEditor);
  $('#site-form').addEventListener('submit',saveSiteForm);
  $('#add-project').addEventListener('click',()=>{content.projects.unshift({id:'project-'+Date.now(),title:'New Project',category:'NEW PROJECT',year:new Date().getFullYear().toString(),tagline:'A short project statement.',summary:'',challenge:'',approach:'',outcome:'',contributions:[],metrics:[],image:'',link:'',featured:false});persist();renderProjectEditor();});
  $('#export-json').addEventListener('click',exportJSON);
  $('#import-json').addEventListener('change',importJSON);
  $('#reset-content').addEventListener('click',()=>{if(confirm('Reset all edits in this browser to the original starter content?')){content=structuredClone(originalContent);localStorage.removeItem(STORAGE_KEY);persist();fillSiteForm();renderProjectEditor();}});
  $('#project-editor-list').addEventListener('input',handleProjectInput);
  $('#project-editor-list').addEventListener('change',handleProjectChange);
  $('#project-editor-list').addEventListener('click',handleProjectClick);
}
function openEditor(){fillSiteForm();renderProjectEditor();switchTab('site');$('#editor-modal').classList.add('open');$('#editor-modal').setAttribute('aria-hidden','false');}
function switchTab(tab){$$('[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));['site','projects','backup'].forEach(t=>$('#tab-'+t).hidden=t!==tab);}
function fillSiteForm(){const f=$('#site-form');['name','eyebrow','headline','intro','about','location','email','resumeUrl'].forEach(k=>f.elements[k].value=content[k]||'');f.elements.skills.value=(content.skills||[]).join(', ');f.elements.education.value=(content.education||[]).join('\n');}
function saveSiteForm(e){e.preventDefault();const f=e.currentTarget;['name','eyebrow','headline','intro','about','location','email','resumeUrl'].forEach(k=>content[k]=f.elements[k].value.trim());content.skills=f.elements.skills.value.split(',').map(s=>s.trim()).filter(Boolean);content.education=splitLines(f.elements.education.value);persist();}
function renderProjectEditor(){const root=$('#project-editor-list');if(!content.projects.length){root.innerHTML='<div class="empty-note">No projects yet. Add your first project above.</div>';return;}
  root.innerHTML=content.projects.map((p,i)=>`<article class="project-edit-card" data-edit-id="${escapeHTML(p.id)}"><div class="project-edit-head"><strong>${i+1}. ${escapeHTML(p.title||'Untitled project')}</strong><button class="small-action delete-project" data-action="delete">Remove project</button></div><div class="project-edit-grid">${field('title','Project title',p.title)}${field('category','Category',p.category)}${field('year','Year / date',p.year)}${field('tagline','Short statement',p.tagline)}${field('summary','Overview',p.summary,'textarea')}${field('challenge','Challenge',p.challenge,'textarea')}${field('approach','Approach',p.approach,'textarea')}${field('outcome','Outcome',p.outcome,'textarea')}${field('contributions','Contributions (one per line)',(p.contributions||[]).join('\n'),'textarea')}${field('metrics','Highlights / metrics (one per line)',(p.metrics||[]).join('\n'),'textarea')}${field('link','Project link',p.link)}${field('image','Cover image URL (or upload below)',p.image)}${field('gallery','Gallery image URLs (one per line)',(p.gallery||[]).map(g=>g.src).join('\n'),'textarea')}<label class="featured-toggle"><input type="checkbox" data-field="featured" ${p.featured?'checked':''}> Feature this project near the top</label></div><label class="image-control">Upload cover image<input type="file" accept="image/*" data-image-upload></label><label class="image-control">Add gallery images<input type="file" accept="image/*" data-gallery-upload multiple></label></article>`).join('');}
function field(name,label,value,type='input'){return `<label>${label}${type==='textarea'?`<textarea data-field="${name}" rows="3">${escapeHTML(value||'')}</textarea>`:`<input data-field="${name}" value="${escapeHTML(value||'')}">`}</label>`;}
function handleProjectInput(e){const card=e.target.closest('[data-edit-id]');const field=e.target.dataset.field;if(!card||!field)return;const p=content.projects.find(x=>x.id===card.dataset.editId);if(!p)return;p[field]=['contributions','metrics'].includes(field)?splitLines(e.target.value):field==='gallery'?splitLines(e.target.value).map((src,i)=>({src,caption:`Project image ${i+1}`})):e.target.value;const title=$('strong',card);if(title&&field==='title')title.textContent=(content.projects.indexOf(p)+1)+'. '+(p.title||'Untitled project');persistWithoutRender();}
function handleProjectChange(e){const card=e.target.closest('[data-edit-id]');if(!card)return;const p=content.projects.find(x=>x.id===card.dataset.editId);if(e.target.matches('[data-field="featured"]')){if(p){p.featured=e.target.checked;persist();renderProjectEditor();}return;}if(e.target.matches('[data-gallery-upload]')){const files=[...(e.target.files||[])];if(!p||!files.length)return;if(files.some(f=>f.size>2_500_000)){alert('Each gallery image must be under 2.5 MB.');e.target.value='';return;}Promise.all(files.map(file=>new Promise(resolve=>{const reader=new FileReader();reader.onload=()=>resolve({src:reader.result,caption:file.name});reader.readAsDataURL(file);}))).then(items=>{p.gallery=[...(p.gallery||[]),...items];persist();renderProjectEditor();});return;}if(!e.target.matches('[data-image-upload]'))return;const file=e.target.files?.[0];if(!file||!p)return;if(file.size>2_500_000){alert('Please use an image under 2.5 MB to keep the site fast.');e.target.value='';return;}const reader=new FileReader();reader.onload=()=>{p.image=reader.result;persist();renderProjectEditor();};reader.readAsDataURL(file);}
function handleProjectClick(e){const btn=e.target.closest('[data-action="delete"]');if(!btn)return;const card=btn.closest('[data-edit-id]');if(confirm('Remove this project from the portfolio?')){content.projects=content.projects.filter(p=>p.id!==card.dataset.editId);persist();renderProjectEditor();}}
function persistWithoutRender(){localStorage.setItem(STORAGE_KEY,JSON.stringify(content));}
function exportJSON(){const blob=new Blob([JSON.stringify(content,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='content.json';a.click();URL.revokeObjectURL(url);}
function importJSON(e){const file=e.target.files?.[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{try{const data=JSON.parse(reader.result);if(!Array.isArray(data.projects)||!data.name)throw new Error('This does not look like a portfolio content file.');content=data;persist();fillSiteForm();renderProjectEditor();alert('Portfolio content imported.');}catch(err){alert('Could not import this JSON: '+err.message);}};reader.readAsText(file);e.target.value='';}
init();
