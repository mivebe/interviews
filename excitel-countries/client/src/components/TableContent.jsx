import TableRow from './TableRow';

const SortIndicator = ({ active, direction }) => {
    if (!active) return <span className="table__sort table__sort--idle" aria-hidden="true">↕</span>;
    return (
        <span className="table__sort" aria-hidden="true">
            {direction === 'asc' ? '↑' : '↓'}
        </span>
    );
};

const TableContent = ({ columns, entries, sort, onSort, onShowDetail, widths, onStartResize }) => {
    const totalWidth = widths.reduce((sum, w) => sum + w, 0);

    return (
        <div className="table__scroll">
            <table className="table__grid" style={{ width: totalWidth }}>
                <colgroup>
                    {widths.map((w, i) => (
                        <col key={columns[i].key} style={{ width: w }} />
                    ))}
                </colgroup>
                <thead>
                    <tr>
                        {columns.map((column, index) => {
                            const isActive = sort.key === column.key;
                            return (
                                <th key={column.key} scope="col" className="table__header-cell">
                                    <button
                                        type="button"
                                        className={`table__sort-button${isActive ? ' is-active' : ''}`}
                                        onClick={() => onSort(column.key)}
                                        aria-sort={isActive ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
                                    >
                                        <span className="table__header-label">{column.label}</span>
                                        <SortIndicator active={isActive} direction={sort.direction} />
                                    </button>
                                    {index < columns.length - 1 && (
                                        <span
                                            className="table__resizer"
                                            onPointerDown={onStartResize(index)}
                                            role="separator"
                                            aria-orientation="vertical"
                                            title="Drag to resize"
                                        />
                                    )}
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody>
                    {entries.length === 0 && (
                        <tr>
                            <td className="table__empty" colSpan={columns.length}>
                                No countries match your filter.
                            </td>
                        </tr>
                    )}
                    {entries.map(entry => (
                        <TableRow
                            key={entry.code}
                            entry={entry}
                            columns={columns}
                            onShowDetail={onShowDetail}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TableContent;
