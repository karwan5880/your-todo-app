import { useTheme } from '../hooks/useTheme';

const IconPagination = ({ currentPage, totalPages, onPageChange }) => {
  const { getThemeClasses } = useTheme();

  if (totalPages <= 1) return null;

  return (
    <div className={`${getThemeClasses('header')} border-t px-4 py-3`}>
      <div className="flex justify-center items-center gap-1">
        {/* First Page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={`p-2 rounded ${
            currentPage === 1 
              ? `${getThemeClasses('textMuted')} cursor-not-allowed` 
              : `${getThemeClasses('buttonSecondary')} hover:bg-gray-100 dark:hover:bg-gray-700`
          }`}
          title="First page"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>

        {/* Previous Page */}
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`p-2 rounded ${
            currentPage === 1 
              ? `${getThemeClasses('textMuted')} cursor-not-allowed` 
              : `${getThemeClasses('buttonSecondary')} hover:bg-gray-100 dark:hover:bg-gray-700`
          }`}
          title="Previous page"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Page Numbers - Responsive */}
        <div className="flex items-center gap-1">
          {/* Mobile: Just current page */}
          <div className="sm:hidden">
            <span className={`px-3 py-2 text-sm ${getThemeClasses('text')}`}>
              {currentPage} / {totalPages}
            </span>
          </div>

          {/* Desktop: Fixed 5 page buttons */}
          <div className="hidden sm:flex items-center gap-1">
            {(() => {
              const maxButtons = 5; // FIXED number of buttons
              const pages = [];
              
              if (totalPages <= maxButtons) {
                // Show all pages if total is <= 5
                for (let i = 1; i <= totalPages; i++) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() => onPageChange(i)}
                      className={`px-3 py-2 text-sm rounded ${
                        currentPage === i ? getThemeClasses('button') : getThemeClasses('buttonSecondary')
                      }`}
                    >
                      {i}
                    </button>
                  );
                }
              } else {
                // Always show EXACTLY 5 buttons
                let start = Math.max(1, currentPage - 2);
                let end = Math.min(totalPages, start + 4);
                
                // Adjust start if we're near the end
                if (end - start < 4) {
                  start = Math.max(1, end - 4);
                }
                
                for (let i = start; i <= end; i++) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() => onPageChange(i)}
                      className={`px-3 py-2 text-sm rounded ${
                        currentPage === i ? getThemeClasses('button') : getThemeClasses('buttonSecondary')
                      }`}
                    >
                      {i}
                    </button>
                  );
                }
              }
              
              return pages;
            })()}
          </div>
        </div>

        {/* Next Page */}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`p-2 rounded ${
            currentPage === totalPages 
              ? `${getThemeClasses('textMuted')} cursor-not-allowed` 
              : `${getThemeClasses('buttonSecondary')} hover:bg-gray-100 dark:hover:bg-gray-700`
          }`}
          title="Next page"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Last Page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded ${
            currentPage === totalPages 
              ? `${getThemeClasses('textMuted')} cursor-not-allowed` 
              : `${getThemeClasses('buttonSecondary')} hover:bg-gray-100 dark:hover:bg-gray-700`
          }`}
          title="Last page"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default IconPagination;