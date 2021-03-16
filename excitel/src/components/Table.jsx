import { useEffect, useState } from 'react'
import useLongPress from '../utils/useLongPress';

// Icons & Styles
import filterIcon from '../resources/icons/filter.png';
import '../styles/Button.css'

// Components
import Dropdown from './Dropdown';
import Search from './Search'
import TableContent from './TableContent';
import PageDisplay from './PageDisplay';

// Utils & Constants
import { getEntriesToShow, sortCategory } from '../utils/util';
import { initialCategoriesToShow, filterOptions, initialSortedColumns, itemsPerPageOptions } from "../utils/constants";

const Table = ({ data, handleSearch, handleShowModal }) => {

    const [categoriesToShow, setCategoriesToShow] = useState(initialCategoriesToShow)
    const [isSorted, setIsSorted] = useState(initialSortedColumns)
    const [pagination, setPagination] = useState({
        itemsPerPage: 10,
        currentPage: 1,
        pagesCount: Math.ceil(data.length / 10),
        entries: getEntriesToShow(data, 1, 10)
    })

    useEffect(() => {
        setPagination({
            itemsPerPage: 10,
            currentPage: 1,
            pagesCount: Math.ceil(data.length / 10),
            entries: getEntriesToShow(data, 1, 10)
        })
    }, [data, categoriesToShow])

    const handleCategorySort = e => {
        const type = e.target.name;
        const sortedEntries = sortCategory(isSorted, pagination.entries, type);
        setPagination({
            ...pagination,
            entries: sortedEntries
        })
        setIsSorted({ ...isSorted, [type]: !isSorted[type] })
    }

    const handleItemsPerPage = selection => {
        setPagination({
            itemsPerPage: selection,
            currentPage: 1,
            pagesCount: Math.ceil(data.length / selection),
            entries: getEntriesToShow(data, pagination.currentPage, selection)
        })
    }

    const handlePageSelect = e => {
        const selectedPage = Number(e.target.value);
        const newEntries = getEntriesToShow(data, selectedPage, pagination.itemsPerPage)
        setPagination({
            ...pagination,
            currentPage: selectedPage,
            entries: newEntries
        })
    }

    const handleFilter = categoryName => {
        const targetIndex = categoriesToShow.findIndex(entry => entry.name === categoryName);
        const newCategoriesToShow = [...categoriesToShow];
        if (targetIndex !== -1) {
            newCategoriesToShow.splice(targetIndex, 1);
        } else {
            const target = initialCategoriesToShow.find(entry => entry.name === categoryName)
            newCategoriesToShow.push(target)
        }
        setCategoriesToShow(newCategoriesToShow)
    }

    const longPressProps = useLongPress({
        onLongPress: handleShowModal,
        ms: 1500,
    });

    return (
        <div id='table'>
            <div id="table-header">
                <Dropdown options={itemsPerPageOptions} onChange={handleItemsPerPage} listItemType='text' />
                <Search handleSearch={handleSearch} />
                <Dropdown options={filterOptions} onChange={handleFilter} listItemType='cb' icon={filterIcon} />
            </div>
            <TableContent
                categoriesToShow={categoriesToShow}
                isSorted={isSorted}
                entries={pagination.entries}
                longPressProps={longPressProps}
                handleCategorySort={handleCategorySort}
            />
            <div id="table-footer">
                <PageDisplay pagination={pagination} handlePageSelect={handlePageSelect} />
            </div>

        </div>
    )
};
export default Table;