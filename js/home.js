$(window).on('load', function() {
  $('.header-video').each(function(i, elem) {
        headerVideo = new HeaderVideo({
          element: elem,
          media: '.header-video__media',
          playTrigger: '.header-video__play-trigger',
          closeTrigger: '.header-video__close-trigger'
        });
    });

  var weddingDate = moment.tz("2018-12-29 16:00", "America/Vancouver");

  $('#countdownClock').countdown(weddingDate.toDate(), function(event) {
      $(this).html(event.strftime(''
        + '<div class="flex-column clock-item"><span class="count">%w</span> <label>weeks</label></div>'
        + '<div class="flex-column clock-item"><span class="count">%d</span> <label>days</label></div>'
        + '<div class="flex-column clock-item"><span class="count">%H</span> <label>hours</label></div>'
        + '<div class="flex-column clock-item"><span class="count">%M</span> <label>minutes</label></div>'
        + '<div class="flex-column clock-item"><span class="count">%S</span> <label>seconds</label></div>'));
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
