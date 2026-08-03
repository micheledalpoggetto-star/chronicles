(function(global){
 'use strict';
 const catalog={
  age_of_legends:{id:'age_of_legends',name:'Age of Legends',genre:'Fantasy epico',tone:'avventuroso ed epico'},
  shadows_beyond:{id:'shadows_beyond',name:'Shadows Beyond',genre:'Horror cosmico',tone:'lento, inquietante e investigativo'},
  genesis:{id:'genesis',name:'Genesis',genre:'Supereroistico',tone:'cinematografico e morale'},
  neon_protocol:{id:'neon_protocol',name:'Neon Protocol',genre:'Cyberpunk',tone:'teso, urbano e moralmente grigio'},
  fractured_domains:{id:'fractured_domains',name:'Fractured Domains',genre:'Fantasy dei Cinque Domini',tone:'mitico, filosofico e persistente'}
 };
 function list(){return Object.values(catalog).map(x=>({...x}));}
 function get(id){const u=catalog[id];if(!u)throw new Error('Universo sconosciuto: '+id);return {...u};}
 function register(manifest){if(!manifest?.id||!manifest?.name)throw new Error('Manifest universo non valido');catalog[manifest.id]={...manifest};}
 global.ChroniclesUniverses={list,get,register};
})(window);