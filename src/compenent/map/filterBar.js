import React from "react";
import "../../css/map/filterBar.css";
import { useDispatch } from "react-redux";
import { updateCaseSelected } from "../../redux/Reducers/caseOpenReducer";
import { FaUser, FaCalendarAlt } from "react-icons/fa";
import useTranslation from "../../utils/translation";

const FilterBar = ({ filters, setFilters, availableTypes, setPolylineClusters }) => {
  const dispatch = useDispatch();
  const t = useTranslation();

  const handleFilterChange = (e) => {
    dispatch(updateCaseSelected(null));
    const { name, value } = e.target;
    if (name === "polyline") {
      setPolylineClusters({});
    }
    setFilters({ ...filters, [name]: value });
  };

  return (
    <div className="filter-bar">
      {/* Sex Filter */}
      <div className="filter-item">
        <label><FaUser /> {t("map.filterBar.sex.field_name") || "Sex"}</label>
        <select name="sex" value={filters.sex} onChange={handleFilterChange}>
          <option value="all">{t("map.filterBar.all") || "All"}</option>
          <option value="man">{t("map.filterBar.sex.man") || "Man"}</option>
          <option value="woman">{t("map.filterBar.sex.woman") || "Woman"}</option>
          <option value="unknown">{t("map.filterBar.sex.unknown") || "Unknown"}</option>
        </select>
      </div>

      {/* Age Filter */}
      <div className="filter-item">
        <label>{t("map.filterBar.age.field_name") || "Age"}</label>
        <select name="age" value={filters.age} onChange={handleFilterChange}>
          <option value="all">{t("map.filterBar.all") || "All"}</option>
          <option value="child">{t("map.filterBar.age.child") || "Child"}</option>
          <option value="adult">{t("map.filterBar.age.adult") || "Adult"}</option>
          <option value="old">{t("map.filterBar.age.old") || "Old"}</option>
        </select>
      </div>

      {/* Types Filter */}
      {availableTypes.length > 0 && (
        <div className="filter-item">
          <label>{t("map.filterBar.types.field_name") || "Types"}</label>
          <select name="types" value={filters.types} onChange={handleFilterChange}>
            <option value="all">{t("map.filterBar.all") || "All"}</option>
            {availableTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      )}

      {/* Start Date Filter */}
      <div className="filter-item">
        <label><FaCalendarAlt /> {t("map.filterBar.startDate") || "Start Date"}</label>
        <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} />
      </div>

      {/* End Date Filter */}
      <div className="filter-item">
        <label><FaCalendarAlt /> {t("map.filterBar.endDate") || "End Date"}</label>
        <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} />
      </div>

      {/* Connection Filter */}

      {/*<div className="filter-item">
        <label><FaFilter /> Connection:</label>
        <select name="polyline" value={filters.polyline} onChange={handleFilterChange}>
          <option value="none">None</option>
          <option value="sex">Sex</option>
          <option value="age">Age</option>
          <option value="types">Types</option>
        </select>
      </div>*/}
    </div>
  );
};

export default FilterBar;
