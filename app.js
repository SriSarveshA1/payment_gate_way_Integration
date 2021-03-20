//Bringing all our dependencies modules
const express = require('express');
const ejs = require('ejs');
const paypal = require('paypal-rest-sdk');

//Adding client id and client secret
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AT7Vv029bZJBlbOmP5YrJ2K2AzjxHGvMK2uB_ZzrM5T76uDUeL4FAx5j0XSBn-zQGWhVUimO6zevPvnv',
    'client_secret': 'EANDT1fBB0bjAD1XCZziwVuNfRMqNuns3AyimrtPe_XUXb5oMu_kzsEOoxk_DbnmihP-jSHFEmSEcyaf'
  });

//setting the app to express
const app = express();

//setting the view engine to ejs
app.set('view engine','ejs');

//created a index route thats gonna route index template

app.get('/', (req, res) => res.render('index'));

//Then we need to create the pay route to which the form is going to get submitted
app.post('/pay', (req, res) => {
    const create_payment_json = {
      "intent": "sale",
      "payer": {
          "payment_method": "paypal"
      },
      "redirect_urls": {
          "return_url": "http://localhost:3000/success",
          "cancel_url": "http://localhost:3000/cancel"
      },
      "transactions": [{
          "item_list": {
              "items": [{
                  "name": "srisarvesh Ranganathan",
                  "sku": "001",
                  "price": "50.00",
                  "currency": "USD",
                  "quantity": 1
              }]
          },
          "amount": {
              "currency": "USD",
              "total": "50.00"
          },
          "description": "Donating is a goog habit"
      }]
  };
  
//We are going to have a callback funtion and we are going to pass the json object here
paypal.payment.create(create_payment_json, function (error, payment) {
    //this payment object is gonna return us what we want the user to direct to...we need to iterate over the links array and find the approval link to which we want the user to redirect
    if (error) {
        throw error;
    } else {
        for(let i = 0;i < payment.links.length;i++){
          if(payment.links[i].rel === 'approval_url'){
            res.redirect(payment.links[i].href);
          }
        }
    }

});
}); 

//starting our server on port 3000...
app.listen(3000, () => console.log('Server Started'));
