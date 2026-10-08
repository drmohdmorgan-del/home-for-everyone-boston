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
  about_text:"HOME FOR ALL REALTY LLC is a Boston brokerage founded on the idea that great real estate service shouldn't depend on the size of the deal. First-time buyer or seasoned investor — you get the same launch-grade marketing and the same relentless advocacy.",
  listings:[
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
function apply(){
  var d=load();
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
        return '<div class="listing"><div class="ph">'+(l.sample?"SAMPLE PHOTO":"LISTING PHOTO")+'</div>'+
        '<div class="body">'+(l.sample?'<span class="tag">Sample listing</span>':'')+
        '<div class="price">'+esc(l.price)+'</div>'+
        '<div class="addr">'+esc(l.addr)+'</div>'+
        '<div class="facts"><span>'+esc(l.beds)+' bd</span><span>'+esc(l.baths)+' ba</span><span>'+esc(l.sqft)+' sqft</span></div>'+
        '<p style="font-size:14px;color:var(--muted)">'+esc(l.desc)+'</p></div></div>';
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
window.HFE={load:load,save:save,esc:esc,KEY:KEY,DEFAULTS:DEFAULTS};
})();
