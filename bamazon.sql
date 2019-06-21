-- creates bamazon db

CREATE DATABASE bamazonDB;

USE bamazonDB;

-- creates products table
CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NULL,
  department_id INT,
  price DECIMAL(6,2) NULL,
  stock_quantity INT NOT NULL,
  product_sales DECIMAL(8,2) DEFAULT 0
  PRIMARY KEY (item_id)
);

-- add products to table
INSERT INTO products (product_name, department_id, price, stock_quantity)
VALUES ("Poké Ball", 1, 200.00, 4), ("Great Ball", 1, 600.00, 4), ("Ultra Ball", 1, 1200.00, 4),
 ("Potion", 2, 300.00, 4),("Super Potion", 2, 700.00, 4), ("Hyper Potion", 2, 1200.00, 4), 
 ("Max Potion", 2, 2500.00, 4), ("Full Restore", 3, 3000.00, 4), ("Revive", 3, 1500.00, 4),
 ("Antidote", 4, 100.00, 4), ("Parlyz Heal", 4, 200.00, 4), ("Awakening", 4, 250.00, 4),
  ("Burn Heal", 4, 250.00, 4), ("Ice Heal", 4, 250.00, 4), ("Full Heal", 4, 600.00, 4),
  ("Escape Rope", 5, 550.00, 4), ("Repel", 6, 350.00, 4), ("Super Repel", 6, 500.00, 4),
  ("Max Repel", 6, 700.00, 4)

-- creates departments table
CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(45) NULL,
  over_head_costs DECIMAL(6,2) NULL,
  PRIMARY KEY (department_id)
);


-- add products to table
INSERT INTO departments (department_name, over_head_costs)
VALUES ("Balls", 500.00), ("Potions", 600.00),("Cures", 550.00),
("Healing", 100.00),("Items", 400.00),("Repelents", 400.00), ("Pokémon", 1000.00)


--to be used in supervisors.js
SELECT d.*, SUM(product_sales) as product_sales, SUM(product_sales) - d.over_head_costs as total_pofit
    FROM products as p
    RIGHT JOIN departments as d
    ON p.department_id = d.department_id
    GROUP BY d.department_id, d.department_name, d.department_name

