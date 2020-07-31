console.log("File Running...");
var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'Sleu2558',
	database : 'nodelogin',
	insecureAuth : true
});

var app = express();

app.use(express.static(__dirname + '/public'));
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/public/SplashPage.html'));
});

app.post('/sign_up' ,function(request,response){
	var username = request.body.username;
	var email= request.body.email;
	var password = request.body.password;
	var id = 10025;

	var sqltest = "INSERT INTO `accounts` (`id`, `username`, `password`, `email`) VALUES (50, 'test2', 'test2', 'test2@test.com');";
	let sql = "INSERT INTO `accounts` VALUES (`id` = ?, `username` = ?, `password` = ?, `email` = ?);";
	let values =[id,username,password,email];
  	connection.query(sql, values, function (err, result,fields) {	
  		console.log("Made it here!");
    	if (err) throw err;
    	console.log("1 record inserted");
    	console.log(result);
    	console.log( id,username, email, password);
    	response.redirect('/home');
		response.end();
  	});
});

app.post("/auth", function(request, response) {
	var username = request.body.username;
	var password = request.body.password;

	if (username && password) {
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (error) {
     			console.log(error);
			}	
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});


app.listen(3000);
console.log("End of file...");