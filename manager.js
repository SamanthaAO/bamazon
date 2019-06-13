var mysql = require("mysql");
var inquirer = require("inquirer");
require("dotenv").config();
var key = require("./keys.js");
var password = key.password.password;

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
    showMenu();
});

function showMenu() {

    inquirer
        .prompt([{
            type: "list",
            name: "managerOption",
            message: "Please select an option from the list below:",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]


        }
        ])
        .then(function (answer) {

            switch (answer.managerOption) {
                case "View Products for Sale":
                    readProducts();
                    break;

                case "View Low Inventory":
                    readLowInventory();
                    break;

                case "Add to Inventory":
                    identifyItem();
                    break;

                // case "Add New Product":
                // updateProducts();
                // break;

            }
        })
}


function readProducts() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        //displays all the products
        //callback(res);
        if (err) throw err;
        displayAll(res);
        connection.end();
    });
}

function displayAll(res) {
    var itemArray = [];
    res.forEach(function (element) {
        var price = priceSymbol(element.price);
        var itemInfo = "Item ID: " + element.item_id + " | Name: " + element.product_name + " | Price: " + price + " | Stock Quantity: " + element.stock_quantity;
        itemArray.push(itemInfo);
        console.log(itemInfo);
    })
    return itemArray;
}

function priceSymbol(x) {
    var price = new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(x);
    return price;
}

function readLowInventory() {
    console.log("Selecting products with low inventory...\n");
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
        //displays all the products
        //callback(res);
        if (err) throw err;
        displayAll(res);
        connection.end();
    });
};

function identifyItem() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        //displays all te products
        var choices = displayAll(res);
        //var itemList = res.length attempted to use fo validate;
        //var answer;
        if (err) throw err;
        inquirer
            .prompt([{
                type: "list",
                name: "stockOption",
                message: "Please select the item you would like to update the stock on",
                choices: choices


            },
            {
                type: "number",
                name: "stockAdded",
                message: "How many would you like to add?",
                validate: validateNumber
            }



            ])
            .then(function (answer) {
                var chosenItemID = choices.indexOf(answer.stockOption) + 1;
                for (var i = 0; i < res.length; i++) {
                    if (res[i].item_id == chosenItemID) {
                        chosenItem = res[i];
                    }
                }
                console.log(chosenItem);

                updateInventory(answer);



                // if (chosenItem.stock_quantity >= answer.quantityPurchased) {
                //     var total = priceSymbol(chosenItem.price * answer.quantityPurchased)
                //     console.log("Congratulations you have purchased " + answer.quantityPurchased + " " + chosenItem.product_name + "s. Your total comes to " + total + ".");
                //     updateProducts(chosenItem, answer);
                //     console.log(chosenItem)

                // }
                // else {
                //     console.log("I am so sorry for the inconvienience, but we do not currently have the stock to fill you order of " + chosenItem.product_name + "s.")
                // }


            });

        //console.log(res[i].item_id + ": " + res[i].product_name);

    });




};

function validateNumber(answer) {

    var reg = /^\d+$/;
    return reg.test(answer) || "Please input a number!";

}

function updateInventory(answer) {
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: chosenItem.stock_quantity + answer.stockAdded
            },
            {
                item_id: chosenItem.item_id
            }
        ],
        function (error) {
            if (error) throw error;
            console.log("Transaction Complete");
            connection.end();
        }
    );
}



        // function updateProducts(){

        // };





