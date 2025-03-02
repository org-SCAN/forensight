import { useMap } from "react-leaflet";
import "leaflet.heat";
import L from "leaflet";
import { useEffect } from "react";

export const HeatMapLayer = ({ points }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || points.length === 0) return;

    const heatLayer = L.heatLayer(points, {
      radius: 20,
      blur: 15,
      maxZoom: 18,
      minOpacity: 0.5
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
};
