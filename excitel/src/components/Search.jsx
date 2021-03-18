import { useState } from "react"
import useDebouncedSuggestions from '../utils/useDebouncedSuggestions';
import '../styles/Search.css'

const Search = ({ handleSearch }) => {

    const [searchInput, setSearchInput] = useState('')
    const suggestions = useDebouncedSuggestions(searchInput, 1000)

    const handleSuggestionSelection = e => setSearchInput(e.target.getAttribute('value'))

    return (
        <div className="table-header__section">
            <input type='text'
                value={searchInput}
                placeholder={'Search'}
                onChange={e => setSearchInput(e.target.value)}
                onKeyDown={handleSearch(searchInput)}
            />
            {suggestions &&
                <div id='search-dropdown_container'>
                    <div id='search-dropdown'>
                        {suggestions.map(suggestion =>
                            <p
                                key={suggestion.code}
                                onClick={handleSuggestionSelection}
                                value={suggestion.name}
                            >
                                {suggestion.name}
                            </p>
                        )}
                    </div>
                </div>
            }
        </div>
    )
}
export default Search