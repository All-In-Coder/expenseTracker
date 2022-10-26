const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const expense = new Schema({
    ref:{
        type: String,
        unique:true
    },
    
    address: {
        type:String,
    },
    value: {
        type:String,
    },
    debited:{
        type:String
    }
});

module.exports = mongoose.model("Expense", expense);