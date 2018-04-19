$(window).on('load', function() {
  var now = new Date();
  var weddingDate = moment.tz("2018-12-29 16:00", "America/Vancouver");
  var diff = weddingDate / 1000 - now.getTime() / 1000;

  var clock = $('#countdownClock').FlipClock(diff, {
    clockFace: 'DailyCounter',
    countdown: true
  });

  var hundredMile = {lat: 51.647254, lng: -121.295770};

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: hundredMile
  });

  var marker = new google.maps.Marker({
    position: hundredMile,
    map: map
  });

  var request = {
    location: hundredMile,
    radius: '10',
    type: ['hotel']
  };

  var placesService = new google.maps.places.PlacesService(map);

  placesService.nearbySearch(request, function(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      var placeMarker = new google.maps.Marker({
        map: map,
        title: place.name,
        position: place.geometry.location
      });
    }
  }
  });

});
