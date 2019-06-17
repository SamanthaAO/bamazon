var mysql = require("mysql");
var inquirer = require("inquirer");
require("dotenv").config();
var key = require("./keys.js");
var password = key.password.password;
var itemList;




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

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    readProducts();
});

function readProducts() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        //displays all te products
        displayAll(res);
        itemList = res.length;
        //var answer;
        if (err) throw err;
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
                for (var i = 0; i < res.length; i++) {
                    if (res[i].item_id == answer.IDPurchased) {
                        chosenItem = res[i];
                    }
                }
                //console.log(chosenItem);

                if (chosenItem.stock_quantity >= answer.quantityPurchased) {
                    var total = priceSymbol(chosenItem.price * answer.quantityPurchased)
                    console.log("Congratulations you have purchased " + answer.quantityPurchased + " " + chosenItem.product_name + "s. Your total comes to " + total + ".");
                    updateProducts(chosenItem, answer);
                    //console.log(chosenItem)

                }
                else {
                    console.log("I am so sorry for the inconvienience, but we do not currently have the stock to fill you order of " + chosenItem.product_name + "s.")
                    anotherPurchase();
                }


            });

        //console.log(res[i].item_id + ": " + res[i].product_name);

    });
}

function displayAll(res) {
    res.forEach(function (element) {
        var price = priceSymbol(element.price)
        console.log("Item ID: " + element.item_id + " | Name: " + element.product_name + " | Price: " + price)
        
    })
    //console.table(res);
}


function priceSymbol(x) {
    var price = new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(x);
    return price;
}

function validateNumber(answer) {

    var reg = /^\d+$/;
    return reg.test(answer) || "Please input a number!";

}

function validateIDOnList(answer) {

        if (isNaN(answer) === false && parseInt(answer) > 0 && parseInt(answer) <= itemList) {
            return true;
        }
        return "Please input a number that is on the list!";
}

function updateProducts(chosenItem, answer) {
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
