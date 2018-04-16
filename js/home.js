$(window).on('load', function() {
  var weddingDate = moment.tz("2018-12-29 16:00", "America/Vancouver");

  $('#countdownClock').countdown(weddingDate.toDate(), function(event) {
      $(this).html(event.strftime(''
        + '<div class="flex-column clock-item"><span class="count">%w</span> <label>weeks</label></div>'
        + '<div class="flex-column clock-item"><span class="count">%d</span> <label>days</label></div>'
        + '<div class="flex-column clock-item"><span class="count">%H</span> <label>hours</label></div>'
        + '<div class="flex-column clock-item"><span class="count">%M</span> <label>minutes</label></div>'
        + '<div class="flex-column clock-item"><span class="count">%S</span> <label>seconds</label></div>'));
  });
});

