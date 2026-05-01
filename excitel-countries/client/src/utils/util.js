const paginate = (entries, currentPage, itemsPerPage) => {
    if (!Array.isArray(entries) || entries.length === 0) return [];
    const safePage = Math.max(1, currentPage);
    const start = (safePage - 1) * itemsPerPage;
    return entries.slice(start, start + itemsPerPage);
};

const sortBy = (entries, key, direction) => {
    if (!key) return entries;
    const factor = direction === 'desc' ? -1 : 1;
    return [...entries].sort((a, b) => {
        const av = a[key] ?? '';
        const bv = b[key] ?? '';
        if (av < bv) return -1 * factor;
        if (av > bv) return 1 * factor;
        return 0;
    });
};

const filterByName = (entries, term) => {
    const t = term.trim().toLowerCase();
    if (!t) return entries;
    return entries.filter(e => (e.name || '').toLowerCase().includes(t));
};

const findByCode = (entries, code) => entries.find(e => e.code === code);

export { paginate, sortBy, filterByName, findByCode };
