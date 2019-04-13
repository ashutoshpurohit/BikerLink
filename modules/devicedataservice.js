/**
 * http://usejsdoc.org/
 */

function toAirFlightPathList(bodyAirFlightPath){
	var flightpaths = [];
	var pathcount =0;
	if(bodyAirFlightPath != undefined){
		for(pathcount = 0; pathcount < bodyAirFlightPath.length; pathcount++){
			var path = {
					Latitude: bodyAirFlightPath[pathcount].Latitude,
					Longitude: bodyAirFlightPath[pathcount].Longitude,
					Altitude: bodyAirFlightPath[pathcount].Altitude,
					Speed:bodyAirFlightPath[pathcount].Speed,
					Direction: bodyAirFlightPath[pathcount].Direction,
					TimeSlice: bodyAirFlightPath[pathcount].TimeSlice,
					TimeStamp:bodyAirFlightPath[pathcount].TimeStamp,
					
			};
			
			flightpaths.push(path);
		}
	}
	
	return flightpaths;
}

function toAirFlight(body, FlightData){
	var flight = new FlightData(
			{
				FlightId : body.FlightId,
				FlightDate: body.FlightDate,
				Source: body.Source,
				Destination: body.Destination,
				FlightDateStr: body.FlightDateStr,
				AirFlightPath: toAirFlightPathList(body.AirFlightPath)
			});
	
	return flight;
}

function toFlightTrajectoryPathList(bodyAirFlightPath){
	var flightpaths = [];
	var pathcount =0;
	if(bodyAirFlightPath != undefined){
		for(pathcount = 0; pathcount < bodyAirFlightPath.length; pathcount++){
			var path = {
					Latitude: bodyAirFlightPath[pathcount].Latitude,
					Longitude: bodyAirFlightPath[pathcount].Longitude,
					Altitude: bodyAirFlightPath[pathcount].Altitude,
					Speed:bodyAirFlightPath[pathcount].Speed,
					Direction: bodyAirFlightPath[pathcount].Direction,
			};
			
			flightpaths.push(path);
		}
	}
	
	return flightpaths;
}

function toFlightTrajectory(body, FlightData){
	var flight = new FlightData(
			{
				Source: body.Source,
				Destination: body.Destination,
				
				AirFlightPath: toFlightTrajectoryPathList(body.AirFlightPath)
			});
	
	return flight;
}

function toDevice(body, MobileDevice) {
var mobiledevice =  new MobileDevice(
{
	MobileNumber: body.MobileNumber,
	DeviceId: body.DeviceId,
	TimeStamp : new Date()
});

return mobiledevice;
}

function toWeatherData(body, WeatherData){
	var weather = new WeatherData(
			{
				latitude: body.latitude,
				longitude: body.longitude,
				altitude: body.altitude,
				DateStr: body.DateStr,
				TimeStr: body.TimeStr,
				temperature:{
					units: body.temperature.units,
					value: body.temperature.value,
					dew_point: body.temperature.dew_point,
					wind_chill: body.temperature.wind_chill
					
				},
				relative_humidity: {
					units: body.relative_humidity.units,
					value: body.relative_humidity.value
				},
				cloud_cover:{
					units: body.cloud_cover.units,
					value: body.cloud_cover.value,
					text: body.cloud_cover.text
				},
				weather_code: {
					value: body.weather_code.value,
					text: body.weather_code.text
				},
				cloud_ceiling: {
					units: body.cloud_ceiling.units,
					value: body.cloud_ceiling.value,
				},
				pressure: {
					units: body.pressure.units,
					value: body.pressure.value,
				},
				daylight: body.daylight,
				visibility: {
					units: body.visibility.units,
					value: body.visibility.value,
					
				},
				wind: {
					speed: body.wind.speed,
					speed_units: body.wind.speed_units,
					dir_units: body.wind.dir_units,
					dir: body.wind.dir
				},
				precipitation: {
					probability:{
						units: body.precipitation.probability.units,
						value: body.precipitation.probability.value
					}
				},
				station:{
					priority: body.station.priority,
					coordinates:[
						body.latitude,
						body.longitude
					],
					elev: {
						units: body.elev.units,
						value: body.elev.value,
					},
					id: body.station.id,
					Name: body.station.Name,
					
				},
				issuetime: body.issuetime
			}
			);
	return weather;
}

