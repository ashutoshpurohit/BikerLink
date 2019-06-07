
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , devicedataservice = require('./modules/devicedataservice')
  , dataservices = require('./modules/dataservices')
  , mongoose = require('mongoose')
  , gcm =  require('node-gcm')
  ,fs = require('fs');

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression')
var cloudinary = require('cloudinary');
var fileUpload = require('express-fileupload');


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

app.use(fileUpload());

cloudinary.config({ 
	  cloud_name: 'dxrxryauq', 
	  api_key: '456131671447736', 
	  api_secret: 'cFE0ehMWYW32GJ-BTxOYAdPnpGk' 
	});


// development only
if ('development' == app.get('env')) {
  //app.use(express.errorHandler());
}

var dbURI = "mongodb://localhost/BikerCourierDB";

if (process.env.NODE_ENV === 'production') {
 dbURI = "mongodb://heroku_trvs3b4b:kt9743v0m78u7s219ts6i4btrs@ds123399.mlab.com:23399/heroku_trvs3b4b";
}

console.log('Connecting to DB ' + dbURI);

mongoose.connect(dbURI);

console.log('Connected to DB ' + dbURI);

var FlightDataMappingSchema = new mongoose.Schema({
	FlightId: String,
	FlightDate: Date,
	Source: String,
	Destination: String,
	FlightDateStr : String,
	AirFlightPath: [
		{
			Latitude: Number,
			Longitude: Number,
			Altitude: Number,
			Speed: Number,
			Direction: Number,
			TimeSlice: String,
			TimeStamp: Number			
		}
	]
	
});

var FlightTrajectoryMappingSchema = new mongoose.Schema({
	Source: String,
	Destination: String,
	
	AirFlightPath: [
		{
			Latitude: Number,
			Longitude: Number,
			Altitude: Number,
			Speed: Number,
			Direction: Number,
			
		}
	]
	
});

var WeatherDataMappingSchema = new mongoose.Schema({
	latitude: Number,
	longitude: Number,
	altitude: Number,
	DateStr: String,
	TimeStr: String,
	temperature: {
		units: String,
		value : Number,
		dew_point: Number,
		wind_chill: Number
	},
	relative_humidity:{
		units: String,
		value : Number,
	},
	cloud_cover: {
		units: String,
		value : Number,
		text : String,
	},
	weather_code: {
		value : Number,
		text : String,
	},
	cloud_ceiling:{
		units: String,
		value : Number,
	},
	pressure: {
		units: String,
		value : Number,
	},
	daylight: Boolean,
	visibility: {
		units: String,
		value : Number,
	},
	wind: {
		speed: Number,
		speed_units: String,
		dir_units: String,
		dir: Number
	},
	precipitation: {
		probability: {
			units: String,
			value : Number,
		}
	},
	station: {
		priority: Number,
		coordinates: [
			Number
		],
		elev: {
			units: String,
			value : Number,
		},
		id: String,
		Name: String,
	},
	issuetime: Date
});

var MobileDeviceMappingSchema = new mongoose.Schema({
	MobileNumber: Number,
	DeviceId: String,
	TimeStamp : Date
});

var BikerCourierMappingSchema = new mongoose.Schema({
	Id: {type: String, required: true, unique: true },
	FirstName: {type: String, required: true},
	LastName: {type: String},
	DOB : Date,
	Age : {type:Number},
	Gender: String,
	FullAddress: String,
	Landmark: String,
	City: String,
	State: String,
	PinCode: String,
	IsActive: Boolean,
	Mobile:String,
	ImageURL: String,
	IDImageURL: String,
	IsApproved: String,
	Rating: String,
	Reviews: [{
		UserRating: String,
		UserReview: String,
		UserName: String,
		UserCompany:String
	}],
	Location: 
	{
		Longitute: String,
		Latitude: String,
		City: String,
		State: String,
		PinCode: String,
		Country: String,
		District: String,
		AreaName: String
		
	}	
});

