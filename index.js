// Name: Kripal Hiteshbhai Pandya
// Project: Final Exam
// Student Number: 8846574
// Date: August 17, 2023
// Email: Kpandya6574@conestogac.on.ca 

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const { check, validationResult } = require('express-validator');

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/KripalFinalExam', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var myApp = express();
myApp.use(bodyParser.urlencoded({ extended: false }));

myApp.set('views', path.join(__dirname, 'views'));

myApp.use(express.static(__dirname + '/public'));

myApp.set('view engine', 'ejs');

myApp.get('/', function (req, res) {
    res.render('index'); 
});

const Order = mongoose.model('Order', {
    name: String,
    studentId: String,
    webCharge: Number,
    serverlessCharge: Number,
    pencilCharge: Number,
    subTotal: Number,
    taxAmount: Number,
    totalAmount: Number
});

var studentIdRegex = /^\d{7}$/;

function checkRegex(userInput, regex) {
    if (regex.test(userInput)) {
        return true;
    }
    else {
        return false;
    }
}

function customstudentIdNumberValidation(value) {
    if (!checkRegex(value, studentIdRegex)) {
        throw new Error('Student ID number should be of 7 digits');
    }
    return true;
}

myApp.post('/', [
    check('name', 'You must enter your Name').not().isEmpty(),
    check('studentId', 'You must enter your Student ID').not().isEmpty(),
    check('studentId').custom(customstudentIdNumberValidation),
], function (req, res) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('index', {
            errors: errors.array()
        });
    }
    else {

        web = 0;
        serverless = 0;
        pencil = 0;
        
        var name = req.body.name;
        var studentId = req.body.studentId;
        var web = req.body.web;
        var serverless = req.body.serverless;
        var pencil = req.body.pencil;

        var webCharge = 0;
        var serverlessCharge = 0;
        var pencilCharge = 0;
        var subTotal = 0;
        var totalAmount = 0;
        var taxAmount = 0;
        var tax = 0;

        webCharge = 72.99 * web;
        serverlessCharge = 61.99 * serverless;
        pencilCharge = 6.99 * pencil;
        subTotal = webCharge + serverlessCharge + pencilCharge;

        tax = 5;
        taxAmount = ((subTotal * 5) / 100);
        totalAmount = ((subTotal * 5) / 100) + subTotal;

        var pageData = {
            name: name,
            studentId: studentId,
            webCharge: webCharge,
            serverlessCharge: serverlessCharge,
            pencilCharge: pencilCharge,
            subTotal: subTotal,
            taxAmount: taxAmount,
            totalAmount: totalAmount
        }

        var myOrder = new Order(pageData);
        myOrder.save().then( function(){
            console.log('New order created');
        });
        
        res.render('index', pageData);
    }
});

myApp.get('/allorders', function(req, res){
    Order.find({}).exec(function(err, orders){
        res.render('allorders', {orders:orders});
    });
});

myApp.listen(3000);

console.log('Website is at port 3000');