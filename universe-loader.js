async function loadUniverse(file){
 const r=await fetch(file);
 if(!r.ok) throw new Error("Universe non trovato");
 return await r.json();
}
window.loadUniverse=loadUniverse;
