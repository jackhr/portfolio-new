const STATE = {
  startedWelcome: false,
};

$('body').on('scroll wheel DOMMouseScroll', function(evt) {

  const sectionName = $(this).data('section');
  const section = $(`.project.section.${sectionName}`);
  const scrollLeft = section.scrollLeft();
  const delta = evt.originalEvent.wheelDelta || -evt.originalEvent.detail;
  
  if (section.offset().top <= 0) {
    $('body')
      .addClass('no-scroll')
      [0].scrollBy(0, section.offset().top);
    section.addClass('scrolling')
  }
  if (section.hasClass('scrolling')) {
    section.scrollLeft(((delta/4) - scrollLeft) * -1);
  }
  if (section.scrollLeft() == section.prop('scrollLeftMax') && delta < 0) {
    // Reached the end
    console.log('Reached the end');
    let nextSection = section.data('next-section');
    nextSection ||= section.data('project');
    section
      .removeClass('scrolling')
      .scrollLeft(section.prop('scrollLeftMax'));

    $('body')
      .data('section', nextSection)
      .removeClass('no-scroll');
  } else if (section.scrollLeft() == 0 && delta > 0) {
    // Reached the beginning
    console.log('Reached the beginning');
    let prevSection = section.data('prev-section');
    prevSection ||= section.data('project');

    section
      .removeClass('scrolling')
      .scrollLeft(0);

    $('body')
      .data('section', prevSection)
      .removeClass('no-scroll');
  }
});

$(document).ready(function() {
  $("#intro").removeClass('no-scroll');
  $('body')[0].scrollBy(0, 0);
  $('.project.section').scrollLeft(0);
});

let lastY;
$('#intro').on('touchstart', function(e) {
  lastY = e.originalEvent.touches[0].clientY;
}).on('wheel mousewheel touchmove', function(e) {
  
  const mobileScroll = e.type === 'touchmove';
  const threshold = 120;
  // Delta will mainly tell if user is scrolling up of down
  let delta;

  if (mobileScroll) {
    const currentY = e.originalEvent.touches[0].clientY;
    delta = currentY - lastY;
    lastY = currentY;
  } else {
    delta = e.originalEvent.wheelDelta || -e.originalEvent.detail;
  }

  if (!mobileScroll && delta > threshold*-1 && delta < threshold) return;

  if (delta > 0 && $(this).scrollTop() === 0) {
    // If scrolling up on intro then return
    return e.preventDefault();
  }

  $(this).removeClass('viewing');
  setTimeout(() => {
    $(this).remove();
    // Make main scrollable
    $("main").removeClass('no-scroll');

    if (!STATE.startedWelcome) {
      // Only need to fire this once
      STATE.startedWelcome = true;
      $(".intro-text-white").addClass('disappear');
      
      setTimeout(() => {
        $(".intro-text-white").remove();
        initWelcomeType();
      }, 750);
    }
  }, 1500);
  
});

function initWelcomeType() {
  new TypeIt("#welcome-text", { 
    strings: "Welcome.",
    lifeLike: true,
    speed: 100,
    cursorChar: '<img src="assets/images/welcome-cursor.svg">',
    afterComplete: async (instance) => {
      // instance.destroy();
      $('#scroll-for-more').removeClass('hide');
      setTimeout(() => {
        $('#scroll-for-more').toggleClass('oscillate');
        $('html, body').removeClass('no-scroll');
      }, 750);
    }
  }).go();
}

$('body').on('scroll wheel DOMMouseScroll', function(evt) {
  const scrollForMore = $('#scroll-for-more');
  if (scrollForMore.hasClass('oscillate')) {

    const val = scrollForMore
      .css('transform')
      .replaceAll(')', '')
      .split(', ')
      .slice(-1)[0];
    
    scrollForMore
      .removeClass('oscillate')
      .css('transform', `translateY(${val}px)`);

    setTimeout(() => scrollForMore.css('transform', 'translateY(0px)'), 10);

    $('body').off('scroll');
  }
});