# LoadingSpinner Component

A flexible and reusable loading spinner component for the Book Club frontend application.

## Features

- Multiple sizes (sm, md, lg, xl)
- Customizable colors (primary, accent, neutral, white)
- Optional text display
- Full-screen overlay mode
- Theme-aware (supports dark mode)
- Smooth animations

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Size of the spinner |
| `color` | `'primary' \| 'accent' \| 'neutral' \| 'white'` | `'primary'` | Color theme of the spinner |
| `text` | `string` | `''` | Optional text to display below the spinner |
| `fullScreen` | `boolean` | `false` | Whether to display as a full-screen overlay |
| `className` | `string` | `''` | Additional CSS classes to apply |

## Usage Examples

### Basic Usage
\`\`\`jsx
import LoadingSpinner from '../ui/LoadingSpinner';

// Simple spinner
<LoadingSpinner />

// With text
<LoadingSpinner text="Loading..." />
\`\`\`

### Different Sizes
\`\`\`jsx
<LoadingSpinner size="sm" />
<LoadingSpinner size="md" />
<LoadingSpinner size="lg" />
<LoadingSpinner size="xl" />
\`\`\`

### Different Colors
\`\`\`jsx
<LoadingSpinner color="primary" />
<LoadingSpinner color="accent" />
<LoadingSpinner color="neutral" />
<LoadingSpinner color="white" />
\`\`\`

### Full-Screen Overlay
\`\`\`jsx
<LoadingSpinner 
  fullScreen 
  size="lg" 
  color="primary" 
  text="Loading your data..." 
/>
\`\`\`

### In Buttons
\`\`\`jsx
<button disabled={loading}>
  {loading ? (
    <div className="flex items-center">
      <LoadingSpinner size="sm" color="white" className="mr-2" />
      Loading...
    </div>
  ) : (
    'Submit'
  )}
</button>
\`\`\`

### In Components
\`\`\`jsx
const MyComponent = () => {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner size="lg" color="primary" text="Loading data..." />
      </div>
    );
  }

  return <div>{/* Your content */}</div>;
};
\`\`\`

## Integrated Components

The LoadingSpinner has been integrated into the following components:

- **Signup** - Button loading state
- **Login** - Button loading state  
- **BookClubList** - Page loading state
- **Dashboard** - Page loading state
- **Button** - Built-in loading state
- **CreateBookClub** - Form submission state

## Styling

The component uses Tailwind CSS classes and CSS variables defined in the theme system:

- Responsive to dark/light mode
- Uses theme color variables
- Smooth transitions and animations
- Proper z-index for full-screen mode

## Accessibility

- Uses semantic HTML structure
- Provides visual loading feedback
- Compatible with screen readers through text descriptions
- Proper contrast ratios in all color variants
