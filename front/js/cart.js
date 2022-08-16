// fetch -> getCart -> forEach
let commande = JSON.parse(localStorage.getItem('commandes'));
let cart = getCart();
//console.log(cart);
const catalogue = {};

const items = document.getElementById('cart__items');
fetch('http://localhost:3000/api/products')
.then((response) => response.json().then((data) =>{
	//console.log(data);  
	data.forEach(obj => {  	
		catalogue[obj._id] = obj;
	})
	//console.log(catalogue);
	cart.forEach(item => {
		//console.log(item);
		const produit = catalogue[item.id];
		//console.log(produit);
		const article = document.createElement('article');
		items.appendChild(article);
		article.setAttribute('class', 'cart__item');
		article.setAttribute('data-id', item.id);
		article.setAttribute('data-color', item.couleur);
		const divImage = document.createElement('div');
		divImage.setAttribute('class', 'cart__item__img');
		article.appendChild(divImage);
		let images = document.createElement('img');
		images.setAttribute('src', produit.imageUrl);
		images.setAttribute('alt', produit.altTxt);
		divImage.appendChild(images);
		const divContent = document.createElement('div');
		divContent.setAttribute('class','cart__item__content');
		article.appendChild(divContent)
		const divDescription = document.createElement('div');
		divDescription.setAttribute('class','cart__item__content__description');
		const titre = document.createElement('h2');
		titre.innerText = produit.name;
		divDescription.appendChild(titre);
		const optionCouleur = document.createElement('p');
		optionCouleur.innerText = item.couleur;
		//console.log(optionCouleur);
		divDescription.appendChild(optionCouleur);
		const prix = document.createElement('p');
		prix.innerText = `${produit.price} €`;
		//console.log(prix);
		divDescription.appendChild(prix);
		divContent.appendChild(divDescription);
		const divSettings = document.createElement('div');
		divSettings.setAttribute('class','cart__item__content__settings');
		divContent.appendChild(divSettings);
		const divQuantity = document.createElement('div');
		divQuantity.setAttribute('class','cart__item__content__settings__quantity');
		const quantite = document.createElement('p');
		quantite.innerText = `Qté : `;
		divQuantity.appendChild(quantite);
		const input = document.createElement('input');
		input.setAttribute('type',"number");
		input.setAttribute('class','itemQuantity');
		input.setAttribute('name','itemQuantity');
		input.setAttribute('min','1');
		input.setAttribute('max','100');
		input.setAttribute('value',item.quantite);
		//console.log(input);
		divQuantity.appendChild(input);
		divSettings.appendChild(divQuantity);
		const divDelete = document.createElement('div');
		divDelete.setAttribute('class','cart__item__content__settings__delete');
		const supprimer = document.createElement('p');
		supprimer.setAttribute('class','deleteItem');
		supprimer.innerText = `Supprimer`;
		divDelete.appendChild(supprimer);
		divContent.appendChild(divDelete);
	})
	calculTotaux();
	
}));

function calculTotaux() {
	let total = 0;
	let totalQte = 0;
  cart.forEach(item => {
  	const produit = catalogue[item.id];
  	totalQte += item.quantite;
  	//console.log(totalQte);
    total += parseInt(produit.price)*parseInt(item.quantite);
    //console.log(total);    
  });
  const totalPrix = document.querySelector('#totalPrice');
	const totalQuantite = document.querySelector('#totalQuantity');
	totalPrix.innerText = total ;
  totalQuantite.innerText = totalQte;  
};


/* on reçoit l'id, la couleur d'un produit et sa nouvelle quantité.
Si la quantité est à 0 alors on supprime L'article ensuite,
on trouve le produit dans le panier à partir de son id et sa couleur
puis on remplace sa quantité, on recalcule les totaux et on sauvegarde */

function changeQuantite(id,couleur,qte) {
	qte = parseInt(qte);
  if (qte == 0){
    return supprimerArticle(id,couleur);
  };
  const item = cart.find(item => {
		return (item.id === id && item.couleur === couleur);
  });
  item.quantite = qte;
  calculTotaux();
  saveCart(cart);
}

/* on reçoit un évenement on regarde quel input a été changé avec son nom,
si c'est l'input qui correspond à la quantité alors on selectionne son plus 
proche ancêtre de type 'article' afin de récuperer les données data-id et
data-color pour changer la quantité */

