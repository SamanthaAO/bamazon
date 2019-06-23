//initiates node packages
var mysql = require("mysql");
var inquirer = require("inquirer");
require("dotenv").config();

//creates global variables
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

//when connected will then shows initial menu of options for manager to choose from 
connection.connect(function (err) {
    //if there is an error say so 
    if (err) throw err;
    //tell the id it is connected at
    console.log("connected as id " + connection.threadId + "\n");
    //shows initial menu of options for manager to choose from 
    showMenu();
});

//shows supervisor options to choose from for functions to perform
function showMenu() {

    inquirer
        .prompt([{
            type: "list",
            name: "supervisorOption",
            message: "Please select an option from the list below:",
            choices: ["View Product Sales by Department", "Add New Depatment"]


        }
        ])
        .then(function (answer) {

            switch (answer.supervisorOption) {
                case "View Product Sales by Department":
                    readProductsSales();
                    break;

                case "Add New Depatment":
                    updateDepartments();
                    break;


            }
        })
}

//shows table of all product sales
function readProductsSales() {
    console.log("Selecting all product sales by department...\n");
    //groups product data against departement to get total sales. groups by name and id to have unique identifier. 
    connection.query(`SELECT d.*, SUM(product_sales) as product_sales, SUM(product_sales) - d.over_head_costs as total_pofit
    FROM products as p
    RIGHT JOIN departments as d
    ON p.department_id = d.department_id
    GROUP BY d.department_id, d.department_name`, function (err, res) {
            //displays all the products
            //callback(res);
            if (err) throw err;
            console.table(res);
            anotherAction();
        });
};

//adds new departments
function updateDepartments() {
    inquirer
        .prompt([
            {
                type: "input",
                name: "departmentName",
                message: "What is the new department name?",
            },
            {
                type: "number",
                name: "overHeadCosts",
                message: "What are the over head costs for this department?",
                validate: validateNumber
            }


        ])
        .then(function (answer) {

            connection.query(
                "INSERT INTO departments SET ? ",
                [
                    {
                        department_name: answer.departmentName,
                        over_head_costs: answer.overHeadCosts

                    }
                ],
                function (error) {
                    if (error) throw error;
                    console.log("Department added.");
                    anotherAction();
                }
            );

        });

};




//validates that the input in overhead costs is a number
function validateNumber(answer) {

    var reg = /^\d+$/;
    return reg.test(answer) || "Please input a number!";

}


//checks if supervisor would like to complete another action and then disconnects
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
