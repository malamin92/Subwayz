src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"

var directionsDisplay;
var directionsService;
var geocoder;
// Store all transit involved route 
var transit_obj = [];
// Markers for current locaiton
var markers = [];

// If content 
function showTransit(transit_obj, content){
  // Retrieve route from array
  var current_route;
  for (var i = 0; i < transit_obj.length; i++) {
    console.log(transit_obj[i].instructions + " + " + content);
    if (transit_obj[i].instructions.indexOf(content) !=- 1){
      current_route = transit_obj[i];
      break;
    }
  }
  // Print transit detail
  getTransitDetail(current_route);
};

function getTransitDetail(obj){
  $("#train").text(obj.transit.line.short_name + " Train");
  $("#train-stop-depart").text(obj.transit.departure_stop.name);
  $("#train-stop-end").text(obj.transit.arrival_stop.name);
  $("#num-stop").text(obj.transit.num_stops + " Stops");
  $("#arrival_time").text(obj.transit.arrival_time.text);
  $("#departure_time").text(obj.transit.departure_time.text);
  $("#distance").text(obj.distance.text);
  $("#duration").text(obj.duration.text);
};

$(document).ready(function(){
  $('#err-container').hide (0);
  $('#navCarousel').off('keydown.bs.carousel');
  // Keeps form pointAB from refreshing the page.
  $('#pointAB').on('submit', function(){
    return false;
  });

  // Change station info dynamically base on clicking on route section 
  $("#directions-panel").click(function(e) {
    var content = $(e.target).html();
    var theObj = $(e.target);
    console.log(theObj);
    if ( content != "" ) {
      // Click on route part that contain subway, get parent html tag for subway information
      if (content.toLowerCase().indexOf("subway") > -1) {
        // Current tag related to saved subway route
        showTransit(transit_obj, content);
      }
      else {
        // Check every element in transit_obj, if one of them exist then print the related subway route 
        for (var i = 0; i < transit_obj.length; i++) {
          console.log(transit_obj[i]);
          switch (e.toElement.innerText) {
            // Arrival Stop
            case transit_obj[i].transit.arrival_stop.name:
              console.log(1);
              getTransitDetail(transit_obj[i]);
              break;
            // Arrival Time
            case transit_obj[i].transit.arrival_time.text:
              console.log(2);
              getTransitDetail(transit_obj[i]);
              break;
            // Staion Stop
            case transit_obj[i].transit.departure_stop.name:
              console.log(3);
              getTransitDetail(transit_obj[i]);
              break;
            // Departure Time
            case transit_obj[i].transit.departure_time.text:
              console.log(4);
              getTransitDetail(transit_obj[i]);
              break;
            // Distance
            case transit_obj[i].distance.text:
              console.log(5);
              getTransitDetail(transit_obj[i]);
              break;
            // Duration 
            case transit_obj[i].duration.text:
              console.log(6);
              getTransitDetail(transit_obj[i]);
              break;
            // Number of stops
            case transit_obj[i].transit.num_stops + " stops":
              console.log(7);
              getTransitDetail(transit_obj[i]);
              break;
          }
        }
      }
    }
  });
  
  // Call Google Direction 
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();
  geocoder = new google.maps.Geocoder();
  // Initial map 
  function initialize() {

    var map;
    var pos;

    var mapOptions = {
      zoom: 13
    };

    if(navigator.geolocation) {

      navigator.geolocation.getCurrentPosition(function(position) {
        pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var marker = new google.maps.Marker({
          position: pos,
          map: map,
          title: 'Current Location'
        });
        markers.push(marker);
        
        //Reverse geocoding for starting location
        geocoder.geocode({'latLng': pos}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            if (results.length != 0) {
              console.log("reverse geocoding result choice: ");
              console.log(results);
              
              // Change input box value 
              var startInput = document.getElementById("start");
              startInput.value = results[0].formatted_address;
              
            } else {
              alert('No results found');
            }
          } else {
            alert('Geocoder failed due to: ' + status);
          }
        });
        
        //$('#start').val(pos);
      }, function() {
        handleNoGeolocation(false);
      }); 
    } 
    else {
      // Browser doesn't support Geolocation
      handleNoGeolocation(true);
    }
    
    // Non-supporting geolocaiton handling
    function handleNoGeolocation(errorFlag) {
      if (!errorFlag) {
        $('#err-message').text('Geolocation services failed.');
        $('#err-container').show(1000);
      }
      else {
        $('#err-message').text('Your browser doesn\'t support geolocation.');
        $('#err-container').show(1000);
      }
      
      var options = {
        map: map,
        // Hard code nyc lat lng
        position: new google.maps.LatLng(40.7903, -73.9597),
        content: content
      };
    }

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    map.setCenter(pos);

    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('directions-panel'));
    
    //Needed to resize maps 
    google.maps.event.addDomListener (map, 'idle', function(){
      google.maps.event.trigger (map, 'resize');
      map.setCenter(pos);
    });

  }

  google.maps.event.addDomListener(window, 'load', initialize);

});

