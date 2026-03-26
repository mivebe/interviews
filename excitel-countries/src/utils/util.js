export const getEntriesToShow = (entries, currentPage, itemsPerPage) => {
    if (currentPage === 0) return undefined
    if (entries.length === 1) return entries.slice(0, 1)
    const start = currentPage === 1 ? 0 : (currentPage - 1) * itemsPerPage
    const end = entries.length - 1 > start + itemsPerPage ?
        start + itemsPerPage :
        entries.length
    return entries.slice(start, end)
}

export const getSingleEntry = (id, entries) => entries.find(entry => entry.code === id)

export const sortCategory = (isSorted, entries, type) => {
    const isAlreadySorted = isSorted[type]

    return !isAlreadySorted ?
        [...entries.sort((a, b) => (a[type] > b[type]) ? 1 : ((b[type] > a[type]) ? -1 : 0))] :
        [...entries.sort((a, b) => (a[type] > b[type]) ? -1 : ((b[type] > a[type]) ? 0 : 1))]
}

