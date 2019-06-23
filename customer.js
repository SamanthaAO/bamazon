//initiates node packages
var mysql = require("mysql");
var inquirer = require("inquirer");
require("dotenv").config();

//creates global variables
var key = require("./keys.js");
var password = key.password.password;
var itemList;



//connects to sql server
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: password,
    database: "bamazonDB"
});

//when connected will then run read products so user sees all available products
connection.connect(function (err) {
    //if there is an error say so 
    if (err) throw err;
    //tell the id it is connected at
    console.log("connected as id " + connection.threadId + "\n");
    //runs readProducts
    readProducts();
});

//displays all the possible products to user
function readProducts() {
    console.log("Selecting all products...\n");
    //selects all items from products
    connection.query("SELECT * FROM products", function (err, res) {
        //displays all the products
        displayAll(res);
        //updates definition of itemlist so that we know the length of numbeers for validation
        itemList = res.length;

        if (err) throw err;

        //inquirer asks for id# and quantity
        inquirer
            .prompt([{
                type: "number",
                name: "IDPurchased",
                message: "What is the ID of the item that you would like to purchase?",
                validate: validateIDOnList


            },
            {
                type: "number",
                name: "quantityPurchased",
                message: "How many would you like to purchase?",
                validate: validateNumber
            }



            ])
            .then(function (answer) {
                var chosenItem;
                //runs though the items and finds the item that matches the answer collected
                for (var i = 0; i < res.length; i++) {
                    if (res[i].item_id == answer.IDPurchased) {
                        chosenItem = res[i];
                    }
                }

                //checks to see if there is enough stock to fill the order
                if (chosenItem.stock_quantity >= answer.quantityPurchased) {
                    var total = priceSymbol(chosenItem.price * answer.quantityPurchased)
                    console.log("Congratulations you have purchased " + answer.quantityPurchased + " " + chosenItem.product_name + "s. Your total comes to " + total + ".");
                    updateProducts(chosenItem, answer);


                }

                //if there is not enough stock
                else {
                    console.log("I am so sorry for the inconvienience, but we do not currently have the stock to fill you order of " + chosenItem.product_name + "s.")
                    anotherPurchase();
                }

            });
    });
}

//displays all items
function displayAll(res) {
    res.forEach(function (element) {
        var price = priceSymbol(element.price)
        console.log("Item ID: " + element.item_id + " | Name: " + element.product_name + " | Price: " + price)

    })

}

//makes it so that the japanese yen is used for currency
function priceSymbol(x) {
    var price = new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(x);
    return price;
}

//validates that input is a number
function validateNumber(answer) {

    var reg = /^\d+$/;
    return reg.test(answer) || "Please input a number!";

}

//validates that input is an id on the list and is a number
function validateIDOnList(answer) {

    if (isNaN(answer) === false && parseInt(answer) > 0 && parseInt(answer) <= itemList) {
        return true;
    }
    return "Please input a number that is on the list!";
}

//updates products available in mySql after products and salees are purchsed
function updateProducts(chosenItem, answer) {
    //updates products
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: chosenItem.stock_quantity - answer.quantityPurchased
            },
            {
                item_id: chosenItem.item_id
            }
        ],
        function (error) {
            if (error) throw error;
            console.log("Transaction Complete");
            anotherPurchase();
        }
    );
    //updates sales
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                product_sales: chosenItem.product_sales + answer.quantityPurchased * chosenItem.price
            },
            {
                item_id: chosenItem.item_id
            }
        ],
        function (error) {
            if (error) throw error;

        }
    );
}

//askes the customer if they would liek to make another purchase or end the session.
function anotherPurchase() {

    inquirer
        .prompt([
            {
                name: "confirm",
                type: "confirm",
                message: "Would you like to make another purchase?"
            }
        ])
        .then(function (answer) {
            if (answer.confirm == true) {
                readProducts();
            }
            else {
                console.log("Have a Nice Day");
                connection.end();
            }

        });

}
