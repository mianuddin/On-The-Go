// var onTheGo = onTheGo || {};
navigator.geolocation.getCurrentPosition(function (position) {
    var nearest = dataParser(position, function (position, nearest) {
        google.maps.event.addDomListener(window, 'load', initializeMap(position, nearest));
        console.log("geolocation enabled");
    });
},
function (error) { 
  if (error.code == error.PERMISSION_DENIED)
      console.log("geolocation denied");
});

function initializeMap(position, closest) {
        console.log("Initialize:" + closest.lat + ", " + closest.lng);
    var mapOptions = {
        center: { lat: parseFloat(closest.lat), lng: parseFloat(closest.lng)},
        zoom: 18
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(parseFloat(closest.lat), parseFloat(closest.lng)),
        map: map,
        title: closest.name
    });
}

var dataParser = (function (position, callback) {
    console.log("1");
    var closest = new Object();
    $.getJSON( "acbathrooms.json", function( jData ) {
        console.log("2");
        closest.name = jData.data[1][8];
        closest.lat = jData.data[1][13][1];
        closest.lng = jData.data[1][13][2];
        closest.dist = getDistanceFromLatLonInKm(position.coords.latitude, position.coords.longitude, jData.data[1][13][1], jData.data[1][13][2]);
        console.log(closest.dist);
        $.each(jData.data, function(i, item) {
            // console.log(item[13][1] + ", " + item[13][2]);
            var currentDist = getDistanceFromLatLonInKm(position.coords.latitude, position.coords.longitude, item[13][1], item[13][2]);
            if(currentDist < closest.dist) {
                closest.name = item[8];
                closest.lat = item[13][1];
                closest.lng = item[13][2];
                closest.dist = currentDist;
            }
            console.log(currentDist);
        });
        console.log(closest.name + ": " + closest.lat + ", " + closest.lng);
        callback(position, closest);
    });
});


function getDistanceFromLatLonInKm (lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
}
function deg2rad(deg) {
    return deg * (Math.PI/180)
}