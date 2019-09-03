var canv = document.getElementById('canvas');
var Module = {
    canvas: canv
};


const CanvasOverlay = L.Layer.extend({

  initialize: function (userDrawFunc, options) {
      this._userDrawFunc = userDrawFunc;
      //L.setOptions(this, options);
  },

  drawing: function (userDrawFunc) {
      this._userDrawFunc = userDrawFunc;
      return this;
  },

  params: function(options){
      //L.setOptions(this, options);
      return this;
  },

  canvas: function () {
      return this._canvas;
  },

  redraw: function () {
      if (!this._frame) {
          this._frame = L.Util.requestAnimFrame(this._redraw, this);
      }
      return this;
  },

  onAdd: function (map) {
      this._map = map;
      this._canvas = L.DomUtil.create('canvas', 'leaflet-heatmap-layer');

      var size = this._map.getSize();
      this._canvas.width = size.x;
      this._canvas.height = size.y;

      var animated = this._map.options.zoomAnimation && L.Browser.any3d;
      L.DomUtil.addClass(this._canvas, 'leaflet-zoom-' + (animated ? 'animated' : 'hide'));


      map._panes.overlayPane.appendChild(this._canvas);

      map.on('moveend', this._reset, this);
      map.on('resize',  this._resize, this);

      if (map.options.zoomAnimation && L.Browser.any3d) {
          map.on('zoomanim', this._animateZoom, this);
      }

      this._reset();
  },

  onRemove: function (map) {
      map.getPanes().overlayPane.removeChild(this._canvas);

      map.off('moveend', this._reset, this);
      map.off('resize', this._resize, this);

      if (map.options.zoomAnimation) {
          map.off('zoomanim', this._animateZoom, this);
      }
      this._canvas = null;

  },

  addTo: function (map) {
      map.addLayer(this);
      return this;
  },

  _resize: function (resizeEvent) {
      this._canvas.width  = resizeEvent.newSize.x;
      this._canvas.height = resizeEvent.newSize.y;
  },
  _reset: function () {
      var topLeft = this._map.containerPointToLayerPoint([0, 0]);
      L.DomUtil.setPosition(this._canvas, topLeft);
      this._redraw();
  },

  _redraw: function () {
      var size     = this._map.getSize();
      var bounds   = this._map.getBounds();
      var zoomScale = (size.x * 180) / (20037508.34  * (bounds.getEast() - bounds.getWest())); // resolution = 1/zoomScale
      var zoom = this._map.getZoom();

      // console.time('process');

      if (this._userDrawFunc) {
          this._userDrawFunc(this,
                              {
                                  canvas   :this._canvas,
                                  bounds   : bounds,
                                  size     : size,
                                  zoomScale: zoomScale,
                                  zoom : zoom,
                                  options: this.options
                             });
      }


      // console.timeEnd('process');

      this._frame = null;
  },

  /*
  _animateZoom: function (e: any) {
      var scale = this._map.getZoomScale(e.zoom),
          offset = this._map._getCenterOffset(e.center)._multiplyBy(-scale).subtract(this._map._getMapPanePos());

      this._canvas.style[L.DomUtil.TRANSFORM] = L.DomUtil.getTranslateString(offset) + ' scale(' + scale + ')';
  }
  */
 // animateZoom was relying on L.DomUtil.getTranslateString which no longer exists.
 // replacing by the updated version from the new "CanvasLayer" repo...
 _animateZoom: function (e) {
    var scale = this._map.getZoomScale(e.zoom);
    // -- different calc of animation zoom  in leaflet 1.0.3 thanks @peterkarabinovic, @jduggan1
    var offset = L.Layer ? this._map._latLngBoundsToNewLayerBounds(this._map.getBounds(), e.zoom, e.center).min :
                          this._map._getCenterOffset(e.center)._multiplyBy(-scale).subtract(this._map._getMapPanePos());

    L.DomUtil.setTransform(this._canvas, offset, scale);
  }

});

const canvasOverlay = function (userDrawFunc, options) {
  return new CanvasOverlay(userDrawFunc, options);
};



var map = L.map('mapid', {preferCanvas: true}).setView([51.505, -0.09], 13);

L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: ['a','b','c']
}).addTo(map);

var overlay = canvasOverlay().addTo(map);
  //.drawing(drawingOnCanvas)

var canvas = overlay.canvas();

Module.canvas = canvas;
