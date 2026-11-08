import React,{useEffect,useMemo,useRef,useState} from 'react';
import {ArrowDownToLine,ArrowUpRight,Check,ChevronDown,Globe,Heart,ImagePlus,Layers,Plus,Save,ShoppingBag,SlidersHorizontal,Trash2,Upload,X} from 'lucide-react';
import {garments,fabrics,colors} from './data';
import GarmentPreview from './components/GarmentPreview';

const initial={garment:'tee',color:'#f2eee5',fabric:'cotton',size:'M',designName:'My new design',notes:'',artwork:null};
const copy={
 en:{studio:'Design studio',subtitle:'Create your next signature piece.',library:'My designs',shop:'Collection',language:'العربية',save:'Save design',new:'New design',garment:'Garment',fabric:'Fabric',color:'Color palette',size:'Size',details:'Design details',name:'Design name',notes:'Notes',upload:'Upload artwork',saved:'Saved designs',empty:'Your saved designs will appear here.',add:'Add to bag',bag:'Shopping bag',clear:'Clear',total:'Estimated total',preview:'3D preview',choose:'Choose a garment',remove:'Remove',savedMsg:'Design saved successfully',sizes:['XS','S','M','L','XL','XXL'],home:'Studio',shopTitle:'Explore the collection',bagEmpty:'Your bag is empty.'},
 ar:{studio:'استوديو التصميم',subtitle:'صمّم قطعتك المميزة القادمة.',library:'تصميماتي',shop:'المجموعة',language:'English',save:'حفظ التصميم',new:'تصميم جديد',garment:'نوع القطعة',fabric:'القماش',color:'الألوان',size:'المقاس',details:'تفاصيل التصميم',name:'اسم التصميم',notes:'ملاحظات',upload:'إضافة شعار أو صورة',saved:'التصميمات المحفوظة',empty:'ستظهر تصميماتك المحفوظة هنا.',add:'أضف إلى السلة',bag:'سلة التسوق',clear:'مسح',total:'الإجمالي التقديري',preview:'معاينة ثلاثية الأبعاد',choose:'اختر قطعة',remove:'حذف',savedMsg:'تم حفظ التصميم بنجاح',sizes:['XS','S','M','L','XL','XXL'],home:'الاستوديو',shopTitle:'استكشف المجموعة',bagEmpty:'سلتك فارغة.'}
};
export default function App(){
 const [lang,setLang]=useState('en'),[tab,setTab]=useState('studio'),[design,setDesign]=useState(initial);
 const [saved,setSaved]=useState(()=>JSON.parse(localStorage.getItem('azhy-designs')||'[]'));
 const [bag,setBag]=useState(()=>JSON.parse(localStorage.getItem('azhy-bag')||'[]'));
 const [toast,setToast]=useState(''); const fileRef=useRef(null); const t=copy[lang]; const rtl=lang==='ar';
 useEffect(()=>localStorage.setItem('azhy-designs',JSON.stringify(saved)),[saved]);
 useEffect(()=>localStorage.setItem('azhy-bag',JSON.stringify(bag)),[bag]);
 const garment=garments.find(g=>g.id===design.garment)||garments[0];
 const total=useMemo(()=>bag.reduce((s,x)=>s+x.price,0),[bag]);
 function notify(s){setToast(s);setTimeout(()=>setToast(''),2400)}
 function update(k,v){setDesign(d=>({...d,[k]:v}))}
 function save(){const item={...design,id:Date.now(),garmentName:garment.name,price:garment.price,created:new Date().toISOString()};setSaved(s=>[item,...s]);notify(t.savedMsg)}
 function load(item){setDesign({...initial,...item});setTab('studio')}
 function add(){setBag(b=>[...b,{...design,id:Date.now(),title:design.designName||garment.name,price:garment.price,garmentName:garment.name}]);notify(lang==='ar'?'تمت الإضافة إلى السلة':'Added to bag')}
 function upload(e){const f=e.target.files?.[0];if(!f)return;if(!['image/png','image/jpeg','image/webp','image/svg+xml'].includes(f.type)){notify('Use PNG, JPG, WEBP or SVG');return}if(f.size>5*1024*1024){notify('Maximum file size is 5 MB');return}const r=new FileReader();r.onload=()=>update('artwork',r.result);r.readAsDataURL(f)}
 function exportDesign(){const blob=new Blob([JSON.stringify(design,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='azhy-design.json';a.click();URL.revokeObjectURL(a.href)}
 return <div className={rtl?'app rtl':'app'} dir={rtl?'rtl':'ltr'}>
  <header className="topbar"><a className="brand" href="#" onClick={()=>setTab('studio')}><span className="brand-mark">A</span><span>AZHY <small>FASHION STUDIO</small></span></a>
   <nav><button className={tab==='studio'?'active':''} onClick={()=>setTab('studio')}>{t.home}</button><button className={tab==='collection'?'active':''} onClick={()=>setTab('collection')}>{t.shop}</button><button className={tab==='saved'?'active':''} onClick={()=>setTab('saved')}>{t.library}</button></nav>
   <div className="top-actions"><button className="icon-btn" onClick={()=>setLang(lang==='en'?'ar':'en')}><Globe size={17}/>{t.language}</button><button className="bag-btn" onClick={()=>setTab('bag')}><ShoppingBag size={17}/><span>{bag.length}</span></button></div>
  </header>
  <main>
   {tab==='studio'&&<><section className="hero"><div><div className="eyebrow">THE CREATIVE ATELIER · 2026</div><h1>{t.studio}<br/><em>AZHY.</em></h1><p>{t.subtitle}</p></div><div className="hero-side">DESIGN<br/>YOUR<br/><span>IDENTITY</span></div></section>
    <div className="studio-grid"><section className="preview-panel"><div className="panel-heading"><div><span className="eyebrow">01 / VISUALIZE</span><h2>{t.preview}</h2></div><button className="outline-btn" onClick={()=>update('garment','tee')}>{t.new}</button></div><GarmentPreview type={design.garment} color={design.color}/><div className="preview-caption"><span>{garment.name}</span><span>{design.color.toUpperCase()}</span></div>
     {design.artwork&&<div className="art-preview"><img src={design.artwork} alt="Uploaded artwork"/><button onClick={()=>update('artwork',null)}><X size={14}/></button></div>}
    </section>
    <section className="controls"><div className="panel-heading"><div><span className="eyebrow">02 / CUSTOMIZE</span><h2>{t.details}</h2></div><SlidersHorizontal size={19}/></div>
     <label className="field-label">{t.garment}</label><div className="garment-grid">{garments.map(g=><button key={g.id} className={design.garment===g.id?'garment-card selected':'garment-card'} onClick={()=>update('garment',g.id)}><span className="garment-icon">{g.id==='hoodie'?'◒':g.id==='pants'?'▥':g.id==='jacket'?'◇':'▱'}</span><span>{rtl?g.ar:g.name}</span><small>${g.price}</small></button>)}</div>
     <div className="two-col"><div><label className="field-label">{t.fabric}</label><select value={design.fabric} onChange={e=>update('fabric',e.target.value)}>{fabrics.map(f=><option key={f.id} value={f.id}>{rtl?f.ar:f.name}</option>)}</select></div><div><label className="field-label">{t.size}</label><select value={design.size} onChange={e=>update('size',e.target.value)}>{t.sizes.map(s=><option key={s}>{s}</option>)}</select></div></div>
     <label className="field-label">{t.color}</label><div className="swatches">{colors.map(c=><button key={c} aria-label={c} className={design.color===c?'swatch chosen':'swatch'} style={{background:c}} onClick={()=>update('color',c)}>{design.color===c&&<Check size={15} color={c==='#f2eee5'||c==='#ffffff'?'#111':'white'}/>}</button>)}<input aria-label="Custom color" type="color" value={design.color} onChange={e=>update('color',e.target.value)}/></div>
     <label className="field-label">{t.name}</label><input value={design.designName} onChange={e=>update('designName',e.target.value)} placeholder={t.name}/>
     <label className="field-label">{t.notes}</label><textarea rows="2" value={design.notes} onChange={e=>update('notes',e.target.value)} placeholder={t.notes}/>
     <input ref={fileRef} hidden type="file" accept=".png,.jpg,.jpeg,.webp,.svg,image/png,image/jpeg,image/webp,image/svg+xml" onChange={upload}/>
     <button className="upload-btn" onClick={()=>fileRef.current?.click()}><ImagePlus size={17}/>{t.upload}<span>PNG / JPG / SVG · 5MB</span></button>
     <div className="action-row"><button className="primary-btn" onClick={save}><Save size={16}/>{t.save}</button><button className="secondary-btn" onClick={exportDesign}><ArrowDownToLine size={16}/></button><button className="secondary-btn" onClick={add}><ShoppingBag size={16}/></button></div>
    </section></div>
   </>}
   {tab==='saved'&&<section className="page-section"><div className="page-title"><div className="eyebrow">YOUR CREATIVE ARCHIVE</div><h1>{t.saved}</h1></div>{saved.length===0?<p className="empty">{t.empty}</p>:<div className="saved-grid">{saved.map(x=><article className="saved-card" key={x.id}><div className="saved-color" style={{background:x.color}}><span>AZHY</span></div><div className="saved-info"><b>{x.designName}</b><small>{x.garmentName} · {x.size} · {x.color}</small><div><button onClick={()=>load(x)}>Open</button><button onClick={()=>setSaved(s=>s.filter(i=>i.id!==x.id))}><Trash2 size={14}/></button><button onClick={()=>{setDesign(x);add()}}><ShoppingBag size={14}/></button></div></div></article>)}</div>}</section>}
   {tab==='collection'&&<section className="page-section"><div className="page-title"><div className="eyebrow">CURATED ESSENTIALS</div><h1>{t.shopTitle}</h1></div><div className="product-grid">{garments.map(g=><article className="product-card" key={g.id}><div className="product-visual"><span>AZHY</span><b>{g.type.toUpperCase()}</b></div><div className="product-meta"><div><b>{rtl?g.ar:g.name}</b><small>Made for your identity</small></div><strong>${g.price}</strong></div><button className="primary-btn full" onClick={()=>{update('garment',g.id);setTab('studio')}}>Customize <ArrowUpRight size={15}/></button></article>)}</div></section>}
   {tab==='bag'&&<section className="page-section"><div className="page-title"><div className="eyebrow">YOUR SELECTION</div><h1>{t.bag}</h1></div>{bag.length===0?<p className="empty">{t.bagEmpty}</p>:<><div className="bag-list">{bag.map(x=><div className="bag-item" key={x.id}><span className="bag-swatch" style={{background:x.color}}/><div><b>{x.title}</b><small>{x.garmentName} · {x.size}</small></div><strong>${x.price}</strong><button onClick={()=>setBag(b=>b.filter(i=>i.id!==x.id))}><Trash2 size={16}/></button></div>)}</div><div className="bag-total"><span>{t.total}</span><strong>${total}</strong></div><p className="notice">Demo checkout: connect a payment provider and configure shipping before accepting real orders.</p><button className="primary-btn" onClick={()=>notify('Demo only — payment is not connected')}>Continue to checkout</button><button className="text-btn" onClick={()=>setBag([])}>{t.clear}</button></>}</section>}
  </main><footer><span>AZHY FASHION STUDIO</span><span>CREATE WITH PURPOSE · WEAR YOUR STORY</span></footer>
  {toast&&<div className="toast">{toast}</div>}
 </div>
}