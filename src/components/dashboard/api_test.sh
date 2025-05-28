#!/bin/bash

# API Testing Script for Video Sharing Platform
# This script tests all API endpoints in a logical order

# Configuration
BASE_URL="http://localhost:3000"
LOG_FILE="api_test.log"
TEST_FILES="./test_files"

# Initialize log file
echo "API Testing Log - $(date)" > $LOG_FILE
echo "========================================" >> $LOG_FILE

# ANSI color codes for better readability
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper function to execute and log API calls
execute_curl() {
    local name=$1
    local curl_command=$2
    
    echo -e "\n${BLUE}===== Testing: $name =====${NC}"
    echo -e "\n===== Testing: $name =====" >> $LOG_FILE
    echo "Command: $curl_command" >> $LOG_FILE
    echo -e "${YELLOW}Executing: ${curl_command}${NC}"
    
    # Execute curl and capture response
    local response=$(eval $curl_command)
    local status=$?
    
    # Log response
    echo -e "${GREEN}Response:${NC}\n$response"
    echo -e "Response:\n$response" >> $LOG_FILE
    echo "Status code: $status" >> $LOG_FILE
    echo "----------------------------------------" >> $LOG_FILE
    
    # Return the response
    echo "$response"
}

# Helper function for pauses between operations
pause() {
    echo -e "${YELLOW}Pausing for $1 seconds...${NC}"
    sleep $1
}

# Verify test files exist
check_files() {
    if [ ! -d "$TEST_FILES" ]; then
        echo -e "${RED}Error: Test files directory not found.${NC}"
        echo -e "Please run the following commands to download test files:"
        echo -e "mkdir -p test_files"
        echo -e "curl -L https://thispersondoesnotexist.com -o test_files/avatar.jpg"
        echo -e "curl -L https://picsum.photos/1200/300 -o test_files/cover.jpg"
        echo -e "curl -L https://picsum.photos/480/360 -o test_files/thumbnail.jpg"
        echo -e "curl -L https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_10mb.mp4 -o test_files/testvideo.mp4"
        exit 1
    fi

    for file in avatar.jpg cover.jpg thumbnail.jpg testvideo.mp4; do
        if [ ! -f "$TEST_FILES/$file" ]; then
            echo -e "${RED}Error: Required test file $TEST_FILES/$file not found.${NC}"
            exit 1
        fi
    done
}

# Check files before starting
check_files

echo -e "${GREEN}Starting API Tests...${NC}"
echo "Starting API Tests at $(date)" >> $LOG_FILE

# ==========================================
# 1. Health Check (doesn't require authentication)
# ==========================================
execute_curl "Health Check" "curl -s -X GET $BASE_URL/health"
pause 1

# ==========================================
# 2. User Registration and Authentication
# ==========================================

# Register a new user
USER_RESPONSE=$(execute_curl "User Registration" "curl -s -X POST $BASE_URL/user/register \
  -F \"username=testuser$(date +%s)\" \
  -F \"email=test$(date +%s)@example.com\" \
  -F \"password=SecurePass123!\" \
  -F \"fullName=Test User\" \
  -F \"avatar=@$TEST_FILES/avatar.jpg\" \
  -F \"coverImage=@$TEST_FILES/cover.jpg\"")

# Extract user ID
USER_ID=$(echo $USER_RESPONSE | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)
if [ -z "$USER_ID" ]; then
    echo -e "${YELLOW}Warning: Could not extract user ID. Using placeholder.${NC}"
    USER_ID="PLACEHOLDER_USER_ID"
else
    echo -e "${GREEN}Extracted User ID: $USER_ID${NC}"
fi

# Extract username and email from registration response
USERNAME=$(echo $USER_RESPONSE | grep -o '"username":"[^"]*"' | cut -d'"' -f4)
EMAIL=$(echo $USER_RESPONSE | grep -o '"email":"[^"]*"' | cut -d'"' -f4)

