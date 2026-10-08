/* Home for Everyone — content store.
   Public pages READ from localStorage (with baked-in defaults).
   admin.html WRITES. Logo, colors, fonts and layout are NOT editable here. */
(function(){
"use strict";
var KEY="hfe-content-v1";
var published=null; /* assets/content.json deployed with the site: visible to ALL visitors */
var DEFAULTS={
  notice:"BUY · SELL · INVEST — Residential sales, investment properties, and property management across Greater Boston.",
  phone:"",
  email:"",
  hero_title:"A home for everyone.<br><em>Right here in Boston.</em>",
  hero_lede:"Buy, sell, and invest with a boutique brokerage that treats your move like its own. Modern marketing, honest guidance, and relentless follow-through — from first tour to final signature.",
  theme_green:"#0c3b2e",
  theme_gold:"#c6a15b",
  theme_bg:"#faf7f0",
  about_text:"HOME FOR ALL REALTY LLC is a Boston brokerage founded on the idea that great real estate service shouldn't depend on the size of the deal. First-time buyer or seasoned investor — you get the same launch-grade marketing and the same relentless advocacy.",
  listings:[
    {price:"$1,249,000",addr:"15 Forestdale Rd, Worcester, MA 01604",beds:"11",baths:"7",sqft:"4,338",desc:"3-family multi-family home — 3 units up/down. Strong investment opportunity in Worcester.",status:"For Sale",mls:"73518697",lot:"0.4-acre lot",year:"Built 1913",agent:"Listed by Salustia Ortiz, Dreamcatcher Investment Group, Inc.",sample:false},
    {price:"$659,900",addr:"56 S Main St, Milford, MA 01757",beds:"8",baths:"3",sqft:"2,822",desc:"Recently fully renovated single-family Colonial with finished basement and finished attic — over 1,000 sq ft of additional living space. Generous backyard, close to highways, shopping, and schools.",status:"Pending",mls:"73464720",lot:"0.18-acre lot",year:"Built 1925",agent:"Listed by Salustia Ortiz, Dreamcatcher Investment Group, Inc.",sample:false},
    {price:"$689,000",addr:"Sample St, East Boston, MA 02128",beds:"2",baths:"2",sqft:"1,050",desc:"Sun-filled corner condo steps to Central Square.",sample:true},
    {price:"$1,150,000",addr:"Sample Ave, South Boston, MA 02127",beds:"3",baths:"2.5",sqft:"1,720",desc:"Renovated brownstone unit with deeded parking.",sample:true},
    {price:"$925,000",addr:"Sample Rd, Dorchester, MA 02125",beds:"4",baths:"2",sqft:"2,100",desc:"Two-family with strong rental history — ideal for investors.",sample:true}
  ]
};
function clone(o){return JSON.parse(JSON.stringify(o));}
function load(){
  /* priority: published file < this browser's drafts < defaults */
  var out=clone(DEFAULTS), k, d, raw;
  if(published){ for(k in published){ if(k in out) out[k]=published[k]; } }
  try{
    raw=localStorage.getItem(KEY);
    if(raw){ d=JSON.parse(raw); for(k in d){ if(k in out) out[k]=d[k]; } }
  }catch(e){}
  return out;
}
function save(d){ localStorage.setItem(KEY, JSON.stringify(d)); }
function esc(s){
  return String(s==null?"":s).replace(/[&<>"']/g,function(c){
    return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];
  });
}
/* lighten (amt>0) or darken (amt<0) a hex color by percent */
function shade(hex,amt){
  var n=String(hex||"").replace("#","");
  if(n.length===3)n=n.split("").map(function(c){return c+c;}).join("");
  if(!/^[0-9a-fA-F]{6}$/.test(n))return hex;
  var num=parseInt(n,16),r=(num>>16)&255,g=(num>>8)&255,b=num&255;
  if(amt>=0){r=Math.round(r+(255-r)*amt/100);g=Math.round(g+(255-g)*amt/100);b=Math.round(b+(255-b)*amt/100);}
  else{r=Math.round(r*(1+amt/100));g=Math.round(g*(1+amt/100));b=Math.round(b*(1+amt/100));}
  return "#"+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1);
}
function applyTheme(d){
  var root=document.documentElement.style;
  var green=d.theme_green||"#0c3b2e",gold=d.theme_gold||"#c6a15b",bg=d.theme_bg||"#faf7f0";
  root.setProperty("--green",green);
  root.setProperty("--green-deep",shade(green,-28));
  root.setProperty("--gold",gold);
  root.setProperty("--gold-soft",shade(gold,28));
  root.setProperty("--ivory",bg);
  root.setProperty("--line",shade(gold,62));
}
function apply(){
  var d=load();
  applyTheme(d);
  document.querySelectorAll("[data-hfe]").forEach(function(el){
    var k=el.getAttribute("data-hfe");
    if(!(k in d))return;
    if(k==="hero_title"){ el.innerHTML=d.hero_title; }
    else if(k==="phone"||k==="email"){
      var p=el.closest("p");
      if(d[k]){ el.textContent=d[k]; el.style.display=""; if(p)p.style.display=""; }
      else { if(p)p.style.display="none"; }
    }
    else { el.textContent=d[k]; }
  });
  var grid=document.getElementById("listing-grid");
  if(grid){
    if(!d.listings.length){
      grid.innerHTML='<p style="color:var(--muted)">No listings yet — check back soon, or <a href="contact.html">contact us</a> for off-market opportunities.</p>';
    }else{
      grid.innerHTML=d.listings.map(function(l){
        var tags=(l.sample?'<span class="tag">Sample listing</span>':'')+(l.status&&!l.sample?'<span class="tag green">'+esc(l.status)+'</span>':'');
        var specs=[l.mls?("MLS #"+l.mls):null,l.lot||null,l.year||null].filter(Boolean).join(" · ");
        return '<div class="listing"><div class="ph">'+(l.sample?"SAMPLE PHOTO":"LISTING PHOTO")+'</div>'+
        '<div class="body">'+tags+
        '<div class="price">'+esc(l.price)+'</div>'+
        '<div class="addr">'+esc(l.addr)+'</div>'+
        '<div class="facts"><span>'+esc(l.beds)+' bd</span><span>'+esc(l.baths)+' ba</span><span>'+esc(l.sqft)+' sqft</span></div>'+
        '<p style="font-size:14px;color:var(--muted)">'+esc(l.desc)+'</p>'+
        (specs?'<p style="font-size:12.5px;color:var(--muted);margin-top:8px">'+esc(specs)+'</p>':'')+
        (l.agent&&!l.sample?'<p style="font-size:12.5px;color:var(--muted);margin-top:4px;font-style:italic">'+esc(l.agent)+'</p>':'')+
        '</div></div>';
      }).join("");
    }
  }
}
document.addEventListener("DOMContentLoaded",function(){
  apply(); /* drafts + defaults immediately */
  fetch("assets/content.json").then(function(r){ return r.ok?r.json():null; })
    .then(function(j){ if(j){ published=j; apply(); } })
    .catch(function(){});
});
window.HFE={load:load,save:save,esc:esc,shade:shade,applyTheme:applyTheme,KEY:KEY,DEFAULTS:DEFAULTS};
})();
