# User Follow System

## Overview
New user follow functionality allowing users to follow/unfollow each other with real-time updates.

## Key Features
- Follow/unfollow users with optimistic updates
- Real-time WebSocket notifications
- Paginated followers/following lists
- Profile integration with follower counts
- Responsive design with accessibility support

## Components Added
- `FollowButton` - Reusable follow/unfollow button
- `UserCard` - User display with follow functionality
- `FollowsLists` - Paginated user lists
- `followsSlice` - Redux state management

## API Endpoints
- `POST /api/follows/` - Follow user
- `DELETE /api/follows/{id}/` - Unfollow user  
- `GET /api/follows/followers/` - Get followers list
- `GET /api/follows/following/` - Get following list

## Usage

### Follow Button
```jsx
import { FollowButton } from '../features/follows/components';

<FollowButton 
  targetUserId={userId}
  size="md"
  variant="primary"
/>
```

### Profile Integration
The Profile page now includes followers/following tabs that automatically load user connections.

## Testing
Run the follow flow tests: `npm test -- followFlow.test.js`

## Branch Workflow
Each developer should create feature branches from `dev` and submit PRs for review.
