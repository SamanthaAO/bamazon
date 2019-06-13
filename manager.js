{
    type: "list",
    name: "shopItems",
    message: "Please select a product from the list below that you would like to purchase.",
    choices: function choices(){
        var displayArray = [];
        res.forEach(function(element){
          displayArray.push(element.item_id + ": " + element.product_name)
        })
        return displayArray;
    },
},