var CompanyPersonMappingSchema = new mongoose.Schema({
	Id: {type: String, required: true, unique: true },
	FirstName: {type: String, required: true},
	LastName: {type: String},
	DOB : Date,
	Age : {type:Number},
	Gender: String,
	CompanyName: String,
	CompanyDesignation: String,
	FullAddress: String,
	Landmark: String,
	City: String,
	State: String,
	PinCode: String,
	IsActive: Boolean,
	Mobile:String,
	ImageURL: String,
	IDImageURL: String,
	IsApproved: String,
	Rating: String,
	Reviews: [{
		UserRating: String,
		UserReview: String,
		UserName: String,
		UserCompany:String
	}],
	Location: 
	{
		Longitute: String,
		Latitude: String,
		City: String,
		State: String,
		PinCode: String,
		Country: String,
		District: String,
		AreaName: String
	}		
});

var PinCodeMappingSchema = new mongoose.Schema({
	PinCode : String,
	City: String,
	State: String,
	District: String,
	Area: String,
	HeadOffice: String
	
});

var MessageMappingSchema = new mongoose.Schema({
	Id: {type: String, required: true, unique: true },
	From: 
	{
	  Type: String,
	  Id: String,
	  FullName: String,
	  MobileNumber: String,
	  
	},
Message:
	{
	  MessageBody: String,
	  MessageTitle: String
	},
To:
	[
	  {
	    Type: String,
	    Id: String,
	    FullName: String,
	    MobileNumber:String,
	    Status: String,
	    NoOfPackets: {type:Number},
	    PinCode: String,
	    Area: String,
	    
	  } 
	],

DateofMsg: Date,
Status: String
	
});

var MobileDevice = mongoose.model('MobileDevice', MobileDeviceMappingSchema);

var BikerCourier = mongoose.model('BikerCourier', BikerCourierMappingSchema);

var CompanyPerson = mongoose.model('CompanyPerson', CompanyPersonMappingSchema);

var PinCodes = mongoose.model('PinCodes', PinCodeMappingSchema);

var Messages = mongoose.model('Messages', MessageMappingSchema);

var FlightData = mongoose.model('FlightData', FlightDataMappingSchema);

var WeatherData = mongoose.model('WeatherData', WeatherDataMappingSchema);

var FlightTrajectory = mongoose.model('FlightTrajectory', FlightTrajectoryMappingSchema);

var staticnotificationid = 100000;

app.get('/', function(request,response){
	response.json({"Message" : "CONNECTED"
		});
});

app.get('/leds', function(request,response){
	response.json({"NAME" : "Ashutosh",
		"DATE": "6\03\2019",
		"TEMPERATURE": "37.5",
		"MILK:" : "Cow",
		"FAT": 80,
		"SNF": 6.8,
		"CLR" :4,
		"Salt": 2.1,
		"L": 1.2,
		"AW": 2.2,
		"Fp": 3.2,
		"P": 4.2,
		
		});
});

app.get('/Weight', function(request,response){
	response.json({"id" : 12,
		"Weight": 3.6,
		
		});
});

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

app.post('/AirFlight', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	devicedataservice.updateFlightData(FlightData, request.body, response);
	});

app.put('/AirFlight', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	
	devicedataservice.createFlightData(FlightData, request.body, response);
	});



app.post('/FlightTrajectory', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	devicedataservice.updateFlightTrajectory(FlightTrajectory, request.body, response);
	});

app.put('/FlightTrajectory', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	
	devicedataservice.createFlightTrajectory(FlightTrajectory, request.body, response);
	});

app.post('/WeatherData', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	devicedataservice.createWeatherData(WeatherData, request.body, response);
	});

app.put('/WeatherData', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	
	devicedataservice.createWeatherData(WeatherData, request.body, response);
	});
	

	
app.get('/AirFlight', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		
		devicedataservice.listFlightData(FlightData, response);
	});



