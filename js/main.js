$(document).ready(function() {
  $("#intro").removeClass('no-scroll');
});

$('#intro, main').on('mousewheel DOMMouseScroll', function(e) {
  const delta = e.originalEvent.wheelDelta || -e.originalEvent.detail;
  const getSibling = delta => delta > 0 ? 'prev' : 'next';
  const threshold = 120;

  if (delta > threshold*-1 && delta < threshold) return;

  if (this.id === 'intro') {
    if (delta > 0 && $(this).scrollTop() === 0) {
      return e.preventDefault();
    }

    if (this.id === 'intro') {
      $(this).removeClass('viewing');
      setTimeout(() => {
        $(this).remove();
        $("main").removeClass('no-scroll');
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
  
  // Display next sectino to scroll to
  initialSection[getSibling(delta)]().addClass('viewing');
  // Make sure scroll value is maximum as possible to scroll fully
  const top = $(main).height() * (delta / Math.abs(delta));
  // Keep current section in viewport
  main.scrollTo({
    top,
    left: 0,
    behavior:'instant'
  });
  // Finally scroll to new section
  main.scrollTo({
    top: top * -1,
    left: 0,
    behavior:'smooth'
  });

  setTimeout(() => {
    // When finished scrolling remove intial section from view
    initialSection.removeClass('viewing');
    // Allow user to scroll again
    $(main).removeClass('scrolling');
  }, 1000);

  
});