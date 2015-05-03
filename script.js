// var onTheGo = onTheGo || {};
navigator.geolocation.getCurrentPosition(function (position) {
    google.maps.event.addDomListener(window, 'load', initializeMap(position));
    console.log("geolocation enabled");
},
function (error) { 
  if (error.code == error.PERMISSION_DENIED)
      console.log("geolocation denied");
});

function initializeMap(position) {
    var mapOptions = {
        center: { lat: position.coords.latitude, lng: position.coords.longitude},
        zoom: 18
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
}

var coords = (function () {
    function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
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
});