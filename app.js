
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


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
  console.log('Nidhi');
});
