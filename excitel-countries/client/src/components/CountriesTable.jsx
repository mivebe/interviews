import { useEffect, useMemo, useRef, useState } from 'react';

import TableToolbar from './TableToolbar';
import TableContent from './TableContent';
import Pagination from './Pagination';
import { COLUMNS, PAGE_SIZE_OPTIONS } from '../utils/constants';
import { filterByName, paginate, sortBy } from '../utils/util';
import useColumnResize from '../utils/useColumnResize';

import '../styles/Table.css';

const CountriesTable = ({ countries, onShowDetail }) => {
    const [filterTerm, setFilterTerm] = useState('');
    const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState({ key: 'name', direction: 'asc' });
    const sectionRef = useRef(null);
    const { widths, startResize } = useColumnResize(sectionRef, COLUMNS.length);

    const filtered = useMemo(
        () => filterByName(countries, filterTerm),
        [countries, filterTerm],
    );

    const sorted = useMemo(
        () => sortBy(filtered, sort.key, sort.direction),
        [filtered, sort.key, sort.direction],
    );

    const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
    const pageEntries = useMemo(
        () => paginate(sorted, page, pageSize),
        [sorted, page, pageSize],
    );

    useEffect(() => {
        if (page > pageCount) setPage(1);
    }, [page, pageCount]);

    const handleSort = (key) => {
        setSort(prev => {
            if (prev.key !== key) return { key, direction: 'asc' };
            return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
        });
    };

    const handlePageSizeChange = (size) => {
        setPageSize(size);
        setPage(1);
    };

    const handleFilterChange = (term) => {
        setFilterTerm(term);
        setPage(1);
    };

    return (
        <section className="table" ref={sectionRef}>
            <TableToolbar
                filterTerm={filterTerm}
                onFilterChange={handleFilterChange}
                pageSize={pageSize}
                onPageSizeChange={handlePageSizeChange}
                onAutocompleteSelect={onShowDetail}
            />

            <TableContent
                columns={COLUMNS}
                entries={pageEntries}
                sort={sort}
                onSort={handleSort}
                onShowDetail={onShowDetail}
                widths={widths}
                onStartResize={startResize}
            />

            <div className="table__footer">
                <span className="table__count">
                    {sorted.length} {sorted.length === 1 ? 'country' : 'countries'}
                </span>
                <Pagination
                    page={page}
                    pageCount={pageCount}
                    onPageChange={setPage}
                />
            </div>
        </section>
    );
};

export default CountriesTable;
