//Bringing all our dependencies modules
const express = require('express');
const ejs = require('ejs');
const paypal = require('paypal-rest-sdk');
const nodemailer = require("nodemailer");

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
          "return_url": "https://paymentgatewayinte.herokuapp.com/success",
          "cancel_url": "https://paymentgatewayinte.herokuapp.com//cancel"
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
           // console.log(payment.links[i].href);
            res.redirect(payment.links[i].href);
          }
        }
    }

});
}); 
//we need to create the execute payment object with the payer id which we need to take out from the url after we click pay ...
app.get('/success', (req, res) => {
    const payerId = req.query.PayerID;//we are retreiving these details from thhe url
    const paymentId = req.query.paymentId;
  
    const execute_payment_json = {//using those above details we are creating an object and sending to the the call back method
      "payer_id": payerId,
      "transactions": [{
          "amount": {
              "currency": "USD",
              "total": "50.00"
          }
      }]
    };
  
    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
      if (error) {
          console.log(error.response);
          throw error;
      } else {
        //var er=100;
        for(let i = 0;i < payment.links.length;i++){
        
           // res.redirect(payment.links[i].href);
          var amount= payment.transactions[i].amount.total;
          //payment.payer.pa
          var ty=payment.payer;
          var id=payment.id;
          
        }
        
          
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'sarveshrocksa1@gmail.com',
              pass: 'sarvesh@A13612'
            }
          });
          
          var mailOptions = {
            from: 'sarveshrocksa1@gmail.com',
            to:  ty.payer_info.email,
            subject: 'Donation success',
            text: `Have successfully donated the amount of ${amount} ur payment id is ${id}`
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log(`mail sent ` );
            
            }
          });
          
         
          res.send('Success');
      }
  });
  
  

  });
  

//we are adding route to the cancel page 
app.get('/cancel', (req, res) => res.send('Cancelled'));

//starting our server on port 3000...
app.listen(process.env.PORT || 5000, () => console.log('Server Started'));
