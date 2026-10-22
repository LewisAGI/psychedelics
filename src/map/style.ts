import type { StyleSpecification } from 'maplibre-gl';

/** Same night globe as the history-of-humanity map: Natural Earth land, NASA Blue Marble. */
export function mapStyle(): StyleSpecification {
  return {
    version: 8,
    sources: {
      land: { type: 'geojson', data: '/ne_110m_land.geojson' },
      marble: {
        type: 'raster',
        tiles: [
          'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_ShadedRelief_Bathymetry/default/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpg',
        ],
        tileSize: 256,
        maxzoom: 8,
      },
    },
    layers: [
      { id: 'ocean', type: 'background', paint: { 'background-color': '#071018' } },
      { id: 'land', type: 'fill', source: 'land', paint: { 'fill-color': '#1a2822' } },
      {
        id: 'coast',
        type: 'line',
        source: 'land',
        paint: { 'line-color': '#24362e', 'line-width': 0.6 },
      },
      {
        id: 'marble',
        type: 'raster',
        source: 'marble',
        paint: {
          'raster-saturation': 0.2,
          'raster-contrast': -0.05,
          'raster-brightness-min': 0,
          'raster-brightness-max': 0.92,
        },
      },
    ],
  };
}
