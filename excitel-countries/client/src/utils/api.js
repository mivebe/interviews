const ENDPOINT = '/.netlify/functions/excitel-api';

const fetchCountries = async (query = '') => {
    const response = await fetch(`${ENDPOINT}?query=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error(`Request failed with ${response.status}`);
    const data = await response.json();
    return Array.isArray(data) ? data : [];
};

export { fetchCountries };
