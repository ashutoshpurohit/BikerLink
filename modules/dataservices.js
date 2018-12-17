function toReviewList(bodyReviews){
	var reviews = [];
	var reviewcount =0;
	if(bodyReviews != undefined){
		for(reviewcount = 0; reviewcount < bodyReviews.length; reviewcount++){
			var review = {
					UserRating: bodyReviews[reviewcount].UserRating,
					UserReview: bodyReviews[reviewcount].UserReview,
					UserName: bodyReviews[reviewcount].UserName,
					UserCompany:bodyReviews[reviewcount].UserCompany	
			};
			
			reviews.push(review);
		}
	}
	
	return reviews;
}

function toCreateBikerCourier(body, BikerCourier){
	
	var biker = new BikerCourier({
		Id: body.Id,
		FirstName: body.FirstName,
		LastName: body.LastName,
		DOB : body.DOB,
		Age : body.Age,
		Gender: body.Gender,
		FullAddress: body.FullAddress,
		Landmark: body.Landmark,
		City: body.City,
		State: body.State,
		PinCode: body.PinCode,
		IsActive: true,
		Mobile:body.Mobile,
		ImageURL: body.ImageURL,
		IDImageURL: body.IDImageURL,
		IsApproved: false,
		Rating: body.Rating,
		
		Location: 
		{
			Longitute: body.Location.Longitute,
			Latitude: body.Location.Latitude,
			City: body.Location.City,
			State: body.Location.State,
			PinCode: body.Location.PinCode,
			Country: body.Location.Country,
			District: body.Location.District,
			AreaName: body.Location.AreaName
		},
		Reviews: toReviewList(body.Reviews)
	});
	
	return biker;
}

function toCreateCompany(body, CompanyPerson){
	
	var companyperson = new CompanyPerson({
		Id: body.Id,
		FirstName: body.FirstName,
		LastName: body.LastName,
		DOB : body.DOB,
		Age : body.Age,
		Gender: body.Gender,
		FullAddress: body.FullAddress,
		CompanyName: body.CompanyName,
		CompanyDesignation: body.CompanyDesignation,
		Landmark: body.Landmark,
		City: body.City,
		State: body.State,
		PinCode: body.PinCode,
		IsActive: true,
		Mobile:body.Mobile,
		ImageURL: body.ImageURL,
		IDImageURL: body.IDImageURL,
		IsApproved: false,
		Rating: body.Rating,
		Location: 
		{
			Longitute: body.Location.Longitute,
			Latitude: body.Location.Latitude,
			City: body.Location.City,
			State: body.Location.State,
			PinCode: body.Location.PinCode,
			Country: body.Location.Country,
			District: body.Location.District,
			AreaName: body.Location.AreaName
		},
		Reviews: toReviewList(body.Reviews)
	});
	
	return companyperson;
	
}

function toPinCodeCreate(body, PinCodes){
	var pincd = new PinCodes({
		PinCode : body.PinCode,
		City: body.PinCode,
		State: body.PinCode,
		District: body.PinCode,
		Area: body.PinCode,
		HeadOffice: body.PinCode
	});
	
	return pincd;
}

exports.createBikerCourier = function (model, requestBody, response){
	
	var Biker = toCreateBikerCourier(requestBody, model);
	Biker.Id = Biker.FirstName + "_" + Biker.LastName + "_"	+ Biker.Mobile;
	
	     
	Biker.save(function(err){
		if (err){
			//throw err;
			console.log(err);
			response.json({"code" : 101, "status" : "Error in creating Biker Courier with Error " + err, "MobileNumber" : requestBody.Mobile});
			}
		console.log('Biker Courier saved successfully');
		response.json({"code" : 200, "status" : "Biker Courier Record Created Successfully" , "MobileNumber" : requestBody.Mobile });
	});
	
};

