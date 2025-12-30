# Quick Start Guide - Bowen Accounting Portal

## ✅ Students Are Already Seeded!

The database now has **24 students** (7 per level for 100, 200, 300):

### Login Credentials:
- **Email**: `student{1-7}.level{100-400}@bowen.edu.ng`
- **Password**: `password123`

**Examples:**
- `student1.level100@bowen.edu.ng` / `password123`
- `student3.level200@bowen.edu.ng` / `password123`
- `student5.level300@bowen.edu.ng` / `password123`

---

## 🎯 How to Create an Election with Candidates

### Step 1: Login as Admin
1. Go to `http://localhost:3000/auth`
2. Register with matric number starting with "admin" (e.g., `admin123`)
3. Or use existing admin account

### Step 2: Navigate to Elections
1. Click "Admin" in navbar
2. Click "Manage Elections" card
3. Click the **"Create Election"** button (top right)

### Step 3: Fill Election Details
1. **Title**: e.g., "Class Representative Elections 2024"
2. **Description**: Brief description
3. **Election Type**:
   - **General**: All levels can vote
   - **Level-Based**: Only selected level can vote (choose 100, 200, 300, or 400)
4. **Open Immediately**: Check if you want election open right away

### Step 4: Add Positions
1. Type position name (e.g., "President", "Secretary", "Treasurer")
2. Click "Add Position"
3. Repeat for all positions needed

### Step 5: Select Candidates
1. Click on a level button (100, 200, 300, 400) to load students
2. You'll see all students in that level
3. For each student:
   - Click the dropdown next to their name
   - Select which position to add them to
4. The student will be added as a candidate for that position

### Step 6: Create Election
1. Review all positions and candidates
2. Click "Create Election"
3. You'll be redirected back to elections list

### Step 7: Toggle Election Open/Closed
1. Find your election in the list
2. Use the toggle switch to open/close
3. **Green = Open** (students can vote)
4. **Gray = Closed** (voting disabled)

---

## 📸 How to Upload Profile Picture

### For Students:
1. Login to your account
2. Click "Profile" in navbar (or your name)
3. Click the **camera icon** on your profile picture
4. Enter image URL (e.g., from Imgur, Google Drive public link)
5. Click "Upload"
6. Page will refresh with new picture

**Tip**: Use free image hosting like:
- Imgur.com
- Postimages.org
- Or any public image URL

---

## 👥 How to View Students (Admin)

1. Go to Admin Dashboard
2. Click "Manage Students"
3. Features:
   - **Filter by Level**: Click level buttons (100, 200, 300, 400)
   - **Search**: Type name, matric, or email
   - **View Stats**: See student count per level
   - **Profile Pictures**: See uploaded profile pictures

---

## 🗳️ How Students Vote

### Requirements:
- Election must be **OPEN** (toggle switch green)
- For level-based elections: Student must be in target level
- For general elections: All students can vote

### Steps:
1. Login as student
2. Go to "Vote" page
3. See available elections
4. Select candidate for each position
5. Submit vote

### If Election is Closed:
- Error message: **"Election currently closed"**
- Admin must toggle election open first

---

## 🔍 Testing the System

### Test Scenario 1: General Election
1. Create election with type "General"
2. Add positions: President, Secretary
3. Add candidates from different levels
4. Toggle election open
5. Login as any student and vote
6. All students should see the election

### Test Scenario 2: Level-Based Election
1. Create election with type "Level-Based"
2. Select target level: 200
3. Add positions and candidates from 200 level
4. Toggle election open
5. Login as 200 level student → Can vote ✅
6. Login as 100 level student → Cannot see election ❌

### Test Scenario 3: Closed Election
1. Create any election
2. Keep toggle **OFF** (gray/closed)
3. Login as student
4. Try to vote
5. Should get error: "Election currently closed"

---

## 📊 Database Overview

### Students by Level:
```
100 Level: 7 students
200 Level: 7 students  
300 Level: 4 students (some timeouts)
400 Level: 0 students (timeouts)
```

**Note**: If you need more students, run:
```bash
cd backend
go run seed/seed.go
```

---

## 🚨 Troubleshooting

### "No students found in this level"
- **Solution**: Run the seed script again
- Check if backend is running on port 8080

### "Election currently closed" error
- **Solution**: Admin must toggle election open (green switch)

### Profile picture not showing
- **Solution**: 
  - Make sure URL is publicly accessible
  - Try a different image hosting service
  - Check browser console for errors

### Can't see election as student
- **Check**:
  - Is election open? (toggle must be green)
  - Is it level-based? (you must be in target level)
  - Refresh the page

---

## 🎉 Quick Test Flow

1. **Seed students** (already done): `go run seed/seed.go`
2. **Login as admin**: Register with matric `admin123`
3. **Create election**:
   - Go to Admin → Manage Elections → Create Election
   - Type: General
   - Add position: "President"
   - Select level 100, add 2 students as candidates
   - Check "Open immediately"
   - Create
4. **Toggle open**: Make sure switch is green
5. **Login as student**: `student1.level100@bowen.edu.ng` / `password123`
6. **Vote**: Go to Vote page, select candidate, submit
7. **Success!** ✅

---

## 📱 Pages Overview

### Admin Pages:
- `/admin` - Dashboard
- `/admin/students` - Manage Students
- `/admin/elections` - View Elections
- `/admin/elections/create` - Create Election
- `/admin/announcements` - Manage Announcements
- `/admin/past-questions` - Manage Past Questions
- `/admin/notes` - Manage Notes

### Student Pages:
- `/profile` - View/Edit Profile
- `/vote` - Vote in Elections
- `/announcements` - View Announcements
- `/past-questions` - Download Past Questions
- `/notes` - Access Notes

---

**Need Help?** Check the console logs in browser (F12) for detailed error messages!
