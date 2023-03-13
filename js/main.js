const STATE = {
  startedWelcome: false,
};

$(document).ready(function() {
  $("#intro").removeClass('no-scroll');
});

let lastY;
$('#intro, main').on('touchstart', function(e) {
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

  if (this.id === 'intro') {
    if (delta > 0 && $(this).scrollTop() === 0) {
      // If scrolling up on intro then return
      return e.preventDefault();
    }

    if (this.id === 'intro') {
      // Slide up intro
      $(this).removeClass('viewing');
      setTimeout(() => {
        $(this).remove();
        // Make main scrollable
        $("main").removeClass('no-scroll');

        if (!STATE.startedWelcome) {
          $(".intro-text-white").addClass('disappear');
          
          setTimeout(() => {
            $(".intro-text-white").remove();
            
            initWelcomeType();
          }, 2000);

          STATE.startedWelcome = true;
        }
        
      }, 1500);
      return;
    }
  }

  // When scrolling on main
  const main = this;
  
  // Let's not interfere while scrolling
  if ($(main).hasClass('scrolling')) return;
  $(main).addClass('scrolling');
  // Get current section for reference
  const initialSection = $(main).find('.viewing');

  if (initialSection.hasClass('about') && delta < 0) {
    // Can't scroll down if we are at the bottom
    e.preventDefault();
    return $(main).removeClass('scrolling');
  } else if (initialSection.hasClass('first') && delta > 0) {
    // Can't scroll up if we are at the top
    e.preventDefault();
    return $(main).removeClass('scrolling');
  }

  // Function to determine which sibling to scroll to
  const getSibling = delta => delta > 0 ? 'prev' : 'next';
  // Display next sectino to scroll to
  initialSection[getSibling(delta)]().addClass('viewing');
  // Process factor to scroll by
  const factor = initialSection.hasClass('projects') ? delta > 0 ? 0 : -2 : -1;
  // Make sure scroll value is maximum as possible to scroll fully
  const top = $(initialSection).height() * factor;
  // Keep current section in viewport
  // Finally scroll to new section
  $('main .section').css({
    'transform': `translateY(${top}px)`,
  });

  setTimeout(() => {
    // When finished scrolling remove intial section from view
    initialSection.removeClass('viewing');
    // Allow user to scroll again
    $(main).removeClass('scrolling');
  }, 1200);

  
});


function initWelcomeType() {
  new TypeIt("#welcome-text", { 
    strings: "Welcome.",
    lifeLike: true,
    speed: 100,
    cursorChar: '<img src="../assets/images/welcome-cursor.svg">',
    afterComplete: async instance => instance.destroy()
  }).go();
}
