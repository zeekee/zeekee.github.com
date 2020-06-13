$(function () {
  $('[data-toggle="tooltip"]').tooltip()
});

(function() {
'use strict';
window.addEventListener('load', function() {
  var form = document.getElementById('contact-form');
  var validation = form.addEventListener('submit', function(event) {
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      }else{
        event.preventDefault();
        event.stopPropagation();
        $("#contact-modal").modal("hide");
        $("#contact-alert").show();
        setTimeout(() => {
          $("#contact-alert").hide();
        }, 3000)
      }
      form.classList.add('was-validated');
    }, false);
}, false);
})();