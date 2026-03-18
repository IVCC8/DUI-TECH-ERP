import { useState, useEffect, useMemo } from 'react';

const useKpiData = (endpoint) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const baseUrl = 'http://localhost:4000/api/kpis';

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${baseUrl}/${endpoint}`);
                if (!response.ok) throw new Error('Network response was not ok');
                const result = await response.json();
                if (isMounted) setData(result);
            } catch (err) {
                if (isMounted) setError(err.message);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchData();
        return () => { isMounted = false; };
    }, [endpoint]);

    const result = useMemo(() => ({ data, loading, error }), [data, loading, error]);

    return result;
};

export default useKpiData;