exports.updateBikerCourier = function (model, requestBody, response) {
	var id = requestBody.Id;
	model.findOne({Id: id},
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
	var Biker = toCreateBikerCourier(requestBody, model);
	if (!data) {
		Biker.Id = Biker.FirstName + "_" + Biker.LastName + "_"	+ Biker.Mobile;
	console.log('BikerCourier with ID: '+ id
	+ ' does not exist. The Biker Courier will be created with ID ' + Biker.Id);
	Biker.save(function(error) {
	if (!error){
		Biker.save();
		response.json({"code" : 200, "status" : "Biker Courier Record Created Successfully" , "MobileNumber" : requestBody.Mobile });
	}
	else{
         response.json({"code" : 101, "status" : "Error in creating Biker Courier Record" + error , "MobileNumber" : requestBody.Mobile });
	}
	});
	
	
	return;
	}
	//poulate the document with the updated values
	
	data.DOB = Biker.DOB;
	data.Age = Biker.Age;
	data.Gender = Biker.Gender;
	data.FullAddress = Biker.FullAddress;
	data.Landmark = Biker.Landmark;
	data.City = Biker.City;
	data.State = Biker.State;
	data.PinCode = Biker.PinCode;
	data.IsActive = Biker.IsActive;
	data.Mobile = Biker.Mobile;
	data.ImageUrl = Biker.ImageUrl;
	data.IDImageURL = Biker.IDImageURL;
	data.IsApproved = Biker.IsApproved;
	data.Rating = Biker.Rating;
	data.Reviews = Biker.Reviews;
	data.Location = Biker.Location;
	
	// now save
	data.save(function (error) {
	if (!error) {
	console.log('Successfully updated Biker with Mobile : '+ requestBody.Mobile);
	
	data.save();
	response.json({"code" : 200, "status" : "Biker Courier Record Updated Successfully" , "MobileNumber" : requestBody.Mobile });
	} else {
	console.log('error on save');
	response.json({"code" : 100, "status" : "Error in creating Biker Courier Record" + error , "MobileNumber" : requestBody.Mobile });
	}
	});
	
	}
	});
};

exports.listBikerCourier = function (model, response) {
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

exports.findBikerCourierByMobileNumber = function (model, _mobile, response) {
		model.findOne({Mobile: _mobile},
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
		response.end('Biker Courier with Mobile Number Not Found');
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
	
exports.listBikerCourierByCity = function (model, _city, response) {
	  model.find({City: _city}, function(error, result) {
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

exports.listBikerCourierByPinCode = function (model, PinCodeModel, _pincode, response) {
	  var city = []
	  PinCodeModel.find({PinCode: _pincode}, function(error, result) {
	if (error) {
	console.error(error);
	return null;
	}
	if (result != undefined) {
	var cities = JSON.parse(JSON.stringify(data));
				var c=0;
				  for (c=0; c < cities.length ; cities++  ) {
				
				city.push(cities[c].City);	
				}
	}
	model.find({City: {$in: city}}, function(err, data) {
	if (err) {
	console.error(err);
	return null;
	}
	if (response != null) {
	response.setHeader('content-type', 'application/json');
	response.end(JSON.stringify(data));
	}
	return JSON.stringify(data);
	});
	});
}

exports.findBikerCourierByID = function (model, _Id, response) {
		model.findOne({Id: _Id},
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
		response.end('Biker Courier Not Found');
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
	
exports.deleteBikerCourier = function (model, _Id, response){
model.findOne({Id: _Id},
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
console.log('BikerCourier not found');
if (response != null) {
response.writeHead(404,
{'Content-Type' : 'text/plain'});
response.end('BikerCourier Not Found');
}
return;
} else {
data.remove(function(error){
if (!error) {
data.remove();
response.json({"code" : 200, "status" : "Biker Courier Record Deleted Successfully" , "BikerId" : _Id });
}
else {
console.log(error);
response.json({"code" : 101, "status" : "Biker Courier Record Not Deleted with error " + error , "BikerId" : _Id });
}
});

	return;
	}
	}
	});
};

exports.deleteBikerCourierByMobileNumber  = function (model, _mobileNumber, response){
model.findOne({Mobile: _mobileNumber},
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
console.log('BikerCourier not found');
if (response != null) {
response.writeHead(404,
{'Content-Type' : 'text/plain'});
response.end('BikerCourier Not Found');
}
return;
} else {
data.remove(function(error){
if (!error) {
data.remove();
response.json({"code" : 200, "status" : "Biker Courier Record Deleted Successfully" , "MobileNumber" : _mobileNumber });
}
else {
console.log(error);
response.json({"code" : 101, "status" : "Biker Courier Record Not Deleted with error " + error , "MobileNumber" : _mobileNumber });
}
});

	return;
	}
	}
	});
} 


exports.createCompanyPerson = function (model, requestBody, response){
	
	var company = toCreateCompany(requestBody, model);
	company.Id = company.FirstName + "_" + company.LastName + "_"	+ company.Mobile;
	
	     
	company.save(function(err){
		if (err){
			//throw err;
			console.log(err);
			response.json({"code" : 101, "status" : "Error in creating Company Person with Error " + err, "MobileNumber" : requestBody.Mobile});
			}
		console.log('Company Personsaved successfully');
		response.json({"code" : 200, "status" : "Company Record Created Successfully" , "MobileNumber" : requestBody.Mobile });
	});
	
};

exports.updateCompanyPerson = function (model, requestBody, response) {
	var id = requestBody.Id;
	model.findOne({Id: id},
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
	var company = toCreateCompany(requestBody, model);
	if (!data) {
		company.Id = company.FirstName + "_" + company.LastName + "_"	+ company.Mobile;
	console.log('Company Person with ID: '+ id
	+ ' does not exist. The company person will be created with ID ' + company.Id);
	company.save(function(error) {
	if (!error){
		company.save();
		response.json({"code" : 200, "status" : "company person Record Created Successfully" , "MobileNumber" : requestBody.Mobile });
	}
	else{
         response.json({"code" : 101, "status" : "Error in creating company person Record " + error , "MobileNumber" : requestBody.Mobile });
	}
	});
	
	
	return;
	}
	//poulate the document with the updated values
	
	data.DOB = company.DOB;
	data.Age = company.Age;
	data.Gender = company.Gender;
	data.FullAddress = company.FullAddress;
	data.Landmark = company.Landmark;
	data.City = company.City;
	data.State = company.State;
	data.PinCode = company.PinCode;
	data.IsActive = company.IsActive;
	data.Mobile = company.Mobile;
	data.ImageUrl = company.ImageUrl;
	data.IDImageURL = company.IDImageURL;
	data.IsApproved = company.IsApproved;
	data.Rating = company.Rating;
	data.Reviews = company.Reviews;
	data.Location = company.Location;
	
	// now save
	data.save(function (error) {
	if (!error) {
	console.log('Successfully updated Company Person with Mobile : '+ requestBody.Mobile);
	
	data.save();
	response.json({"code" : 200, "status" : "Company Person Record Updated Successfully" , "MobileNumber" : requestBody.Mobile });
	} else {
	console.log('error on save');
	response.json({"code" : 100, "status" : "Error in updating Company Person Record" + error , "MobileNumber" : requestBody.Mobile });
	}
	});
	
	}
	});
};

