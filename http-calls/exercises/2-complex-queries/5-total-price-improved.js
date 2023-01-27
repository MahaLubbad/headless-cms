/**
 * Fill in the blanks to create a script 
 * that prints the total cost if someone would buy one of every item 
 * without applying any discount, but only count items that are currently in stock
 */

 import "./qs.js";
 async function ex4() {
   const query = qs.stringify(
   {
    fields: ["price", "outOfStock"],
    filters: {
    
        outOfStock: {
         
            $eq: false,
         
        },
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
   //console.log(result.data.map(product => `${product.attributes.name} ${product.attributes.price}€`).join("\n"));
   
   let sum = 0;
  for (const obj of result.data) {
    sum += obj.attributes.price;
  }
  console.log(sum);

  }
 ex4();