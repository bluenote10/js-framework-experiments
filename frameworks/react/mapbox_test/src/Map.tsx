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

class Map extends React.Component {
  private mapContainer: HTMLDivElement | null;

  constructor(props: {}) {
    super(props);
    this.state = {};
    this.mapContainer = null;
  }

  componentDidMount() {
    const map = new mapboxgl.Map({
      container: this.mapContainer!,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
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

    map.on('move', () => {
      /*
      this.setState({
        lng: map.getCenter().lng.toFixed(4),
        lat: map.getCenter().lat.toFixed(4),
        zoom: map.getZoom().toFixed(2)
      });
      */
    });
  }

  render() {
    return (
      <OuterDiv>
        <MapDiv ref={el => this.mapContainer = el} className='mapContainer' />
      </OuterDiv>
    )
  }
}

export default Map;