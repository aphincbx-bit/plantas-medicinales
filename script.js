const menuButton = document.querySelector('.menu-btn');
const navigation = document.querySelector('#nav');

menuButton.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

navigation.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navigation.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

document.querySelectorAll('.filters button').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelector('.filters .active').classList.remove('active');
    button.classList.add('active');
    const filter = button.dataset.filter;
    document.querySelectorAll('.plant').forEach((plant) => {
      plant.classList.toggle('hidden', filter !== 'all' && plant.dataset.kind !== filter);
    });
  });
});

const form = document.querySelector('#plant-form');
const plantGrid = document.querySelector('.plant-grid');
const message = document.querySelector('#form-message');
const storageKey = 'plantasAgregadasFeria';
function safeText(value){const el=document.createElement('div');el.textContent=value;return el.innerHTML;}
function getPlants(){try{return JSON.parse(localStorage.getItem(storageKey))||[]}catch{return[]}}
function plantCard(plant){
  const article=document.createElement('article'); article.className='plant added-plant'; article.dataset.kind='added';
  const image=plant.photo?`<img src="${plant.photo}" alt="Fotografía de ${safeText(plant.name)}">`:'<div class="plant-placeholder" aria-hidden="true">☘</div>';
  article.innerHTML=`${image}<div class="plant-body"><p class="latin">${safeText(plant.scientific||'Nombre científico no indicado')}</p><h3>${safeText(plant.name)}</h3><dl><dt>¿Para qué sirve tradicionalmente?</dt><dd>${safeText(plant.use)}</dd><dt>Forma de preparación</dt><dd>${safeText(plant.preparation)}</dd></dl><button class="remove-plant" type="button">Eliminar esta planta</button></div>`;
  article.querySelector('.remove-plant').addEventListener('click',()=>removePlant(plant.id)); return article;
}
function showPlants(){document.querySelectorAll('.added-plant').forEach(item=>item.remove());getPlants().forEach(plant=>plantGrid.appendChild(plantCard(plant)));}
function removePlant(id){localStorage.setItem(storageKey,JSON.stringify(getPlants().filter(plant=>plant.id!==id)));showPlants();message.textContent='La planta fue eliminada.';}
function savePlant(photo){
  const data=new FormData(form), plants=getPlants();
  plants.push({id:String(Date.now()),name:data.get('name').trim(),scientific:data.get('scientific').trim(),use:data.get('use').trim(),preparation:data.get('preparation').trim(),photo});
  try{localStorage.setItem(storageKey,JSON.stringify(plants));form.reset();showPlants();message.textContent='¡Planta guardada correctamente!';}catch{message.textContent='No se pudo guardar. Prueba con una fotografía más pequeña.';}
}
form.addEventListener('submit',event=>{
  event.preventDefault(); const file=form.elements.photo.files[0];
  if(file&&file.size>3*1024*1024){message.textContent='La fotografía supera 3 MB.';return}
  if(!file){savePlant('');return} const reader=new FileReader(); reader.onload=()=>savePlant(reader.result); reader.onerror=()=>message.textContent='No se pudo leer la fotografía.'; reader.readAsDataURL(file);
});
document.querySelector('#clear-added').addEventListener('click',()=>{if(getPlants().length&&confirm('¿Deseas borrar todas las plantas que agregaste?')){localStorage.removeItem(storageKey);showPlants();message.textContent='Se borraron las plantas agregadas.';}});
showPlants();