if [ -z "$USERNAME" ] || [ -z "$EMAIL" ]; then
    echo -e "${YELLOW}Using fallback values for username/email${NC}"
    USERNAME="testuser$(date +%s)"
    EMAIL="test$(date +%s)@example.com"
fi

pause 2

# Login to get authentication tokens
LOGIN_RESPONSE=$(execute_curl "User Login" "curl -s -X POST $BASE_URL/user/login \
  -H \"Content-Type: application/json\" \
  -d '{\"email\": \"$EMAIL\", \"password\": \"SecurePass123!\"}'")

# Extract tokens from login response
ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
REFRESH_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"refreshToken":"[^"]*"' | cut -d'"' -f4)

if [ -z "$ACCESS_TOKEN" ]; then
    echo -e "${RED}Error: Failed to extract access token. Testing authenticated endpoints will fail.${NC}"
    echo "Error: Failed to extract access token. Testing authenticated endpoints will fail." >> $LOG_FILE
    ACCESS_TOKEN="INVALID_TOKEN"
else
    echo -e "${GREEN}Successfully obtained access token.${NC}"
    echo "Successfully obtained access token." >> $LOG_FILE
fi

pause 2

# ==========================================
# 3. User Operations
# ==========================================

# Get current user profile
execute_curl "Get Current User" "curl -s -X GET $BASE_URL/user \
  -H \"Authorization: Bearer $ACCESS_TOKEN\""

pause 1

# Update user details
execute_curl "Update User Details" "curl -s -X PATCH $BASE_URL/user/updateDetails \
  -H \"Authorization: Bearer $ACCESS_TOKEN\" \
  -H \"Content-Type: application/json\" \
  -d '{\"fullName\": \"Updated Test User\"}'"

pause 1

# Change password
execute_curl "Change Password" "curl -s -X PATCH $BASE_URL/user/changePassword \
  -H \"Authorization: Bearer $ACCESS_TOKEN\" \
  -H \"Content-Type: application/json\" \
  -d '{\"oldPassword\": \"SecurePass123!\", \"newPassword\": \"NewSecurePass456!\"}'"

pause 1

# Update avatar
execute_curl "Update Avatar" "curl -s -X PATCH $BASE_URL/user/updateAvatar \
  -H \"Authorization: Bearer $ACCESS_TOKEN\" \
  -F \"avatar=@$TEST_FILES/avatar.jpg\""

pause 1

# Update cover image
execute_curl "Update Cover Image" "curl -s -X PATCH $BASE_URL/user/updateCoverImage \
  -H \"Authorization: Bearer $ACCESS_TOKEN\" \
  -F \"coverImage=@$TEST_FILES/cover.jpg\""

pause 1

# ==========================================
# 4. Video Operations
# ==========================================

# Upload a new video
VIDEO_RESPONSE=$(execute_curl "Upload Video" "curl -s -X POST $BASE_URL/videos \
  -H \"Authorization: Bearer $ACCESS_TOKEN\" \
  -F \"title=Test Video\" \
  -F \"description=This is a test video description\" \
  -F \"videoFile=@$TEST_FILES/testvideo.mp4\" \
  -F \"thumbnail=@$TEST_FILES/thumbnail.jpg\"")

# Extract video ID
VIDEO_ID=$(echo $VIDEO_RESPONSE | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)
if [ -z "$VIDEO_ID" ]; then
    echo -e "${YELLOW}Warning: Could not extract video ID. Using placeholder.${NC}"
    VIDEO_ID="PLACEHOLDER_VIDEO_ID"
else
    echo -e "${GREEN}Extracted Video ID: $VIDEO_ID${NC}"
fi

pause 2

# Get all videos
execute_curl "Get All Videos" "curl -s -X GET \"$BASE_URL/videos?page=1&limit=10&sortBy=createdAt&sortType=desc\" \
  -H \"Authorization: Bearer $ACCESS_TOKEN\""

pause 1

# Get video by ID
execute_curl "Get Video" "curl -s -X GET $BASE_URL/videos/$VIDEO_ID \
  -H \"Authorization: Bearer $ACCESS_TOKEN\""

pause 1

