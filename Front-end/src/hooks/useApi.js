import React, { useState, useEffect } from 'react';

const useApi = (endpoint, initialData = []) => {
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const baseUrl = 'http://localhost:4000/api';

    const fetchData = React.useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`${baseUrl}/${endpoint}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const result = await response.json();
            setData(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [endpoint]);

    useEffect(() => {
        fetchData();
    }, [endpoint, fetchData]);

    const postData = async (payload) => {
        try {
            const response = await fetch(`${baseUrl}/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error('Create failed');
            await fetchData(); // Refresh
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        }
    };

    const deleteData = async (id) => {
        try {
            const response = await fetch(`${baseUrl}/${endpoint}/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Delete failed');
            await fetchData(); // Refresh
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        }
    };

    return { data, loading, error, refresh: fetchData, postData, deleteData };
};

export default useApi;
