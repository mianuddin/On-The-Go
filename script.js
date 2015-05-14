// Run at start.
console.log("-- start --");
navigator.geolocation.getCurrentPosition(function (position) {
    console.log("-- geolocation enabled --");
    console.log("-- " + position.coords.latitude + ", " + position.coords.longitude + " --");
    var nearest = dataParser(position, function (position, nearest) {
        google.maps.event.addDomListener(window, 'load', initializeMap(position, nearest));
        appendInfo(nearest);
    });
},
function (error) { 
  if (error.code == error.PERMISSION_DENIED)
      console.log("geolocation denied");
});

// Code
function initializeMap(position, closest) {
    console.log("-- initializing map at " + closest.lat + ", " + closest.lng + " --");
    var mapOptions = {
        center: { lat: parseFloat(closest.lat), lng: parseFloat(closest.lng)},
        zoom: 18,
        disableDefaultUI: true
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
    console.log("-- data parser --");
    var closest = new Object();
    $.getJSON( "acbathrooms.json", function( jData ) {
        console.log("-- loaded json --");
        // Load information from first item in db. Room for optimization.
        closest.name = jData.data[1][8];
        closest.deets = jData.data[1][11] + "...";
        closest.rating = jData.data[1][12];
        closest.lat = jData.data[1][13][1];
        closest.lng = jData.data[1][13][2];
        closest.dist = getDistanceFromLatLonInMi(position.coords.latitude, position.coords.longitude, jData.data[1][13][1], jData.data[1][13][2]);
        // Go through items in db.
        $.each(jData.data, function(i, item) {
            var currentDist = getDistanceFromLatLonInMi(position.coords.latitude, position.coords.longitude, item[13][1], item[13][2]);
            if(currentDist < closest.dist) {
                closest.name = item[8];
                closest.deets = item[11] + "...";
                closest.rating = item[12];
                closest.lat = item[13][1];
                closest.lng = item[13][2];
                closest.dist = currentDist;
            }
        });
        console.log("-- closest bathroom - " + closest.name + ": " + closest.lat + ", " + closest.lng + " --");
        callback(position, closest);
    });
});

function getDistanceFromLatLonInMi (lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d*0.621371; // Distance in km times conversion factor for miles.
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}

// Draw Information

function appendInfo (closest) {
    $('#content').prepend('<span>' + closest.name + "</span>"); // Name of bathroom.
    $('#stats>div').append(generateStars(closest) + '<span>' + closest.dist.toFixed(2) + " Mi Away</span>"); // Stats from db.
    $('#deets').append('<p>' + closest.deets + "</p>"); // Details from db.
    $('#navigate').attr('href', 'https://www.google.com/maps/dir/Current+Location/' + closest.lat + ',' + closest.lng ); // GMaps navigation.
    $('#spinner-overlay').css('height', '0px'); // Hide spinner.
    $('.spinner>div').css('height', '0px'); // Hide spinner.
}

function generateStars(closest) {
    var starHTML = "";
    
    switch(closest.rating) {
        case "G":
            for(var i=0; i<5; i++) {
                starHTML += '<span class="goldStar">&#9733;</span>';
            }
            break;
        case "g":
            for(var i=0; i<5; i++) {
                starHTML += '<span class="goldStar">&#9733;</span>';
            }
            break;
        case "Y":
            for(var i=0; i<3; i++) {
                starHTML += '<span class="goldStar">&#9733;</span>';
            }
            for(var i=0; i<2; i++) {
                starHTML += '<span class="star">&#9733;</span>';
            }
            break;
        case "y":
            for(var i=0; i<3; i++) {
                starHTML += '<span class="goldStar">&#9733;</span>';
            }
            for(var i=0; i<2; i++) {
                starHTML += '<span class="star">&#9733;</span>';
            }
            break;
        case "R":
            for(var i=0; i<5; i++) {
                starHTML += '<span class="star">&#9733;</span>';
            }
            break;
        case "r":
            for(var i=0; i<5; i++) {
                starHTML += '<span class="star">&#9733;</span>';
            }
            break;
        default:
            starHTML += '<span>No rating.</span>';
    }
    
    starHTML += '<span>&nbsp|&nbsp</span>';
    
    return starHTML;
}