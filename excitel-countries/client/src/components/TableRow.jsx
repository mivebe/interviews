import useLongPress from '../utils/useLongPress';
import { LONG_PRESS_MS } from '../utils/constants';

const TableRow = ({ entry, columns, onShowDetail }) => {
    const { handlers, progress, isPressing } = useLongPress({
        ms: LONG_PRESS_MS,
        onLongPress: () => onShowDetail(entry),
    });

    const remainingSeconds = Math.max(0, ((1 - progress) * LONG_PRESS_MS) / 1000).toFixed(1);

    return (
        <>
            <tr className={`table__row${isPressing ? ' is-pressing' : ''}`} {...handlers}>
                {columns.map(column => {
                    const value = entry[column.key];
                    const text = value == null || value === '' ? '—' : String(value);
                    return (
                        <td
                            key={column.key}
                            className="table__cell"
                            title={text}
                        >
                            <span className="table__cell-text">{text}</span>
                        </td>
                    );
                })}
            </tr>
            {isPressing && (
                <tr className="table__progress-row" aria-hidden="true">
                    <td colSpan={columns.length} className="table__progress-cell">
                        <div className="table__progress-inner">
                            <span className="table__progress-track">
                                <span
                                    className="table__progress-bar"
                                    style={{ transform: `scaleX(${progress})` }}
                                />
                            </span>
                            <span className="table__progress-label">Hold {remainingSeconds}s</span>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
};

export default TableRow;
