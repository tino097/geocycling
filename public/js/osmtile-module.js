var map = new ol.Map({
	target: 'map',
	layers: [
		new ol.layer.Tile({
			source: new ol.source.MapQuest({
				layer: 'osm'
			})
		})
	],
	view: new ol.View({
		center: ol.proj.transform(initialCoords, 'EPSG:4326', 'EPSG:3857'),
		zoom: 12
	})
});

var vectorSource = new ol.source.Vector({
});

var markers = [];

function AddMarkers(coordinates) {
	for (var i = 0; i < coordinates.length; i++) {
		var x = coordinates[i][1];
		var y = coordinates[i][0];

		var iconFeature = new ol.Feature({
			geometry: new ol.geom.Point(ol.proj.transform([x, y], 'EPSG:4326', 'EPSG:3857')),
			name: 'Marker ' + i
		});
		markers[i] = ol.proj.transform([x, y], 'EPSG:4326', 'EPSG:3857');
		vectorSource.addFeature(iconFeature);
	}

	var vectorLayer = new ol.layer.Vector({
		source: vectorSource
	});
	return vectorLayer;
}
