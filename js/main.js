$(document).ready(function() {
  $("#force-intro").addClass('scroll');
});

$("#force-intro").on('scroll', function(evt) {
  if (!$(this).hasClass('scroll')) return;
  $("#intro").addClass('remove');
  setTimeout(() => $("#force-intro, #intro").remove(), 1500);
});