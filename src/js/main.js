import $ from 'jquery';
import Toast from './toast';

$(document).ready(function() {
  // JS error notifications
  window.onerror = function(message, url, lineNumber) {
    new Toast({
      title: 'Javascript error occured',
      message: message + "\n(" + url + ":" + lineNumber + ")",
      type: 'danger'
    }).show();
  };

  //*****

  // Body margin-top from navbar
  $('body').css('margin-top', $('#navbar').outerHeight());

  //*****

  // Toggle navbar
  $('.navbar-burger').on('click', function() {
    let _this = $(this);

    _this.toggleClass('is-active');
    $(`#${_this.data('target')}`).toggleClass('is-active');
  });

  //*****

  // Loading pages
  let loadJobsListButton = $('#loadJobsList');
  loadJobsListButton.on('click', function() {
    let pageToLoad = Number(loadJobsListButton.data('current-page')) + 1;
    console.log(pageToLoad);
    loadJobsListButton.toggleClass('is-loading');

    $.get(`/?page=${pageToLoad}`, (data, status) => {
      $('#jobsList').append(data);
      loadJobsListButton.toggleClass('is-loading');
      loadJobsListButton.data('current-page', pageToLoad);
    });
  });
});

