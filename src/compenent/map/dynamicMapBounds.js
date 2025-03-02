import { useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";

export const DynamicMapBounds = ({ cases, selectedCase, highlightedCoord }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedCase) {
      const selectedData = cases.find((c) => c.data.id === selectedCase);
      if (selectedData && selectedData.data.coordinates.length) {
        const caseCoords = selectedData.data.coordinates.map((c) => [c.latitude, c.longitude]);
        const bounds = L.latLngBounds(caseCoords);
        map.flyToBounds(bounds, { padding: [50, 50] });
      }
    } else if (cases.length > 0) {
      const allCoords = cases.flatMap((c) => c.data.coordinates.map((coord) => [coord.latitude, coord.longitude]));
      if (allCoords.length) {
        const bounds = L.latLngBounds(allCoords);
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [selectedCase, cases, map]);

  // Images dynamic bounds when hovering 
  /*useEffect(() => {
    if (highlightedCoord) {
        console.log(highlightedCoord);
      map.flyTo([highlightedCoord.latitude, highlightedCoord.longitude], map.getZoom(), { animate: true });
    }
  }, [highlightedCoord, map]);*/

  return null;
};
