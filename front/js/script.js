const items= document.getElementById('items');

fetch('http://localhost:3000/api/products')
.then((response) => response.json()
.then((data) =>{
  //console.log(data);
  for(let produit of data){
    const a = document.createElement('a');
    items.appendChild(a);
    a.setAttribute('href','./product.html?id='+ produit._id);
    //console.log(a);
    const article = document.createElement('article');
    a.appendChild(article);
    //console.log(article);
    let images = document.createElement('img');
    images.setAttribute('src', produit.imageUrl);
    images.setAttribute('alt', produit.altTxt);
    article.appendChild(images);
    //console.log(images);
    let titre = document.createElement('h3');
    titre.innerText = produit.name;
    article.appendChild(titre);
    //console.log(titre);
    let paragraphe = document.createElement('p');
    paragraphe.innerText = produit.description;
    article.appendChild(paragraphe);
    //console.log(paragraphe);
    }
  })).catch((err)=>console.log('erreur'));
  