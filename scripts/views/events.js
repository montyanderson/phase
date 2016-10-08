/* eslint-disable */
const View = require("../View.js");

const events = module.exports = new View(`
    <div class="col s6">
        <div class="card">
            <div class="card-image">
                <div id="map"></div>
            </div>
        </div>
    </div>

    <div class="col s6">
        <div class="row">
            {{^events}}
                <p>There are no events in your area!</p>
            {{/events}}

            {{#events}}
                <div class="col s12 card event" data-id="{{id}}">
                    <div class="card-content">
                        <h3><a href="/event/{{id}}">{{name}}</a></h3>
                        <p>An event by <a href="/user/{{user.id}}">{{user.displayName}}</a></p>
                    </div>
                </div>
            {{/events}}
        </div>
    </div>
`, (view, locals) => {
    $(".events").html(view);

    const map = new google.maps.Map($("#map")[0], {
        center: {
            lng: events.locals.coords.longitude,
            lat: events.locals.coords.latitude
        },
        zoom: 12
    });

     locals.events.forEach((e) => {
         console.log(e);

         const marker = new google.maps.Marker({
             map,
             position: {
                 lng: e.coords.longitude,
                 lat: e.coords.latitude
             },
             title: e.name
         });

         marker.addListener("click", () => {
            $('.event[data-id="' + e.id + '"]').fadeOut();
         });
     });
});

events.getEvents = (coords) => {
    $.getJSON("/api/events", events.locals.coords, es => {
        events.render({events: es});
    });
};
