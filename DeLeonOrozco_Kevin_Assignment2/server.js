/*AUTHOR: Kevin De Leon Orozco
Code taken from Lab 13 and invoice example taken from Assigment 1 workshop file and modified.
Code displayed in server ensures that code is being run from both client and server side.
Server is needed for clients to have access from webpage. Without server webiste is not accessible to public. */

var express = require('express'); //needed to install express similar to Lab 13
var myParser = require("body-parser"); //needed to install body-parser similar to Lab 13
var fs = require('fs'); //Taken from Lab 13
var products = require("./public/products.json"); //require products from this file 
var app = express(); //need to defien express in order for server to run 
var user_info_file = './user_data.json';




app.post("/products_html", function (request, response) {
    let POST = request.body;
    window.onload = function () {
        let params = (new URL(document.location)).searchParams;

    if (POST ('purchase_submit')) {
            has_errors = false; // assume quantities are valid from the start
            total_qty = 0; // need to check if something was selected so we will look if the total > 0
            for (i = 0; i < products.length; i++) {// assigns desired quantites to products 
                if (params.has(`quantity${i}`)) {
                    var a_qty = POST (`quantity${i}`);
                    product_selection_form[`quantity${i}`].value = a_qty;
                    total_qty += a_qty; 
                    if(!isNonNegInt(a_qty)) {
                        has_errors = true; // invalid quantity
                        checkQuantityTextbox(product_selection_form[`quantity${i}`]); // show where the error is
                    }
                }
            }
            // Code responds to errors, if no errors then redirects to invoice
            if(has_errors) {
                alert("Please enter only valid quantities!");
            } else if(total_qty == 0) {
                alert("Please select some quantities!");
            } else { // this will redirect to login
                window.location = `/login.html${document.location.search}`
                window.stop;

            }
        }
    }
        });

if(fs.existsSync(user_info_file)){
    var file_stats = fs.statSync(user_info_file);

    var data = fs.readFileSync(user_info_file,'utf-8');
    var userdata = JSON.parse(data);

    // We are adding more objects with the code below
    username = 'newuser';
    userdata[username] = {};
    userdata[username].password = 'newpass';
    userdata[username].email = 'newuser@user.com';
    userdata[username].name = "The New Guy";

    console.log(userdata["kdlo22"]["password"],userdata.kdlo22.email);
    fs.writeFileSync(user_info_file, JSON.stringify(userdata));

    console.log(`${user_info_file} has ${file_stats.size} characters`);
} else {
    console.log("hey!" + user_info_file + "doesn't exist!");
}


app.use(myParser.urlencoded({ extended: true }));

app.post("/check_login", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
   console.log(request.body, userdata);
   console.log(request.query);
   var login_username= request.body.username
   //check if username exists in reg data. If so, check if password matches 
   if (typeof userdata[login_username] != 'undefined'){
       var user_info = userdata[login_username];
       //check if password stored for username matches what user typed in
       if (user_info["password"] != request.body["password"]){
        err_str = `bad password`; //this will output message that password is not correct
    } else {
        response.redirect (`/invoice.html' + ${request.query ['quantity']}` );
        return;
    }
       
   } else {
       err_str = `bad username` //this will output error message.
    
   }
   response.redirect(`./login?username=${login_username}&error=${err_str}`);
});


 app.post("/register_user", function (request, response) {
    // process a simple register form
    console.log(request.body);
    username = request.body.username;
    //check if username is taken 
    errs= [];
    if(typeof userdata[username] != 'undefined') {
        errs.push ( "username taken");
    } else {
        userdata[username] = {};
    }
    // is passwrd same as repeat password
    if (request["body"]["password"] != request ["body"]["repeat_password"]) {
        errs.push ("passwords don't match");
    } else {
        userdata[username].password = request.body.password;
    }
    userdata[username].email = request.body.email;

    if(errs.length ==0) {
    console.log(userdata);
    fs.writeFileSync(user_info_file, JSON.stringify(userdata));
    response.end(`New user ${username} registered`)
    } else {
    response.end(JSON.stringify(errs));
}


 });

app.use(myParser.urlencoded({ extended: true }));

var contents = fs.readFileSync('./public/invoice.html', 'utf8'); //renders content from invoice.html


    function display_invoice_table_rows(POST) { // need to POST since it is not global 
        subtotal = 0;
        str = '';
        for (i = 0; i < products.length; i++) {
            a_qty = 0;
            if(typeof POST[`qty_text${i}`] != 'undefined') { //this takes the quantity given in product store and renders it in invoice 
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
       
    };




app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
});

app.use(express.static('./public')); //This retrieves all files from public file, without this files would not be accessed 

var listener = app.listen(8080, () => { console.log('Server listening on port ' + listener.address().port) }); //Server will be listening from localhost:8080