function onInputChange(event) {
	const {target} = event;
	const {name,value} = target;	
	if (name === "itemQuantity") {
		const article = target.closest('article');
		const {id,color} = article.dataset;		
		
		changeQuantite(id,color,value);
	}
}

/*on reçoit l'id et la couleur d'un article à supprimer. 
On filtre le tableau pour obtenir un nouveau tableau, en excluant du tableau le produit
ayant l'id et la couleur demandés 
On recalcule les totaux
On supprime la ligne de la page et on sauvegarde le panier*/

function supprimerArticle(id,couleur){
  cart = cart.filter(item => {
    const estProduitSupprime = (item.id === id && item.couleur === couleur);
    return !estProduitSupprime;
  });
  calculTotaux();
  const ligne = document.querySelector(`article[data-id="${id}"][data-color="${couleur}"]`);
  ligne.remove();
  saveCart(cart);
}

/* On reçoit un événement après chaque clic dans "cart__items", on filtre le clic 
sur le bouton supprimer, on récupère les variables sur 'l'ancêtre 
(afin de récupèrer les éléments data-id et data-color), 
On appelle la fonction supprimerArticle */

function onCartClick(event) {
  const {target} = event;
  const {className,value} = target; 
  if (className === "deleteItem") {
    const article = target.closest('article');
    const {id,color} = article.dataset;
    supprimerArticle(id,color);
  }
}

/*On selectionne la section entière, ensuite on lui met un écouteur d'évenement
change, avec true on 'capture' les évenements des enfants 
pour déclencher la fonction onInputChange */

const sectionCart = document.querySelector('#cart__items');
sectionCart.addEventListener('change',onInputChange,true);

/*On selectionne la section entière, ensuite on lui met un écouteur d'évenement
click, avec true on 'capture' les évenements des enfants
pour déclencher la fonction onCartClick */

sectionCart.addEventListener('click',onCartClick,true);

//***********formulaire*************

let form = document.querySelector('.cart__order__form');

/*on ecoute la modification des input */
form.firstName.addEventListener('change', function(){
	validName(this);
});

form.lastName.addEventListener('change', function(){
    validName(this);
});

form.address.addEventListener('change', function(){
    validAdress(this);
});

form.city.addEventListener('change', function(){
   validAdress(this);
});

form.email.addEventListener('change', function(){
	validEmail(this);
});

form.addEventListener('submit', function(event){	
   event.preventDefault();
    if(validForm()){
    	let commandeId = [];
        cart.forEach(item => {
          const produit = catalogue[item.id];	
  	      commandeId.push(item.id);
  	    });
  	    if (commandeId.length < 1) {
  	    	return alert('Panier vide !');
  	    }
        const data = {
 		   contact:{
 		   	 firstName : form.firstName.value,
 		   	 lastName  : form.lastName.value,
 		   	 address : form.address.value,
 		   	 city : form.city.value,
 		   	 email : form.email.value,
 		   },
 		   products : commandeId,	
    	};
    	//console.log(data);
    	fetch('http://localhost:3000/api/products/order',{
    		method:'POST',
    		headers:{'Content-Type' : 'application/json'},
    		body:JSON.stringify(data),
    	})
    	.then((response)=>response.json())
    	.then((reponseServeur)=>{    		
    		const orderId = reponseServeur.orderId;
    		deleteCart();
    		document.location.href ='confirmation.html?orderId='+orderId;
    	})
      };
    });


const validForm = function(){
	return (validName(form.firstName, form.lastName) &&
    validAdress(form.address, form.city) &&
    validEmail(form.email));
}

const validSomething = function(input,regex){
    let regexp = new RegExp(regex,'g');    
    let errorMsg = input.nextElementSibling;
    if(regexp.test(input.value)){
         errorMsg.innerText = 'Saisie validée';
         errorMsg.style.color = 'green';
         return true;
    }else{
    	 errorMsg.innerText = 'Saisie non valide';
    	 errorMsg.style.color = 'red';
    	 return false;
    }; 
};

const validName = function (inputName){
	return validSomething (inputName,'^[a-zA-Zéèàäïêñ.-]{3,25}$');
};

const validAdress = function (inputAdress){
	return validSomething (inputAdress,'^[0-9 a-zA-Zéèàäïêñ.-]+$','g');
};
	
const validEmail = function(inputEmail){
	return validSomething (inputEmail, '^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$', 'g');
};


    	