# 🚀 Frontend Revamp & Transition Guide

**Project:** Videotube Frontend  
**Date:** January 10, 2026  
**Goal:** Modernize architecture with shadcn, eliminate duplicates, standardize state management

---

## 📊 Current State Analysis

### ✅ Already Good
- Feature-based folder structure
- React Query (@tanstack/react-query) for server state
- Redux Toolkit for client state
- Path aliases configured (`@Features`, `@Shared`, etc.)
- Tailwind CSS v4
- React Router v7
- Modern React 19

### ⚠️ Issues to Address
- **Duplicate components** (VideoCard, ShadcnVideoCard, SkeletonVideoCard, ShadcnSkeletonVideoCard)
- **Mixed UI libraries** (@base-ui-components, custom Menu, shadcn components)
- **Inconsistent naming** (`hook/` vs `hooks/`, `Userslice.js` vs `authSlice.js`)
- **State management overlap** (Redux slices for server data that should use React Query)
- **Legacy dependencies** (react-loading-skeleton, @floating-ui/react)
- **Manual dark mode handling** (DarkModeContainer with custom logic)

---

## 🎯 Architecture Decisions

### **State Management Strategy**

| State Type | Tool | Location | Examples |
|------------|------|----------|----------|
| **Client State** | Redux Toolkit | `features/*/store/` | Auth, theme, UI state (modals, sidebar) |
| **Server State** | TanStack Query | `features/*/hooks/` | Videos, playlists, users, comments |
| **API Layer** | Pure Functions | `features/*/services/` | Fetch functions, no state |

### **Page Organization**
- **Keep pages in features** (Option 1 from our discussion)
- Each feature with routes gets a `pages/` folder
- All page components end with `Page` suffix
- Simple utility pages (404, Error) can go in top-level `src/pages/` if needed

### **UI Components**
- **shadcn** as the single source of truth for UI primitives
- Remove all competing UI libraries
- Standardize on shadcn patterns (Card, Dropdown, Skeleton, etc.)

---

## 📂 New Directory Structure

