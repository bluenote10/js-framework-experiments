import React from 'react';
import styled from '@emotion/styled'

import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'MAPBOX_ACCESS_TOKEN';

const OuterDiv = styled.div`
  background: #fff;
  padding-top: 20px;
  padding-left: 20px;
`

const MapDiv = styled.div`
  width: 95%;
  height: 800px;
  border: 1px solid #DDD;
`

interface MapProps {
  tileServer: string
}

class Map extends React.Component<MapProps> {
  private mapContainer: HTMLDivElement | null;
  private map: mapboxgl.Map | null;
  private currentTileServer: string | null;

  constructor(props: MapProps) {
    super(props);
    this.state = {};
    this.mapContainer = null;
    this.map = null;
    this.currentTileServer = null;
  }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer!,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: ["https://a.tile.openstreetmap.de/{z}/{x}/{y}.png"],
          }
        },
        layers: [{
          id: 'osm',
          type: 'raster',
          source: 'osm',
        }],
      },
      //center: [this.state.lng, this.state.lat],
      //zoom: this.state.zoom
    });

    this.map.on("load", m =>
      this.setTileServer(this.props.tileServer)
    )

    /*
    map.on('move', () => {
      this.setState({
        lng: map.getCenter().lng.toFixed(4),
        lat: map.getCenter().lat.toFixed(4),
        zoom: map.getZoom().toFixed(2)
      });
    });
    */

    //(map.getStyle().sources!["osm"] as any).tiles = ["https://a.tile.openstreetmap.de/${z}/${x}/${y}.png"]
  }

  componentWillReceiveProps(nextProps: MapProps) {
    if (this.map != null) {
      if (this.currentTileServer !== nextProps.tileServer) {
        this.setTileServer(nextProps.tileServer)
      }
    }
  }

  setTileServer(tileServer: string) {
    if (this.map != null) {
      this.map.removeLayer("osm");
      this.map.removeSource("osm");
      this.map.addSource("osm", {
        type: 'raster',
        tiles: [tileServer],
      })
      this.map.addLayer({
        id: 'osm',
        type: 'raster',
        source: 'osm',
      })
      this.currentTileServer = tileServer
    }
  }

  render() {
    return (
      <OuterDiv>
        <MapDiv ref={el => this.mapContainer = el} />
      </OuterDiv>
    )
  }
}

export default Map;