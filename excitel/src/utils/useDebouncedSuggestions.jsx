import { useState, useEffect } from "react";

const useDebounce = (value, delay) => {

    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            const getData = async () => {
                const response = await fetch(`http://localhost:3001?query=${value}`)
                const data = await response.json()
                setDebouncedValue(data)
            }
            value && getData()
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    },
        [value, delay]
    );
    return debouncedValue;
}
export default useDebounce