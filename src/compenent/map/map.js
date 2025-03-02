import React, { useState, useMemo, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents, Tooltip } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "../../css/map/map.css";
import "../../css/map/sideBar.css";
import FilterBar from "./filterBar";
import Sidebar from "./sidebar";
import { updateCaseSelected, updateCasesData, updateSidebarState } from "../../redux/Reducers/caseOpenReducer";
import { getCasesByFolder } from "../../db/indexedDB";
import { useSelector, useDispatch } from "react-redux";
import { DynamicMapBounds } from "./dynamicMapBounds";
import { HeatMapLayer } from "./heatMapLayer";

function Map() {
  const centre = [46.603354, 1.8883335];
  const dispatch = useDispatch();

  const caseOpen = useSelector((state) => state.caseOpen.cases);
  const caseSelected = useSelector((state) => state.caseOpen.caseSelected);
  const map = useSelector((state) => state.map.map);
  const theme = useSelector((state) => state.theme.mode);
  const sidebarState = useSelector((state) => state.caseOpen.sidebarState);

  const [caseOpenData, setCaseOpenData] = useState([]);
  const [highlightedCoord, setHighlightedCoord] = useState(null);
  const [highlightedCase, setHighlightedCase] = useState(null);
  const [filters, setFilters] = useState({ sex: "all", age: "all", types: "all", startDate: "", endDate: "", polyline: "none" });
  const [availableTypes, setAvailableTypes] = useState([]);
  const [polylineClusters, setPolylineClusters] = useState({});
  const [test, setTest] = useState(false);


  const filteredCases = useMemo(() => {
    return caseOpenData.filter((caseData) => {
      const data = caseData.data;
      const caseDate = new Date(data.date);
      const startDate = filters.startDate ? new Date(filters.startDate) : null;
      const endDate = filters.endDate ? new Date(filters.endDate) : null;
  
      return (
        (filters.sex === "all" || data.sex === filters.sex) &&
        (filters.age === "all" || data.age === filters.age) &&
        (filters.types === "all" || (Array.isArray(data.types) && data.types.includes(filters.types))) &&
        (!startDate || caseDate >= startDate) &&
        (!endDate || caseDate <= endDate)
      );
    });
  }, [caseOpenData, filters, caseSelected]);

  async function fetchCases() {
    try {
      const folderData = await getCasesByFolder(caseOpen);
      setCaseOpenData(folderData.cases || []);
      setAvailableTypes([
        ...new Set(folderData.cases.flatMap((c) => c.data.types || []))
      ]); 
      setFilters({ sex: "all", age: "all", types: "all", startDate: "", endDate: "", polyline: "none" });
    } catch (error) {
      setCaseOpenData([]);
      console.error("Error getting cases:", error);
    }
  }
  useEffect(() => {
    fetchCases();
  }, [caseOpen]);

  useEffect(() => {
    setPolylineClusters({});
    if (!filters.polyline) return;
  
    const newPolylineClusters = {};
  
    filteredCases.forEach((caseData) => {
      const data = caseData.data;
      const firstCoord = data.coordinates[0];

      if (data[filters.polyline]) {
        if (filters.polyline === "types") {
          data[filters.polyline].forEach((type) => {
            if (!newPolylineClusters[type]) {
              newPolylineClusters[type] = [];
            }
            newPolylineClusters[type].push([firstCoord.latitude, firstCoord.longitude]);
          });
        } else {
          if (!newPolylineClusters[data[filters.polyline]]) {
            newPolylineClusters[data[filters.polyline]] = [];
          }
          newPolylineClusters[data[filters.polyline]].push([firstCoord.latitude, firstCoord.longitude]);
        }
      }
    });
    setPolylineClusters(newPolylineClusters);
  }, [filters.polyline, filteredCases]); 

  const handleMarkerClick = (caseId) => {
    dispatch(updateCaseSelected(caseSelected === caseId ? null : caseId));
    dispatch(updateSidebarState("case"));
  };

  const MapClickHandler = () => {
    useMapEvents({
      click: () => {
        dispatch(updateCaseSelected(null));
        setHighlightedCoord(null);
        setHighlightedCase(null);
        dispatch(updateSidebarState(caseSelected ? "folder" : "closed"));
      },
    });
    return null;
  };

  const createCaseMarkers = () => {
    if (caseSelected) return null;

    return filteredCases.map((caseData) => {
      const data = caseData.data;
      const firstCoord = data.coordinates[0];
      let iconUrl = (map === "default" ? "light" : "dark") +'-sex-' + data.sex + '.png';
      if (filters.polyline === "age") {
        iconUrl = (map === "default" ? "light" : "dark") + '-age-' + data.age + '.png';
      }

      return (
        <>
          <Marker
            key={data.id}
            position={[firstCoord.latitude, firstCoord.longitude]}
            icon={new L.Icon({ iconUrl: iconUrl, iconSize: [40, 40] })}
            eventHandlers={{ 
              click: () => handleMarkerClick(data.id),
              mouseover: () => setTimeout(() => setTest(data.id) , 1000000),//setHighlightedCase(data.id), icon={new L.Icon({ iconUrl: iconUrl, iconSize: highlightedCase === data.id ? [45, 45] : [40, 40] })}
              mouseout: () => setTest(null),//setHighlightedCase(null),
            }}
          >
            <Tooltip direction="top" offset={[0, -30]} opacity={1}>
              <span>{data.tag}</span>
            </Tooltip>
          </Marker>
        </>
      );
    });
  };

  const getColorForPolyline = (key) => {
    if (filters.polyline === "sex") {
      return key === "woman" ? "red" : key === "man" ? "blue" : "black";
    }
  
    if (filters.polyline === "age") {
      return key === "child" ? "green" : key === "adult" ? "yellow" : "orange";
    }
  
    if (filters.polyline === "types") {
      const hash = key.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const hue = hash % 360; 
      return `hsl(${hue}, 80%, 50%)`; 
    }
  
    return "black";
  };  

  const createImages = () => {
    return filteredCases.flatMap((caseData) => {
      const data = caseData.data;
      return (
        <>
          {caseSelected === data.id && (
            <>
              {data.coordinates.map((coord) => (
                <Marker
                  key={coord.id}
                  position={[coord.latitude, coord.longitude]}
                  icon={new L.Icon({ iconUrl: "logo.png", iconSize: highlightedCoord === coord ? [35, 35] : [30, 30] })}
                  eventHandlers={{
                    mouseover: () => setHighlightedCoord(coord),
                    mouseout: () => setHighlightedCoord(null),
                  }}
                >
                </Marker>
              ))}
            </>
          )}
        </>
      );
    });
  };

  const createPolylines = useMemo(() => {
    if (!filters.polyline || caseSelected) return null;
  
    return Object.entries(polylineClusters).map(([key, positions], index) => {
      const midpoint = positions[Math.floor(positions.length / 2)];
  
      return (
        <Polyline 
          key={index} 
          positions={positions} 
          color={getColorForPolyline(key)} 
          weight={6} 
          opacity={0.5} 
          lineCap="round" 
          pane="overlayPane" 
          interactive={true} 
        >
          <Tooltip 
            direction="top" 
            permanent={false} 
            opacity={1} 
            offset={[0, -5]} 
          >
            <span>{key}</span>
          </Tooltip>
        </Polyline>
      );
    });
  }, [polylineClusters, filters.polyline, caseSelected]);
  
  const heatmapData = useMemo(() => {
    return caseOpenData.flatMap((caseData) =>
      caseData.data.coordinates.map((coord) => [coord.latitude, coord.longitude, 1])
    );
  }, [caseOpenData]);

  return (
    <div className="map-container">
      <div className={`map-content`}>
        <FilterBar filters={filters} setFilters={setFilters} availableTypes={availableTypes} setPolylineClusters={setPolylineClusters}/>
        <div className="map-and-sidebar">
          <MapContainer 
            center={centre} 
            zoom={6} 
            scrollWheelZoom={true} 
            placeholder={<div>Loading...</div>}
            className={`leaflet-container ${theme === "light" ? "light" : "dark"}`}
          >
            {map === "heat-map" ? (
              <React.Fragment>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <HeatMapLayer points={heatmapData} />
              </React.Fragment>
            ) : (
              <React.Fragment>
                {map === "default" && (
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                )}
                {/*map === "dark" && (
                  <TileLayer
                    attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
                    className={"test"}
                  />
                )*/}
                {map === "satellite" && (
                  <React.Fragment>
                    <TileLayer
                      attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                      url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    />
                    {/*<TileLayer
                      attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://tiles.stadiamaps.com/tiles/stamen_terrain_labels/{z}/{x}/{y}{r}.png"
                    />*/}
                  </React.Fragment>
                )}
                
                {filters.polyline === "none" ? (
                  <MarkerClusterGroup chunkedLoading={true} disableClusteringAtZoom={9}>
                    {createCaseMarkers()}
                  </MarkerClusterGroup>
                ) : (
                  <React.Fragment>
                    {createCaseMarkers()}
                    {createPolylines}
                  </React.Fragment>
                )}
                {createImages()}
              </React.Fragment>
            )}
            <MapClickHandler />
            <DynamicMapBounds cases={filteredCases} selectedCase={caseSelected} highlightedCoord={highlightedCoord}/>
          </MapContainer>
          {map !== "heat-map" && <Sidebar filteredCases={filteredCases} highlightedCoord={highlightedCoord} setHighlightedCoord={setHighlightedCoord} highlightedCase={highlightedCase} setHighlightedCase={setHighlightedCase}/>}          
        </div>
      </div>
    </div>
  );
}

export default Map;
