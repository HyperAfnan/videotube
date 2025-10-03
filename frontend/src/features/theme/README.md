# VideoTube Redux Theme Implementation

This module manages the theme state (light/dark mode) for the VideoTube application using Redux.

## Overview

The theme implementation leverages Redux for state management, providing a centralized way to control the application's appearance across all components. The implementation includes:

1. Redux slice for theme state management
2. Theme initializer component for bootstrapping
3. Custom hook for easy access to theme functionality
4. System preference detection and synchronization
5. Theme persistence using localStorage

## Components and Files

### Redux Store

- `themeSlice.js` - Redux slice that manages theme state and provides actions for changing themes
  - Actions: `setTheme`, `toggleTheme`
  - State: `{ theme: 'light' | 'dark' }`

### React Components

- `ThemeInitializer.jsx` - Component that initializes theme on application startup
  - Reads from localStorage or system preferences
  - Listens to system preference changes
  - Sets the initial theme in Redux

### Hooks

- `useThemeRedux.js` - Custom hook for accessing and modifying theme state
  - `theme` - Current theme ('light' or 'dark')
  - `setTheme(theme)` - Set theme explicitly
  - `toggleTheme()` - Toggle between light and dark mode
  - `isDark` - Boolean indicating if current theme is dark
  - `isLight` - Boolean indicating if current theme is light

## Usage

### In Components

To use the theme in your components, import the `useThemeRedux` hook:

```jsx
import { useThemeRedux } from "@Features/theme/hook/useThemeRedux";

function MyComponent() {
  const { theme, toggleTheme } = useThemeRedux();

  return (
    <div className="dark:bg-zinc-900 bg-white">
      <button onClick={toggleTheme}>
        {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      </button>
    </div>
  );
}
```

### Styling with Tailwind

Use Tailwind's dark mode variant for styling:

```jsx
<div className="bg-white dark:bg-zinc-900">
  <p className="text-gray-800 dark:text-zinc-200">This text adapts to theme</p>
</div>
```

## Implementation Details

1. **Initialization**:
   - On application startup, `ThemeInitializer` reads the theme from localStorage or system preferences
   - The theme is set in Redux store and applied to the document root

2. **Theme Switching**:
   - When `toggleTheme` or `setTheme` is called, the Redux action updates the state
   - The reducer also updates localStorage and applies the appropriate classes to the document

3. **System Preference**:
   - The application listens for changes in system color scheme preference
   - If the user hasn't explicitly set a preference, the app follows the system theme

4. **Persistence**:
   - Theme preference is stored in localStorage under the key `videotube-theme`
   - This ensures the user's preference is remembered across sessions

## Integration with Existing App

This theme implementation is integrated with the VideoTube application by:
- Adding the theme reducer to the Redux store
- Including `ThemeInitializer` at the root level in main.jsx
- Using `useThemeRedux` in components that need theme awareness

The implementation follows best practices for Redux state management and provides a clean, reusable approach to theming in React applications.