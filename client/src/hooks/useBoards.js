import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/client.js';

export function useBoards() {
  const [boards, setBoards]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setBoards(await api.getBoards());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const createBoard = useCallback(async (title) => {
    const board = await api.createBoard({ title });
    setBoards((prev) => [...prev, board]);
    return board;
  }, []);

  const updateBoard = useCallback(async (id, title) => {
    const board = await api.updateBoard(id, { title });
    setBoards((prev) => prev.map((b) => (b.id === id ? board : b)));
    return board;
  }, []);

  const deleteBoard = useCallback(async (id) => {
    await api.deleteBoard(id);
    setBoards((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const reorderBoards = useCallback(async (ids) => {
    // Optimistic: reorder locally right away
    setBoards((prev) => {
      const idxMap = Object.fromEntries(ids.map((id, i) => [id, i]));
      return [...prev].sort((a, b) => (idxMap[a.id] ?? 999) - (idxMap[b.id] ?? 999));
    });
    try {
      const updated = await api.reorderBoards(ids);
      setBoards(updated);
    } catch {
      load(); // revert on server error
    }
  }, [load]);

  return { boards, loading, error, createBoard, updateBoard, deleteBoard, reorderBoards };
}