app.get('/FlightTrajectory', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		
		devicedataservice.listFlightTrajectory(FlightTrajectory, response);
	});

app.get('/GetAirFlight/:FlightId', function(request, response){
	
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	
	devicedataservice.listFlightDataByFlightId(FlightData, request.params.FlightId ,response);
	
});

app.get('/GetAirFlightForSourceDestiation', function(request, response){
	
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	
	devicedataservice.listAirFlightForSourceDestiation(FlightData, request.param('Source'), request.param('Destination') ,response);
	
});



app.get('/GetAirFlightTrajectoryForSourceDestiation', function(request, response){
	
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	
	devicedataservice.listFlightTrajectoryForSourceDestiation(FlightTrajectory, request.param('Source'), request.param('Destination') ,response);
	
});

app.get('GetWeatherData', function(request, response){
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	
	WeatherData.find({latitude: request.param('latitude'), longitude : request.param('longitude')}, function(error, result) {
		if (error) {
		console.error(error);
		return null;
		}
		if (response != null) {
		response.setHeader('content-type', 'application/json');
		response.end(JSON.stringify(result));
		}
		return JSON.stringify(result);
		});
	
});

app.get('GetAllWeatherData', function(request, response) {
	WeatherData.find({}, function(error, result) {
		if (error) {
		console.error(error);
		return null;
		}
		if (response != null) {
		response.setHeader('content-type', 'application/json');
		response.end(JSON.stringify(result));
		}
		return JSON.stringify(result);
		});
});

app.get('GetWeatherDataForAltitude', function(request, response){
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	
	WeatherData.find({latitude: request.param('latitude'), longitude : request.param('longitude'), altitude: request.param('altitude')}, function(error, result) {
		if (error) {
		console.error(error);
		return null;
		}
		if (response != null) {
		response.setHeader('content-type', 'application/json');
		response.end(JSON.stringify(result));
		}
		return JSON.stringify(result);
		});
	
});

app.get('/GetAirFlightForSourceDestiationForDate', function(request, response){
	
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	
	devicedataservice.listAirFlightForSourceDestiationForDate(FlightData, request.param('Source'), request.param('Destination'), request.param('DateStr') ,response);
	
});

app.get('/GetAirFlightForFlightIdForDate', function(request, response){
	
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	
	devicedataservice.listAirFlightForFlightIdForDate(FlightData, request.param('FlightId'), request.param('DateStr') ,response);
	
});



app.del('/DeleteAllFlights', function(request, response){
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	FlightData.deleteMany({}, function(error, data){
		
	});
		//devicedataservice.deleteAllFlights(FlightData, response);
});

app.get('/getdevicesByMobile/:MobileNumber', function(request, response) {
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

app.put('/BikerCourier', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	console.log(request.body);
	dataservices.createBikerCourier(BikerCourier, request.body, response);
	});

app.post('/BikerCourier', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	dataservices.updateBikerCourier(BikerCourier, request.body, response);
	});

app.get('/BikerCourierByMobile/:MobileNumber', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	console.log(request.url + ' : querying for ' +
	request.params.MobileNumber);
	dataservices.findBikerCourierByMobileNumber(BikerCourier, request.params.MobileNumber,
	response);
	});

app.del('/delBikerCourierByMobile/:MobileNumber', function(request,response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	console.log('request.params.MobileNumber');
	console.log(request.params.MobileNumber);
	dataservices.deleteBikerCourierByMobileNumber(BikerCourier, request.params.MobileNumber, response);
	});

app.del('/delBikerCourier/:Id', function(request,response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	console.log('request.params.Id');
	console.log(request.params.Id);
	dataservices.deleteBikerCourier(BikerCourier, request.params.Id, response);
	});
	
app.get('/BikerCourier', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		console.log('Listing all device with ' + request.params.key +
				'=' + request.params.value);
		dataservices.listBikerCourier(BikerCourier, response);
	});

