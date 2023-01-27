/**
 * Fill in the blanks to create a script 
 * that prints the total cost if someone would buy one of every item
 * taking into consideration that it's impossible to buy items that are out of stuck,
 * and taking the discount rates into account 
 */

 import "./qs.js";
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