```
src/
├── components/                    # shadcn UI components only # done
│   └── ui/
│       ├── button.jsx
│       ├── dropdown-menu.jsx
│       ├── skeleton.jsx
│       ├── card.jsx
│       ├── avatar.jsx
│       ├── badge.jsx
│       ├── dialog.jsx
│       ├── toast.jsx
│       ├── sheet.jsx
│       ├── input.jsx
│       ├── label.jsx
│       ├── form.jsx
│       └── ... (other shadcn components)
│
├── lib/
│   ├── utils.js                   # cn() utility
│   └── queryClient.js             # TanStack Query configuration
│
├── store/
│   ├── store.js                   # Redux store (minimal slices)
│   └── index.js                   # Store exports
│
├── shared/
│   ├── components/
│   │   ├── Layout.jsx
│   │   ├── Container.jsx          # Page wrapper
│   │   ├── ProtectedRoute.jsx
│   │   ├── LazyImage.jsx          # Optional: keep if custom logic needed
│   │   └── header/
│   │       ├── Header.jsx
│   │       ├── Logo.jsx
│   │       ├── SearchBar.jsx
│   │       ├── ProfilePic.jsx
│   │       └── CreateButton.jsx
│   │   └── sidebar/
│   │       └── Sidebar.jsx
│   ├── hooks/
│   │   └── useDebounce.js         # Shared utility hooks
│   ├── utils/
│   │   ├── formatter.js
│   │   ├── asyncHandler.js
│   │   └── secureFetch.js
│   └── services/
│       └── notificationService.js
│
├── features/
│   ├── auth/
│   │   ├── store/
│   │   │   ├── authSlice.js       # Redux: user, tokens, isAuthenticated
│   │   │   └── authThunks.js      # Optional: async Redux actions
│   │   ├── hooks/
│   │   │   ├── useAuth.js         # Redux selector hook
│   │   │   └── useAuthMutations.js # TanStack: login, signup, logout
│   │   ├── services/
│   │   │   └── authService.js     # API functions
│   │   ├── components/
│   │   │   ├── AuthInit.jsx
│   │   │   └── ConfirmEmailFooter.jsx
│   │   └── pages/
│   │       ├── LoginPage.jsx
│   │       ├── SignupPage.jsx
│   │       └── ConfirmEmailPage.jsx
│   │
│   ├── video/
│   │   ├── hooks/
│   │   │   ├── useVideoQueries.js     # useVideos, useVideoById
│   │   │   ├── useVideoMutations.js   # useUpload, useDelete, useReport
│   │   │   └── useVideo.js            # Composite hook
│   │   ├── services/
│   │   │   └── videoService.js
│   │   ├── components/
│   │   │   ├── VideoCard.jsx          # Consolidated (was ShadcnVideoCard)
│   │   │   ├── VideoCardSkeleton.jsx  # Consolidated (was ShadcnSkeletonVideoCard)
│   │   │   └── UploadVideoDialog/
│   │   │       ├── index.js
│   │   │       ├── UploadDialog.jsx
│   │   │       ├── UploadInput.jsx
│   │   │       ├── UploadDetails.jsx
│   │   │       └── UploadPlaylist.jsx
│   │   ├── pages/
│   │   │   ├── VideoListPage.jsx      # Browse videos
│   │   │   └── VideoDetailPage.jsx    # Watch video
│   │   ├── constants/
│   │   │   └── queryKeys.js
│   │   └── utils/
│   │       └── videoActions.js        # Download, share helpers
│   │
│   ├── playlist/
│   │   ├── hooks/
│   │   │   ├── usePlaylistQueries.js
│   │   │   └── usePlaylistMutations.js
│   │   ├── services/
│   │   │   └── playlistService.js
│   │   ├── components/
│   │   │   ├── PlaylistCard.jsx
│   │   │   └── PlaylistCardSkeleton.jsx
│   │   ├── pages/
│   │   │   ├── PlaylistsPage.jsx      # User's playlists
│   │   │   └── PlaylistDetailPage.jsx # Single playlist
│   │   └── constants/
│   │       └── queryKeys.js
│   │
│   ├── watchlater/
│   │   ├── hooks/
│   │   │   ├── useWatchLaterQueries.js
│   │   │   └── useWatchLaterMutations.js
│   │   ├── services/
│   │   │   └── watchLaterService.js
│   │   ├── components/
│   │   │   ├── WatchLaterVideoCard.jsx
│   │   │   ├── WatchLaterSort.jsx
│   │   │   └── WatchLaterSidebar.jsx
│   │   └── pages/
│   │       └── WatchLaterPage.jsx
│   │
│   ├── user/
│   │   ├── hooks/
│   │   │   ├── useUserQueries.js      # useUser, useUserChannel
│   │   │   └── useUserMutations.js    # useUpdateProfile
│   │   ├── services/
│   │   │   └── userService.js
│   │   ├── components/
│   │   │   ├── UserAvatar.jsx
│   │   │   └── UserCard.jsx
│   │   └── pages/
│   │       ├── ProfilePage.jsx        # Current user profile
│   │       ├── ChannelPage.jsx        # Any user's channel
│   │       └── SettingsPage.jsx       # Account settings
│   │
│   ├── dashboard/
│   │   ├── hooks/
│   │   │   └── useDashboardQueries.js
│   │   ├── services/
│   │   │   └── dashboardService.js
│   │   ├── components/
│   │   │   ├── StatsCard.jsx
│   │   │   └── AnalyticsChart.jsx
│   │   └── pages/
│   │       └── DashboardPage.jsx      # Creator dashboard
│   │
│   ├── home/
│   │   └── pages/
│   │       └── HomePage.jsx
│   │
│   ├── search/
│   │   ├── hooks/
│   │   │   └── useSearchQueries.js
│   │   ├── services/
│   │   │   └── searchService.js
│   │   └── pages/
│   │       └── SearchResultsPage.jsx
│   │
│   ├── theme/
│   │   ├── store/
│   │   │   └── themeSlice.js          # Redux: theme preference
│   │   ├── hooks/
│   │   │   └── useTheme.js            # Redux selector
│   │   └── components/
│   │       ├── ThemeInitializer.jsx
│   │       └── ThemeToggle.jsx
│   │
│   └── ui/                             # NEW: UI state feature
│       ├── store/
│       │   └── uiSlice.js              # Redux: sidebar, modals, drawers
│       └── hooks/
│           └── useUI.js
│
├── pages/ // done
│   ├── NotFoundPage.jsx
│   └── ErrorPage.jsx
│
├── main.jsx
└── index.css
```

