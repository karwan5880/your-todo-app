import { useState, useRef, useEffect, useMemo, useCallback, memo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useTheme } from "../hooks/useTheme";
import { isOverdue } from "../utils/dateUtils";
import TodoModal from "./TodoModal";
import AddTodoQuick from "./AddTodoQuick";
import moment from "moment";
import '../styles/fullcalendar-theme.css';

const FullCalendarViewOptimized = memo(({
  todos,
  onUpdate,
  onDelete,
  onToggleComplete,
  onAddTodo,
}) => {
  // Safety check for todos prop
  if (!todos || !Array.isArray(todos)) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading calendar...</p>
        </div>
      </div>
    );
  }

  const { getThemeClasses } = useTheme();
  const calendarRef = useRef(null);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDateTodos, setShowDateTodos] = useState(false);
  const [selectedDateTodos, setSelectedDateTodos] = useState([]);
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [showMiniCalendar, setShowMiniCalendar] = useState(false);
  const [tooltipEvent, setTooltipEvent] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [currentView, setCurrentView] = useState('dayGridMonth');
  const [calendarTitle, setCalendarTitle] = useState('');

  // Memoized theme detection
  const isDarkTheme = useMemo(() => 
    getThemeClasses("header").includes("bg-gray-800"), 
    [getThemeClasses]
  );

  // Apply theme classes to calendar elements
  useEffect(() => {
    const themeClass = isDarkTheme ? 'dark-theme' : 'light-theme';
    
    // Apply theme to calendar elements
    const applyThemeClasses = () => {
      const elements = [
        '.fc-toolbar',
        '.fc-toolbar-title',
        '.fc-button',
        '.fc-daygrid-day',
        '.fc-timegrid-slot',
        '.fc-daygrid-week-number',
        '.fc-daygrid-day-number',
        '.fc-day-today',
        '.fc-timegrid-slot-label',
        '.fc-timegrid-axis',
        '.fc-timegrid-body::-webkit-scrollbar-track',
        '.fc-timegrid-body::-webkit-scrollbar-thumb'
      ];

      elements.forEach(selector => {
        const els = document.querySelectorAll(selector);
        els.forEach(el => {
          el.classList.remove('dark-theme', 'light-theme');
          el.classList.add(themeClass);
        });
      });
    };

    // Apply immediately and after a short delay for dynamic elements
    applyThemeClasses();
    const timeoutId = setTimeout(applyThemeClasses, 100);

    return () => clearTimeout(timeoutId);
  }, [isDarkTheme]);

  // Memoized keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger shortcuts when typing in inputs
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

      const calendar = calendarRef.current?.getApi();
      if (!calendar) return;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          calendar.prev();
          break;
        case "ArrowRight":
          e.preventDefault();
          calendar.next();
          break;
        case "ArrowUp":
          e.preventDefault();
          if (e.shiftKey) {
            calendar.changeView("dayGridMonth");
          }
          break;
        case "ArrowDown":
          e.preventDefault();
          if (e.shiftKey) {
            calendar.changeView("timeGridDay");
          } else {
            calendar.changeView("timeGridWeek");
          }
          break;
        case "t":
        case "T":
          e.preventDefault();
          calendar.today();
          break;
        case "n":
        case "N":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setSelectedDate(new Date());
            setShowAddModal(true);
          }
          break;
        case "m":
        case "M":
          e.preventDefault();
          setShowMiniCalendar(!showMiniCalendar);
          break;
        case "Escape":
          e.preventDefault();
          setSelectedTodo(null);
          setShowAddModal(false);
          setShowDateTodos(false);
          setHoveredEvent(null);
          setTooltipEvent(null);
          setShowMiniCalendar(false);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showMiniCalendar]);

  // Memoized category color function
  const getCategoryColor = useCallback((category) => {
    const colorMap = {
      Work: "#ea580c",
      Personal: "#3b82f6", 
      Urgent: "#dc2626",
    };
    return colorMap[category] || "#6366f1";
  }, []);

  // Memoized todos with dates
  const todosWithDates = useMemo(() => 
    todos.filter(todo => todo && todo.dueDate && todo.id),
    [todos]
  );

  // Memoized smart time handling
  const getSmartTime = useCallback((todo) => {
    const dueDate = moment(todo.dueDate);

    if (todo.dueTime || dueDate.hour() !== 0 || dueDate.minute() !== 0) {
      return {
        start: dueDate.toDate(),
        end: dueDate.clone().add(1, "hour").toDate(),
        allDay: false,
      };
    }

    const title = todo.title.toLowerCase();
    const category = todo.category.toLowerCase();

    // Morning tasks (8-11 AM)
    if (
      title.includes("morning") ||
      title.includes("breakfast") ||
      title.includes("workout") ||
      title.includes("exercise")
    ) {
      return {
        start: dueDate.clone().hour(8).minute(0).toDate(),
        end: dueDate.clone().hour(9).minute(0).toDate(),
        allDay: false,
      };
    }

    // Work tasks (9 AM - 5 PM)
    if (
      category === "work" ||
      title.includes("meeting") ||
      title.includes("call") ||
      title.includes("presentation")
    ) {
      const hour = title.includes("meeting") || title.includes("call") ? 10 : 9;
      const duration = title.includes("meeting") || title.includes("call") ? 1 : 2;
      return {
        start: dueDate.clone().hour(hour).minute(0).toDate(),
        end: dueDate.clone().hour(hour + duration).minute(0).toDate(),
        allDay: false,
      };
    }

    // Evening tasks (6-9 PM)
    if (
      title.includes("evening") ||
      title.includes("dinner") ||
      title.includes("family") ||
      title.includes("relax")
    ) {
      return {
        start: dueDate.clone().hour(18).minute(0).toDate(),
        end: dueDate.clone().hour(19).minute(0).toDate(),
        allDay: false,
      };
    }

    // Urgent tasks - current time or next available slot
    if (category === "urgent") {
      const now = moment();
      const urgentTime = dueDate.isSame(now, "day")
        ? now.clone().add(30, "minutes")
        : dueDate.clone().hour(9).minute(0);
      return {
        start: urgentTime.toDate(),
        end: urgentTime.clone().add(1, "hour").toDate(),
        allDay: false,
      };
    }

    // Default: 2 PM for 1 hour
    return {
      start: dueDate.clone().hour(14).minute(0).toDate(),
      end: dueDate.clone().hour(15).minute(0).toDate(),
      allDay: false,
    };
  }, []);

  // Memoized color brightness adjustment
  const adjustColorBrightness = useCallback((hex, percent) => {
    const num = parseInt(hex.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;
    return (
      "#" +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  }, []);

  // Memoized events
  const events = useMemo(() => 
    todosWithDates
      .filter(todo => todo && todo.id)
      .map(todo => {
        const color = getCategoryColor(todo.category);
        const isTaskOverdue = isOverdue(todo.dueDate) && !todo.completed;
        const timeInfo = getSmartTime(todo);

        const gradientStart = todo.completed ? "#10b981" : color;
        const gradientEnd = todo.completed
          ? "#059669"
          : adjustColorBrightness(color, -20);

        const isAllDay = todo.allDay !== false;

        return {
          id: todo.id,
          title: todo.completed ? `✓ ${todo.title}` : todo.title,
          start: isAllDay ? todo.dueDate : timeInfo.start,
          end: isAllDay ? undefined : timeInfo.end,
          allDay: isAllDay,
          backgroundColor: `linear-gradient(135deg, ${gradientStart} 0%, ${gradientEnd} 100%)`,
          borderColor: gradientEnd,
          textColor: "#ffffff",
          extendedProps: {
            todo: todo,
            isOverdue: isTaskOverdue,
            category: todo.category,
            completed: todo.completed,
            duration: isAllDay
              ? null
              : moment(timeInfo.end).diff(moment(timeInfo.start), "minutes"),
            smartTime: timeInfo,
          },
          classNames: [
            "custom-event",
            ...(isTaskOverdue ? ["overdue-event"] : []),
            ...(todo.completed ? ["completed-event"] : []),
            `category-${todo.category.toLowerCase()}`,
            ...(isAllDay ? ["all-day-event"] : ["timed-event"]),
          ],
        };
      }),
    [todosWithDates, getCategoryColor, getSmartTime, adjustColorBrightness]
  );

  // Memoized event handlers
  const handleEventClick = useCallback((clickInfo) => {
    const todo = clickInfo.event.extendedProps?.todo;
    if (!todo) return;
    setSelectedTodo(todo);
  }, []);

  const handleEventMouseEnter = useCallback((mouseEnterInfo) => {
    if (window.matchMedia('(hover: none)').matches) return;
    
    const { event, jsEvent } = mouseEnterInfo;
    const todo = event.extendedProps?.todo;

    if (!todo) return;

    setHoveredEvent(todo);
    setTooltipEvent(todo);
    setTooltipPosition({
      x: jsEvent.clientX,
      y: jsEvent.clientY,
    });
  }, []);

  const handleEventMouseLeave = useCallback(() => {
    setTimeout(() => {
      setHoveredEvent(null);
      setTooltipEvent(null);
    }, 800);
  }, []);

  const handleDateClick = useCallback((dateClickInfo) => {
    const clickedDate = dateClickInfo.date;
    const calendar = calendarRef.current?.getApi();
    
    if (calendar) {
      calendar.changeView('timeGridDay', clickedDate);
      setCurrentView('timeGridDay');
      // Update title after view and date change
      setTimeout(() => {
        setCalendarTitle(calendar.view.title);
      }, 100);
    }
  }, []);

  // Handle view changes and title updates
  const handleViewChange = useCallback((view) => {
    setCurrentView(view);
    const calendar = calendarRef.current?.getApi();
    if (calendar) {
      calendar.changeView(view);
      // Update title after view change
      setTimeout(() => {
        setCalendarTitle(calendar.view.title);
      }, 100);
    }
  }, []);

  // Update calendar title when calendar loads or changes
  useEffect(() => {
    const updateTitle = () => {
      const calendar = calendarRef.current?.getApi();
      if (calendar) {
        setCalendarTitle(calendar.view.title);
        setCurrentView(calendar.view.type);
      }
    };

    // Update title after calendar renders
    const timeoutId = setTimeout(updateTitle, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  // Custom header with triangle button layout
  const headerToolbar = useMemo(() => ({
    left: "",
    center: "title",
    right: "",
  }), []);

  // Memoized button text
  const buttonText = useMemo(() => ({
    month: "M",
    week: "W", 
    day: "D",
    today: "Today",
  }), []);

  return (
    <div className="h-full relative">
      <div className={`h-full ${getThemeClasses("card")} rounded-xl p-4 overflow-hidden`}>
        {/* Custom Triangle Button Layout */}
        <div className="mb-4 flex justify-between items-start">
          {/* Left Triangle Formation */}
          <div className="triangle-nav-left flex flex-col gap-2">
            {/* Top row - Today button (centered with more padding) */}
            <div className="flex justify-center mb-1">
              <button
                onClick={() => {
                  const calendar = calendarRef.current?.getApi();
                  if (calendar) {
                    calendar.today();
                    setTimeout(() => setCalendarTitle(calendar.view.title), 100);
                  }
                }}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold text-sm hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Today
              </button>
            </div>
            {/* Bottom row - Prev and Next buttons */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  const calendar = calendarRef.current?.getApi();
                  if (calendar) {
                    calendar.prev();
                    setTimeout(() => setCalendarTitle(calendar.view.title), 100);
                  }
                }}
                className={`px-4 py-2 ${getThemeClasses("buttonSecondary")} rounded-lg text-sm font-medium hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md min-w-[44px]`}
              >
                ←
              </button>
              <button
                onClick={() => {
                  const calendar = calendarRef.current?.getApi();
                  if (calendar) {
                    calendar.next();
                    setTimeout(() => setCalendarTitle(calendar.view.title), 100);
                  }
                }}
                className={`px-4 py-2 ${getThemeClasses("buttonSecondary")} rounded-lg text-sm font-medium hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md min-w-[44px]`}
              >
                →
              </button>
            </div>
          </div>

          {/* Center - Calendar Title */}
          <div className="flex-1 text-center px-4 mt-2">
            <h2 className={`text-xl font-bold ${getThemeClasses("text")}`}>
              {calendarTitle}
            </h2>
          </div>

          {/* Right Triangle Formation */}
          <div className="triangle-nav-right flex flex-col gap-2">
            {/* Top row - Month button (centered with more padding) */}
            <div className="flex justify-center mb-1">
              <button
                onClick={() => handleViewChange('dayGridMonth')}
                className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 ${
                  currentView === 'dayGridMonth'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
                }`}
              >
                M
              </button>
            </div>
            {/* Bottom row - Week and Day buttons */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => handleViewChange('timeGridWeek')}
                className={`px-4 py-2 rounded-lg text-sm font-medium hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md min-w-[44px] ${
                  currentView === 'timeGridWeek'
                    ? getThemeClasses("button")
                    : getThemeClasses("buttonSecondary")
                }`}
              >
                W
              </button>
              <button
                onClick={() => handleViewChange('timeGridDay')}
                className={`px-4 py-2 rounded-lg text-sm font-medium hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md min-w-[44px] ${
                  currentView === 'timeGridDay'
                    ? getThemeClasses("button")
                    : getThemeClasses("buttonSecondary")
                }`}
              >
                D
              </button>
            </div>
          </div>
        </div>

        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={false}
          buttonText={buttonText}
          events={events}
          eventClick={handleEventClick}
          eventMouseEnter={handleEventMouseEnter}
          eventMouseLeave={handleEventMouseLeave}
          dateClick={handleDateClick}
          height="100%"
          dayMaxEvents={4}
          moreLinkClick={(info) => {
            const date = info.date;
            const dateKey = moment(date).format("YYYY-MM-DD");
            const todosForDate = todosWithDates.filter(
              (todo) => moment(todo.dueDate).format("YYYY-MM-DD") === dateKey
            );
            setSelectedDateTodos(todosForDate);
            setSelectedDate(date);
            setShowDateTodos(true);
            return "popover";
          }}
          eventDisplay="block"
          displayEventTime={true}
          scrollTime="08:00:00"
          slotMinTime="00:00:00"
          slotMaxTime="23:30:00"
          slotDuration="00:30:00"
          allDaySlot={true}
          nowIndicator={false}
          selectable={false}
          editable={false}
          weekNumbers={true}
          weekNumberFormat={{ week: "numeric" }}
          dayHeaderFormat={{ weekday: "short" }}
          slotLabelFormat={{
            hour: "numeric",
            minute: "2-digit",
            omitZeroMinute: false,
            meridiem: "short",
          }}
          eventTimeFormat={{
            hour: "numeric",
            minute: "2-digit",
            meridiem: "short",
          }}
        />
      </div>

      {/* Todo Detail Modal */}
      {selectedTodo && (
        <TodoModal
          todo={selectedTodo}
          onClose={() => setSelectedTodo(null)}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
        />
      )}

      {/* Add Todo Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md">
            <AddTodoQuick
              selectedDate={selectedDate}
              onAddTodo={(todoData) => {
                onAddTodo(todoData);
                setShowAddModal(false);
              }}
              onCancel={() => setShowAddModal(false)}
            />
          </div>
        </div>
      )}

      {/* Date Todos Modal */}
      {showDateTodos && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${getThemeClasses("card")} rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden`}>
            <div className={`p-6 border-b ${getThemeClasses("card")}`}>
              <div className="flex items-center justify-between">
                <h3 className={`text-lg font-semibold ${getThemeClasses("text")}`}>
                  Tasks for {selectedDate && moment(selectedDate).format("MMMM D, YYYY")}
                </h3>
                <button
                  onClick={() => setShowDateTodos(false)}
                  className={`p-2 ${getThemeClasses("textMuted")} hover:${getThemeClasses("text")} transition-colors`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-96 space-y-3">
              {selectedDateTodos
                .filter((todo) => todo && todo.id)
                .map((todo) => {
                  const color = getCategoryColor(todo.category);
                  return (
                    <div
                      key={todo.id}
                      className={`p-3 rounded-lg border-l-4 ${getThemeClasses("card")} hover:shadow-md transition-shadow cursor-pointer`}
                      style={{ borderLeftColor: color }}
                      onClick={() => {
                        setSelectedTodo(todo);
                        setShowDateTodos(false);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className={`font-medium ${getThemeClasses("text")} ${todo.completed ? "line-through" : ""}`}>
                          {todo.title}
                        </h4>
                        {todo.completed && (
                          <span className="text-green-500 text-sm">✓</span>
                        )}
                      </div>
                      {todo.description && (
                        <p className={`text-sm ${getThemeClasses("textMuted")} mt-1 ${todo.completed ? "line-through" : ""}`}>
                          {todo.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full text-white`} style={{ backgroundColor: color }}>
                          {todo.category}
                        </span>
                        {isOverdue(todo.dueDate) && !todo.completed && (
                          <span className="text-red-500 text-xs font-medium">Overdue</span>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

FullCalendarViewOptimized.displayName = 'FullCalendarViewOptimized';

export default FullCalendarViewOptimized;