import logo from './logo.svg';
import './App.css';
import Map from './compenent/map/map';
import Sidebar from './compenent/sidebar/sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { clearFolderOrder } from './db/casesListDB';
import { clearDatabase } from './db/indexedDB';
import { clearLocalStorageDB } from './db/localStorageDB';
import { setMap } from './redux/Reducers/mapReducer';

function App() {
  const theme = useSelector((state) => state.theme.mode);

  useDispatch(setMap("default"));

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className={`sidebar-container ${theme === "light" ? "light" : "dark"}`}>
        <Sidebar />
      </div>

      {/* Map Container */}
      <div className={`map-container ${theme === "light" ? "light" : "dark"}`}>
        <Map/>
      </div>
    </div>
  );
}

export default App;
