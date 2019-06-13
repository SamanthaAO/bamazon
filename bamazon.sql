-- creates bamazon db

CREATE DATABASE bamazonDB;

USE bamazonDB;

-- creates products table
CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NULL,
  department_name VARCHAR(45) NULL,
  price DECIMAL(6,2) NULL,
  stock_quantity INT NOT NULL,
  PRIMARY KEY (item_id)
);

-- add products to table
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Poké Ball", "Balls", 200.00, 4), ("Great Ball", "Balls", 600.00, 4), ("Ultra Ball", "Balls", 1200.00, 4),
 ("Potion", "Potions", 300.00, 4),("Super Potion", "Potions", 700.00, 4), ("Hyper Potion", "Potions", 1200.00, 4), 
 ("Max Potion", "Potions", 2500.00, 4), ("Full Restore", "Cures", 3000.00, 4), ("Revive", "Cures", 1500.00, 4),
 ("Antidote", "Healing", 100.00, 4), ("Parlyz Heal", "Healing", 200.00, 4), ("Awakening", "Healing", 250.00, 4),
  ("Burn Heal", "Healing", 250.00, 4), ("Ice Heal", "Healing", 250.00, 4), ("Full Heal", "Healing", 600.00, 4),
  ("Escape Rope", "Items", 550.00, 4), ("Repel", "Repelents", 350.00, 4), ("Super Repel", "Repelents", 500.00, 4),
  ("Max Repel", "Repelents", 700.00, 4)