import upArrow from '../resources/icons/up-arrow.png';
import downArrow from '../resources/icons/down-arrow.png';
import '../styles/Table.css'

const TableContent = ({ categoriesToShow, isSorted, entries, longPressProps, handleCategorySort }) => {
    console.log('from TableContent', categoriesToShow);
    return(
    <table className="table-container">
        <thead>
            <tr>
                {categoriesToShow?.map(category =>
                    <th key={category.id}>
                        <button className='category-button' title={category.title} name={category.name} onClick={handleCategorySort}>
                            <p className='category-button_text'>{category.title}</p>
                            {isSorted[category.name] !== undefined && <img className="category-button_arrow" src={!isSorted[category.name] ? upArrow : downArrow} alt='arrow' />}
                        </button>
                    </th>)
                }
            </tr>
        </thead>
        <tbody>
            {entries?.map(entry =>
                <tr key={entry.code} {...longPressProps}>
                    {categoriesToShow?.map(category =>
                        <td key={`${entry.code} ${category.name}`} entryid={entry.code}>{entry[category.name]}</td>
                    )}
                </tr>)
            }
        </tbody>
    </table>
)}
export default TableContent