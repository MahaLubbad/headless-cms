async function createItemElement(itemData) {
  const itemEl = document.createElement("div");
  itemEl.className = "item";

  const imgEl = document.createElement("img");
  imgEl.setAttribute("src", itemData.image.data.attributes.url);
  itemEl.appendChild(imgEl);

  const titleEl = document.createElement("div");
  titleEl.className = "itemTitle";
  titleEl.innerText = itemData.name;
  itemEl.appendChild(titleEl);

  const priceEl = document.createElement("div");
  priceEl.className = "price"; 
  if(itemData.outOfStock) {
    priceEl.innerHTML = '<div class="outOfStock">Out of stock</div>'; 
  } else {
    if (itemData.discount.data) {
      const discountAmount = itemData.discount.data.attributes.percentage;
      priceEl.innerHTML = `
            <div class="discount">${discountAmount}%</div>
            <div class="oldPrice">${itemData.price.toFixed(2)}€</div>
            <div class="newPrice">${(itemData.price * (1 - (discountAmount/100))).toFixed(2)}€</div>
      `;
    }else {
      const newPrice = document.createElement("div");
      newPrice.className = "newPrice";
      newPrice.innerText = itemData.price.toFixed(2) + "€";
      priceEl.appendChild(newPrice);
    }
  } 
  itemEl.appendChild(priceEl);

  const descriptionEl = document.createElement("div");
  descriptionEl.className = "itemDescription";
  descriptionEl.innerText = itemData.description.length > 100 ? itemData.description.substring(1, 100) + '...': itemData.description;
  itemEl.appendChild(descriptionEl);
  
  return itemEl;
}

async function createCategoryContainer(entry) {
  console.log(entry);
  const el = document.createElement("div");
  el.className = "categorycontainer";

  const titleEl = document.createElement("h1");
  titleEl.innerText = entry.attributes.name;
  el.appendChild(titleEl);

  const descriptionEl = document.createElement("span");
  descriptionEl.innerText = entry.attributes.description;
  descriptionEl.className = "categoryDiscription";
  el.appendChild(descriptionEl);

  const itemsContainer = document.createElement("div");
  itemsContainer.className = "items";
  entry.attributes.products.data.forEach(async itemEntry => {
    const itemEl = await createItemElement(itemEntry.attributes);
    itemEl.className = "item";
    itemsContainer.appendChild(itemEl);
  });
  el.appendChild(itemsContainer);

  return el;
}

async function loadProducts() {
  const response = await (await fetch("/api/categories?populate[products][populate][0]=discount&populate[products][populate][1]=image", {
    method: 'GET',
    headers: {
      'Authorization': `Bearer afaddde6fe34f2b035219d46d1b562bb14a0ec5a5c7e54b5a7bb48f8e32c1aef7427e4254f0a941476620095c249874dcfe68ef34ef1f4d1f1f1080ba6a0116868f9d1ca4f3de9ef172569653e6ddb2a0cae35c3dded89e679b8f28cb1b22b903866a1c2dc484cd47d3acead3ce7a92838f0e032d19586ed716c2e1b4e224ccc`
    }
  })).json();
  const body = document.getElementById("body");
  body.innerHTML = "";
  response.data.forEach(async entry => {
    const categoryContainer = await createCategoryContainer(entry); 
    body.appendChild(categoryContainer);
  });
}

 /*   ***************************************************************       */
//loadProducts();

async function ex1() {
  const query = qs.stringify(
  {

      sort :'name:asc'
  },
   
  {
    encodeValuesOnly: true,
  });
  console.log("The query string", query);

  // call the matching endpoint and include the querystring after the ?
  const baseUrl = "http://localhost:1337/api/products";
  const response = await fetch(`${baseUrl}?${query}`);
  const result = await response.json();
  console.log(result.data.map(product => `${product.attributes.name} ${product.attributes.price}€`).join("\n"));
}

