async function loadUniverse(file){
 const r=await fetch(file);
 return await r.json();
}
window.loadUniverse=loadUniverse;
