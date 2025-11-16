import { useRef, useEffect, useCallback } from 'react';
import { Map, MapRef, Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = "pk.eyJ1IjoidGFraXphd2FhYWEiLCJhIjoiY21pMGdseHV5MHh5YzJ2b2xseXZ2em1mbyJ9.AlCbdIAqHiLEbFI0q1oi3A";
const OWM_API_KEY = "bb408aeec5264c3e59e40a0ac545d87d";

const SPIN_RATE = 50;
const ZOOM_THRESHOLD = 3;

interface MapboxProps {
  coordinates: {
    lon: number;
    lat: number;
  } | null;
}

const Mapbox: React.FC<MapboxProps> = ({ coordinates }) => {
  const INITIAL_VIEW_STATE = {
    longitude: -100,
    latitude: 40,
    zoom: 1,
  };
  const mapRef = useRef<MapRef>(null);
  const isUserInteracting = useRef(false);
  const spinScheduled = useRef(false);

  const spinGlobe = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;
    if (isUserInteracting.current || map.getZoom() > ZOOM_THRESHOLD || map.isMoving()) {
      return;
    }

    const center = map.getCenter();
    center.lng -= SPIN_RATE / 50; // slower, smoother

    // Chain the spin on move end to avoid nested eases
    map.once('moveend', () => {
      spinGlobe();
    });

    map.easeTo({ center, duration: 1000, easing: (n) => n });
  }, []);

  const handleMoveStart = useCallback(() => {
    isUserInteracting.current = true;
  }, []);

  const handleMoveEnd = useCallback(() => {
    isUserInteracting.current = false;
    spinGlobe();
  }, [spinGlobe]);

  const onLoad = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (map) {
      map.setFog({});
      spinGlobe();
    }
  }, [spinGlobe]);

  useEffect(() => {
    if (coordinates) {
      isUserInteracting.current = true;
      mapRef.current?.flyTo({
        center: [coordinates.lon, coordinates.lat],
        zoom: 12,
        duration: 2000,
      });
      // Re-enable spin slightly after the flight completes
      setTimeout(() => {
        isUserInteracting.current = false;
        spinGlobe();
      }, 2500);
    }
  }, [coordinates, spinGlobe]);

  useEffect(() => {
    return () => {};
  }, []);

  return (
    <Map
      ref={mapRef}
      initialViewState={INITIAL_VIEW_STATE}
      onMoveStart={handleMoveStart}
      onMoveEnd={handleMoveEnd}
      style={{ width: '100%', height: '100%' }}
      mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
      projection={{name: 'globe'}}
      mapboxAccessToken={MAPBOX_TOKEN}
      onLoad={onLoad}
    >
      <Source
        id="clouds-source"
        type="raster"
        tiles={[`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${OWM_API_KEY}`]}
        tileSize={256}
      >
        <Layer
          id="clouds-layer"
          type="raster"
          paint={{ 'raster-opacity': 0.5 }}
        />
      </Source>
    </Map>
  );
};

export default Mapbox;
