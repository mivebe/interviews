import { useEffect, useRef, useState } from 'react';
import useCountrySearch from '../utils/useCountrySearch';

const Autocomplete = ({ onSelect, placeholder = 'Search by name…' }) => {
    const [term, setTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const containerRef = useRef(null);

    const { results, isLoading } = useCountrySearch(term);

    useEffect(() => {
        const handleOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutside);
        return () => document.removeEventListener('mousedown', handleOutside);
    }, []);

    useEffect(() => {
        setActiveIndex(-1);
    }, [results]);

    const handleSelect = (country) => {
        onSelect(country);
        setTerm('');
        setIsOpen(false);
    };

    const handleKeyDown = (event) => {
        if (!isOpen || results.length === 0) return;
        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                setActiveIndex(i => (i + 1) % results.length);
                break;
            case 'ArrowUp':
                event.preventDefault();
                setActiveIndex(i => (i <= 0 ? results.length - 1 : i - 1));
                break;
            case 'Enter':
                event.preventDefault();
                if (activeIndex >= 0) handleSelect(results[activeIndex]);
                break;
            case 'Escape':
                setIsOpen(false);
                break;
            default:
                break;
        }
    };

    const showDropdown = isOpen && term.trim().length > 0;

    return (
        <div className="autocomplete" ref={containerRef}>
            <input
                type="search"
                className="table__input"
                placeholder={placeholder}
                value={term}
                onChange={(e) => { setTerm(e.target.value); setIsOpen(true); }}
                onFocus={() => setIsOpen(true)}
                onKeyDown={handleKeyDown}
                role="combobox"
                aria-expanded={showDropdown}
                aria-autocomplete="list"
                aria-controls="autocomplete-listbox"
            />
            {showDropdown && (
                <ul id="autocomplete-listbox" className="autocomplete__list" role="listbox">
                    {isLoading && <li className="autocomplete__status">Searching…</li>}
                    {!isLoading && results.length === 0 && (
                        <li className="autocomplete__status">No matches</li>
                    )}
                    {!isLoading && results.map((country, index) => (
                        <li
                            key={country.code}
                            role="option"
                            aria-selected={index === activeIndex}
                            className={`autocomplete__item${index === activeIndex ? ' is-active' : ''}`}
                            onMouseEnter={() => setActiveIndex(index)}
                            onMouseDown={(e) => { e.preventDefault(); handleSelect(country); }}
                        >
                            {country.flag && (
                                <img src={country.flag} alt="" className="autocomplete__flag" />
                            )}
                            <span className="autocomplete__name">{country.name}</span>
                            <span className="autocomplete__meta">{country.region}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Autocomplete;
