# Book Club React Components

This document describes the React components created for the book club functionality in the frontend application.

## Components Overview

### 1. BookClubList Component (`/components/bookclubs/BookClubList.jsx`)

**Purpose**: Displays a paginated list of all book clubs with search and filtering capabilities.

**Features**:
- Grid layout of book club cards
- Search functionality by name/description
- Category filtering with preset categories
- Pagination support
- Join/Leave club actions
- Responsive design
- Loading states and error handling

**Key Props/State**:
- `bookClubs`: Array of book club objects
- `searchTerm`: Current search query
- `selectedCategory`: Active category filter
- `currentPage`: Current pagination page
- `loading`: Loading state indicator

**API Integration**: Uses `bookClubAPI.getBookClubs()` and `bookClubAPI.joinBookClub()`

### 2. CreateBookClub Component (`/components/bookclubs/CreateBookClub.jsx`)

**Purpose**: Form component for creating new book clubs.

**Features**:
- Comprehensive form with validation
- Image upload support with file size/type validation
- Category selection dropdown
- Meeting frequency options
- Private/public club toggle
- Form error handling and display
- Success navigation to created club

**Form Fields**:
- Name (required, min 3 characters)
- Description (required, min 10 characters)
- Category (required, dropdown selection)
- Max members (optional, 2-1000 range)
- Meeting frequency (weekly, bi-weekly, monthly, quarterly)
- Reading schedule (optional)
- Location (optional)
- Image upload (optional, max 5MB)
- Privacy setting (checkbox)

**API Integration**: Uses `bookClubAPI.createBookClub()` with FormData

### 3. BookClubDetail Component (`/components/bookclubs/BookClubDetail.jsx`)

**Purpose**: Detailed view of a specific book club with member actions.

**Features**:
- Complete club information display
- Member statistics and club stats
- Join/Leave functionality
- Creator-specific actions (Edit/Delete)
- Member-only quick actions
- Creator information sidebar
- Responsive two-column layout

**Displayed Information**:
- Club image, name, and description
- Category and privacy status
- Member count and statistics
- Meeting frequency and location
- Reading schedule
- Creation date and creator info

**User Actions**:
- Join club (non-members)
- Leave club (members, except creator)
- Edit/Delete club (creators only)
- Navigation to discussions, books, members

**API Integration**: Uses `bookClubAPI.getBookClub()`, `bookClubAPI.joinBookClub()`, `bookClubAPI.leaveBookClub()`, `bookClubAPI.deleteBookClub()`

### 4. Navigation Component (`/components/common/Navigation.jsx`)

**Purpose**: Site-wide navigation with authentication awareness.

**Features**:
- Responsive navigation bar
- Authentication state detection
- Conditional menu items based on auth status
- User greeting for authenticated users
- Logout functionality
- Active page highlighting

**Navigation Items**:
- Home (always visible)
- Book Clubs (authenticated users only)
- Login/Signup (non-authenticated users)
- User greeting and logout (authenticated users)

## API Service Integration

All components use the enhanced `api.js` service which includes:

### Book Club API Methods
- `getBookClubs(params)`: Fetch book clubs with filtering
- `getBookClub(id)`: Get specific book club details
- `createBookClub(formData)`: Create new book club
- `updateBookClub(id, formData)`: Update existing club
- `deleteBookClub(id)`: Delete book club
- `joinBookClub(id)`: Join a book club
- `leaveBookClub(id)`: Leave a book club
- `searchBookClubs(query, params)`: Search functionality
- `getUserMemberships()`: Get user's club memberships

### Enhanced Error Handling
- Proper FormData support for image uploads
- Detailed error responses
- Token refresh handling
- Authentication state management

## Routing Structure

```javascript
/bookclubs              -> BookClubList
/bookclubs/create       -> CreateBookClub
/bookclubs/:id          -> BookClubDetail
```

## Styling

Components use **Tailwind CSS** with:
- Responsive grid layouts
- Consistent color scheme (blue primary, gray secondary)
- Hover effects and transitions
- Loading states with spinners
- Form validation styling
- Custom line-clamp utility for text truncation

## State Management

Components use React hooks for state management:
- `useState` for component state
- `useEffect` for API calls and side effects
- `useParams` for route parameters
- `useNavigate` for programmatic navigation

## Error Handling

All components include:
- Try-catch blocks for API calls
- User-friendly error messages
- Loading states during API operations
- Form validation with real-time feedback
- Graceful fallbacks for missing data

## Features Supported

### Core Functionality
✅ List all book clubs with pagination
✅ Search and filter book clubs
✅ Create new book clubs with image upload
✅ View detailed book club information
✅ Join and leave book clubs
✅ Creator permissions (edit/delete)

### UI/UX Features
✅ Responsive design
✅ Loading states
✅ Error handling
✅ Form validation
✅ Image upload with validation
✅ Category filtering
✅ Pagination
✅ Navigation with auth awareness

### Authentication Integration
✅ Token-based authentication
✅ Conditional rendering based on auth status
✅ User-specific actions (join/leave/create)
✅ Creator permissions

## Usage Examples

### Basic Navigation
```javascript
// Navigate to book clubs list
<Link to="/bookclubs">View Book Clubs</Link>

// Create new book club
<Link to="/bookclubs/create">Create Book Club</Link>

// View specific book club
<Link to={`/bookclubs/${clubId}`}>View Club</Link>
```

### API Usage
```javascript
// Fetch book clubs with filters
const clubs = await bookClubAPI.getBookClubs({
  search: 'fiction',
  category: 'Fiction',
  page: 1
});

// Create a new book club
const formData = new FormData();
formData.append('name', 'My Book Club');
formData.append('description', 'A great club for readers');
const newClub = await bookClubAPI.createBookClub(formData);
```

## Dependencies

- React 18+
- React Router Dom
- Tailwind CSS
- Modern browser with FormData support

## Future Enhancements

Potential improvements:
- Real-time member updates
- Book club recommendations
- Advanced search filters
- Member management interface
- Discussion forums integration
- Calendar integration for meetings
- Email invitations
- Book recommendations
- Reading progress tracking

---

These components provide a complete foundation for book club creation and management functionality in the React frontend application.
