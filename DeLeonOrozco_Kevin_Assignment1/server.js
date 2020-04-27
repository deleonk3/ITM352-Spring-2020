//Code taken from Lab 13 ex C 
var express = require('express');
var myParser = require("body-parser");
var fs = require('fs');
var products = require("./public/products.json"); //require products from this file 

var app = express();

app.use(myParser.urlencoded({ extended: true }));

// This allows us to access the invoice 
app.post("/invoice.html", function (request, response, next) {
    let POST = request.body;
    if(typeof POST['Sub_btn'] == 'undefined') {
        console.log('No purchase form data');
        next(); d
    } else 
    {
        console.log("No sub button");
      
    }

    console.log(Date.now() + ': Purchase made from ip ' + request.ip + ' data: ' + JSON.stringify(POST));

    var contents = fs.readFileSync('./public/invoice.html', 'utf8'); //renders content from invoice.html
    response.send(eval('`' + contents + '`')); // render template string

    function display_invoice_table_rows(POST) { // need to POST since it is not global 
        subtotal = 0;
        str = '';
        for (i = 0; i < products.length; i++) {
            a_qty = 0;
            if(typeof POST[`qty_text${i}`] != 'undefined') {
                a_qty = POST[`qty_text${i}`];
            }
            if (a_qty > 0) {
                // product row
                extended_price =a_qty * products[i].price
                subtotal += extended_price;
                str += (`
      <tr>
        <td width="43%">${products[i].model}</td>
        <td align="center" width="11%">${a_qty}</td>
        <td width="13%">\$${products[i].price}</td>
        <td style="text-align: right;" width="54%">\$${extended_price}</td>
      </tr>
      `);
            }
        }
        //Code Taken from Invoice 2
        // Compute tax
        tax_rate = 0.0575;
        tax = tax_rate * subtotal;

        // Compute shipping
        if (subtotal <= 50) {
            shipping = 2;
        }
        else if (subtotal <= 100) {
            shipping = 5;
        }
        else {
            shipping = 0.05 * subtotal; // 5% of subtotal
        }

        // Compute grand total
        total = subtotal + tax + shipping;
        
        return str;
    }

});



app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
});

app.use(express.static('./public'));

var listener = app.listen(8080, () => { console.log('Server listening on port ' + listener.address().port) }); //Server will be listening from localhost:8080