app.get('/getBikerCourierByPinCode/:PinCode', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		
		dataservices.listBikerCourierByPinCode(BikerCourier, PinCodes, request.params.PinCode, response);
	});

app.get('/getBikerCourierByCity/:City', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		
		dataservices.listBikerCourierByCity(BikerCourier, request.params.City, response);
	});

app.get('/BikerCourier/:Id', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	console.log(request.url + ' : querying for ' +
	request.params.Id);
	dataservices.findBikerCourierByID(BikerCourier, request.params.Id,
	response);
	});

app.put('/CompanyPerson', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	console.log(request.body);
	dataservices.createCompanyPerson(CompanyPerson, request.body, response);
	});

app.post('/CompanyPerson', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	dataservices.updateCompanyPerson(CompanyPerson, request.body, response);
	});

app.get('/CompanyPersonByMobile/:MobileNumber', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	console.log(request.url + ' : querying for ' +
	request.params.MobileNumber);
	dataservices.findCompanyPersonByMobileNumber(CompanyPerson, request.params.MobileNumber,
	response);
	});



app.del('/delCompanyPersonByMobile/:MobileNumber', function(request,response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	console.log('request.params.MobileNumber');
	console.log(request.params.MobileNumber);
	dataservices.deleteCompanyPersonByMobileNumber(CompanyPerson, request.params.MobileNumber, response);
	});

app.del('/delCompanyPerson/:Id', function(request,response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	console.log('request.params.Id');
	console.log(request.params.Id);
	dataservices.deleteCompanyPerson(CompanyPerson, request.params.Id, response);
	});
	
app.get('/CompanyPerson', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		console.log('Listing all device with ' + request.params.key +
				'=' + request.params.value);
		dataservices.listCompanyPerson(CompanyPerson, response);
	});

app.get('/getCompanyPersonByPinCode/:PinCode', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		
		dataservices.listCompanyPersonByPinCode(CompanyPerson, PinCodes, request.params.PinCode, response);
	});

app.get('/CompanyPersonByCity/:City', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		
		dataservices.listCompanyPersonByCity(CompanyPerson, request.params.City, response);
	});

app.get('/CompanyPerson/:Id', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	console.log(request.url + ' : querying for ' +
	request.params.Id);
	dataservices.findCompanyPersonByID(CompanyPerson, request.params.Id,
	response);
	});


app.put('/PinCode', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	console.log(request.body);
	dataservices.createPinCode(PinCodes, request.body, response);
	});

app.post('/PinCode', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	dataservices.updatePinCode(PinCodes, request.body, response);
	});

	
app.get('/PinCode', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		console.log('Listing all device with ' + request.params.key +
				'=' + request.params.value);
		dataservices.listPinCode(PinCodes, response);
	});

app.get('/PinCodesByPinCode/:PinCode', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		
		dataservices.listPinCodeByPinCode(PinCodes, request.params.PinCode, response);
	});

app.get('/PinCodesByCity/:City', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		
		dataservices.listPinCodeByCity(PinCodes, request.params.City, response);
	});

app.post('/uploadBikerOrPersonImage', function(req, res){
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
	var filename = req.files.picture.name;
	console.log(filename);
	if(filename.endsWith(".jpg") || filename.endsWith(".png") || filename.endsWith(".bmp") || filename.endsWith(".gif"))
			{
		       filename  = filename.slice(0, -4);
			}
	else 
		{
		  
		  if(filename.endsWith(".jpeg") || filename.endsWith(".html"))
		   {
	          filename  = filename.slice(0, -5);
		   }
		
		}
	console.log(filename);
		 var xlFile = req.files.picture;
  	     var newPath = __dirname + "/Images/" + req.files.picture.name;
		 console.log(newPath);
		 xlFile.mv(newPath, function(err){ 
		   if(err){
			   console.log("Error Uploading File");
			   console.log(err);
			   res.send("Error Uploading File");
		   }
		   else
		   {
	  cloudinary.uploader.upload(
			  newPath,
			  function(result) { console.log(result); console.log(result.url); 
			  var ImageInfo = {
 		    		 "ImageName" : filename,
 		    		 "ImageUrl": result.url,
 		    		 "ImageUploaded": true
 		     };
 		     res.json(ImageInfo);
			 fs.unlinkSync(newPath);  
			  },
			  {
			    public_id: filename, 
			    
			  }      
			);
		   }
		 });
});