// ex1();


/*   ***************************************************************       */

async function example1() {
  const query = qs.stringify(
    {
      /** here we can include all query parameter fields that we want to pass and their values */
      // we provide which fields we want to select
    fields: ['name', 'price'],
    // we add filters
    filters: {
      price: {
        $lte: 40,
        $gte: 15
      }
    },
    // we define the ordering
    sort: ['price:asc']
  }, {
    encodeValuesOnly: true,
  });
  console.log("The querystring", query);

  // call the matching endpoint and include the querystring after the ?
  const response = await fetch(`http://localhost:1337/api/products?${query}`);
  const result = await response.json();
  // from here on we can use the result from the server in our javascript code
  console.log(result.data.map(product => `${product.attributes.name} ${product.attributes.price}€`).join("\n"));
}
// example1();



/*   ***************************************************************       */


 async function searchProductByName(nameStr) {
   const query = qs.stringify(
   {
       filters:{
         name:{
           $containsi:nameStr
         }
       },
   }, 
   {
     encodeValuesOnly: true,
   });
   console.log("The query string", query);
 
   // call the matching endpoint and include the querystring after the ?
   const baseUrl = "http://localhost:1337/api/products";
   const response = await fetch(`${baseUrl}?${query}`);
   const result = await response.json();
   return result.data.map((product) => `${product.attributes.name}`).join("\n");
  }
 async function test() {
  console.log("Products containing name", await searchProductByName("name"));
  console.log("Products containing prog", await searchProductByName("prog"));
  console.log("Products containing pro", await searchProductByName("pro"));
 }

 //test();


 /*   ***************************************************************       */

 async function ex4() {
  const query = qs.stringify(
  {
   fields: ["price"],
  }, 
  

  {
    encodeValuesOnly: true,
  });
  console.log("The query string", query);

  // call the matching endpoint and include the querystring after the ?
  const baseUrl = "http://localhost:1337/api/products";
  const response = await fetch(`${baseUrl}?${query}`);
  const result = await response.json();
console.log(result);
  
  let sum = 0;
  for(const obj of result.data ){
    sum += obj.attributes.price ;
  }
  console.log(sum);

}
//ex4();

/*   ***************************************************************       */

// async function ex4() {
//   const query = qs.stringify(
//   {
//     fields: ["price", "outOfStock"],
//    filters: {

//        outOfStock: {
        
//            $eq: false,
//        },
//      },
//    },

  
//   {
//     encodeValuesOnly: true,
//   });
//   console.log("The query string", query);

//   // call the matching endpoint and include the querystring after the ?
//   const baseUrl = "http://localhost:1337/api/products";
//   const response = await fetch(`${baseUrl}?${query}`);
//   const result = await response.json();
//   //console.log(result.data.map(product => `${product.attributes.name} ${product.attributes.price}€`).join("\n"));
//   console.log(result);
//   let sum = 0;
//  for (const obj of result.data) {
//    sum += obj.attributes.price;
//  }
//  console.log(sum);
 
//  }
// //ex4();

/*   ***************************************************************       */



async function ex6() {
  const query = qs.stringify(
  {
     populate: ["discount"],
    fields: ["name", "price" , "outOfStock"],
    filters: {
      outOfStock: {
        $eq: false,
    },

    }
 }, 
 {
   encodeValuesOnly: true,
 });
 console.log("The query string", query);

 // call the matching endpoint and include the querystring after the ?
 const baseUrl = "http://localhost:1337/api/products";
 const response = await fetch(`${baseUrl}?${query}`);
 const result = await response.json();
 
 let sum = 0;
for (const obj of result.data) {

  if(obj.attributes.discount.data !== null){
    sum += obj.attributes.price * (1 - obj.attributes.discount.data.attributes.percentage / 100);
  }
  else{
    sum += obj.attributes.price;
  }
}

console.log(sum);


}
ex6();


