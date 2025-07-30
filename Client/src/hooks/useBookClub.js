import { useState, useEffect, useCallback } from 'react';
import { bookClubAPI } from '../services/api';

export const useBookClub = (clubId) => {
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClub = useCallback(async () => {
    if (!clubId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await bookClubAPI.getBookClub(clubId);
      setClub(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch book club');
    } finally {
      setLoading(false);
    }
  }, [clubId]);

  const joinClub = useCallback(async () => {
    try {
      await bookClubAPI.joinBookClub(clubId);
      await fetchClub(); // Refresh club data
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [clubId, fetchClub]);

  const leaveClub = useCallback(async () => {
    try {
      await bookClubAPI.leaveBookClub(clubId);
      await fetchClub(); // Refresh club data
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [clubId, fetchClub]);

  const updateClub = useCallback(async (updateData) => {
    try {
      const response = await bookClubAPI.updateBookClub(clubId, updateData);
      setClub(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [clubId]);

  useEffect(() => {
    fetchClub();
  }, [fetchClub]);

  return {
    club,
    loading,
    error,
    refetch: fetchClub,
    joinClub,
    leaveClub,
    updateClub,
  };
};

export const useBookClubs = (params = {}) => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pages: 0,
  });

  const fetchClubs = useCallback(async (searchParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookClubAPI.getBookClubs({ ...params, ...searchParams });
      setClubs(response.data.clubs || response.data);
      setPagination(response.data.pagination || {});
    } catch (err) {
      setError(err.message || 'Failed to fetch book clubs');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchClubs();
  }, [fetchClubs]);

  return {
    clubs,
    loading,
    error,
    pagination,
    refetch: fetchClubs,
  };
};