app.post('/UpdateBikerWithImage', function(request, response){
	var conditions = {Id: request.body.profileId},
    update = { ImageURL: request.body.ImgaeURL },
    options = { multi: false };

	BikerCourier.update(conditions, update, options,
function callback (err, numAffected) {
    // numAffected is the number of updated documents
		if(!err){
			console.log('Biker Image Updated Successfully');
			response.json({"code" : 200, "status" : "Biker Image Updated Successfully"});
		}
		else{
			console.log(err);
			response.json({"code" : 101, "status" : "Error in updating Biker Image with Error " + err});
		}
			
});
	
});

app.post('/UpdateBikerIDWithImage', function(request, response){
	
	var conditions = {Id: request.body.profileId},
    update = { IDImageURL: request.body.ImgaeURL },
    options = { multi: false };

	BikerCourier.update(conditions, update, options,
function callback (err, numAffected) {
    // numAffected is the number of updated documents
		if(!err){
			console.log('Biker ID Image Updated Successfully');
			response.json({"code" : 200, "status" : "Biker ID Image Updated Successfully"});
		}
		else{
			console.log(err);
			response.json({"code" : 101, "status" : "Error in updating Biker ID Image with Error " + err});
		}
			
});
	
});

app.post('/UpdatePersonWithImage', function(request, response){
	
	var conditions = {Id: request.body.profileId},
    update = { ImageURL: request.body.ImgaeURL },
    options = { multi: false };

	CompanyPerson.update(conditions, update, options,
function callback (err, numAffected) {
    // numAffected is the number of updated documents
		if(!err){
			console.log('Company Person Image Updated Successfully');
			response.json({"code" : 200, "status" : "Company Person Image Updated Successfully"});
		}
		else{
			console.log(err);
			response.json({"code" : 101, "status" : "Error in updating Company Person Image with Error " + err});
		}
			
});
	
});

app.post('/UpdatePersonWithIDImage', function(request, response){
	
	var conditions = {Id: request.body.profileId},
    update = { IDImageURL: request.body.ImgaeURL },
    options = { multi: false };

	CompanyPerson.update(conditions, update, options,
function callback (err, numAffected) {
    // numAffected is the number of updated documents
		if(!err){
			console.log('Company Person Image Updated Successfully');
			response.json({"code" : 200, "status" : "Company Person Image Updated Successfully"});
		}
		else{
			console.log(err);
			response.json({"code" : 101, "status" : "Error in updating Company Person Image with Error " + err});
		}
			
});
	
});

