$(window).on('load', function() {
  var now = new Date();
  var weddingDate = moment.tz("2018-12-29 16:00", "America/Vancouver");
  var diff = weddingDate / 1000 - now.getTime() / 1000;
  var markers = [];
  var hostnameRegexp = new RegExp('^https?://.+?/');
  var pinColor = "D4AF37";
  var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
        new google.maps.Size(21, 34),
        new google.maps.Point(0,0),
        new google.maps.Point(10, 34));
  var pinShadow = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_shadow",
        new google.maps.Size(40, 37),
        new google.maps.Point(0, 0),
        new google.maps.Point(12, 35));

  var clock = $('#countdownClock').FlipClock(diff, {
    clockFace: 'DailyCounter',
    countdown: true
  });

  var hundredMile = {lat: 51.647254, lng: -121.295770};

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: hundredMile,
    mapTypeControl: false,
    panControl: false,
    zoomControl: false,
    streetViewControl: false
  });

  var infoWindow = new google.maps.InfoWindow({
    content: document.getElementById('info-content')
  });

  var placesService = new google.maps.places.PlacesService(map);

  // Search for hotels in the selected city, within the viewport of the map.
   var search = {
     location: hundredMile,
     bounds: map.getBounds(),
     radius: "500",
     types: ['lodging']
   };

   placesService.nearbySearch(search, function(results, status) {
     if (status === google.maps.places.PlacesServiceStatus.OK) {
       // Create a marker for each hotel found, and
       // assign a letter of the alphabetic to each marker icon.
       for (var i = 0; i < results.length; i++) {
         var markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
         // Use marker animation to drop the icons incrementally on the map.
         markers[i] = new google.maps.Marker({
           position: results[i].geometry.location,
           animation: google.maps.Animation.DROP,
           icon: pinImage,
           shadow: pinShadow
         });
         // If the user clicks a hotel marker, show the details of that hotel
         // in an info window.
         markers[i].placeResult = results[i];
         google.maps.event.addListener(markers[i], 'click', showInfoWindow);
         setTimeout(dropMarker(i), i * 100);
         addResult(results[i], i);
       }
     }
   });

   function dropMarker(i) {
        return function() {
          markers[i].setMap(map);
        };
      }

      function addResult(result, i) {
       var results = document.getElementById('resultsList');
       var markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));

       var listItem = document.createElement('div');
       listItem.style.backgroundColor = (i % 2 === 0 ? '#F0F0F0' : '#FFFFFF');
       listItem.onclick = function() {
         google.maps.event.trigger(markers[i], 'click');
       };
       listItem.setAttribute('class', 'list-group-item list-group-item-action flex-row');

       var icon = document.createElement('i');
       //icon.src = markerIcon;
       icon.setAttribute('class', 'fas fa-bed bedIcon mr-4');
       //icon.setAttribute('className', 'placeIcon');
       var name = document.createTextNode(result.name);
       listItem.appendChild(icon);
       listItem.appendChild(name);
       results.appendChild(listItem);
     }

   // Get the place details for a hotel. Show the information in an info window,
      // anchored on the marker for the hotel that the user selected.
      function showInfoWindow() {
        var marker = this;
        placesService.getDetails({placeId: marker.placeResult.place_id},
            function(place, status) {
              if (status !== google.maps.places.PlacesServiceStatus.OK) {
                return;
              }
              infoWindow.open(map, marker);
              buildIWContent(place);
            });
      }

      // Load the place information into the HTML elements used by the info window.
      function buildIWContent(place) {
        document.getElementById('iw-icon').innerHTML = '<i class="fas fa-bed fa-5x bedIcon"/>';
        document.getElementById('iw-url').innerHTML = '<b><a href="' + place.url +
            '">' + place.name + '</a></b>';
        document.getElementById('iw-address').textContent = place.vicinity;

        if (place.formatted_phone_number) {
          document.getElementById('iw-phone-row').style.display = '';
          document.getElementById('iw-phone').textContent =
              place.formatted_phone_number;
        } else {
          document.getElementById('iw-phone-row').style.display = 'none';
        }

        // Assign a five-star rating to the hotel, using a black star ('&#10029;')
        // to indicate the rating the hotel has earned, and a white star ('&#10025;')
        // for the rating points not achieved.
        if (place.rating) {
          var ratingHtml = '';
          for (var i = 0; i < 5; i++) {
            if (place.rating < (i + 0.5)) {
              ratingHtml += '&#10025;';
            } else {
              ratingHtml += '&#10029;';
            }
          document.getElementById('iw-rating-row').style.display = '';
          document.getElementById('iw-rating').innerHTML = ratingHtml;
          }
        } else {
          document.getElementById('iw-rating-row').style.display = 'none';
        }

        // The regexp isolates the first part of the URL (domain plus subdomain)
        // to give a short URL for displaying in the info window.
        if (place.website) {
          var fullUrl = place.website;
          var website = hostnameRegexp.exec(place.website);
          if (website === null) {
            website = 'http://' + place.website + '/';
            fullUrl = website;
          }
          document.getElementById('iw-website-row').style.display = '';
          document.getElementById('iw-website').textContent = website;
        } else {
          document.getElementById('iw-website-row').style.display = 'none';
        }
      }

      var venueMap = new google.maps.Map(document.getElementById('venue-map'), {
        zoom: 15,
        center: hundredMile,
        mapTypeControl: false,
        panControl: false,
        zoomControl: false,
        streetViewControl: false
      });

});
