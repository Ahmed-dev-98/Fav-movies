# Movie Management Frontend

A modern, responsive React frontend for managing your favorite movies and TV shows. Built with TypeScript, Vite, TailwindCSS, and Shadcn UI.

## 🚀 Features

- **Modern UI**: Clean, responsive design with Shadcn UI components
- **Full CRUD Operations**: Add, view, edit, and delete media entries
- **Infinite Scroll**: Seamless pagination for large collections
- **Advanced Search & Filtering**: Search by title, director, description with filters for type, genre, year
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Real-time Feedback**: Toast notifications for all actions
- **Type Safety**: Full TypeScript implementation
- **Form Validation**: Comprehensive validation using Zod and react-hook-form

## 🛠️ Technology Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **UI Components**: Shadcn UI
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Date Handling**: date-fns

## 📦 Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on port 3000

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3000
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Shadcn UI components
│   ├── MediaTable.tsx  # Main table with infinite scroll
│   ├── MediaForm.tsx   # Add/edit form
│   ├── MediaDialog.tsx # Modal wrapper
│   ├── DeleteConfirmDialog.tsx  # Confirmation dialog
│   └── SearchAndFilters.tsx     # Search and filter controls
├── hooks/              # Custom React hooks
│   ├── useMedia.ts     # Media data management
│   └── useMediaMutations.ts     # CRUD operations
├── api/                # API client
│   └── client.ts       # Axios-based API client
├── types/              # TypeScript definitions
│   └── media.ts        # Media-related types
├── lib/                # Utilities
│   └── utils.ts        # Helper functions
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
├── index.css           # Global styles
└── App.css             # Custom utilities
```

## 🎨 Component Overview

### MediaTable

- Responsive table/card layout
- Infinite scroll pagination
- Desktop table view with all details
- Mobile-friendly card view
- Loading and empty states

### MediaForm

- Comprehensive form with all media fields
- Real-time validation with Zod
- Type-safe form handling with react-hook-form
- Support for both create and edit modes

### SearchAndFilters

- Debounced search input
- Advanced filtering by type, genre, year
- Sorting options
- Active filter display with quick removal
- Collapsible filter panel

### MediaDialog

- Modal wrapper for forms
- Handles both create and edit modes
- Loading states during submissions

### DeleteConfirmDialog

- Confirmation dialog for deletions
- Shows media details for confirmation
- Loading state during deletion

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 📱 Responsive Design

The application is fully responsive and adapts to different screen sizes:

- **Desktop (lg+)**: Full table layout with all columns
- **Tablet (md-lg)**: Condensed table with essential columns
- **Mobile (sm)**: Card-based layout optimized for touch

## 🔌 API Integration

The frontend communicates with the backend API through:

- **GET /api/media** - Fetch media with pagination and filters
- **POST /api/media** - Create new media entry
- **PUT /api/media/:id** - Update existing media
- **DELETE /api/media/:id** - Delete media entry
- **GET /api/media/stats/overview** - Get collection statistics

## ✨ Key Features in Detail

### Infinite Scroll

- Automatically loads more content as user scrolls
- Uses Intersection Observer API for performance
- Smooth loading indicators
- "No more items" state when all data is loaded

### Advanced Search

- Real-time search across title, director, and description
- Debounced input (300ms) to reduce API calls
- Persistent search state in URL (future enhancement)

### Smart Filtering

- Multiple filter combinations
- Visual filter badges with quick removal
- Filter state preservation across sessions
- Clear all filters functionality

### Form Validation

- Client-side validation matching backend rules
- Real-time feedback on form fields
- Proper error states and messages
- Type-safe form data handling

### Error Handling

- Graceful error states for network issues
- User-friendly error messages
- Retry functionality for failed requests
- Loading states for all async operations

## 🎯 Performance Optimizations

- **Code Splitting**: Dynamic imports for better loading
- **Memoization**: React.memo and useMemo where appropriate
- **Debounced Search**: Reduces API calls during typing
- **Intersection Observer**: Efficient infinite scroll implementation
- **Optimized Re-renders**: Proper dependency arrays in hooks

## 🔒 Type Safety

Full TypeScript implementation with:

- Strict type checking enabled
- Shared types between frontend and backend
- Zod schemas for runtime validation
- Type-safe API client with proper error handling

## 🚀 Production Build

To build for production:

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment to any static hosting service.

## 🌟 Future Enhancements

- [ ] User authentication integration
- [ ] Drag-and-drop image upload for posters
- [ ] Advanced filtering with date ranges
- [ ] Bulk operations (delete, update)
- [ ] Export functionality (CSV, JSON)
- [ ] Offline support with service workers
- [ ] Dark/light theme toggle
- [ ] Keyboard shortcuts
- [ ] Advanced search with full-text search