app.put('/SendMessage', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	Date.prototype.yyyymmdd = function() {
		   var yyyy = this.getFullYear();
		   var mm = this.getMonth() < 9 ? "0" + (this.getMonth() + 1) : (this.getMonth() + 1); // getMonth() is zero-based
		   var dd  = this.getDate() < 10 ? "0" + this.getDate() : this.getDate();
		   return "".concat(dd).concat("/").concat(mm).concat("/").concat(yyyy);
		  };

	var message = new gcm.Message({
	    
		data: {
	    	"type" : "Notice",
	        "body": request.body.MessageBody,
	        "title": request.body.MessageTitle,
	        "priority" : 1,
	        
	        "notification_id": (staticnotificationid + 1).toString()
	        
	    },
	    //notification: {
	        //title: "From node app CourierBiker Interaction Server ",
	        //icon: "ic_launcher",
	        //body: "This is a notification that will be displayed ASAP."
	    //}
	});
	
	// Set up the sender with you API key
	var sender = new gcm.Sender('AAAAt7ftYKY:APA91bGMdkut0SZxwWv6SfGrhL6ZO36nmFXZSM6n29mDD4BjwXQIm6poUHQlgukEG6eRsRtyVr8kFBVmQkJvWiC7Lww714--gU37C1Mh0DAwgRrvPBajmm-ErpUFAOeKWfUu7GvFS3KO');
	var registrationTokens = [];
	
	MobileDevice.find({}, function(error, result) {
		if (error) 
		{
		console.error(error);
		return null;
		}
		else
		{
			var resultcount =0;
			if(result !==undefined)
			{
				console.log("inside result");
				console.log(result.length);
				for(resultcount =0; resultcount<result.length; resultcount++)
				{
					console.log("for");
					console.log(result[resultcount].DeviceId);
					registrationTokens.push(result[resultcount].DeviceId);

				}
			}

			// Now the sender can be used to send messages
			// ... or retrying a specific number of times (10)
			sender.send(message, { registrationTokens: registrationTokens }, 10, function (err, response) {
			  if(err) 
				  {
				    console.log(err);
				  }
			  else   
				  {
				   console.log(response);
				  }
			});
	
	  }
		
	});

	
	
	// Send to a topic, with no retry this time
	sender.sendNoRetry(message, { topic: '/topics/global' }, function (err, response) {
	    if(err) {console.error(" Error " + err);}
	    else    {console.log("Success " + response);}
	});
	
	
	response.end('Ended final');
	});

app.put('/SendMessageToAllBikersinCity', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	Date.prototype.yyyymmdd = function() {
		   var yyyy = this.getFullYear();
		   var mm = this.getMonth() < 9 ? "0" + (this.getMonth() + 1) : (this.getMonth() + 1); // getMonth() is zero-based
		   var dd  = this.getDate() < 10 ? "0" + this.getDate() : this.getDate();
		   return "".concat(dd).concat("/").concat(mm).concat("/").concat(yyyy);
		  };

	var message = new gcm.Message({
	    
		data: {
			"MessageId": request.body.MessageId,
	    	"Messagetype" : "PickUpRequest",
	        "FromName": request.body.FromName,
	        "CompanyName" : request.body.CompanyName,
	        "CompanyDesignation" : request.body.CompanyDesignation,
	        "FromMobile" : request.body.FromMobile,
	        "PickUpDate" : request.body.PickUpDate,
	        "ExpectedPickUpTime": request.body.ExpectedPickUpTime,
	        "PickUpFullAddress" : request.body.PickUpFullAddress,
	        "PickUpLandmark" : request.body.PickUpLandmark,
	        "StateName": request.body.StateName,
	        "City" : request.body.City,
	        "PinCode": request.body.PinCode,
	        "NumberOfPackets" : request.body.NumberOfPackets,
	        "MessageTitle": request.body.MessageTitle,
	        "Status": "Requested",
	        "priority" : 1,
	        "NumberofPacktesAccepted": request.body.NumberofPacktesAccepted,
	        "NumberOfPacketsApproved": request.body.NumberOfPacketsApproved,
	        "NumberOfPacketsConfirmed": request.body.NumberOfPacketsConfirmed,
	        "FromImage": request.body.FromImage,
	        "ToImage" : request.body.ToImage,
	        
	        "notification_id": (staticnotificationid + 1).toString()
	        
	    },
	    
	});
	
	// Set up the sender with you API key
	var sender = new gcm.Sender('AAAAt7ftYKY:APA91bGMdkut0SZxwWv6SfGrhL6ZO36nmFXZSM6n29mDD4BjwXQIm6poUHQlgukEG6eRsRtyVr8kFBVmQkJvWiC7Lww714--gU37C1Mh0DAwgRrvPBajmm-ErpUFAOeKWfUu7GvFS3KO');
	var registrationTokens = [];
	
	MobileDevice.find({MobileNumber: {$in: request.body.Mobiles}}, function(error, result) {
		if (error) 
		{
		console.log(error);
		return null;
		}
		else
		{
			var resultcount =0;
			if(result !==undefined)
			{
				console.log("inside result");
				console.log(result.length);
				for(resultcount =0; resultcount<result.length; resultcount++)
				{
					console.log("for");
					console.log(result[resultcount].DeviceId);
					registrationTokens.push(result[resultcount].DeviceId);

				}
			}

			// Now the sender can be used to send messages
			// ... or retrying a specific number of times (10)
			sender.send(message, { registrationTokens: registrationTokens }, 10, function (err, resp) {
			  if(err) 
				  {
				  console.log(err);
				  response.json({"code" : 101, "status" : "Error in Sending Message with Error " + err});
				  }
			  else   
				  {
				  console.log(resp);
				  response.json({"code" : 200, "status" : "Message Send Successfully"});
				  }
			});
	
	  }
		
	});

	});

