import { useEffect, useState } from 'react';
import useDebounce from './useDebounce';
import { fetchCountries } from './api';

const useCountrySearch = (term, { delay = 400, limit = 10 } = {}) => {
    const debouncedTerm = useDebounce(term, delay);
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const trimmed = debouncedTerm.trim();
        if (!trimmed) {
            setResults([]);
            setIsLoading(false);
            return undefined;
        }

        let isCancelled = false;
        setIsLoading(true);

        fetchCountries(trimmed)
            .then(data => { if (!isCancelled) setResults(data.slice(0, limit)); })
            .catch(() => { if (!isCancelled) setResults([]); })
            .finally(() => { if (!isCancelled) setIsLoading(false); });

        return () => { isCancelled = true; };
    }, [debouncedTerm, limit]);

    return { results, isLoading };
};

export default useCountrySearch;