---

## 🗑️ Phase 1: Cleanup & Removal

### **1.1 Delete Duplicate Components**

```bash
# Delete these files
rm src/features/video/components/VideoCard.jsx
rm src/features/video/components/SkeletonVideoCard.jsx
rm src/features/video/components/VideoCardMenu.jsx
rm src/shared/components/Menu/Menu.jsx
rm src/shared/components/Menu/menuActions.js
rm src/shared/hooks/useFloatingMenu.js
rm src/shared/components/DarkModeContainer.jsx

# Then rename
mv src/features/video/components/ShadcnVideoCard.jsx src/features/video/components/VideoCard.jsx
mv src/features/video/components/ShadcnSkeletonVideoCard.jsx src/features/video/components/VideoCardSkeleton.jsx
```

### **1.2 Delete Redundant Redux Slices**

```bash
# These features already use React Query
rm src/features/video/store/videoSlice.js
rm src/features/playlist/store/playlistSlice.js
rm src/features/user/store/Userslice.js

# Remove empty store directories if they exist
rmdir src/features/video/store 2>/dev/null
rmdir src/features/playlist/store 2>/dev/null
rmdir src/features/user/store 2>/dev/null
```

### **1.3 Uninstall Dependencies**

```bash
npm uninstall react-loading-skeleton @base-ui-components/react @floating-ui/react
```

### **1.4 Update Redux Store**

**File:** `src/store/store.js`

```javascript
import { configureStore } from "@reduxjs/toolkit";
import authSlice from "@Features/auth/store/authSlice.js";
import themeSlice from "@Features/theme/store/themeSlice.js";
// Remove these:
// import playlistSlice from "@Features/playlist/store/playlistSlice.js";
// import videoSlice from "@Features/video/store/videoSlice.js";
// import userSlice from "@Features/user/store/Userslice.js";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    theme: themeSlice,
    // Only client-side state in Redux
  },
});
```

---

## 🎨 Phase 2: Install & Configure shadcn

### **2.1 Install Missing shadcn Components**

```bash
# Core components
npx shadcn@latest add skeleton
npx shadcn@latest add card
npx shadcn@latest add avatar
npx shadcn@latest add badge
npx shadcn@latest add dropdown-menu

# Form components
npx shadcn@latest add dialog
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add form
npx shadcn@latest add textarea
npx shadcn@latest add select

# Layout components
npx shadcn@latest add sheet
npx shadcn@latest add tabs
npx shadcn@latest add scroll-area
npx shadcn@latest add separator

# Feedback components
npx shadcn@latest add toast
npx shadcn@latest add alert
npx shadcn@latest add progress
```

### **2.2 Configure TanStack Query**

**File:** `src/lib/queryClient.js`

```javascript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,           // 5 minutes
      gcTime: 10 * 60 * 1000,             // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
    },
  },
});
```

### **2.3 Update main.jsx**

**File:** `src/main.jsx`

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { store } from "@/store";
import { queryClient } from "@/lib/queryClient";
import { Layout, ProtectedRoute } from "@/shared/components";

