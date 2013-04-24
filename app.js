/**
* Module dependencies.
*/
var express = require('express'),
    routes = require('./routes'),
    user = require('./routes/user'),
    http = require('http'),
    path = require('path');
    var fs = require('fs');

var app = express();

app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(require('stylus')
        .middleware(__dirname + '/public'));
    app.use(express.static(path.join(__dirname, 'public')));

    // Handle 404
    app.use(function(req, res) {
        res.status(400);
        res.render('404.jade', {title: '404: File Not Found'});
    });

    app.use(express.favicon(__dirname + 'public/favicon.ico'));

    // Handle 500
    app.use(function(error, req, res, next) {
        res.status(500);
        res.render('500.jade', {title:'500: Internal Server Error', error: error});
    });

});

var html_dir = './public/html/';

app.configure('development', function() {
    app.use(express.errorHandler());
});


app.get('/', function(req, res) {
    res.render('index', {
        title: 'Home'
    });
});

app.get('/hello', function(req, res) {
    res.sendfile(html_dir + 'about.html');
});

app.get('/test', function(req, res) {

    // function to encode file data to base64 encoded string
    function base64_encode(file) {
        // read binary data
        var bitmap = fs.readFileSync(file);
        // convert binary data to base64 encoded string
        return new Buffer(bitmap).toString('base64');
    }

    // function to create file from base64 encoded string
    function base64_decode(base64str, file) {
        // create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
        var bitmap = new Buffer(base64str, 'base64');
        // write buffer to file
        fs.writeFileSync(file, bitmap);
        console.log('******** File created from base64 encoded string ********');
    }

    // convert image to base64 encoded string
    var base64str = 'data:image/jpg;base64,'+base64_encode(__dirname + '/public/img/me.png');
    
    res.send(base64str);
    // convert base64 string back to image 
    //base64_decode(base64str, 'copy.jpg');

})

app.get('/about', function(req, res) {
    res.render('about', {
        title: 'About'
    });
});

app.get('/contact', function(req, res) {
    res.render('contact', {
        title: 'Contact'
    });
});



http.createServer(app).listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});