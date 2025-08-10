# Advanced Todo App

A comprehensive task management application built with Next.js 15, React 19, and Tailwind CSS. Features advanced functionality including CRUD operations, filtering, sorting, pagination, import/export capabilities, and multiple view modes.

## ✨ Features

### Core Functionality
- ✅ **CRUD Operations**: Create, read, update, and delete todos
- ✅ **Categories**: Organize tasks by Work, Personal, or Urgent categories
- ✅ **Due Dates**: Set and track task deadlines with overdue highlighting
- ✅ **Completion Tracking**: Mark tasks as complete/incomplete
- ✅ **Local Storage**: Persistent data across browser sessions

### Advanced Features
- 🔍 **Search & Filter**: Search by keywords, filter by status and category
- 📊 **Sorting**: Sort by due date or creation date (ascending/descending)
- 📄 **Pagination**: Configurable items per page (5, 10, 15, 20)
- 📥 **Import**: Bulk import from CSV and Excel files
- 📤 **Export**: Export all tasks to Excel format
- 📅 **Calendar View**: Visualize tasks by due date with color coding
- 🎯 **Drag & Drop**: Reorder tasks with intuitive drag-and-drop interface

### UI/UX Enhancements
- 📱 **Responsive Design**: Optimized for mobile, tablet, and desktop
- 🎨 **Category Color Coding**: Visual organization with consistent colors
- ⚡ **Performance Optimized**: React.memo, useMemo, and useCallback optimizations
- ♿ **Accessibility**: WCAG 2.1 AA compliant with proper ARIA labels
- 🌟 **Smooth Animations**: Enhanced transitions and hover effects

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd your-todo-app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage

### Basic Operations
1. **Add Task**: Click in the title field and fill out the form
2. **Edit Task**: Click the edit icon on any task
3. **Complete Task**: Check the checkbox next to the task
4. **Delete Task**: Click the delete icon and confirm

### Advanced Features
1. **Search**: Use the search bar to find tasks by title or description
2. **Filter**: Use status and category filters to narrow down tasks
3. **Sort**: Click sort buttons to organize by due date or creation date
4. **Import**: Click "Choose File" to import CSV or Excel files
5. **Export**: Click "Export Tasks" to download all tasks as Excel
6. **View Modes**: Switch between List, Drag & Drop, and Calendar views

### Import Format
Your CSV/Excel files should include these columns:
- **Title** (required): Task title
- **Description**: Task details
- **Category**: Work, Personal, or Urgent
- **Due Date**: YYYY-MM-DD format
- **Completed**: Yes/No or True/False

Download the sample template for the correct format.

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Generate coverage report:
```bash
npm run test:coverage
```

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── globals.css        # Global styles
│   ├── layout.js          # Root layout
│   └── page.js            # Main application page
├── components/            # React components
│   ├── AddTodo.js         # Add task form
│   ├── Calendar.js        # Calendar view
│   ├── DraggableTodoItem.js # Drag-and-drop item
│   ├── DraggableTodoList.js # Drag-and-drop list
│   ├── EditTodo.js        # Edit task form
│   ├── Filters.js         # Search and filter controls
│   ├── ImportExport.js    # Import/export functionality
│   ├── Pagination.js      # Pagination controls
│   ├── TodoItem.js        # Individual task item
│   └── TodoList.js        # Task list container
├── hooks/                 # Custom React hooks
│   └── useTodos.js        # Main state management hook
└── utils/                 # Utility functions
    ├── constants.js       # App constants
    ├── dateUtils.js       # Date formatting utilities
    ├── importExport.js    # File processing utilities
    ├── storage.js         # Local storage utilities
    └── todoUtils.js       # Todo manipulation utilities
```

## 🛠️ Technologies Used

- **Framework**: Next.js 15 with App Router
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4
- **Drag & Drop**: @dnd-kit
- **Calendar**: react-calendar
- **File Processing**: xlsx, papaparse, file-saver
- **Testing**: Jest, React Testing Library
- **State Management**: Custom hooks with local storage

## 🎯 Performance Features

- **React.memo**: Prevents unnecessary re-renders
- **useMemo**: Optimizes expensive calculations (filtering, sorting)
- **useCallback**: Stabilizes event handlers
- **Code Splitting**: Lazy loading for optional features
- **Debounced Search**: Reduces API calls and improves performance

## ♿ Accessibility Features

- **WCAG 2.1 AA Compliant**: Meets accessibility standards
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: Proper ARIA labels and roles
- **Focus Management**: Visible focus indicators
- **Color Contrast**: Minimum 4.5:1 contrast ratio

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📞 Support

For support, please open an issue in the repository or contact the development team.
