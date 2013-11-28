// MVC w/ node & express
// http://timstermatic.github.io/blog/2013/08/17/a-simple-mvc-framework-with-node-and-express/

/**
 * Module Dependencies 
 */
var express = require('express'),
    //db = require('mongojs').connect('localhost/contact-list', ['contacts']),
    fs = require('fs');
    //$ = require('jquery');

var app = express();


/**
 * Middlewares and configurations 
 */
app.configure(function () {

    app.use(express.bodyParser());
    // app.use(express.urlencoded());
    // app.use(express.cookieParser('Contacts App '));
    // app.use(express.session({
    //     store: new MongoSessionStore({
    //         url: 'mongodb://localhost/contact-list'
    //     }),
    //     secret: '1234567890QWERTY'
    // }));
    // app.use(express.static(path.join(__dirname, 'public')));
    // app.set('views', __dirname + '/views');
    // app.set('view engine', 'jade');
});

app.use(function (req, res, next) {
    // var err = req.session.error,
    //    msg = req.session.success;
    // delete req.session.error;
    // delete req.session.success;
    // res.locals.message = '';
    // if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
    // if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
    next();
});


/**
 * Dynamically include controller routes
 */
fs.readdirSync('./controllers').forEach(function (file) {
    if (file.substr(-3) === '.js') {
        route = require('./controllers/'+ file);
        route.controllers(app);
    }
});


app.listen(process.env.PORT || 8000);