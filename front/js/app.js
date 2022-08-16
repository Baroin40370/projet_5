/*je recupere le panier dans le localStorage et,
s'il n'existe pas je retourne un tableau vide,
sinon je retourne le panier
*/
const getCart = ()=>{
	let produitTableau = JSON.parse(localStorage.getItem('panier'));
    if (produitTableau == null) {
    	return [];
    }
    return produitTableau;
}

//sauvegarde de mon panier
const saveCart = (cart)=> {
	localStorage.setItem('panier',JSON.stringify(cart));
}

//supprime le panier du localStorage
const deleteCart = ()=>{
	localStorage.removeItem('panier');
}

