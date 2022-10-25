const express = require('express');
const env = require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const Expense = require('./models/expense');
const app = express();
// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
dbConnection();

function dbConnection(req, res, next) {
    // Mongodb connection
    mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }, (req, res) => {
        console.log("Mongoose Connected");
    });

    //Get the default connection
    const db = mongoose.connection;

    // Bind connection to error event (to get notification of connection errors)
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    db.once('open', function () {
        console.log("database Connected");
    });
}

app.get("/allData", (req, res) => {
    const allMessage = Expense.find();
    allMessage.exec((error, result) => {
        if (error) {
            res.json({
                "message": "Someting went wrong",
                "error": error
            });
        }

        res.json({
            "message": "All Messsages",
            "stories": result
        });
    });
})

app.post('/delete', (req,res)=>{
    const ref = req.body.ref;
    try {
        Expense.deleteOne({"ref":ref});
        res.json("Successs");
    } catch (error) {
        res.json("errorr");
        
    }
});

app.post('/addExpense', (req, res) => {
    const ref = req.body.ref;
    const address = req.body.address;
    const value = req.body.value;
    const debited = req.body.debited;
    var check = Expense.findOne({
        "ref": ref
    });
    if(ref==null)
        res.json("ref is null");
        
    check.exec((err, result) => {
        if (result==null) {
            const newExpense = Expense({
                ref,
                address,
                value,
                debited
            });
            try {
                newExpense.save((err, result) => {
                    console.log(err);
                    console.log(result);
                    if (err) {
                        res.json({
                            "message": "Errorrrrr"
                        });
                    }
                    res.json({
                        "message": "Added",
                    });
                });
                res.json("Success");
            } catch (error) {
                    res.json("Errorrr");
            }
        }
        res.json({
            "message": "Already present ref"
        })
    });


});
app.listen(5000, () => {
    console.log("running at port 5000");
});