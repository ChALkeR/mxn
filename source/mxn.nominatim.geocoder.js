mxn.register('nominatim', {

Geocoder: {
	init: function() {
	},

	geocode: function(address, rowlimit) {
		var me = this;
		me.row_limit = rowlimit || 1; //default to one result

		var url = 'http://nominatim.openstreetmap.org/';
		var params = {
			'addressdetails': 1,
			'format': 'json'
		};

		if (address.hasOwnProperty('lat') && address.hasOwnProperty('lon')) {
			url += 'reverse';
			params.lat = address.lat;
			params.lon = address.lon;
		} else {
			url += 'search';
			if (!address.hasOwnProperty('address') || address.address === null || address.address === '') {
				address.address = [ address.street, address.locality, address.region, address.country ].join(', ');
			}
			if (address.hasOwnProperty('address')) {
				params.q = address.address;
			}
			else {
				params.q = address;
			}
			params.limit = me.row_limit;
		}

		var handlers = {
			json: function(results) {
				me.geocode_callback(results, me.row_limit);
			},
			error: function(xhr) {
				if (xhr.status == 503) { // Service Temporarily Unavailable
					me.error_callback("Nominatim is temporarily unavailable (were you blocked for excessive use?)");
				} else {
					me.error_callback(xhr.statusText);
				}
			},
			response: function(xhr) {
				if (xhr.status == 200) {
					try {
						handlers.json(JSON.parse(xhr.responseText));
					} catch (e) {
						me.error_callback("There was an error parsing data from Nominatim.");
					}
				} else {
					handlers.error(xhr);
				}
			}
		};

		if (typeof jQuery !== 'undefined') {
			jQuery.ajax({
				url: url,
				data: params,
				dataType: 'json',
				success: handlers.json,
				error: handlers.error
			});
		} else if (typeof OpenLayers !== 'undefined') {
			OpenLayers.Request.GET({
				url: url,
				params: params,
				callback: handlers.response
			});
		} else {
			try {
				var query = '';
				for (var key in params)
					query += (query ? '&' : '?') + encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
				var xhr = new XMLHttpRequest() || new ActiveXObject('Microsoft.XMLHTTP');
				xhr.open('GET', url + query, true);
				xhr.onreadystatechange = function() {
					if (xhr.readyState == 4)
						handlers.response(xhr);
				};
				xhr.send(params);
			} catch (e) {
				me.error_callback("There was an error with XMLHttpRequest (old browser?). Try loading jQuery or OpenLayers to get a fallback.");
			}
		}
	},

	geocode_callback: function(results, rowlimit) {
		if (results instanceof Array) {
			if (!results.length) {
				this.error_callback("Nominatim didn't recognize this address.");
				return;
			}
		}
		else {
			results = [results];
		}

		var place;
		var places = [];

		for (i=0; i<results.length; i++) {
			place = results[i];
			var return_location = {};
			return_location.street = '';
			return_location.locality = '';
			return_location.postcode = '';
			return_location.region = '';
			return_location.country = '';
			var street_components = [];

			if (place.address.country) {
				return_location.country = place.address.country;
			}
			if (place.address.state_district) {
				return_location.region = place.address.state_district;
			}
			else if (place.address.state) {
				return_location.region = place.address.state;
			}
			if (place.address.city) {
				return_location.locality = place.address.city;
			}
			else if (place.address.town) {
				return_location.locality = place.address.town;
			}
			else if (place.address.village) {
				return_location.locality = place.address.village;
			}
			else if (place.address.hamlet) {
				return_location.locality = place.address.hamlet;
			}

			if (!return_location.locality && place.address.county) {
				return_location.locality = place.address.county;
			}

			if (place.address.postcode) {
				return_location.postcode = place.address.postcode;
			}
			if (place.address.road) {
				street_components.push(place.address.road);
			}
			if (place.address.house_number) {
				street_components.unshift(place.address.house_number);
			}

			if (return_location.street === '' && street_components.length > 0) {
				return_location.street = street_components.join(' ');
			}

			return_location.point = new mxn.LatLonPoint(parseFloat(place.lat), parseFloat(place.lon));

			places.push(return_location);
		}

		if (rowlimit <= 1) {
			this.callback(places[0]);
		}
		else {
			if (places.length > rowlimit) {
				places.length = rowlimit;
			}
			this.callback(places);
		}
	}
}

});