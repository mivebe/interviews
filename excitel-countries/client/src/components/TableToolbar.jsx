import Autocomplete from './Autocomplete';
import { PAGE_SIZE_OPTIONS } from '../utils/constants';

const TableToolbar = ({
    filterTerm,
    onFilterChange,
    pageSize,
    onPageSizeChange,
    onAutocompleteSelect,
}) => (
    <div className="table__toolbar">
        <label className="table__field">
            <span className="table__field-label">Filter by name</span>
            <input
                type="search"
                className="table__input"
                placeholder="Type to filter…"
                value={filterTerm}
                onChange={(e) => onFilterChange(e.target.value)}
            />
        </label>

        <label className="table__field">
            <span className="table__field-label">Find a country</span>
            <Autocomplete onSelect={onAutocompleteSelect} />
        </label>

        <label className="table__field table__field--compact">
            <span className="table__field-label">Per page</span>
            <select
                className="table__select"
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
            >
                {PAGE_SIZE_OPTIONS.map(size => (
                    <option key={size} value={size}>{size}</option>
                ))}
            </select>
        </label>
    </div>
);

export default TableToolbar;
