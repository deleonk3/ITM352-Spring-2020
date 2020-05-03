/*AUTHOR: Kevin De Leon Orozco
Code taken from Lab 13 and invoice example taken from Assigment 1 workshop file and modified.
Code displayed in server ensures that code is being run from both client and server side.
Server is needed for clients to have access from webpage. Without server webiste is not accessible to public. */

var express = require('express'); //needed to install express similar to Lab 13
var myParser = require("body-parser"); //needed to install body-parser similar to Lab 13
var fs = require('fs'); //Taken from Lab 13
var products = require("./public/products.json"); //require products from this file 
var app = express(); //need to defien express in order for server to run 
var user_info_file = './user_data.json'; //retrieves data from this json file 
const querystring = require ("query-string"); // Value created to process query string 


function isNonNegInt(q, return_errors = false) {
    errors = []; // assume no errors at first
    if(q == '') q =0; // handle blank inputs as if they are 0
    if (Number(q) != q) errors.push('<font color="red">Not a number!</font>'); // Check if string is a number value, if not returns text in red color
    else if (q < 0) errors.push('<font color="red">Negative value!</font>'); // Check if it is non-negative, if not returns text in red color 
    else if (parseInt(q) != q) errors.push('<font color="red">Not an integer!</font>'); // Check that it is an integer, if not returns text in red color 
    return return_errors ? errors : (errors.length == 0);
}
//code from Lab 14 
if(fs.existsSync(user_info_file)){
    var file_stats = fs.statSync(user_info_file);
    var data = fs.readFileSync(user_info_file,'utf-8');
    var userdata = JSON.parse(data);

    console.log(`${user_info_file} has ${file_stats.size} characters`); //if user file exists, console outputs how many characters it has. Info no visible on client side 
} else {
    console.log("hey!" + user_info_file + "doesn't exist!"); //if user file does not exists, console outputs error message 
}

app.all('*', function (request, response, next) { //this lets the server aquire all requests 
    console.log(request.method + ' to ' + request.path);
    next();
});


app.use(myParser.urlencoded({ extended: true })); //uses parser


app.post("/processform", function (request, response) { //this accesses info from process form 
    let POST = request.body;
    

    if (typeof POST ['purchase_submit'] != 'undefined') {

        var isvalid = true;
    
        for (i = 0; i <products.length; i++) {
            q = POST ["quantity"+ i];
            isvalid = isvalid && isNonNegInt(q);
        }

        if (isvalid) { //Code taken from Lab 14 ex/c. 
            //if quanttites are valid in processform this diectly takes us to login page
            str = `
<body>
<style> 
        body {text-align: center; /*this aligns the text found in the website */
    background: lightblue;} /* This gives the website a lightblue color */

    img {
        border: 1px solid yellow;  
        /* Yellow border */
        border-radius: 4px;
        /* Rounded border */
        padding: 5px;
        /* Some padding */
        width: 200px;
        /* Set a small width */
    }

     /* code above and below retrieved from SmartphoneProducts3*/

    /* Add a hover effect (blue shadow) */
    img:hover {
        box-shadow: 0 0 5px 1px black;
    }
    </style>
<h1> Please Login to continue<h1>
<img src='https://i.etsystatic.com/20394804/r/il/09c922/1930801674/il_570xN.1930801674_pcpv.jpg'></a>

<form action="check_login?${querystring.stringify(POST)}" method="POST">
<input type="text" name="username" size="40" placeholder="enter username"><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="submit" value="Submit" id="submit">
</form>
<a href = "./register?${querystring.stringify(POST)}">New user register</a>
</body>
    `;
    response.send(str);

//Code for app.post check_login taken and adjusted from Lab 14 ex.c
app.post("/check_login", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
   console.log(request.body, userdata);
   var login_username= request.body.username
   //check if username exists in reg data. If so, check if password matches 
   if (typeof userdata[login_username] != 'undefined'){
       var user_info = userdata[login_username];
       //check if password stored for username matches what user typed in
       if (user_info["password"] != request.body["password"]){
        err_str = `bad_password`; //this will output message that password is not correct
    } else {
        //response.end (`${login_username} is logged in with data ${JSON.stringify(request.query)}`); //this will output message that user is logged in.
        response.redirect(`/invoice.html?${querystring.stringify(request.query)}`);
        return;
    }
       
   } else {
       err_str = `bad_username`; //this will output error message.
    
   }
   response.redirect(`/check_login?username=${login_username}&error=${err_str}`);
});

        }
    }

});

app.get("/register", function (request, response) {
    // Give a simple register form
    str = `
<body>
<style> 
        body {text-align: center; /*this aligns the text found in the website */
    background: lightyellow;} /* This gives the website a lightblue color */

    img {
        border: 1px solid yellow;  
        /* Yellow border */
        border-radius: 4px;
        /* Rounded border */
        padding: 5px;
        /* Some padding */
        width: 200px;
        /* Set a small width */
    }

     /* code above and below retrieved from SmartphoneProducts3*/

    /* Add a hover effect (blue shadow) */
    img:hover {
        box-shadow: 0 0 5px 1px black;
    }
    </style>
<h1><br>Welcome! <br>
<br>Register a new account to recieve products<br></h1>
<form action="register_user?${querystring.stringify(request.query)}" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="password" name="repeat_password" size="40" placeholder="enter password again"><br />
<input type="email" name="email" size="40" placeholder="enter email"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>
    `;
    response.send(str); // code above renders register page and saves quantity chosen in products page 
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
    //will create more users in register page 
    userdata[username] = {};
    userdata[username].password = request.body.password;
    userdata[username].email = request.body.email;
    userdata[username].name = request.body.name;

    if(errs.length ==0) {
    console.log(userdata);
    fs.writeFileSync(user_info_file, JSON.stringify(userdata));
    response.redirect(`/invoice.html?${querystring.stringify(request.query)}`);
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


app.use(express.static('./public')); //This retrieves all files from public file, without this files would not be accessed 

var listener = app.listen(8080, () => { console.log('Server listening on port ' + listener.address().port) }); //Server will be listening from localhost:8080