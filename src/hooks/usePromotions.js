// src/hooks/usePromotions.js
import { useState, useCallback, useRef } from 'react';
import {
  getActivePromotions,
  getAllPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
} from '../services/promotionsService';

// ─── Public feed hook (infinite scroll) ──────────────────────────────────────

export const useFeedPromotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const lastDocRef = useRef(null);

  const fetchInitial = useCallback(async () => {
    setLoading(true);
    setError(null);
    lastDocRef.current = null;

    const result = await getActivePromotions(null);

    if (result.error) {
      setError(result.error);
    } else {
      setPromotions(result.promotions);
      lastDocRef.current = result.lastVisible;
      setHasMore(result.hasMore);
    }
    setLoading(false);
  }, []);

  const fetchMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);

    const result = await getActivePromotions(lastDocRef.current);

    if (!result.error) {
      setPromotions((prev) => [...prev, ...result.promotions]);
      lastDocRef.current = result.lastVisible;
      setHasMore(result.hasMore);
    }
    setLoadingMore(false);
  }, [loadingMore, hasMore]);

  const retry = fetchInitial;

  return {
    promotions,
    loading,
    loadingMore,
    error,
    hasMore,
    fetchInitial,
    fetchMore,
    retry,
  };
};

// ─── Admin hook (CRUD) ────────────────────────────────────────────────────────

export const useAdminPromotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');

  const fetchAll = useCallback(async (status = filterStatus, sort = sortOrder) => {
    setLoading(true);
    setError(null);
    const result = await getAllPromotions(status, sort);
    if (result.error) {
      setError(result.error);
    } else {
      setPromotions(result.promotions);
    }
    setLoading(false);
  }, [filterStatus, sortOrder]);

  const handleFilterChange = useCallback((status) => {
    setFilterStatus(status);
    fetchAll(status, sortOrder);
  }, [fetchAll, sortOrder]);

  const handleSortChange = useCallback((sort) => {
    setSortOrder(sort);
    fetchAll(filterStatus, sort);
  }, [fetchAll, filterStatus]);

  const create = useCallback(async (data, imageFile, onProgress) => {
    const result = await createPromotion(data, imageFile, onProgress);
    if (!result.error) {
      await fetchAll();
    }
    return result;
  }, [fetchAll]);

  const update = useCallback(async (id, data, imageFile, onProgress) => {
    const result = await updatePromotion(id, data, imageFile, onProgress);
    if (!result.error) {
      await fetchAll();
    }
    return result;
  }, [fetchAll]);

  const remove = useCallback(async (id) => {
    const result = await deletePromotion(id);
    if (!result.error) {
      setPromotions((prev) => prev.filter((p) => p.id !== id));
    }
    return result;
  }, []);

  return {
    promotions,
    loading,
    error,
    filterStatus,
    sortOrder,
    fetchAll,
    handleFilterChange,
    handleSortChange,
    create,
    update,
    remove,
  };
};
