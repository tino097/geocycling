var OsmServer = {
  Layers: {},
  init: function() {
    this.initMap();
  },

  // --- Initialize OpenLayers map and set basic options (e.g. projection method)
  initMap: function() {

    // --- Bind map to the map container div
    Map = new OpenLayers.Map('openlayers-container', {
      theme: null
    });

    // --- Add click event listener to trigger a globally usable event
    Map.events.register("click", Map, function(event) {
      $(document).trigger('clickGlobal');
    });

    // --- Add Open Street Maps layer for map tiles from the Prime Data OSM tile server
    this.OsmLayer = new OpenLayers.Layer.OSM(
      "baseLayer",
      "http://149.210.167.14/osm_tiles/${z}/${x}/${y}.png", {
        tileOptions: {
          crossOriginKeyword: null
        },
        opacity: .7,
        numZoomLevels: 18
      }
    );

    Map.eventListeners = {}

    // --- Add OSM tile layer to the map
    Map.addLayer(this.OsmLayer);

    // --- Set WGS 1984 projection method, center and zoom
    epsg4326 = new OpenLayers.Projection("EPSG:4326");
    projectTo = Map.getProjectionObject();
    var lonLat = new OpenLayers.LonLat(4.8986142, 52.3723154).transform(epsg4326, projectTo);
    //var lonLat = new OpenLayers.LonLat(new OpenLayers.Bounds(4.710732, 52.285737, 5.024185, 52.425742) ).transform(epsg4326, projectTo);
    var zoom = 14;
    //Map.zoomToExtent(new OpenLayers.Bounds(4.710732, 52.285737, 5.024185, 52.425742));
    Map.setCenter(lonLat, zoom);
  },

  addMarkers: function(route) {
    var lineLayer = this.createLayer();

    var col = ['#000000', '#6495ED', '#B8860B', '#8B008B', '#FF1493', '#FFD700'];

    var style = {
      //strokeColor: '#0000ff',
      strokeColor: col[route.route_id],
      strokeOpacity: 1,
      strokeWidth: 5,
      pointRadius: 6,
      title: route.route_id,
      hoverStrokeColor:"white"
    };

    var lineFeature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString(route.points), null, style);
    lineLayer.addFeatures(lineFeature);
    Map.addLayer(lineLayer);
  },
  createLayer: function() {
    if (Map.getLayersByName("Routes").length == 0) {
      return new OpenLayers.Layer.Vector("Routes");
    } else {
      return Map.getLayersByName("Routes")[0];
    }
  },

  clearMap: function() {
    if (typeof Map.getLayersByName("Routes")[0] == "object")
      Map.getLayersByName("Routes")[0].removeAllFeatures();
  }
}