// Set route and request direction result 
function calcRoute() {
  $('#err-container').hide (1000);
  var start = document.getElementById('start').value;
  var end = document.getElementById('end').value;
  if (start == '' && end == '') {
    $('#err-message').text('Please fill out "Start" and "End".');
    $('#err-container').show (1000);
    start='';
    end='';
    return;
  }
  else if (start == '') {
    $('#err-message').text('Please fill out "Start".');  
    $('#err-container').show (1000);
    start='';
    end='';
    return;
  }
  else if (end == '') {
    $('#err-message').text('Please fill out "End".');
    $('#err-container').show (1000);
    start='';
    end='';
    return;
  }
  else {
    start += 'new york city';
    end += 'new york city';
  }
  var request = {
    origin: start,
    destination: end,
    travelMode: google.maps.TravelMode.TRANSIT
  };

  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
      console.log(response);
      // Get route object
      var route = response.routes[0].legs[0];
      for (var i = 0; i < route.steps.length; i++) {
        // Find all possible transit 
        if (route.steps[i].travel_mode == "TRANSIT") {
          console.log(route.steps[i].transit.line.short_name);
          // Push to transit_obj array
          transit_obj.push(route.steps[i]);
        }
      }
      //Move to next slide when directions have been retrieved.
      $('#navCarousel').carousel('next');
      //Disable loading icon pseudocode.
      //$('#loadingIcon').hide(300);
    }
    else {
      $('#err-message').text('No search results.');
    }
  });
};

function hideMessage(){
  $('#init-message').hide(1000);
};

function nextSlide() {
  $('#navCarousel').carousel('next');
};

function prevSlide (){
  $('#navCarousel').carousel('prev');
};

function homeSlide (){
  $('#navCarousel').carousel(0);
};

// Hide current locaiton marker on google map 
function hideMarker(){
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
};

/*
$(document).ready(function(){
  var map;
  var directionsDisplay;
  var directionsService = new google.maps.DirectionsService();
  var lat;
  var lon;
  var hunter = new google.maps.LatLng(40.7687020,-73.9648760);

  function initialize() {

    // Try HTML5 geolocation
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = new google.maps.LatLng(position.coords.latitude,
                                         position.coords.longitude);
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        console.log(pos);

        directionsDisplay = new google.maps.DirectionsRenderer();
        var mapOptions = {
          zoom: 11,
          center: pos
        };
        // Draw map
        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        directionsDisplay.setMap(map);
        
        var request = {
            origin: pos,
            destination: hunter,
            travelMode: google.maps.TravelMode.TRANSIT
        };
        directionsService.route(request, function(response, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
          }
        });

        map.setCenter(pos);
      }, function() {
        handleNoGeolocation(true);
      });
    } else {
      // Browser doesn't support Geolocation
      handleNoGeolocation(false);
    }
  }

  function handleNoGeolocation(errorFlag) {
    if (errorFlag) {
      var content = 'Error: The Geolocation service failed.';
    } else {
      var content = 'Error: Your browser doesn\'t support geolocation.';
    }

    // Center map if geolocaiton not supported
    var options = {
      map: map,
      position: new google.maps.LatLng(60, 105),
      content: content
    };

    var infowindow = new google.maps.InfoWindow(options);
    map.setCenter(options.position);
  }

  // Load Map
  google.maps.event.addDomListener(window, 'load', initialize);

  //var haight = new google.maps.LatLng(37.7699298, -122.4469157);
  //var oceanBeach = new google.maps.LatLng(40.695076256618954, -73.9809462044349);

  
  
  
  /*
  // Query google map
  function initialize() {
    var mapOptions = {
      //center: { lat: -34.397, lng: 150.644},
      zoom: 11
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
        
    // Try HTML5 geolocation
      if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var pos = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
          console.log(position.coords.latitude,position.coords.longitude);
          
          // $.post('/',{lat: position.coords.latitude,
          //                             lng: position.coords.longitude,
          //                             alt:position.coords.altitude });
          
          var contentString = 'This is where you are right now.'

          // // Send client geolocaiton to controller
          // $.ajax({
          //   type:'post',
          //   url:'/',
          //   data: { selectingCommand : JSON.stringify.pos},
          //   success:function(){
          //     //I assume you want to do something on controller action execution success?
          //     //$(this).addClass('done');
          //   }
          // });

          var infowindow = new google.maps.InfoWindow({
            content: contentString
          });

          var marker =  new google.maps.Marker({
            position: pos,
            map: map,
          });

          google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(map,marker);
          });

          // Set marker
          marker.setMap(map);
          // Set geolocation as center
          map.setCenter(pos);

        }, function() {
          handleNoGeolocation(true);
        });

      } else {
        // Browser doesn't support Geolocation
        handleNoGeolocation(false);
      }
  }
  
  // Output error message when fail to get geolocation
  function handleNoGeolocation(errorFlag) {
    if (errorFlag) {
      var content = 'Error: The Geolocation service failed.';
    } else {
      var content = 'Error: Your browser doesn\'t support geolocation.';
    }

    var infowindow = new google.maps.InfoWindow(options);
    map.setCenter(options.position);
  }
  
  // Load Map
  google.maps.event.addDomListener(window, 'load', initialize);
  */

  /*
  $('.sixth-train-link').click(function(e){
    e.preventDefault();
    $('.tag').fadeToggle('slow');
    $('.tag').show();
    //console.log(position.coords.latitude,position.coords.longitude);
  });
});

*/