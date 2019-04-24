$(document).ready(function () {
  $('.mdb-select').materialSelect();

  $('.btn-newguest').click(function (e) { 
    e.preventDefault();
    $('.index-tab.active').fadeOut(function () {
      $('.index-tab.active').removeClass('active');
      $('.newguest-tab').fadeIn();
      $('.newguest-tab').addClass('active');
    });
  });
  
  $('.btn-regularguest').click(function (e) { 
    e.preventDefault();
    $('.index-tab.active').fadeOut(function () {
      $('.index-tab.active').removeClass('active');
      $('.regularguest-tab').fadeIn();
      $('.regularguest-tab').addClass('active');
    });
  });
});