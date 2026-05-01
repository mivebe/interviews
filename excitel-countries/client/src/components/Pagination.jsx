const buildPageList = (page, pageCount) => {
    if (pageCount <= 7) {
        return Array.from({ length: pageCount }, (_, i) => i + 1);
    }
    const pages = new Set([1, pageCount, page, page - 1, page + 1]);
    if (page <= 3) [2, 3, 4].forEach(p => pages.add(p));
    if (page >= pageCount - 2) [pageCount - 1, pageCount - 2, pageCount - 3].forEach(p => pages.add(p));

    const sorted = [...pages].filter(p => p >= 1 && p <= pageCount).sort((a, b) => a - b);
    const result = [];
    sorted.forEach((p, i) => {
        if (i > 0 && p - sorted[i - 1] > 1) result.push('…');
        result.push(p);
    });
    return result;
};

const Pagination = ({ page, pageCount, onPageChange }) => {
    if (pageCount <= 1) return null;
    const pages = buildPageList(page, pageCount);

    return (
        <nav className="pagination" aria-label="Pagination">
            <button
                type="button"
                className="pagination__button"
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                aria-label="Previous page"
            >
                ‹
            </button>
            {pages.map((p, i) => (
                p === '…'
                    ? <span key={`ellipsis-${i}`} className="pagination__ellipsis">…</span>
                    : (
                        <button
                            key={p}
                            type="button"
                            className={`pagination__button${p === page ? ' is-active' : ''}`}
                            onClick={() => onPageChange(p)}
                            aria-current={p === page ? 'page' : undefined}
                        >
                            {p}
                        </button>
                    )
            ))}
            <button
                type="button"
                className="pagination__button"
                onClick={() => onPageChange(page + 1)}
                disabled={page === pageCount}
                aria-label="Next page"
            >
                ›
            </button>
        </nav>
    );
};

export default Pagination;
