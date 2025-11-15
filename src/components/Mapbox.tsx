import { useState, useRef, useEffect, useCallback } from 'react';
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
  const [viewState, setViewState] = useState({
    longitude: -100,
    latitude: 40,
    zoom: 1,
  });
  const mapRef = useRef<MapRef>(null);
  const isUserInteracting = useRef(false);
  const animationFrameId = useRef<number | null>(null);

  const spinGlobe = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map || isUserInteracting.current || map.getZoom() > ZOOM_THRESHOLD) return;

    const center = map.getCenter();
    center.lng -= SPIN_RATE / 100;
    map.easeTo({ center, duration: 100, easing: (n) => n });

    animationFrameId.current = requestAnimationFrame(spinGlobe);
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
      mapRef.current?.flyTo({
        center: [coordinates.lon, coordinates.lat],
        zoom: 12,
        speed: 0.8,
        curve: 1,
        easing: (t) => t,
      });
    }
  }, [coordinates]);

  useEffect(() => {
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <Map
      ref={mapRef}
      {...viewState}
      onMove={evt => setViewState(evt.viewState)}
      onMoveStart={handleMoveStart}
      onMoveEnd={handleMoveEnd}
      style={{ width: '100%', height: '100%' }}
      mapStyle="mapbox://styles/mapbox/dark-v10"
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
