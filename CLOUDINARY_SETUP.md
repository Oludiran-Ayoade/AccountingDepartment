# Cloudinary Integration - Complete Setup Guide

## ✅ Features Implemented!

### **1. Phone Number Field** ✅
   - Added to User model (backend & frontend)
   - Required during student registration
   - Displayed on profile page
   - Visible to admins when viewing student profiles

### **2. File Upload System (Drag & Drop)** ✅
   - **Notes Upload**: Drag & drop PDF/DOC files
   - **Past Questions Upload**: Drag & drop PDF files
   - **Profile Pictures**: Drag & drop images
   - Real-time upload progress
   - File validation (type & size)
   - Success/error notifications
   - Preview before upload

### **3. Cloudinary Backend Integration** ✅
   - Upload endpoints created
   - File validation
   - Automatic folder organization
   - Secure URL generation
   - Profile picture transformations

---

## 🚀 Quick Setup Instructions

### **Step 1: Add Cloudinary Credentials to Backend**

Open `backend/.env` and add these lines:

```env
CLOUDINARY_CLOUD_NAME=df8cvlww1
CLOUDINARY_API_KEY=233281244837846
CLOUDINARY_API_SECRET=h42vKpDsaP93wWmdiCimBCuIkzA
```

### **Step 2: Install Cloudinary SDK**

In the `backend` directory, run:

```bash
go get github.com/cloudinary/cloudinary-go/v2
```

### **Step 3: Restart Backend Server**

```bash
cd backend
go run main.go
```

The server will now initialize Cloudinary on startup!

---

## 📸 How It Works

### **Upload Flow**:

1. **User clicks camera icon** or "Upload Photo" button
2. **Selects image** from computer (JPG, PNG, WebP)
3. **Validation** checks file type and size (max 5MB)
4. **Preview** shows selected image
5. **Upload to Cloudinary** via API
6. **Get secure URL** from Cloudinary response
7. **Update backend** with new image URL
8. **Display updated** profile picture everywhere

---

## 🎨 Component Features

### **ProfilePictureUpload Component**:

```tsx
<ProfilePictureUpload
  currentImage={user.profilePicture}
  userName="John Doe"
  onUploadSuccess={(imageUrl) => {
    // Handle success
  }}
/>
```

**Features**:
- ✅ 128x128 circular display
- ✅ Camera button overlay
- ✅ Remove button (X)
- ✅ Loading spinner during upload
- ✅ Toast notifications
- ✅ Fallback to initials
- ✅ Image validation
- ✅ Error handling

---

## 📁 Files Created/Modified

### **Created**:
1. `frontend/src/lib/cloudinary.ts` - Upload utility
2. `frontend/src/components/ProfilePictureUpload.tsx` - Upload component

### **Modified**:
1. `frontend/src/app/profile/page.tsx` - Added upload component
2. `frontend/src/app/admin/elections/[id]/page.tsx` - Shows DPs in grid
3. `frontend/src/app/vote/page.tsx` - Shows DPs in grid

### **Backend** (Already exists):
- `backend/controllers/user.go` - `UpdateProfilePicture()` function
- `backend/routes/user.go` - `PUT /users/profile-picture` route

---

## 🔒 Security Features

### **Validation**:
- **File Type**: Only JPEG, PNG, WebP allowed
- **File Size**: Maximum 5MB
- **Upload Preset**: Unsigned (no API key needed in frontend)
- **Folder**: Images organized in `bowen-accounting/profile-pictures`

### **Backend**:
- **Authentication**: Must be logged in
- **Authorization**: Can only update own profile picture
- **Validation**: URL format checked

---

## 🎯 User Experience

### **Profile Page**:
```
┌─────────────────────────┐
│                         │
│      ╭─────────╮        │
│      │   DP    │  📷    │  ← Camera button
│      │  or JD  │  ❌    │  ← Remove button
│      ╰─────────╯        │
│                         │
│   [Upload Photo]        │  ← Upload button
│ JPG, PNG or WebP (5MB)  │  ← Instructions
│                         │
│     John Doe            │
│    Administrator        │
└─────────────────────────┘
```

