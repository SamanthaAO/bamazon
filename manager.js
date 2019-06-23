//initiates node packages
var mysql = require("mysql");
var inquirer = require("inquirer");
require("dotenv").config();

//creates global variables
var key = require("./keys.js");
var password = key.password.password;

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

//when connected will then run show menu to show the manager possible options
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    showMenu();
});

//shows manager options to choose from
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

                case "Add New Product":
                    updateProducts();
                    break;

            }
        })
}

//shows all products in MySql
function readProducts() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        //displays all the products
        //callback(res);
        if (err) throw err;
        displayAll(res);
        anotherAction();
    });
}

//displays products in correct format
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

//adds price symbol
function priceSymbol(x) {
    var price = new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(x);
    return price;
}

//shows products with low inventory
function readLowInventory() {
    console.log("Selecting products with low inventory...\n");
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
        //displays all the products
        //callback(res);
        if (err) throw err;
        displayAll(res);
        anotherAction();
    });
};

//manager choses item that they would like to update
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
                

                updateInventory(answer);


            });

    });

};

//confirms amount added to stock is a correct number
function validateNumber(answer) {

    var reg = /^\d+$/;
    return reg.test(answer) || "Please input a number!";

}

//the stock is added to the item in sql
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
            console.log("Stock added.");
            anotherAction();
        }
    );
}


//manager adds new product
function updateProducts() {

    var departmentArray = [];
    connection.query(`SELECT department_id, department_name FROM departments`,
        function (err, res) {
            res.forEach(function (element) {
                departmentArray.push({ name: element.department_name, value: element.department_id })
            })
            return departmentArray;
        })

    inquirer
        .prompt([
            {
                type: "input",
                name: "name",
                message: "Name of the Product:",
            },
            {
                type: "list",
                name: "departmentID",
                message: "Select the Department the product is in:",
                choices: departmentArray,
            },
            {
                type: "number",
                name: "price",
                message: "Price:",
                validate: validateNumber
            },
            {
                type: "number",
                name: "stock",
                message: "Quantity in Stock:",
                validate: validateNumber
            }
        ])
        .then(function (answer) {
            connection.query(
                "INSERT INTO products SET ? ",
                [
                    {
                        product_name: answer.name,
                        department_id: answer.departmentID,
                        price: answer.price,
                        stock_quantity: answer.stock

                    }
                ],
                function (error) {
                    if (error) throw error;
                    console.log("Product added.");
                    anotherAction();
                }
            );


        });
};


//manager is asked after they complete their action if they would liek to complete another action or close session
function anotherAction() {

    inquirer
        .prompt([
            {
                name: "confirm",
                type: "confirm",
                message: "Would you like to complete another action?"
            }
        ])
        .then(function (answer) {
            if (answer.confirm == true) {
                showMenu();
            }
            else {
                console.log("Goodbye.");
                connection.end();
            }

        });

}





