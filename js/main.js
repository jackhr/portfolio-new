const STATE = {
  startedWelcome: false,
};

$(document).ready(function() {
  $("#intro").removeClass('no-scroll');
});

let lastY;
$('#intro').on('touchstart', function(e) {
  lastY = e.originalEvent.touches[0].clientY;
}).on('mousewheel DOMMouseScroll touchmove', function(e) {
  
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
      instance.destroy();
      $('html, body').removeClass('no-scroll');
    }
  }).go();
}
