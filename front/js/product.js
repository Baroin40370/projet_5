const items = document.querySelector('.item__img');
const select = document.querySelector('#colors');
const id = new URL(location.href).searchParams.get('id');
//console.log('page du canapé '+ id);
fetch('http://localhost:3000/api/products/'+id)
.then((response) => {
	response.json().then((data)=>{
		//console.log(data);
		let images = document.createElement('img');
        images.setAttribute('src', data.imageUrl);
        images.setAttribute('alt', data.altTxt);
        items.appendChild(images);
		//console.log(images);
        let title = document.querySelector('#title');
        title.innerText = data.name;
        //console.log(title);
        let price = document.querySelector('#price');
        price.innerText = data.price;
        //console.log(price);
        let description = document.querySelector('#description');
        description.innerText = data.description;
        //console.log(description);
        let tableau = data.colors;
        tableau.forEach(function(item,index,array) {
	        //console.log(item,);
	       let option = document.createElement('option');
	        option.setAttribute('value', item);
	        select.appendChild(option);
	        option.innerText = option.value;
		});             
   });
});




/* Je définit mon produit, si j'ai déjà un produit identique 
dans le panier, alors j'ajoute la quantité au produit, 
sinon je push mon produit dans le tableau */ 

const addCart = () =>{
	let produitTableau = getCart();
	const optionProduit = {
		id: id,
		couleur: select.value,
		quantite: parseInt(document.querySelector('#quantity').value)
	};	
	let found = false;
	produitTableau.forEach(produit => {
		if (produit.id == id && produit.couleur == select.value) {        			
			produit.quantite += optionProduit.quantite;
			found = true;
		}
	});
	if (found != true) {
		produitTableau.push(optionProduit);
	}    
	
   //console.log(produitTableau);
    saveCart(produitTableau);
}


/*au clic sur le bouton, je contole que mon produit a bien une couleur et une
quantité valide sinon je retourne un message d'erreur si tout est ok
j'appelle ma fonction addCart qui ajoute un produit dans le panier */
document.querySelector('#addToCart').addEventListener('click', produit =>{
	const quantite = parseInt(document.querySelector('#quantity').value);
	if(select.value == ''){
		return alert('Veuillez choisir une couleur');
	}else if(quantite < 1 || quantite > 100){
		return alert('Veuillez sélectionner une quantite comprise entre 1 et 100.');
	}else{
		addCart();
		alert('Le produit a été ajouté au panier');
	}
});

document.querySelector('#quantity').value = 1;