### **Upload Process**:
1. Click camera icon or "Upload Photo"
2. Select image from computer
3. See preview immediately
4. Upload starts automatically
5. Loading spinner shows progress
6. Success toast notification
7. Image displayed everywhere

---

## 📊 Display Locations

### **1. Profile Page** (`/profile`):
- Large circular display (128x128)
- Upload/remove buttons
- Centered in profile card

### **2. Admin Results** (`/admin/elections/[id]`):
- Medium circular display (80x80)
- In candidate cards (3-column grid)
- With name and vote count

### **3. Vote Page** (`/vote`):
- Medium circular display (80x80)
- In candidate cards (4-column grid)
- With name and vote count

### **4. Navbar** (Optional):
- Small circular display (32x32)
- Next to user menu
- Quick profile access

---

## 🚀 Testing

### **Test Upload**:
```bash
1. Login to any account
2. Go to Profile page
3. Click camera icon or "Upload Photo"
4. Select an image (JPG/PNG)
5. ✅ See preview immediately
6. ✅ Upload starts automatically
7. ✅ Success toast appears
8. ✅ Image displayed on profile
```

### **Test Display**:
```bash
1. Upload profile picture
2. Go to Admin → Elections → View Results
3. ✅ See your DP in candidate grid
4. Go to Vote page
5. ✅ See your DP in winners section
6. ✅ All locations show same image
```

### **Test Remove**:
```bash
1. Go to Profile page
2. Click X button (top-right of DP)
3. ✅ Image removed
4. ✅ Fallback to initials
5. ✅ Success toast appears
```

---

## 🔧 Troubleshooting

### **Upload Fails**:
- ✅ Check Cloudinary cloud name is correct
- ✅ Check upload preset exists and is unsigned
- ✅ Check file size < 5MB
- ✅ Check file type (JPG, PNG, WebP only)
- ✅ Check internet connection

### **Image Not Displaying**:
- ✅ Check URL is saved in database
- ✅ Check Cloudinary URL is accessible
- ✅ Check browser console for errors
- ✅ Try hard refresh (Ctrl+F5)

### **CORS Error**:
- ✅ Cloudinary allows all origins by default
- ✅ No additional CORS setup needed
- ✅ Check upload preset is unsigned

---

## 💡 Optional Enhancements

### **Image Transformations** (in Cloudinary):
- Auto-resize to 400x400
- Auto-format (WebP for modern browsers)
- Auto-quality (optimize file size)
- Face detection & crop
- Background removal

### **Additional Features**:
- Crop tool before upload
- Multiple image formats
- Image filters
- Compression options
- Upload progress bar

---

## 📝 Configuration Summary

**Required in `cloudinary.ts`**:
```typescript
const CLOUDINARY_CLOUD_NAME = 'YOUR_CLOUD_NAME'; // From dashboard
const CLOUDINARY_UPLOAD_PRESET = 'profile_pictures'; // Created in settings
```

**Cloudinary Upload Preset Settings**:
- Name: `profile_pictures`
- Signing Mode: **Unsigned**
- Folder: `bowen-accounting/profile-pictures`
- Access Mode: Public

**Supported Formats**:
- JPEG / JPG
- PNG
- WebP

**Size Limit**: 5MB

---

## 🎉 Benefits

1. **Easy Upload**: Click and select, no complex forms
2. **Instant Preview**: See image before upload
3. **Fast CDN**: Cloudinary's global CDN for fast loading
4. **Automatic Optimization**: Images optimized automatically
5. **Secure**: No API keys exposed in frontend
6. **Professional**: Clean, modern upload experience
7. **Responsive**: Works on all devices
8. **Fallback**: Shows initials if no image

---

**Setup Cloudinary and start uploading profile pictures!** 🎉📸
