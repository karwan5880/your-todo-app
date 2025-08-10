import { memo } from 'react';
import DraggableTodoList from './DraggableTodoList';
import FullCalendarViewOptimized from './FullCalendarViewOptimized';
import { useTheme } from '../hooks/useTheme';

/**
 * Main content area that switches between list and calendar views
 */
const TodoContent = memo(({
  currentView,
  todos,
  paginatedTodos,
  isDragEnabled,
  hasActiveFilters,
  filteredTodos,
  onUpdate,
  onDelete,
  onToggleComplete,
  onReorder,
  onViewTodo,
  onAddTodo,
  clearSearch,
  clearFilters
}) => {
  const { getThemeClasses } = useTheme();

  if (currentView === "calendar") {
    return (
      <div className="h-full">
        {todos.length > 0 ? (
          <FullCalendarViewOptimized
            todos={filteredTodos}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onToggleComplete={onToggleComplete}
            onAddTodo={onAddTodo}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className={`${getThemeClasses("textMuted")} mb-4`}>
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3
                className={`text-lg font-medium ${getThemeClasses(
                  "text"
                )} mb-2`}
              >
                No tasks to show
              </h3>
              <p className={getThemeClasses("textMuted")}>
                Add tasks to see them on the calendar
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-4">
      {/* Drag-and-drop disabled message */}
      {!isDragEnabled && hasActiveFilters && (
        <div className={`${getThemeClasses("card")} border p-3 mb-4 text-center`}>
          <p className={`text-sm ${getThemeClasses("textMuted")}`}>
            🔒 Drag-and-drop is disabled when filters are active.
            <button
              onClick={() => {
                clearSearch();
                clearFilters();
              }}
              className={`ml-1 ${getThemeClasses("textSecondary")} hover:${getThemeClasses("text")} underline`}
            >
              Clear filters
            </button>{" "}
            to enable reordering.
          </p>
        </div>
      )}

      {/* Todo List */}
      {paginatedTodos.length > 0 ? (
        <DraggableTodoList
          todos={paginatedTodos}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
          onReorder={onReorder}
          onViewTodo={onViewTodo}
          isDragEnabled={isDragEnabled}
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className={`${getThemeClasses("textMuted")} mb-4`}>
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <h3
              className={`text-lg font-medium ${getThemeClasses(
                "text"
              )} mb-2`}
            >
              {todos.length === 0 ? "No tasks yet" : "No tasks found"}
            </h3>
            <p className={getThemeClasses("textMuted")}>
              {todos.length === 0
                ? "Tap + to add your first task"
                : "Try adjusting your search or filters"}
            </p>
            {filteredTodos.length === 0 && todos.length > 0 && (
              <button
                onClick={() => {
                  clearSearch();
                  clearFilters();
                }}
                className={`mt-2 ${getThemeClasses("textSecondary")} hover:${getThemeClasses("text")} underline`}
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

TodoContent.displayName = 'TodoContent';

export default TodoContent;