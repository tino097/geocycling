$(function() {

  var points = [];
  var route = {
    "route_id": null,
    "points": null
  };

  $("#submit").click(function(event) {
    OsmServer.clearMap();
    var routeplannerModuleRequest = {
      "module": "routeplanner-module",
      "request_properties": {
        "lat_origin": originObj.response_properties.lat,
        "lon_origin": originObj.response_properties.lon,
        "lat_destination": destinationObj.response_properties.lat,
        "lon_destination": destinationObj.response_properties.lon
      }
    };

    $.post(routeplannerModuleUrl, JSON.stringify(routeplannerModuleRequest), function(data) {
      obj = jQuery.parseJSON(data);
      if (obj.status_code != 200) {
        alert(obj.status_message);
      } else {
        route = {};
        route.route_id = null;
        route.points = null;
        for (var cord in obj.response_properties.routes) {
          points = [];
          for (var lonlat in obj.response_properties.routes[cord].coordinates) {
            var lon = obj.response_properties.routes[cord].coordinates[lonlat][0];
            var lat = obj.response_properties.routes[cord].coordinates[lonlat][1]
            points.push(new OpenLayers.Geometry.Point(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), Map.getProjectionObject()));
          }
          route.route_id = cord;
          route.points = points;
          OsmServer.addMarkers(route);
        }
      }
    });
  });
});
