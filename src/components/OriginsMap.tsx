import { useEffect, useRef } from 'react';
import { LngLatBounds, Marker, Popup, Map as MapLibreMap, setWorkerUrl } from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import 'maplibre-gl/dist/maplibre-gl.css';
import { entryById } from '../content';
import { IconMinus, IconPlus } from '../icons';
import { mapStyle } from '../map/style';
import { ORIGINS } from '../origins';
import { IconButton } from './IconButton';
import { linkedHtml } from './LinkedText';

setWorkerUrl(workerUrl);

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export function OriginsMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const map = new MapLibreMap({
      container,
      style: mapStyle(),
      center: [-40, 18],
      zoom: 1.3,
      minZoom: 0.6,
      maxZoom: 8,
      maxPitch: 0,
      pitchWithRotate: false,
      dragRotate: false,
      touchPitch: false,
      attributionControl: { compact: true, customAttribution: 'NASA Blue Marble · Natural Earth' },
      maplibreLogo: false,
      fadeDuration: 0,
    });
    mapRef.current = map;
    const markers: Marker[] = [];
    let popup: Popup | null = null;

    const setup = () => {
      map.setProjection({ type: 'globe' });
      map.setSky({
        'sky-color': '#070b12',
        'horizon-color': '#8ec5ff',
        'sky-horizon-blend': 0.36,
        'atmosphere-blend': 0.92,
      });
      const bounds = new LngLatBounds();
      for (const origin of ORIGINS) {
        const entry = entryById(origin.id);
        if (!entry) continue;
        const fact = entry.historic_use.find((item) => item.type !== 'uncertain' && item.text.includes(origin.place));
        if (!fact) continue;
        bounds.extend([origin.lng, origin.lat]);
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'pin';
        button.dataset.tip = entry.name;
        button.setAttribute('aria-label', `${entry.name}, ${origin.place}`);
        button.innerHTML = '<span class="dot"></span>';
        markers.push(new Marker({ element: button, anchor: 'center' }).setLngLat([origin.lng, origin.lat]).addTo(map));
        button.addEventListener('click', (event) => {
          event.stopPropagation();
          popup?.remove();
          popup = new Popup({ className: 'event-popup', closeButton: true, maxWidth: '280px', offset: 16 })
            .setLngLat([origin.lng, origin.lat])
            .setHTML(
              `<a class="popup-title" href="/substance/${entry.id}">${escapeHtml(entry.name)}</a>
               <p class="popup-place">${escapeHtml(origin.place)}</p>
               <p class="popup-summary">${linkedHtml(fact.text, entry.id)}</p>`,
            )
            .addTo(map);
        });
      }
      if (!bounds.isEmpty()) map.fitBounds(bounds, { padding: 72, maxZoom: 2.4 });
      container.dataset.ready = 'true';
    };

    map.on('style.load', setup);
    map.on('error', () => {
      map.triggerRepaint();
    });

    return () => {
      popup?.remove();
      markers.forEach((marker) => marker.remove());
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="origins">
      <div id="map" ref={containerRef} data-ready="false" />
      <div className="zoom">
        <IconButton label="Zoom in" onClick={() => mapRef.current?.zoomIn()}>
          <IconPlus />
        </IconButton>
        <IconButton label="Zoom out" onClick={() => mapRef.current?.zoomOut()}>
          <IconMinus />
        </IconButton>
      </div>
    </div>
  );
}
