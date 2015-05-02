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
// function findClosestBathroom(json) {
// }
function initialize() {
    var mapOptions = {
        center: { lat: 37.765, lng: -122.242}, // coords of Alameda
        zoom: 18
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map.setCenter(initialLocation);
        });
    }
}
google.maps.event.addDomListener(window, 'load', initialize);