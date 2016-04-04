/* globals skrollr, $ */

var s = skrollr.init({
  forceHeight: false
});

(function() {

  $('.user-card').css('display', 'flex');

  $('.projects__slider').slick({
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    responsive: [
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  });

  var $contactForm = $('.contact__form');
  var $contactOutput = $('.js-contact-output');
  $contactForm.submit(function(e) {
    e.preventDefault();
    var url = $contactForm.attr('action');
    $.ajax({
      url: url,
      method: 'POST',
      data: $(this).serialize(),
      dataType: 'json',
      beforeSend: function() {
        $contactOutput.append('<div class="contact__alert contact__alert--loading">Sending message…</div>');
      },
      success: function(data) {
        $contactOutput.find('.contact__alert--loading').hide();
        $contactOutput.append('<div class="contact__alert contact__alert--success">Message sent!</div>');
      },
      error: function(err) {
        $contactOutput.find('.contact__alert--loading').hide();
        $contactOutput.append('<div class="contact__alert contact__alert--error">Ops, there was an error.</div>');
      }
    });
  });

  // get stars number
  // slick slider duplicates the items to simulate the infinite slide, we then want to make an ajax request for each project
  // and not for each card, otherwise we'll end up making a lot of useless requests
  var stars = {};
  $('.stars-counter').each(function() {
    var author = $(this).attr('data-author');
    var project = $(this).attr('data-project');
    var field = $(this).find('.stars-counter__number');
    var path = author + '/' + project;
    if (!stars[path]) {
      stars[path] = true;
      $.get('https://api.github.com/repos/' + path, function(data) {
        stars[path] = data.stargazers_count;
      }).fail(function() {
        stars[path] = '?';
      }).always(function() {
        $('.stars-counter[data-author="' + author + '"][data-project="' + project + '"] .stars-counter__number').text(stars[path]);
      });
    }
  });

  $('.js-show-bio').click(function() {
    $('.user-card__bio').addClass('user-card__bio--visible').removeClass('user-card__bio--hidden');
  });
  $('.js-hide-bio').click(function() {
    $('.user-card__bio').removeClass('user-card__bio--visible').addClass('user-card__bio--hidden');
  });

})();

// analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-75924145-1', 'auto');
ga('send', 'pageview');
