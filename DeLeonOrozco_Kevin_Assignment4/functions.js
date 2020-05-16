// This function takes a string assumed to be a key in the products array above to display and select the corresponding products
function select_products(products_key) {
    var order_str = '';
        // get the particular products to display
        products = products_data[products_key];
        if (params.has('Submit')) {
            // grab the quantities from the query string
            order_str = 'Your order is:<br>';
            for (i = 0; i < products.length; i++) {
                order_str += `You want ${params.get(`quantities[${i}]`)} of ${products[i]['name']}<br>`;
            }
        } else {
            order_str += `<h1>Please select what ${products_key} you want</h1><br>`;
            // We put the whole table in the form so that anything entered in it will get submitted
            order_str += `
                <FORM action="" method="GET">
                <INPUT TYPE="HIDDEN" NAME="products_key" VALUE="${products_key}">
                    <TABLE BORDER>
                        <TR><TD><B><BIG>Description</TD><TD><B><BIG>Price</TD><TD><B><BIG>Quantity Desired</TD></TR>`;
    
            for (i = 0; i < products.length; i++) {
                order_str += `<TR><TD>${products[i]['name']}</TD><TD>${products[i]['price']}</TD><TD>
                    <INPUT TYPE="TEXT"  name="quantities[${i}]"></TD></TR>`;
            }
            order_str += `</TABLE><br>
    <INPUT TYPE="SUBMIT"  name="Submit" value="Select">
    </FORM>`;
        } // this closes the else for the form and dislpays the order_str
        document.write(order_str);
    }