exports.createWeatherData = function(model, requestBody, response)
{
  var weather = toWeatherData(requestBody, model);
  
  weather.save(function(err){
		if (err)
			{
			//throw err;
			console.log(err);
			}
		console.log('WeatherData  saved successfully');
		response.json({"code" : 200, "status" : "WeatherData Created Successfully" , "WeatherData" : requestBody.latitude + " " + requestBody.longitude });
	});
  
}

exports.createFlightData = function (model, requestBody, response)
{
	var flight = toAirFlight(requestBody, model);
	
	flight.save(function(err){
		if (err)
			{
			//throw err;
			console.log(err);
			}
		console.log('AirFlight  saved successfully');
		response.json({"code" : 200, "status" : "AirFlight Created Successfully" , "FlightID" : requestBody.FlightId });
	});
}

exports.updateFlightData = function (model, requestBody, response)
{
	var flight = toAirFlight(requestBody, model);
	
	flight.save(function(err){
		if (err)
			{
			//throw err;
			console.log(err);
			}
		console.log('AirFlight  saved successfully');
		response.json({"code" : 200, "status" : "AirFlight Created Successfully" , "FlightID" : requestBody.FlightId });
	});
}

exports.listFlightData = function (model, response) {
	model.find({}, function(error, result) {
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
	}

exports.listFlightDataByFlightId = function (model, _FlightId ,response) {
	model.find({FlightId : _FlightId}, function(error, result) {
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
	}

	exports.listAirFlightForSourceDestiation = function (model, _source, _destination, response) {
	model.find({Source: _source, Destination : _destination}, function(error, result) {
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
	}

	exports.listAirFlightForSourceDestiationForDate = function (model, _source, _destination, _datestr, response) {
	model.find({Source: _source, Destination : _destination, FlightDateStr: _datestr}, function(error, result) {
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
	}

	exports.listAirFlightForFlightIdForDate = function (model, _FlightId,  _datestr, response) {
	model.find({FlightId : _FlightId, FlightDateStr: _datestr}, function(error, result) {
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
	}


exports.deleteAllFlights = function (model, response)
{

model.find({},
function(error, data) {
if (error) {
console.log(error);
if (response != null) {
response.writeHead(500, {'Content-Type' : 'text/plain'});
response.end('Internal server error');
}
return;
} else {
if (!data) {
console.log('Device not found');
if (response != null) {
response.writeHead(404,
{'Content-Type' : 'text/plain'});
response.end('Device Not Found');
}
return;
} else {
for(i=0; i < data.length; i++){	
data[i].remove(function(error){
if (!error) {
data[i].remove();
}
else {
console.log(error);
}

});
}
if (response != null){
	response.send('Device Deleted');
	}
	return;
	}
	}
	});
	}

exports.listFlightTrajectoryForSourceDestiation = function (model, _source, _destination, response) {
	model.find({Source: _source, Destination : _destination}, function(error, result) {
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
	}



	exports.createFlightTrajectory = function (model, requestBody, response)
{
	var flight = toFlightTrajectory(requestBody, model);
	
	flight.save(function(err){
		if (err)
			{
			//throw err;
			console.log(err);
			}
		console.log('FlightTrajectory  saved successfully');
		response.json({"code" : 200, "status" : "FlightTrajectory Created Successfully" , "Source  Destination" : requestBody.Source + " " + requestBody.Destination });
	});
}

exports.updateFlightTrajectory = function (model, requestBody, response)
{
	var flight = toFlightTrajectory(requestBody, model);
	
	flight.save(function(err){
		if (err)
			{
			//throw err;
			console.log(err);
			}
		console.log('FlightTrajectory  saved successfully');
		response.json({"code" : 200, "status" : "FlightTrajectory Updated Successfully" , "Source  Destination" : requestBody.Source + " " + requestBody.Destination });
	});
}

exports.listFlightTrajectory = function (model, response) {
	model.find({}, function(error, result) {
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
	}


exports.createMobileDevice = function (model, requestBody, response)
{
	var mobiledevice = toDevice(requestBody, model);
	
	mobiledevice.save(function(err){
		if (err)
			{
			//throw err;
			console.log(err);
			}
		console.log('Mobile Device saved successfully');
		response.json({"code" : 200, "status" : "Device Created Successfully" , "MobileNumber" : requestBody.MobileNumber });
	});
}

exports.findDeviceByMobileNumber = function (model, _mobileNumber, response) {
	model.findOne({MobileNumber: _mobileNumber},
	function(error, result) {
	if (error) {
	console.error(error);
	response.writeHead(500,
	{'Content-Type' : 'text/plain'});
	response.end('Internal server error');
	return;
	} else {
	if (!result) {
	if (response != null) {
	response.writeHead(404, {'Content-Type' : 'text/plain'});
	response.end('Device Not Found');
	}
	return;
	}
	if (response != null){
	response.setHeader('Content-Type', 'application/json');
	response.send(result);
	}
	//console.log(result);
	}
	});
	}

exports.listDevices = function (model, response) {
	model.find({}, function(error, result) {
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
	}

exports.listDevicesInternal = function (model) {
	
	var result = model.find({});
	
	console.log("before result");
	console.log(result);
	console.log("after result");
	return result;
	
	}

exports.deleteDevice = function (model, _mobileNumber, response)
{
console.log('Deleting Device of Mobile Number: ' + _mobileNumber.toString());
model.findOne({MobileNumber: _mobileNumber},
function(error, data) {
if (error) {
console.log(error);
if (response != null) {
response.writeHead(500, {'Content-Type' : 'text/plain'});
response.end('Internal server error');
}
return;
} else {
if (!data) {
console.log('Device not found');
if (response != null) {
response.writeHead(404,
{'Content-Type' : 'text/plain'});
response.end('Device Not Found');
}
return;
} else {
data.remove(function(error){
if (!error) {
data.remove();
}
else {
console.log(error);
}
});
if (response != null){
	response.send('Device Deleted');
	}
	return;
	}
	}
	});
	}

exports.updateDevice = function (model, requestBody, response) {
	var _mobileNumber = requestBody.MobileNumber;
	model.findOne({MobileNumber: _mobileNumber},
	function(error, data) {
	if (error) {
	console.log(error);
	if (response != null) {
	response.writeHead(500,
	{'Content-Type' : 'text/plain'});
	response.end('Internal server error');
	}
	return;
	} else {
	var device = toDevice(requestBody, model);
	if (!data) {
	console.log('Device with Mobile Number: '+ _mobileNumber.toString()
	+ ' does not exist. The Device will be created.');
	device.save(function(error) {
	if (!error)
		device.save();
	else
		console.log(error);
	});
	if (response != null) {
	
	response.json({"code" : 200, "status" : "Device Created Successfully" , "MobileNumber" : requestBody.MobileNumber });
	}
	return;
	}
	//poulate the document with the updated values
	data.MobileNumber = device.MobileNumber;
	data.DeviceId = device.DeviceId;
	data.TimeStamp = new Date();
	
	// now save
	data.save(function (error) {
	if (!error) {
	console.log('Successfully updated Device with MobileNumber: '+ _mobileNumber.toString());
	data.save();
	} else {
	console.log('error on save');
	}
	});
	if (response != null) {
		response.json({"code" : 200, "status" : "Device Updated Successfully" , "MobileNumber" : requestBody.MobileNumber });
	}
	}
	});
};

exports.findDeviceByDeviceID = function (model, deviceid, response){
	model.find({DeviceId: deviceid}, function(error, result) {
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
}
