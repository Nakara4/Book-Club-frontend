# Follows Redux Slice

This module implements comprehensive Redux state management for user follow/unfollow functionality in the Book Club application.

## Structure

The followsSlice maintains state in the following structure:

```javascript
{
  byUser: { 
    userId: { 
      followers: [],       // Array of follower user objects
      following: [],       // Array of following user objects  
      status: 'idle' | 'loading' | 'error' | 'following' | 'notFollowing',
      followersPagination: { count, currentPage, totalPages, next, previous },
      followingPagination: { count, currentPage, totalPages, next, previous }
    } 
  },
  current: { 
    targets: { 
      [userId]: { 
        isFollowing: boolean,   // Current follow status
        loading: boolean,       // Loading state for follow operations
        error: string | null    // Error message if any
      } 
    } 
  }
}
```

## Async Thunks

### Follow Operations
- **`followUserThunk(userId)`**: Follows a user with optimistic updates
- **`unfollowUserThunk(userId)`**: Unfollows a user with optimistic updates and error rollback

### Data Loading
- **`loadFollowers({ userId, page?, pageSize? })`**: Loads paginated followers list
- **`loadFollowing({ userId, page?, pageSize? })`**: Loads paginated following list  
- **`loadFollowStatus(userId)`**: Loads current follow status for a user

## Features

### Optimistic Updates
- Follow/unfollow operations update UI immediately
- Automatic rollback on API failure
- Enhanced user experience with instant feedback

### Error Handling
- Comprehensive error handling for all operations
- Graceful handling of network errors
- User-friendly error messages

### Pagination Support
- Built-in pagination for followers/following lists
- Configurable page sizes
- Complete pagination metadata

## Selectors

### Basic Selectors
- `selectIsFollowing(state, userId)` - Returns follow status
- `selectFollowLoading(state, userId)` - Returns loading state
- `selectFollowError(state, userId)` - Returns error message
- `selectFollowers(state, userId)` - Returns followers array
- `selectFollowing(state, userId)` - Returns following array
- `selectFollowersCount(state, userId)` - Returns followers count
- `selectFollowingCount(state, userId)` - Returns following count

### Advanced Selectors
- `selectMutualFollows(state, userId, currentUserId)` - Returns mutual follows between users
- `selectIsFollowingUser(state, userId, targetUserId)` - Checks if user follows target
- `selectFollowersPagination(state, userId)` - Returns followers pagination data
- `selectFollowingPagination(state, userId)` - Returns following pagination data

## Actions

### Synchronous Actions
- `clearFollowError(userId)` - Clears error for specific user
- `resetFollowState(userId)` - Resets all state for specific user  
- `clearAllFollowState()` - Clears all follow state

## API Endpoints

The slice integrates with the following API endpoints:
- `POST /users/{userId}/follow/` - Follow user
- `DELETE /users/{userId}/follow/` - Unfollow user
- `GET /users/{userId}/followers/` - Get followers list
- `GET /users/{userId}/following/` - Get following list
- `GET /users/{userId}/follow-status/` - Get follow status

## Usage Example

```javascript
import { useDispatch, useSelector } from 'react-redux';
import {
  followUserThunk,
  unfollowUserThunk,
  loadFollowStatus,
  selectIsFollowing,
  selectFollowLoading,
  selectFollowError
} from './followsSlice';

function FollowButton({ userId }) {
  const dispatch = useDispatch();
  const isFollowing = useSelector(state => selectIsFollowing(state, userId));
  const loading = useSelector(state => selectFollowLoading(state, userId));
  const error = useSelector(state => selectFollowError(state, userId));

  // Load initial follow status
  useEffect(() => {
    dispatch(loadFollowStatus(userId));
  }, [dispatch, userId]);

  const handleToggleFollow = () => {
    if (isFollowing) {
      dispatch(unfollowUserThunk(userId));
    } else {
      dispatch(followUserThunk(userId));
    }
  };

  return (
    <button 
      onClick={handleToggleFollow}
      disabled={loading}
    >
      {loading ? 'Loading...' : isFollowing ? 'Unfollow' : 'Follow'}
      {error && <span className="error">{error}</span>}
    </button>
  );
}
```

## Testing

Comprehensive unit tests are available in `followsSlice.test.js` covering:
- All async thunks (pending, fulfilled, rejected states)
- All selectors with edge cases
- Optimistic updates and error rollbacks
- State mutations and side effects
- Error handling scenarios
- Pagination functionality

## Integration

The followsSlice is already integrated into the main Redux store at `src/app/store.js` and is ready for use throughout the application.

## Profile Component Integration

The Profile component (`src/components/pages/Profile.jsx`) has been updated to use this slice with proper Redux hooks integration and follows all React/Redux best practices.
