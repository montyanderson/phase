const events = require("./views/events.js");

const coords = {};

window.initAutocomplete = () => {
	new google.maps.places.Autocomplete($(".address")[0], {types: ["geocode"]});

	$.ajax({
		url: "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyBVFp946HWnXXDTS-GH2zMUGb-BRmc5n9c",
		type: "POST",
		success: (res) => {
			events.locals.coords = {
				longitude: res.location.lng,
				latitude: res.location.lat
			};

			events.getEvents();
		}
	});
};

$("#submit-event").click(() => {
	console.log("hello, world!");
	const $modal = $("#modal-submit");
	const data = $modal.find("form").serialize();

	$.getJSON("/api/submit?" + data, () => {
		events.getEvents();
	});
});

$(".datepicker").pickadate({
	selectMonths: true,
	selectYears: 15
});

$(".modal-trigger").leanModal();
