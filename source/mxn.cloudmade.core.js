mxn.register('cloudmade', {	

    Mapstraction: {

        init: function(element, api) {		
            var me = this;		
            var cloudmade = new CM.Tiles.CloudMade.Web({key: cloudmade_key});
            this.maps[api] = new CM.Map(element, cloudmade);
            this.loaded[api] = true;
        },

        applyOptions: function(){
            var map = this.maps[this.api];
            if(this.options.enableScrollWheelZoom){
              map.enableScrollWheelZoom();
            }
        },

        resizeTo: function(width, height){	
            this.maps[this.api].checkResize();
        },

        addControls: function( args ) {
            var map = this.maps[this.api];

	    var c = this.addControlsArgs;
	    switch (c.zoom) {
	      case 'large':
	        this.addLargeControls();
	      break;
	      case 'small':
	        this.addSmallControls();
	      break;
	    }

	    if (c.map_type) {
	      this.addMapTypeControls();
	    }
	    if (c.scale) {
	      map.addControl(new CM.ScaleControl());
	      this.addControlsArgs.scale = true;
	    }
        },

        addSmallControls: function() {
            var map = this.maps[this.api];
	    map.addControl(new CM.SmallMapControl());
	    this.addControlsArgs.zoom = 'small';
        },

        addLargeControls: function() {
            var map = this.maps[this.api];
	    map.addControl(new CM.LargeMapControl());
	    this.addControlsArgs.zoom = 'large';
        },

        addMapTypeControls: function() {
            var map = this.maps[this.api];

	    map.addControl(new CM.TileLayerControl());
	    this.addControlsArgs.map_type = true;
        },

        dragging: function(on) {
            var map = this.maps[this.api];

            if (on) {
              map.enableDragging();
            } else {
              map.disableDragging();
            }
        },

        setCenterAndZoom: function(point, zoom) { 
            var map = this.maps[this.api];
            var pt = point.toProprietary(this.api);
            map.setCenter(pt, zoom);

        },

        addMarker: function(marker, old) {
            var map = this.maps[this.api];
            var pin = marker.toProprietary(this.api);
	    map.addOverlay(pin);
            return pin;
        },

        removeMarker: function(marker) {
            var map = this.maps[this.api];
	    map.removeOverlay(marker.proprietary_marker);
        },

        removeAllMarkers: function() {
	    // Done in mxn.core.js
        },

        declutterMarkers: function(opts) {
            var map = this.maps[this.api];

            // TODO: Add provider code
        },

        addPolyline: function(polyline, old) {
            var map = this.maps[this.api];
            var pl = polyline.toProprietary(this.api);
	    map.addOverlay(pl);
            return pl;
        },

        removePolyline: function(polyline) {
            var map = this.maps[this.api];
            map.removeOverlay(polyline.proprietary_polyline);
        },

        getCenter: function() {
            var map = this.maps[this.api];
            var pt = map.getCenter();

            return new mxn.LatLonPoint(pt.lat(), pt.lng());
        },

        setCenter: function(point, options) {
            var map = this.maps[this.api];
            var pt = point.toProprietary(this.api);
            if(options != null && options.pan) { map.panTo(pt); }
            else { map.setCenter(pt); }
        },

        setZoom: function(zoom) {
            var map = this.maps[this.api];
	    map.setZoom(zoom);
        },

        getZoom: function() {
	    var map = this.maps[this.api];
	    return map.getZoom();
        },

        getZoomLevelForBoundingBox: function( bbox ) {
            var map = this.maps[this.api];
            // NE and SW points from the bounding box.
            var ne = bbox.getNorthEast();
            var sw = bbox.getSouthWest();

	    var zoom = map.getBoundsZoomLevel(new CM.LatLngBounds(sw.toProprietary(this.api), ne.toProprietary(this.api)));
            return zoom;
        },

        setMapType: function(type) {
            var map = this.maps[this.api];

            // TODO: Are there any MapTypes for Cloudmade?

            switch(type) {
                case mxn.Mapstraction.ROAD:
                // TODO: Add provider code
                break;
                case mxn.Mapstraction.SATELLITE:
                // TODO: Add provider code
                break;
                case mxn.Mapstraction.HYBRID:
                // TODO: Add provider code
                break;
                default:
                // TODO: Add provider code
            }	 
        },

        getMapType: function() {
            var map = this.maps[this.api];

            // TODO: Are there any MapTypes for Cloudmade?

            return mxn.Mapstraction.ROAD;
            //return mxn.Mapstraction.SATELLITE;
            //return mxn.Mapstraction.HYBRID;

        },

        getBounds: function () {
            var map = this.maps[this.api];

            var box = map.getBounds();
            var sw = box.getSouthWest();
            var ne = box.getNorthEast();

            return new mxn.BoundingBox(sw.lat(), sw.lng(), ne.lat(), ne.lng());
        },

        setBounds: function(bounds){
            var map = this.maps[this.api];
            var sw = bounds.getSouthWest();
            var ne = bounds.getNorthEast();

	    map.zoomToBounds(new CM.LatLngBounds(sw.toProprietary(this.api), ne.toProprietary(this.api)));
        },

        addImageOverlay: function(id, src, opacity, west, south, east, north, oContext) {
            var map = this.maps[this.api];

            // TODO: Add provider code
        },

        setImagePosition: function(id, oContext) {
            var map = this.maps[this.api];
            var topLeftPoint; var bottomRightPoint;

            // TODO: Add provider code

        },

        addOverlay: function(url, autoCenterAndZoom) {
            var map = this.maps[this.api];

            // TODO: Add provider code

        },

        addTileLayer: function(tile_url, opacity, copyright_text, min_zoom, max_zoom) {
            var map = this.maps[this.api];

            // TODO: Add provider code
        },

        toggleTileLayer: function(tile_url) {
            var map = this.maps[this.api];

            // TODO: Add provider code
        },

        getPixelRatio: function() {
            var map = this.maps[this.api];

            // TODO: Add provider code	
        },

        mousePosition: function(element) {
            var map = this.maps[this.api];

            // TODO: Add provider code	
        }
    },

    LatLonPoint: {

        toProprietary: function() {
	    var cll = new CM.LatLng(this.lat,this.lon);
	    return cll;
        },

        fromProprietary: function(point) {
	    return new mxn.LatLonPoint(point.lat(),point.lng());
        }

    },

    Marker: {

        toProprietary: function() {
	    var pt = this.location.toProprietary(this.api);
	    var options = {};

	    if (this.iconUrl) {
	      var cicon = new CM.Icon();
	      cicon.image = this.iconUrl;
	      if (this.iconSize) {
	        cicon.iconSize = new CM.Size(this.iconSize[0], this.iconSize[1]);
	        if (this.iconAnchor) {
	          cicon.iconAnchor = new CM.Point(this.iconAnchor[0], this.iconAnchor[1]);
	        }
	      }
	      if (this.iconShadowUrl) {
	        cicon.shadow = this.iconShadowUrl;
	        if (this.iconShadowSize) {
	          cicon.shadowSize = new CM.Size(this.iconShadowSize[0], this.iconShadowSize[1]);
	        }
	      }
	      options.icon = cicon;
	    }
	    if (this.labelText) {
 	      options.title = this.labelText;
	    }
	    var cmarker = new CM.Marker(pt, options);

	    if (this.infoBubble) {
	      cmarker.bindInfoWindow(this.infoBubble);
	    }


	    return cmarker;
        },

        openBubble: function() {		
            var pin = this.proprietary_marker;
            pin.openInfoWindow(this.infoBubble);
        },

        hide: function() {
            var pin = this.proprietary_marker;
            pin.hide();
        },

        show: function() {
            var pin = this.proprietary_marker;
            pin.show();
        },

        update: function() {
            // TODO: Add provider code
        }

    },

    Polyline: {

        toProprietary: function() {
            var pts = [];
            var poly;

            for (var i = 0,  length = this.points.length ; i< length; i++){
              pts.push(this.points[i].toProprietary(this.api));
            }
            if (this.closed || pts[0].equals(pts[pts.length-1])) {
              poly = new CM.Polygon(pts, this.color, this.width, this.opacity, this.fillColor || "#5462E3", this.opacity || "0.3");
            } else {
              poly = new CM.Polyline(pts, this.color, this.width, this.opacity);
            }
            return poly;
        },

        show: function() {
	    this.proprietary_polyline.show();
        },

        hide: function() {
	    this.proprietary_polyline.hide();
        }

    }

});