// Pages
import HomePage from "@/features/home/pages/HomePage";
import LoginPage from "@/features/auth/pages/LoginPage";
import SignupPage from "@/features/auth/pages/SignupPage";
import VideoListPage from "@/features/video/pages/VideoListPage";
import VideoDetailPage from "@/features/video/pages/VideoDetailPage";
import WatchLaterPage from "@/features/watchlater/pages/WatchLaterPage";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
// ... other imports

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/videos", element: <VideoListPage /> },
      { path: "/videos/:videoId", element: <VideoDetailPage /> },
      { path: "/watch-later", element: <ProtectedRoute><WatchLaterPage /></ProtectedRoute> },
      { path: "/dashboard", element: <ProtectedRoute><DashboardPage /></ProtectedRoute> },
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignupPage /> },
      // ... other routes
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);
```

---

## 🔄 Phase 3: Refactor Components

### **3.1 VideoCard Component**

**File:** `src/features/video/components/VideoCard.jsx`

```jsx
import { Link } from "react-router-dom";
import { MoreVertical, Clock, Download, Share2, ShieldAlert, ListPlus, Bookmark } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { getWebpThumbnail, timeAgo, formatViews } from "@/shared/utils/formatter";
import { useWatchLaterMutations } from "@/features/watchlater/hooks/useWatchLaterMutations";
import { useVideoMutations } from "../hooks/useVideoMutations";
import { downloadVideo, shareVideo } from "../utils/videoActions";

export default function VideoCard({ video }) {
  const { thumbnail, title, createdAt, views, _id: videoId, owner, duration } = video;
  const { addToWatchLater, isAdding } = useWatchLaterMutations();
  const { reportVideo } = useVideoMutations();

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg group">
      <Link to={`/videos/${videoId}`}>
        <div className="relative">
          <img
            src={getWebpThumbnail(thumbnail)}
            alt={title}
            className="w-full h-[245px] object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
          {duration && (
            <Badge variant="secondary" className="absolute bottom-2 right-2 bg-black/80 text-white">
              {duration}
            </Badge>
          )}
        </div>
      </Link>

      <CardContent className="p-4">
        <div className="flex gap-3">
          <Link to={`/@${owner.username}`}>
            <Avatar>
              <AvatarImage src={owner.avatar} alt={owner.fullName} />
              <AvatarFallback>{owner.fullName?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
          </Link>

          <div className="flex-1 min-w-0">
            <Link to={`/videos/${videoId}`}>
              <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
                {title}
              </h3>
            </Link>
            <Link to={`/@${owner.username}`} className="text-sm text-muted-foreground hover:text-foreground">
              {owner.fullName}
            </Link>
            <p className="text-xs text-muted-foreground">
              {formatViews(views)} views • {timeAgo(createdAt)}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => addToWatchLater(videoId)} disabled={isAdding}>
                <Clock className="mr-2 h-4 w-4" />
                {isAdding ? "Adding..." : "Save to Watch Later"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log("Add to playlist")}>
                <ListPlus className="mr-2 h-4 w-4" />
                Add to Playlist
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => downloadVideo(videoId, title)}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => shareVideo(videoId, title)}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => reportVideo(videoId)} className="text-destructive">
                <ShieldAlert className="mr-2 h-4 w-4" />
                Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
