import { useEffect, useState } from 'react';
import { fetchCountries } from './api';

const useCountries = (initialQuery = '') => {
    const [countries, setCountries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isCancelled = false;
        setIsLoading(true);
        setError(null);

        fetchCountries(initialQuery)
            .then(data => { if (!isCancelled) setCountries(data); })
            .catch(err => { if (!isCancelled) setError(err); })
            .finally(() => { if (!isCancelled) setIsLoading(false); });

        return () => { isCancelled = true; };
    }, [initialQuery]);

    return { countries, isLoading, error };
};

export default useCountries;
