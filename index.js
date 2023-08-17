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