```

### **3.2 VideoCardSkeleton Component**

**File:** `src/features/video/components/VideoCardSkeleton.jsx`

```jsx
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function VideoCardSkeleton({ count = 1 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="h-[245px] w-full rounded-t-lg" />
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Skeleton className="h-10 w-10 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
```

### **3.3 Video Page Example**

**File:** `src/features/video/pages/VideoListPage.jsx`

```jsx
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

import Container from "@/shared/components/Container";
import VideoCard from "../components/VideoCard";
import VideoCardSkeleton from "../components/VideoCardSkeleton";
import { useVideos } from "../hooks/useVideoQueries";

export default function VideoListPage() {
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useVideos();
  const { ref, inView } = useInView();

  // Infinite scroll
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const videos = data?.pages.flatMap((page) => page.videos) ?? [];

  return (
    <Container>
      <h1 className="text-3xl font-bold mb-6">All Videos</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {isLoading ? (
          <VideoCardSkeleton count={12} />
        ) : (
          <>
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
            {isFetchingNextPage && <VideoCardSkeleton count={4} />}
          </>
        )}
      </div>

      {/* Infinite scroll trigger */}
      {hasNextPage && <div ref={ref} className="h-10" />}
    </Container>
  );
}
```

---

## 🔧 Phase 4: Standardize Hooks & Services

### **4.1 Query Keys Pattern**

**File:** `src/features/video/constants/queryKeys.js`

```javascript
export const videoQueryKeys = {
  all: ['videos'],
  lists: () => [...videoQueryKeys.all, 'list'],
  list: (filters) => [...videoQueryKeys.lists(), { filters }],
  details: () => [...videoQueryKeys.all, 'detail'],
  detail: (id) => [...videoQueryKeys.details(), id],
  comments: (id) => [...videoQueryKeys.detail(id), 'comments'],
};
```

### **4.2 Query Hooks Pattern**

**File:** `src/features/video/hooks/useVideoQueries.js`

```javascript
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { videoService } from "../services/videoService";
import { videoQueryKeys } from "../constants/queryKeys";

export const useVideos = (filters = {}) => {
  return useInfiniteQuery({
    queryKey: videoQueryKeys.list(filters),
    queryFn: ({ pageParam = 1 }) => videoService.getVideos({ ...filters, page: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
  });
};

export const useVideoById = (videoId, options = {}) => {
  return useQuery({
    queryKey: videoQueryKeys.detail(videoId),
    queryFn: () => videoService.getVideoById(videoId),
    enabled: !!videoId,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

export const useVideoComments = (videoId) => {
  return useQuery({
    queryKey: videoQueryKeys.comments(videoId),
    queryFn: () => videoService.getComments(videoId),
    enabled: !!videoId,
  });
};
```

### **4.3 Mutation Hooks Pattern**

**File:** `src/features/video/hooks/useVideoMutations.js`

```javascript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { videoService } from "../services/videoService";
import { videoQueryKeys } from "../constants/queryKeys";

export const useUploadVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: videoService.uploadVideo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: videoQueryKeys.lists() });
      toast.success("Video uploaded successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to upload video");
    },
  });
};

export const useDeleteVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: videoService.deleteVideo,
    onMutate: async (videoId) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: videoQueryKeys.lists() });
      
      const previousData = queryClient.getQueryData(videoQueryKeys.lists());
      
      queryClient.setQueryData(videoQueryKeys.lists(), (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            videos: page.videos.filter((v) => v._id !== videoId),
          })),
        };
      });

      return { previousData };
    },
    onError: (error, videoId, context) => {
      queryClient.setQueryData(videoQueryKeys.lists(), context.previousData);
      toast.error(error.message || "Failed to delete video");
    },
    onSuccess: () => {
      toast.success("Video deleted successfully");
    },
  });
};

export const useReportVideo = () => {
  return useMutation({
    mutationFn: videoService.reportVideo,
    onSuccess: () => {
      toast.success("Video reported. We'll review it shortly.");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to report video");
    },
  });
};

export const useVideoMutations = () => {
  const uploadVideo = useUploadVideo();
  const deleteVideo = useDeleteVideo();
  const reportVideo = useReportVideo();

  return {
    uploadVideo: uploadVideo.mutate,
    deleteVideo: deleteVideo.mutate,
    reportVideo: reportVideo.mutate,
    isUploading: uploadVideo.isPending,
    isDeleting: deleteVideo.isPending,
  };
};
```

### **4.4 Service Layer Pattern**

**File:** `src/features/video/services/videoService.js`

```javascript
import { secureFetch } from "@/shared/utils/secureFetch";

