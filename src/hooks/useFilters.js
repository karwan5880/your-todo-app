import { useState, useMemo } from 'react';

/**
 * Custom hook for handling todo filtering logic
 * @param {Array} todos - Array of todos to filter
 * @param {string} searchTerm - Search term to filter by
 * @returns {Object} Filter state and filtered todos
 */
export const useFilters = (todos, searchTerm) => {
  const [showCompleted, setShowCompleted] = useState(true);
  const [showIncomplete, setShowIncomplete] = useState(true);

  // Filter todos based on search and completion status
  const filteredTodos = useMemo(() => {
    if (!Array.isArray(todos)) return [];
    
    const searchLower = searchTerm.toLowerCase();
    
    return todos
      .filter((todo) => {
        // Search filter
        const matchesSearch = !searchTerm || 
          todo.title.toLowerCase().includes(searchLower) ||
          todo.description.toLowerCase().includes(searchLower);

        // Status filter
        const matchesStatus =
          (todo.completed && showCompleted) ||
          (!todo.completed && showIncomplete);

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [todos, searchTerm, showCompleted, showIncomplete]);

  // Check if drag and drop should be enabled
  const isDragEnabled = useMemo(() => 
    searchTerm === "" && showCompleted && showIncomplete, 
    [searchTerm, showCompleted, showIncomplete]
  );

  // Clear all filters
  const clearFilters = () => {
    setShowCompleted(true);
    setShowIncomplete(true);
  };

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => 
    searchTerm !== "" || !showCompleted || !showIncomplete,
    [searchTerm, showCompleted, showIncomplete]
  );

  return {
    // State
    showCompleted,
    showIncomplete,
    
    // Actions
    setShowCompleted,
    setShowIncomplete,
    clearFilters,
    
    // Computed values
    filteredTodos,
    isDragEnabled,
    hasActiveFilters,
    
    // Stats
    totalTodos: todos.length,
    filteredCount: filteredTodos.length,
    completedCount: filteredTodos.filter(t => t.completed).length,
    incompleteCount: filteredTodos.filter(t => !t.completed).length
  };
};