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

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  readProducts();
});

function readProducts() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      inquirer
      .prompt([{
          type: "list",
          name: "ShopItems",
          message: "Please select a product from the list below that you would liek to purchase.",
          choices: function choices(){
              var displayArray = [];
              res.forEach(function(element){
                displayArray.push(element.item_id + ": " + element.product_name)
              })
              return displayArray;
          },
      },
      {
          type: "input",
          name: "quantityPurchased",
          message: "How many would you like to purchse?"
      }



      ])
      .then(function(answer) {

      });

      //console.log(res[i].item_id + ": " + res[i].product_name);
      connection.end();
    });
  }

