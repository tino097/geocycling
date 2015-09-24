$(function() {
	var geocodingModuleRequest = {
		"module" : "geocoding-module",
		"request_properties":{
			"address" : null
		}
	};
	$("#origin").keyup(function() {
		geocodingModuleRequest.request_properties.address = $( "#origin" ).val();
		$.post( geocodingModuleUrl, JSON.stringify(geocodingModuleRequest) , function( data ) {
			if(data.status_code != 200){
				$("#origin").css("border", "2px solid red");
				originObj = null;
			} else {
				$("#origin").css("border", "2px solid green");
				originObj = data;
			}
		});
	});

	$("#destination").keyup(function() {
		geocodingModuleRequest.request_properties.address = $( "#destination" ).val();
		$.post( geocodingModuleUrl, JSON.stringify(geocodingModuleRequest), function( data ) {
			if(data.status_code != 200){
				$("#destination").css("border", "2px solid red");
				destinationObj = null;
			} else {
				$("#destination").css("border", "2px solid green");
				destinationObj = data;
			}
		});
	});

	$("#searchForm :input").keyup(function() {
		if (originObj !== null && destinationObj !== null)
			$("#submit").prop('disabled', false);
		else
			$("#submit").prop('disabled', true);
	});
});
