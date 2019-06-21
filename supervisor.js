
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

function readProductsSales() {
    console.log("Selecting all product sales by department...\n");
    connection.query(`SELECT d.*, SUM(product_sales) as product_sales, SUM(product_sales) - d.over_head_costs as total_pofit
    FROM products as p
    RIGHT JOIN departments as d
    ON p.department_id = d.department_id
    GROUP BY d.department_id, d.department_name, d.department_name`, function (err, res) {
            //displays all the products
            //callback(res);
            if (err) throw err;
            console.table(res);
            anotherAction();
        });
};

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





function validateNumber(answer) {

    var reg = /^\d+$/;
    return reg.test(answer) || "Please input a number!";

}

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
