
mkdir -p test_files

# Download sample avatar image
curl -L https://thispersondoesnotexist.com -o test_files/avatar.jpg

# Download sample cover image
curl -L https://picsum.photos/1200/300 -o test_files/cover.jpg

# Download sample thumbnail
curl -L https://picsum.photos/480/360 -o test_files/thumbnail.jpg

# Download a sample video file (Creative Commons video)
curl -L https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_10mb.mp4 -o test_files/testvideo.mp4

# Verify files were downloaded
ls -la test_files/
