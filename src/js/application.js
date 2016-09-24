global.$ = global.jQuery = require('jquery');
window.Tether = require('tether');


//ECMA6
require('bootstrap/js/src/util.js');
require('bootstrap/js/src/tooltip.js');

$(document).ready(function() {

    $('body').tooltip({
        selector: '[data-toggle="tooltip"]'
    });

});