app.put('/SendBikerAcceptedOrConfirmedMessage', function(request, response) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    Date.prototype.yyyymmdd = function() {
           var yyyy = this.getFullYear();
           var mm = this.getMonth() < 9 ? "0" + (this.getMonth() + 1) : (this.getMonth() + 1); // getMonth() is zero-based
           var dd  = this.getDate() < 10 ? "0" + this.getDate() : this.getDate();
           return "".concat(dd).concat("/").concat(mm).concat("/").concat(yyyy);
          };

    var message = new gcm.Message({
        
        data: {
            "MessageId": request.body.MessageId,
            "Messagetype" : request.body.Messagetype,
            "FromName": request.body.FromName,
            "CompanyName" : request.body.CompanyName,
            "CompanyDesignation" : request.body.CompanyDesignation,
            "FromMobile" : request.body.FromMobile,
            "PickUpDate" : request.body.PickUpDate,
            "ExpectedPickUpTime": request.body.ExpectedPickUpTime,
            "PickUpFullAddress" : request.body.PickUpFullAddress,
            "PickUpLandmark" : request.body.PickUpLandmark,
            "StateName": request.body.StateName,
            "City" : request.body.City,
            "PinCode": request.body.PinCode,
            "NumberOfPackets" : request.body.NumberOfPackets,
            "MessageTitle": request.body.MessageTitle,
            "Status": request.body.Status,
            "priority" : 1,
            "NumberofPacktesAccepted": request.body.NumberofPacktesAccepted,
            "NumberOfPacketsApproved": request.body.NumberOfPacketsApproved,
            "NumberOfPacketsConfirmed": request.body.NumberOfPacketsConfirmed,
            "FromImage": request.body.FromImage,
            "ToImage" : request.body.ToImage,
            
            "notification_id": (staticnotificationid + 1).toString()
            
        },
        
    });
    
    // Set up the sender with you API key
    var sender = new gcm.Sender('AAAAt7ftYKY:APA91bGMdkut0SZxwWv6SfGrhL6ZO36nmFXZSM6n29mDD4BjwXQIm6poUHQlgukEG6eRsRtyVr8kFBVmQkJvWiC7Lww714--gU37C1Mh0DAwgRrvPBajmm-ErpUFAOeKWfUu7GvFS3KO');
    var registrationTokens = [];
    
    MobileDevice.find({MobileNumber: {$in: request.body.Mobiles}}, function(error, result) {
        if (error) 
        {
        console.log(error);
        return null;
        }
        else
        {
            var resultcount =0;
            if(result !==undefined)
            {
                console.log("inside result");
                console.log(result.length);
                for(resultcount =0; resultcount<result.length; resultcount++)
                {
                    console.log("for");
                    console.log(result[resultcount].DeviceId);
                    registrationTokens.push(result[resultcount].DeviceId);

                }
            }

            // Now the sender can be used to send messages
            // ... or retrying a specific number of times (10)
            sender.send(message, { registrationTokens: registrationTokens }, 10, function (err, resp) {
              if(err) 
                  {
                  console.log(err);
                  response.json({"code" : 101, "status" : "Error in Sending Message with Error " + err});
                  }
              else   
                  {
                  console.log(resp);
                  response.json({"code" : 200, "status" : "Message Send Successfully"});
                  }
            });
    
      }
        
    });

    });