export const videoService = {
  getVideos: async ({ page = 1, limit = 20, ...filters } = {}) => {
    const params = new URLSearchParams({ page, limit, ...filters });
    const response = await secureFetch(`/api/v1/videos?${params}`);
    return response.data;
  },

  getVideoById: async (videoId) => {
    const response = await secureFetch(`/api/v1/videos/${videoId}`);
    return response.data;
  },

  uploadVideo: async (formData) => {
    const response = await secureFetch("/api/v1/videos", {
      method: "POST",
      body: formData,
    });
    return response.data;
  },

  updateVideo: async ({ videoId, data }) => {
    const response = await secureFetch(`/api/v1/videos/${videoId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.data;
  },

  deleteVideo: async (videoId) => {
    const response = await secureFetch(`/api/v1/videos/${videoId}`, {
      method: "DELETE",
    });
    return response.data;
  },

  getComments: async (videoId) => {
    const response = await secureFetch(`/api/v1/videos/${videoId}/comments`);
    return response.data;
  },

  reportVideo: async (videoId) => {
    const response = await secureFetch(`/api/v1/videos/${videoId}/report`, {
      method: "POST",
    });
    return response.data;
  },
};
```

---

## 🎨 Phase 5: Standardize Naming

### **5.1 Rename Folders**

```bash
# Rename all "hook" to "hooks" (plural)
mv src/features/auth/hook src/features/auth/hooks
mv src/features/video/hook src/features/video/hooks
mv src/features/playlist/hook src/features/playlist/hooks
mv src/features/watchlater/hook src/features/watchlater/hooks
mv src/features/user/hook src/features/user/hooks
mv src/features/theme/hook src/features/theme/hooks
```

### **5.2 Rename Files**

```bash
# Standardize page naming
mv src/features/home/pages/Home.jsx src/features/home/pages/HomePage.jsx
mv src/features/auth/pages/Login.jsx src/features/auth/pages/LoginPage.jsx
mv src/features/auth/pages/Signup.jsx src/features/auth/pages/SignupPage.jsx
mv src/features/auth/pages/ConfirmEmail.jsx src/features/auth/pages/ConfirmEmailPage.jsx
mv src/features/dashboard/pages/Dashboard.jsx src/features/dashboard/pages/DashboardPage.jsx

# Standardize slice naming
mv src/features/user/store/Userslice.js src/features/user/store/userSlice.js

# Rename overlay to dialog
mv src/features/video/components/UploadVideoOverlay src/features/video/components/UploadVideoDialog
```

### **5.3 Update Import Paths**

After renaming, use find-and-replace in your IDE:

- `@Features/*/hook/` → `@Features/*/hooks/`
- `from '@Features/home/pages/Home'` → `from '@Features/home/pages/HomePage'`
- `from '@Features/user/store/Userslice'` → (delete, use React Query instead)

---

## 🧹 Phase 6: Layout & Container Updates

### **6.1 Update Layout Component**

**File:** `src/shared/components/Layout.jsx`

```jsx
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import Header from "./header/Header";
import Sidebar from "./sidebar/Sidebar";

export default function Layout() {
  const location = useLocation();

  const hideHeaderSidebar =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/confirm-email";

  return (
    <>
      <Toaster richColors position="bottom-right" />
      
      {!hideHeaderSidebar && <Header />}
      
      <div className="flex min-h-screen">
        {!hideHeaderSidebar && <Sidebar />}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </>
  );
}
```

### **6.2 Update Container Component**

**File:** `src/shared/components/Container.jsx`

```jsx
import { cn } from "@/lib/utils";

export default function Container({ children, className, ...props }) {
  return (
    <div
      className={cn(
        "min-h-screen w-full pt-16 pl-16", // Offset for fixed header/sidebar
        "bg-background text-foreground",
        "transition-colors duration-200",
        className
      )}
      {...props}
    >
      <main className="container mx-auto p-6 max-w-screen-2xl">
        {children}
      </main>
    </div>
  );
}
```

### **6.3 Remove DarkModeContainer**

```bash
rm src/shared/components/DarkModeContainer.jsx
```

Replace all usages with `Container` or direct div + Tailwind classes.

---

## 🚀 Phase 7: Migration Checklist

### **Priority 1: Critical (Do First)**
- [ ] Uninstall legacy dependencies (`react-loading-skeleton`, `@base-ui-components/react`, `@floating-ui/react`)
- [ ] Delete duplicate VideoCard components
- [ ] Delete redundant Redux slices (video, playlist, user)
- [ ] Update `store.js` to only include auth + theme
- [ ] Install missing shadcn components
- [ ] Create `lib/queryClient.js`
- [ ] Update `main.jsx` with QueryClientProvider

### **Priority 2: Refactoring (Core Features)**
- [ ] Refactor VideoCard to use shadcn components
- [ ] Refactor VideoCardSkeleton to use shadcn Skeleton
- [ ] Replace custom Menu with shadcn DropdownMenu in all places
- [ ] Move menuActions to `features/video/utils/videoActions.js`
- [ ] Standardize all query hooks (useVideoQueries, usePlaylistQueries, etc.)
- [ ] Standardize all mutation hooks
- [ ] Create query key factories for each feature

### **Priority 3: Naming & Organization**
- [ ] Rename all `hook/` folders to `hooks/`
- [ ] Rename all pages to end with `Page` suffix
- [ ] Rename `Userslice.js` to `userSlice.js` (or delete if using React Query)
- [ ] Rename `UploadVideoOverlay` to `UploadVideoDialog`
- [ ] Update all import statements

### **Priority 4: Polish & Optimization**
- [ ] Remove `DarkModeContainer`, use direct Tailwind classes
- [ ] Add shadcn Toast, replace direct Sonner usage
- [ ] Add shadcn Dialog for modals
- [ ] Add shadcn Sheet for mobile sidebar
- [ ] Add shadcn Form for form handling
- [ ] Optimize LazyImage or use native `loading="lazy"`
- [ ] Add proper TypeScript types (optional but recommended)

### **Priority 5: Testing & Validation**
- [ ] Test all video pages (list, detail, upload)
- [ ] Test auth flow (login, signup, logout)
- [ ] Test watch later functionality
- [ ] Test playlist functionality
- [ ] Test dark mode toggle
- [ ] Test responsive design on mobile/tablet
- [ ] Test infinite scroll
- [ ] Run lint and fix errors
- [ ] Update README with new architecture

---

## 📊 Expected Outcomes

### **Bundle Size Reduction**
- Remove `react-loading-skeleton`: ~15KB
- Remove `@floating-ui/react`: ~25KB
- Remove `@base-ui-components`: ~50KB
- **Total saved: ~90KB gzipped**

### **Code Quality**
- **~46 files** → Reduce to **~35 files** (24% reduction)
- Eliminate 11+ duplicate/legacy components
- Single source of truth for UI (shadcn)
- Consistent naming conventions
- Clear separation of concerns (client state vs server state)

### **Developer Experience**
- Easier to onboard new developers
- Consistent patterns across features
- Better TypeScript support (if added)
- Faster development with shadcn components
- Improved maintainability

---

## 🛠️ Helper Scripts

### **Find All Imports to Update**

```bash
# Find all imports of deleted components
grep -r "from.*VideoCard" src/
grep -r "from.*SkeletonVideoCard" src/
grep -r "from.*Menu/Menu" src/
grep -r "from.*useFloatingMenu" src/
grep -r "from.*DarkModeContainer" src/

# Find all hook/ imports (should be hooks/)
grep -r "from.*hook/" src/
```

### **Rename Utility Script**

```bash
#!/bin/bash
# rename-folders.sh

# Rename all hook/ to hooks/
find src/features -type d -name "hook" -execdir mv hook hooks \;

echo "Renamed all hook/ folders to hooks/"
```

---

## 📚 Reference Examples

### **Complete Feature Example: Playlist**

```
src/features/playlist/
├── hooks/
│   ├── usePlaylistQueries.js
│   │   ├── export const usePlaylists = () => { ... }
│   │   ├── export const usePlaylistById = (id) => { ... }
│   │   └── export const usePlaylistVideos = (id) => { ... }
│   │
│   └── usePlaylistMutations.js
│       ├── export const useCreatePlaylist = () => { ... }
│       ├── export const useUpdatePlaylist = () => { ... }
│       ├── export const useDeletePlaylist = () => { ... }
│       ├── export const useAddToPlaylist = () => { ... }
│       └── export const useRemoveFromPlaylist = () => { ... }
│
├── services/
│   └── playlistService.js
│       ├── export const getPlaylists = async () => { ... }
│       ├── export const getPlaylistById = async (id) => { ... }
│       ├── export const createPlaylist = async (data) => { ... }
│       └── ...
│
├── components/
│   ├── PlaylistCard.jsx
│   ├── PlaylistCardSkeleton.jsx
│   └── CreatePlaylistDialog.jsx
│
├── pages/
│   ├── PlaylistsPage.jsx
│   └── PlaylistDetailPage.jsx
│
└── constants/
    └── queryKeys.js
        export const playlistQueryKeys = { ... }
```

---

## 🎯 Weekly Migration Plan

### **Week 1: Cleanup**
- Day 1-2: Delete duplicates & uninstall dependencies
- Day 3-4: Update Redux store & clean slices
- Day 5: Install shadcn components

### **Week 2: Core Refactoring**
- Day 1-2: Refactor VideoCard & skeleton
- Day 3-4: Refactor video pages & hooks
- Day 5: Test video feature end-to-end

### **Week 3: Expand to Other Features**
- Day 1-2: Refactor playlist feature
- Day 3-4: Refactor watch later feature
- Day 5: Refactor auth pages

### **Week 4: Naming & Organization**
- Day 1-2: Rename all folders & files
- Day 3-4: Update all imports
- Day 5: Fix lint errors

### **Week 5: Polish & Testing**
- Day 1-2: Add missing shadcn components (Dialog, Sheet, Form)
- Day 3-4: Test on multiple devices
- Day 5: Final review & documentation

---

## 💡 Pro Tips

1. **Work in feature branches**: Create a branch for each phase
2. **Commit frequently**: Small, atomic commits make debugging easier
3. **Test after each change**: Don't let errors accumulate
4. **Use TypeScript**: Add `.ts` extensions for better type safety (optional)
5. **Document as you go**: Update component READMEs when refactoring
6. **Keep old code temporarily**: Comment out instead of deleting until tested
7. **Use React DevTools**: Verify Redux state and React Query cache
8. **Monitor bundle size**: Use `vite build --mode analyze` to check

---

## 🆘 Troubleshooting

### **Issue: Import paths broken after renaming**
```bash
# Find all broken imports
npm run build
# Fix with IDE find-and-replace
```

### **Issue: React Query not refetching**
```javascript
// Check query keys are correct
// Use React Query DevTools to debug
// Verify invalidateQueries is called
```

### **Issue: Redux state not persisting**
```javascript
// Check if redux-persist is configured (if needed)
// Verify localStorage is working
```

### **Issue: shadcn components not styled**
```javascript
// Verify Tailwind config includes shadcn paths
// Check index.css has shadcn styles imported
```

---

## 📝 Final Notes

- This guide is comprehensive but flexible - adapt to your needs
- Prioritize based on your timeline and team capacity
- Keep user-facing features working during migration
- Consider feature flags for gradual rollout
- Document any deviations from this guide for your team

**Good luck with your revamp! 🚀**

---

**Last Updated:** January 10, 2026  
**Version:** 1.0  
**Maintained by:** Videotube Frontend Team