exports.listCompanyPerson = function (model, response) {
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

exports.findCompanyPersonByMobileNumber = function (model, _mobile, response) {
		model.findOne({Mobile: _mobile},
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
		response.end('Company Person with Mobile Number Not Found');
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
	
exports.listCompanyPersonByCity = function (model, _city, response) {
	  model.find({City: _city}, function(error, result) {
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

exports.listCompanyPersonByPinCode = function (model, PinCodeModel, _pincode, response) {
	  var city = []
	  PinCodeModel.find({PinCode: _pincode}, function(error, result) {
	if (error) {
	console.error(error);
	return null;
	}
	if (result != undefined) {
	var cities = JSON.parse(JSON.stringify(data));
				var c=0;
				  for (c=0; c < cities.length ; cities++  ) {
				
				city.push(cities[c].City);	
				}
	}
	model.find({City: {$in: city}}, function(err, data) {
	if (err) {
	console.error(err);
	return null;
	}
	if (response != null) {
	response.setHeader('content-type', 'application/json');
	response.end(JSON.stringify(data));
	}
	return JSON.stringify(data);
	});
	});
}

exports.findCompanyPersonByID = function (model, _Id, response) {
		model.findOne({Id: _Id},
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
		response.end('Company Person Not Found');
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
	




exports.deleteCompanyPerson = function (model, _Id, response){

model.findOne({Id: _Id},
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
console.log('CompanyPerson not found');
if (response != null) {
response.writeHead(404,
{'Content-Type' : 'text/plain'});
response.end('CompanyPerson Not Found');
}
return;
} else {
data.remove(function(error){
if (!error) {
data.remove();
response.json({"code" : 200, "status" : "CompanyPerson Record Deleted Successfully" , "BikerId" : _Id });
}
else {
console.log(error);
response.json({"code" : 101, "status" : "CompanyPerson Record Not Deleted with error " + error , "BikerId" : _Id });
}
});

	return;
	}
	}
	});
} 


exports.deleteCompanyPersonByMobileNumber  = function (model, _mobileNumber, response){

model.findOne({Mobile: _mobileNumber},
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
console.log('Company Person not found');
if (response != null) {
response.writeHead(404,
{'Content-Type' : 'text/plain'});
response.end('Company Person not found');
}
return;
} else {
data.remove(function(error){
if (!error) {
data.remove();
response.json({"code" : 200, "status" : "Company Person Record Deleted Successfully" , "MobileNumber" : _mobileNumber });
}
else {
console.log(error);
response.json({"code" : 101, "status" : "Company Person Record Not Deleted with error " + error , "MobileNumber" : _mobileNumber });
}
});

	return;
	}
	}
	});
} 