# Update video
execute_curl "Update Video" "curl -s -X PATCH $BASE_URL/videos/$VIDEO_ID \
  -H \"Authorization: Bearer $ACCESS_TOKEN\" \
  -F \"title=Updated Video Title\" \
  -F \"description=Updated video description\" \
  -F \"thumbnail=@$TEST_FILES/thumbnail.jpg\""

pause 1

# Toggle video publish status
execute_curl "Toggle Video Publish Status" "curl -s -X PATCH $BASE_URL/videos/toggle/publish/$VIDEO_ID \
  -H \"Authorization: Bearer $ACCESS_TOKEN\""

pause 1

# ==========================================
# 5. Playlist Operations
# ==========================================

# Create a new playlist
PLAYLIST_RESPONSE=$(execute_curl "Create Playlist" "curl -s -X POST $BASE_URL/playlists \
  -H \"Authorization: Bearer $ACCESS_TOKEN\" \
  -H \"Content-Type: application/json\" \
  -d '{\"name\": \"My Test Playlist\", \"description\": \"A playlist for testing\"}'")

# Extract playlist ID
PLAYLIST_ID=$(echo $PLAYLIST_RESPONSE | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)
if [ -z "$PLAYLIST_ID" ]; then
    echo -e "${YELLOW}Warning: Could not extract playlist ID. Using placeholder.${NC}"
    PLAYLIST_ID="PLACEHOLDER_PLAYLIST_ID"
else
    echo -e "${GREEN}Extracted Playlist ID: $PLAYLIST_ID${NC}"
fi

pause 1

# Get user playlists
execute_curl "Get User Playlists" "curl -s -X GET $BASE_URL/playlists/user/$USER_ID \
  -H \"Authorization: Bearer $ACCESS_TOKEN\""

pause 1

# Get playlist by ID
execute_curl "Get Playlist" "curl -s -X GET $BASE_URL/playlists/$PLAYLIST_ID \
  -H \"Authorization: Bearer $ACCESS_TOKEN\""

pause 1

# Add video to playlist
execute_curl "Add Video to Playlist" "curl -s -X PATCH $BASE_URL/playlists/add/$VIDEO_ID/$PLAYLIST_ID \
  -H \"Authorization: Bearer $ACCESS_TOKEN\""

pause 1

# Update playlist
execute_curl "Update Playlist" "curl -s -X PATCH $BASE_URL/playlists/$PLAYLIST_ID \
  -H \"Authorization: Bearer $ACCESS_TOKEN\" \
  -H \"Content-Type: application/json\" \
  -d '{\"name\": \"Updated Playlist Name\", \"description\": \"Updated description\"}'")

pause 1

# ==========================================
# 6. Like Operations
# ==========================================

# Toggle video like
execute_curl "Toggle Video Like" "curl -s -X POST $BASE_URL/likes/toggle/v/$VIDEO_ID \
  -H \"Authorization: Bearer $ACCESS_TOKEN\""

pause 1

# Get user's liked videos
execute_curl "Get Liked Videos" "curl -s -X GET $BASE_URL/likes/videos/$USER_ID \
  -H \"Authorization: Bearer $ACCESS_TOKEN\""

pause 1

# ==========================================
# 7. Comment Operations
# ==========================================

# Add comment to a video (assuming comment routes exist)
COMMENT_RESPONSE=$(execute_curl "Add Video Comment" "curl -s -X POST $BASE_URL/comments/$VIDEO_ID \
  -H \"Authorization: Bearer $ACCESS_TOKEN\" \
  -H \"Content-Type: application/json\" \
  -d '{\"content\": \"This is a test comment on the video\"}'")

# Extract comment ID (pattern might need adjustment)
COMMENT_ID=$(echo $COMMENT_RESPONSE | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)
if [ -z "$COMMENT_ID" ]; then
    echo -e "${YELLOW}Warning: Could not extract comment ID. Using placeholder.${NC}"
    COMMENT_ID="PLACEHOLDER_COMMENT_ID"
else
    echo -e "${GREEN}Extracted Comment ID: $COMMENT_ID${NC}"