app.put('/SendCompanyApprovedMessage', function(request, response) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    Date.prototype.yyyymmdd = function() {
           var yyyy = this.getFullYear();
           var mm = this.getMonth() < 9 ? "0" + (this.getMonth() + 1) : (this.getMonth() + 1); // getMonth() is zero-based
           var dd  = this.getDate() < 10 ? "0" + this.getDate() : this.getDate();
           return "".concat(dd).concat("/").concat(mm).concat("/").concat(yyyy);
          };

    var message = new gcm.Message({
        
        data: {
            "MessageId": request.body.MessageId,
            "Messagetype" : request.body.Messagetype,
            "FromName": request.body.FromName,
            "CompanyName" : request.body.CompanyName,
            "CompanyDesignation" : request.body.CompanyDesignation,
            "FromMobile" : request.body.FromMobile,
            "PickUpDate" : request.body.PickUpDate,
            "ExpectedPickUpTime": request.body.ExpectedPickUpTime,
            "PickUpFullAddress" : request.body.PickUpFullAddress,
            "PickUpLandmark" : request.body.PickUpLandmark,
            "StateName": request.body.StateName,
            "City" : request.body.City,
            "PinCode": request.body.PinCode,
            "NumberOfPackets" : request.body.NumberOfPackets,
            "MessageTitle": request.body.MessageTitle,
            "Status": request.body.Status,
            "priority" : 1,
            "NumberofPacktesAccepted": request.body.NumberofPacktesAccepted,
            "NumberOfPacketsApproved": request.body.NumberOfPacketsApproved,
            "NumberOfPacketsConfirmed": request.body.NumberOfPacketsConfirmed,
            "FromImage": request.body.FromImage,
            "ToImage" : request.body.ToImage,
            
            "notification_id": (staticnotificationid + 1).toString()
            
        },
        
    });
    
    // Set up the sender with you API key
    var sender = new gcm.Sender('AAAAt7ftYKY:APA91bGMdkut0SZxwWv6SfGrhL6ZO36nmFXZSM6n29mDD4BjwXQIm6poUHQlgukEG6eRsRtyVr8kFBVmQkJvWiC7Lww714--gU37C1Mh0DAwgRrvPBajmm-ErpUFAOeKWfUu7GvFS3KO');
    var registrationTokens = [];
    
    MobileDevice.find({MobileNumber: {$in: request.body.Mobiles}}, function(error, result) {
        if (error) 
        {
        console.log(error);
        return null;
        }
        else
        {
            var resultcount =0;
            if(result !==undefined)
            {
                console.log("inside result");
                console.log(result.length);
                for(resultcount =0; resultcount<result.length; resultcount++)
                {
                    console.log("for");
                    console.log(result[resultcount].DeviceId);
                    registrationTokens.push(result[resultcount].DeviceId);

                }
            }

            // Now the sender can be used to send messages
            // ... or retrying a specific number of times (10)
            sender.send(message, { registrationTokens: registrationTokens }, 10, function (err, resp) {
              if(err) 
                  {
                  console.log(err);
                  response.json({"code" : 101, "status" : "Error in Sending Message with Error " + err});
                  }
              else   
                  {
                  console.log(resp);
                  response.json({"code" : 200, "status" : "Message Send Successfully"});
                  }
            });
    
      }
        
    });

    });

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
  console.log('Nidhi');
});
