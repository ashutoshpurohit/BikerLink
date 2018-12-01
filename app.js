
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , devicedataservice = require('./modules/devicedataservice')
  , mongoose = require('mongoose');

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression')

var app = express();

// all environments
app.set('port', process.env.PORT || 80);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  //app.use(express.errorHandler());
}

var dbURI = "mongodb://heroku_trvs3b4b:kt9743v0m78u7s219ts6i4btrs@ds123399.mlab.com:23399/heroku_trvs3b4b";
mongoose.connect(dbURI);

var MobileDeviceMappingSchema = new mongoose.Schema({
	MobileNumber: Number,
	DeviceId: String,
	TimeStamp : Date
});

var MobileDevice = mongoose.model('MobileDevice', MobileDeviceMappingSchema);

app.get('/', routes.index);
app.get('/users', user.list);

app.get('/Nidhi', function(request,response){
	response.json({"Name" : "Hi",
		"Gender": "Female",
		"Age:" : 31,
		"MaritalStatus": "Married"});
});

app.post('/Ashu', function(request, response){
	console.log(request.body.Name);
	console.log(request.body.Age);
})

app.get('/devices/:MobileNumber', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	console.log(request.url + ' : querying for ' +
	request.params.MobileNumber);
	devicedataservice.findDeviceByMobileNumber(MobileDevice, request.params.MobileNumber,
	response);
	});

app.post('/devices', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	devicedataservice.updateDevice(MobileDevice, request.body, response);
	});

app.put('/devices', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	console.log(request);
	console.log(request.body);
	devicedataservice.createMobileDevice(MobileDevice, request.body, response);
	});
	
app.del('/devices/:MobileNumber', function(request,response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	console.log('request.params.MobileNumber');
	console.log(request.params.MobileNumber);
	devicedataservice.deleteDevice(MobileDevice, request.params.MobileNumber, response);
	});
	
app.get('/devices', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		console.log('Listing all device with ' + request.params.key +
				'=' + request.params.value);
		devicedataservice.listDevices(MobileDevice, response);
	});

app.get('/devices/:DeviceId', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	console.log(request.url + ' : querying for ' +
	request.params.DeviceId);
	devicedataservice.findDeviceByDeviceID(MobileDevice, request.params.DeviceId,
	response);
	});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
  console.log('Nidhi');
});