fi

pause 1

# Toggle like on comment (if comment was created)
if [ "$COMMENT_ID" != "PLACEHOLDER_COMMENT_ID" ]; then
    execute_curl "Toggle Comment Like" "curl -s -X POST $BASE_URL/likes/toggle/c/$COMMENT_ID \
      -H \"Authorization: Bearer $ACCESS_TOKEN\""
    pause 1
fi

# ==========================================
# 8. Subscription Operations
# ==========================================

# Create a second user to test subscriptions
SECOND_USER_RESPONSE=$(execute_curl "Create Second User" "curl -s -X POST $BASE_URL/user/register \
  -F \"username=channel$(date +%s)\" \
  -F \"email=channel$(date +%s)@example.com\" \
  -F \"password=SecurePass123!\" \
  -F \"fullName=Channel Owner\" \
  -F \"avatar=@$TEST_FILES/avatar.jpg\" \
  -F \"coverImage=@$TEST_FILES/cover.jpg\"")

# Extract second user ID
CHANNEL_ID=$(echo $SECOND_USER_RESPONSE | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)
if [ -z "$CHANNEL_ID" ]; then
    echo -e "${YELLOW}Warning: Could not extract channel user ID. Using original user ID.${NC}"
    CHANNEL_ID=$USER_ID
else
    echo -e "${GREEN}Extracted Channel User ID: $CHANNEL_ID${NC}"
fi

pause 1

# Toggle subscription to channel
execute_curl "Toggle Channel Subscription" "curl -s -X POST $BASE_URL/subscriptions/c/$CHANNEL_ID \
  -H \"Authorization: Bearer $ACCESS_TOKEN\""

pause 1

# Get channel subscribers
execute_curl "Get Channel Subscribers" "curl -s -X GET $BASE_URL/subscriptions/c/$CHANNEL_ID \
  -H \"Authorization: Bearer $ACCESS_TOKEN\""

pause 1

# Get user's subscribed channels
execute_curl "Get User Subscriptions" "curl -s -X GET $BASE_URL/subscriptions/u/$USER_ID \
  -H \"Authorization: Bearer $ACCESS_TOKEN\""

pause 1

# ==========================================
# 9. Cleanup Operations
# ==========================================

# Remove video from playlist
execute_curl "Remove Video from Playlist" "curl -s -X PATCH $BASE_URL/playlists/remove/$VIDEO_ID/$PLAYLIST_ID \
  -H \"Authorization: Bearer $ACCESS_TOKEN\""

pause 1

# Delete playlist
execute_curl "Delete Playlist" "curl -s -X DELETE $BASE_URL/playlists/$PLAYLIST_ID \
  -H \"Authorization: Bearer $ACCESS_TOKEN\""

pause 1

# Delete video
execute_curl "Delete Video" "curl -s -X DELETE $BASE_URL/videos/$VIDEO_ID \
  -H \"Authorization: Bearer $ACCESS_TOKEN\""

pause 1

# Refresh token
execute_curl "Refresh Token" "curl -s -X POST $BASE_URL/user/refreshToken \
  -H \"Authorization: Bearer $ACCESS_TOKEN\" \
  -H \"Content-Type: application/json\" \
  -d '{\"refreshToken\": \"$REFRESH_TOKEN\"}'"

pause 1

# Logout
execute_curl "Logout User" "curl -s -X POST $BASE_URL/user/logout \
  -H \"Authorization: Bearer $ACCESS_TOKEN\""

pause 1

# NOTE: Delete user account is commented out to avoid permanent deletion during testing
# Uncomment if you want to test the delete functionality
# execute_curl "Delete User Account" "curl -s -X DELETE $BASE_URL/user/delete \
#   -H \"Authorization: Bearer $ACCESS_TOKEN\""

echo -e "\n${GREEN}API Testing Completed!${NC}"
echo -e "${BLUE}Log file saved to: $LOG_FILE${NC}"
echo -e "\nAPI Testing Completed at $(date)" >> $LOG_FILE
