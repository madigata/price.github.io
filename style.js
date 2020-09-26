var departure;
var arrival;
var distance;
var Mymap;
var price;
var KM_BASE = 5;
var INIT_PRICE = 200;
var LARGE_STEP_PRICE = 250;
var MEDIUM_STEP_PRICE = 100;
var PRICE_FIRST_5KM_PER_KM = 50;
var PRICE_FIRST_10KM_PER_KM = 75;
var PRICE_AFTER_10KM_PER_KM = 75;
var PRICE_FIRST_5KM = INIT_PRICE + PRICE_FIRST_5KM_PER_KM * 3;
var PRICE_FIRST_10KM = PRICE_FIRST_5KM + 5 * PRICE_AFTER_10KM_PER_KM;
var option = {
    componentRestrictions: { 'country': "ML" }
};
var input1 = document.getElementById('place1');
var autocomplete1 = new google.maps.places.Autocomplete(input1, option);
var input2 = document.getElementById('place2');
var autocomplete2 = new google.maps.places.Autocomplete(input2, option);

autocomplete1.addListener('place_changed', function () {
    departure = new google.maps.LatLng(autocomplete1.getPlace().geometry.location.lat(), autocomplete1.getPlace().geometry.location.lng());
    if (arrival) {
        getDirection(departure, arrival);
    }


});

autocomplete2.addListener('place_changed', function () {
    arrival = new google.maps.LatLng(autocomplete2.getPlace().geometry.location.lat(), autocomplete2.getPlace().geometry.location.lng());

    if (departure) {
        getDirection(departure, arrival);
    }


});
function getDirection(departure, arrival) {
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var directionsService = new google.maps.DirectionsService();
    var mapOptions = {
        zoom: 14,
        center: departure
    };
    Mymap = new google.maps.Map(document.getElementById('Mymaps'), mapOptions);
    directionsDisplay.setMap(Mymap);
    var request = {
        origin: departure,
        destination: arrival,
        travelMode: "DRIVING"
    };
    directionsService.route(request, function (result, status) {
        if (status == "OK") {
            directionsDisplay.setDirections(result);
            distance = result.routes[0].legs[0].distance.text;
            var intDistance = (result.routes[0].legs[0].distance.value / 1000);
            price = calculatePrice(intDistance) + " Fcfa";
            getPrice(price)
        }
        else {
            price = "";
            price = "Pas de resultat";
            getPrice(price);
        }
    });
}


function calculatePrice(distance) {
    var result = INIT_PRICE;
    if (distance <= 2) {
        return result
    }
    var distanceCeil = Math.ceil(distance);
    var divideKM = Math.floor(distanceCeil / KM_BASE);
    var remainingKM = distanceCeil % KM_BASE;
    switch (parseInt(divideKM)) {
        case 0:
            return RoundToNearestDivider(INIT_PRICE + (remainingKM - 2) * PRICE_FIRST_5KM_PER_KM, 50);
        case 1:
            return RoundToNearestDivider(PRICE_FIRST_5KM + remainingKM * PRICE_FIRST_10KM_PER_KM, 50);
        default:
            return RoundToNearestDivider(PRICE_FIRST_10KM + (distanceCeil - 10) * PRICE_AFTER_10KM_PER_KM, 50);
    }
}
function RoundToNearestDivider(value, divider) {
    return Math.round(value / 50) * 50;
}

function getPrice(price) {
    document.getElementById('prix').innerHTML = price;
}


window.addEventListener("DOMContentLoaded", (event) => {
    var option = {
        zoom: 15,
        center: new google.maps.LatLng(12.6352832, -8.0040517)
    };
    Mymap = new google.maps.Map(document.getElementById('Mymaps'), option);
    distance = "0" + " km";
    price = "0" + " FCFA";
    getPrice(price);
});