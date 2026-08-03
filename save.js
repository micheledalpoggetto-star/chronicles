(function(global){
 'use strict';
 const KEY='chronicles_pwa_master';
 function save(c){if(!c)return;ChroniclesCampaign.touch(c);localStorage.setItem(KEY,JSON.stringify(ChroniclesCampaign.snapshot(c)));}
 function load(){const raw=localStorage.getItem(KEY);if(!raw)return null;try{return ChroniclesCampaign.migrate(JSON.parse(raw));}catch(e){console.error('Save load failed',e);return null;}}
 function clear(){localStorage.removeItem(KEY);}
 function exportFile(c){
   const clean=ChroniclesCampaign.snapshot(c);const blob=new Blob([JSON.stringify(clean,null,2)],{type:'application/json'});
   const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`${c.character?.name||'campagna'}_chronicles_v${clean.version}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
 }
 async function importFile(file){const text=await file.text();return ChroniclesCampaign.migrate(JSON.parse(text));}
 global.ChroniclesSave={KEY,save,load,clear,exportFile,importFile};
})(window);