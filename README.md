# University Portal - SHINE (SRM Holistic Information on Notification & Engagement)

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Database Schema](#database-schema)
6. [Authentication & Authorization](#authentication--authorization)
7. [API Endpoints](#api-endpoints)
8. [Frontend Components](#frontend-components)
9. [Backend Services](#backend-services)
10. [Key Features & Workflows](#key-features--workflows)
11. [Environment Variables](#environment-variables)
12. [Installation & Setup](#installation--setup)
13. [Deployment](#deployment)

---

## Project Overview

**SHINE** is a comprehensive university management portal for SRM Institute of Science and Technology that provides:

- **Attendance Management System**: Track and manage student attendance with automated alerts, PDF processing, and reporting
- **Student Achievement Portal**: Record, track, and verify student achievements across multiple categories
- **Email Notification System**: Automated email alerts to students, parents, and faculty advisors
- **Placement Matrix System**: Comprehensive placement tracking with Form A and Form B submissions
- **Role-Based Access Control**: Separate dashboards for Students, Faculty Advisors (FA), and Academic Advisors (AA)

The system integrates multiple services including Firebase for real-time data, Flask backend for PDF processing, and Next.js for the frontend interface.

---

## Architecture

The project follows a **multi-tier architecture** with three main components:

### 1. **Next.js Frontend Application** (`SRMproject/`)
   - Server-side rendered React application using Next.js 15.3.3
   - Client-side routing and state management
   - Firebase client SDK for real-time data synchronization
   - Tailwind CSS for styling

### 2. **Python Flask Backend** (`attendence_server_backend/`)
   - Flask REST API for PDF attendance processing
   - PyMuPDF (fitz) for PDF text extraction
   - Firestore integration for attendance data storage
   - Deployed on Render.com

### 3. **React Frontend (Attendance Upload)** (`attendance_server_frontend/`)
   - Standalone React application for attendance PDF upload
   - Communicates with Flask backend
   - Drag-and-drop file upload interface

### Data Flow:
```
User → Next.js App → Firebase Firestore (Primary Data)
User → React Upload App → Flask Backend → Firebase Firestore
```

---

## Technology Stack

### Frontend (Next.js)
- **Framework**: Next.js 15.3.3 (App Router)
- **React**: 19.0.0
- **Firebase**: 11.9.0 (Authentication, Firestore)
- **UI Libraries**:
  - Tailwind CSS 4.x
  - Lucide React (Icons)
  - Framer Motion (Animations)
- **Document Generation**:
  - jsPDF 3.0.1
  - jspdf-autotable 5.0.2
  - ExcelJS 4.4.0
  - XLSX 0.18.5
- **Email**: Resend 4.6.0
- **PDF Processing**: pdf-parse, pdf2json, pdfjs-dist
- **Browser Automation**: Puppeteer-core 20.9.0 (with Chromium)

### Backend (Flask)
- **Framework**: Flask with Flask-CORS
- **PDF Processing**: PyMuPDF (fitz)
- **Data Processing**: Pandas
- **Database**: Firebase Admin SDK (Firestore)
- **Deployment**: Gunicorn (for production)

### Infrastructure
- **Database**: Firebase Firestore
- **Authentication**: Firebase Authentication (Google OAuth)
- **Email Service**: Resend API
- **Hosting**: Render.com (Flask), Vercel/Netlify (Next.js)

---

## Project Structure

```
University-Portal/
│
├── SRMproject/                          # Main Next.js Application
│   ├── app/
│   │   ├── api/                         # Next.js API Routes
│   │   │   ├── alert-student/
│   │   │   ├── approve-aa/
│   │   │   ├── approve-fa/
│   │   │   ├── approve-pending-update/
│   │   │   ├── bulk-alert-students/
│   │   │   ├── delete-approved-achievement/
│   │   │   ├── dismiss-remark/
│   │   │   ├── download-report/
│   │   │   ├── fetch-students/
│   │   │   ├── get-absent-records/
│   │   │   ├── get-all-students-achievements/
│   │   │   ├── get-attendance/
│   │   │   ├── get-basic-student-info/
│   │   │   ├── get-low-attendance-subjects/
│   │   │   ├── get-pending-updates/
│   │   │   ├── get-student-achievements/
│   │   │   ├── get-user-or-section-achievements/
│   │   │   ├── reject-pending-update/
│   │   │   ├── send-emails/
│   │   │   ├── submit-pending-achievement/
│   │   │   └── submit-reason/
│   │   │
│   │   ├── AboutUs/                     # About Us Page
│   │   ├── achievementsPage/            # Student Achievements Portal
│   │   ├── addNewSection/               # Section Management
│   │   ├── admin-attendance/            # Admin Attendance Dashboard
│   │   ├── AAlogsForFAs/                # AA Logs for Faculty Advisors
│   │   ├── components/                  # Reusable Components
│   │   │   ├── Achievements/            # Achievement-related components
│   │   │   ├── DashboardComponents/     # Dashboard UI components
│   │   │   ├── Email-System/            # Email management components
│   │   │   ├── Upload-Attendance/        # Attendance upload components
│   │   │   ├── Admin-DashBoard.js        # Admin/Teacher Dashboard
│   │   │   ├── AuthReset.js              # Authentication reset logic
│   │   │   └── Students-DashBoard.js    # Student Dashboard
│   │   │
│   │   ├── demo/                         # Demo/Preview Page
│   │   ├── placement-matrix/            # Placement Matrix System
│   │   │   ├── FormatAForm.js           # Placement Form A
│   │   │   ├── FormatBForm.js           # Placement Form B
│   │   │   ├── TeacherVerificationTable.js
│   │   │   ├── ApprovedProofs.js
│   │   │   ├── ExportButtonFormA.js
│   │   │   ├── ExportButtonFormB.js
│   │   │   └── Score.js                  # Scoring component
│   │   │
│   │   ├── layout.js                     # Root Layout
│   │   └── page.js                       # Home/Login Page
│   │
│   ├── lib/                              # Utility Libraries
│   │   ├── firebase.js                   # Firebase client config
│   │   ├── firebase-admin.js             # Firebase Admin SDK
│   │   ├── fetchFormA.js                 # Form A data fetcher
│   │   └── fetchFormB.js                 # Form B data fetcher
│   │
│   ├── attendanceLogic.js                # Core attendance logic
│   ├── package.json
│   ├── next.config.mjs
│   └── public/                           # Static assets
│
├── attendence_server_backend/            # Flask Backend
│   ├── app.py                            # Main Flask application
│   ├── requirements.txt                  # Python dependencies
│   ├── render.yaml                       # Render deployment config
│   └── uploads/                          # Temporary file storage
│
└── attendance_server_frontend/           # React Upload App
    ├── src/
    │   ├── AttendanceUploadApp.jsx        # Main upload component
    │   └── App.js
    ├── package.json
    └── public/
```

---

## Database Schema

### Firebase Firestore Collections

#### 1. **`User` Collection** (Student Data)
**Document ID**: Registration Number (e.g., `RA2411003010411`)

```javascript
{
  // Basic Information
  regNo: "RA2411003010411",
  name: "John Doe",
  email: "john.doe@srmist.edu.in",
  section: "A",
  department: "CSE",
  specialization: "AI & ML",
  
  // Contact Information
  phone: "+91XXXXXXXXXX",
  alternatePhone: "+91XXXXXXXXXX",
  personalEmail: "john@gmail.com",
  fatherPhone: "+91XXXXXXXXXX",
  fatherEmail: "father@gmail.com",
  parentEmail: "father@gmail.com", // Used for email alerts
  motherPhone: "+91XXXXXXXXXX",
  motherEmail: "mother@gmail.com",
  guardianPhone: "+91XXXXXXXXXX",
  
  // Academic Information
  advisorName: "Dr. Smith",
  faEmail: "advisor@srmist.edu.in", // Faculty Advisor Email
  dateOfAdmission: "01/07/2023",
  dob: "01/01/2005",
  gender: "Male",
  
  // Attendance Data (Map of subject codes to percentages)
  attendance: {
    "21CSE1001": 85.5,
    "21CSE1002": 92.0,
    "21MAT1001": 78.5
  },
  
  // Absent Records (Map of dates to status strings)
  // Format: "faStatus~aaStatus~reason~faTimestamp~aaTimestamp~alertTimestamp~faRemarks~aaRemarks"
  // faStatus: '0' = Pending, '1' = Verified, '2' = Verified & Forwarded
  // aaStatus: '0' = Pending, '1' = Verified
  absentRecords: {
    "01072025": "0~0~~NA~NA~12:01pm01072025~NA~NA",
    "02072025": "1~0~Medical Emergency~12:30pm02072025~NA~12:01pm02072025~Verified~NA"
  },
  
  // Student Achievements (Map of category to array of achievements)
  achievements: {
    "Participations": [
      {
        id: "uuid-here",
        "Event Name": "Hackathon 2024",
        "Event Date (DD/MM/YYYY)": "15/08/2024",
        "Organization conducted": "SRM",
        // ... other fields
      }
    ],
    "PrizeWinners Technical": [],
    "PrizeWinners Extra Curricular": [],
    "Online Courses": [],
    "Sports Activities": []
    // ... other categories
  },
  
  // Marks Data (Map of subject codes to marks)
  marks: {
    "21CSE1001": 92,
    "21CSE1002": 88
  }
}
```

#### 2. **`UsersLogin` Collection** (Teacher/Faculty Authentication)
**Document ID**: Firebase UID or Email

```javascript
{
  uid: "firebase-uid-here", // or email
  name: "Dr. Smith",
  email: "teacher@srmist.edu.in",
  role: "teacher",
  SecRole: "FA", // or "AA" (Faculty Advisor or Academic Advisor)
  section: "A", // Section they are assigned to
  nameOfFA: "Dr. Smith" // Display name
}
```

#### 3. **`pendingAchievements` Collection** (Pending Achievement Submissions)
**Document ID**: Registration Number

```javascript
{
  // Array of pending achievement items
  pendingItems: [
    {
      id: "unique-id",
      category: "Participations",
      data: {
        "Event Name": "Hackathon 2024",
        "Event Date (DD/MM/YYYY)": "15/08/2024",
        // ... all form fields
      },
      submissionDate: "2024-08-15T10:30:00Z"
    }
  ],
  
  // Array of remarks from FA/AA
  remarks: [
    "Please provide better proof link",
    "Certificate not clear"
  ]
}
```

#### 4. **`User/{regNo}/FormA` Subcollection** (Placement Form A Submissions)
```javascript
{
  registrationNumber: "RA2411003010411",
  fullName: "John Doe",
  gender: "Male",
  nriStudent: "No",
  dateOfBirth: "01/01/2005",
  department: "CSE",
  specialization: "AI & ML",
  section: "A",
  srmistMailId: "john.doe@srmist.edu.in",
  personalMailId: "john@gmail.com",
  mobileNumber: "+91XXXXXXXXXX",
  // ... comprehensive placement data
  proofLinks: {
    "10th/12th Marksheet": "https://...",
    "Certification": "https://..."
  },
  verificationStatus: "pending", // pending, approved, rejected
  teacherRemarks: "",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### 5. **`User/{regNo}/FormB` Subcollection** (Placement Form B Submissions)
```javascript
{
  registrationNumber: "RA2411003010411",
  studentName: "John Doe",
  // ... all scoring-related fields
  totalScore: 850,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

---

## Authentication & Authorization

### Authentication Flow

1. **Google OAuth Login**
   - Users sign in with their Google account
   - System checks if email ends with `@srmist.edu.in` for students
   - Display name must contain registration number in format: `Name (RA2411003010411)`

2. **Role Detection**
   - **Teachers**: Check `UsersLogin` collection using UID or email
     - If found with `role: "teacher"`, grant teacher access
     - `SecRole` determines access level: "FA" or "AA"
   - **Students**: 
     - Verify email domain is `@srmist.edu.in`
     - Extract registration number from display name
     - Check if registration number exists in `User` collection
     - If authorized, update user document with latest info
   - **New Users**: 
     - If UID not found and not a student, show UID for admin approval
     - Admin must add user to `UsersLogin` collection

### Authorization Levels

#### **Student Role**
- Access: Own dashboard
- Can:
  - View own attendance and achievements
  - Submit achievement updates
  - View absent records and submit reasons
  - View placement matrix forms (Form A/B)

#### **Faculty Advisor (FA)**
- Access: Admin dashboard for assigned section
- Can:
  - Upload attendance PDFs
  - View and manage student attendance
  - Verify/forward absent record reasons
  - Approve/reject student achievement submissions
  - Send email alerts to students/parents
  - View placement matrix verification table
  - Generate attendance reports

#### **Academic Advisor (AA)**
- Access: Admin dashboard with section oversight
- Can:
  - View logs from Faculty Advisors
  - Verify absent records forwarded by FAs
  - Final approval on student achievements
  - View all section data

---

## API Endpoints

### Authentication & User Management

#### **GET `/api/route.js`**
- **Description**: Approves pending achievement updates
- **Method**: POST
- **Request Body**:
  ```json
  {
    "regNo": "RA2411003010411"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Update approved"
  }
  ```

### Attendance Management

#### **GET `/api/get-attendance`**
- **Description**: Fetches attendance map for a student
- **Method**: GET
- **Query Parameters**:
  - `regNo` (string, required): Student registration number
- **Response**:
  ```json
  {
    "success": true,
    "attendanceMap": {
      "21CSE1001": 85.5,
      "21CSE1002": 92.0
    }
  }
  ```
- **Error Response**:
  ```json
  {
    "success": false,
    "message": "Attendance data not found for student.",
    "error": "Registration number (regNo) is required."
  }
  ```

#### **POST `/api/fetch-students`**
- **Description**: Fetches all students in a section
- **Method**: POST
- **Request Body**:
  ```json
  {
    "section": "A"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "regNo": "RA2411003010411",
        "name": "John Doe",
        "section": "A",
        "attendance": {...}
      }
    ]
  }
  ```

#### **GET `/api/get-absent-records`**
- **Description**: Fetches absent records for a student
- **Method**: GET
- **Query Parameters**:
  - `regNo` (string, required): Student registration number
  - `role` (string, optional): "FA" or "AA" (default: "FA")
- **Response**:
  ```json
  {
    "success": true,
    "records": [
      {
        "date": "01072025",
        "faStatus": "1", // "0" = Pending, "1" = Verified, "2" = Verified & Forwarded
        "aaApproved": false,
        "resolved": false,
        "reason": "Medical Emergency",
        "faTimestamp": "12:30pm02072025",
        "aaTimestamp": "",
        "alertTimestamp": "12:01pm02072025",
        "faRemarks": "Verified",
        "aaRemarks": ""
      }
    ]
  }
  ```
- **Note**: AA role only sees records with `faStatus === "2"` (forwarded records)

#### **POST `/api/get-low-attendance-subjects`**
- **Description**: Identifies subjects with attendance below 75%
- **Method**: POST
- **Request Body**:
  ```json
  {
    "attendanceMap": {
      "21CSE1001": 85.5,
      "21CSE1002": 72.0
    }
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "lowSubjects": ["21CSE1002"]
  }
  ```

#### **POST `/api/alert-student`**
- **Description**: Creates an absent alert for a student on a specific date
- **Method**: POST
- **Request Body**:
  ```json
  {
    "regNo": "RA2411003010411",
    "dateStr": "01072025" // Format: DDMMYYYY
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Alert raised successfully"
  }
  ```

#### **POST `/api/bulk-alert-students`**
- **Description**: Creates absent alerts for multiple students
- **Method**: POST
- **Request Body**:
  ```json
  {
    "regNos": ["RA2411003010411", "RA2411003010412"],
    "dateStr": "01072025"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "result": [
      {
        "regNo": "RA2411003010411",
        "success": true,
        "message": "Alert created successfully"
      }
    ]
  }
  ```
- **Note**: Skips students who already have an alert for that date

#### **POST `/api/submit-reason`**
- **Description**: Submits reason for absence
- **Method**: POST
- **Request Body**:
  ```json
  {
    "regNo": "RA2411003010411",
    "dateStr": "01072025",
    "reason": "Medical Emergency"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Reason submitted successfully"
  }
  ```

#### **POST `/api/approve-fa`**
- **Description**: Faculty Advisor verifies an absent record
- **Method**: POST
- **Request Body**:
  ```json
  {
    "regNo": "RA2411003010411",
    "dateStr": "01072025",
    "remarks": "Verified" // Optional
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "FA verified successfully"
  }
  ```
- **Behavior**: Sets `faStatus = "1"` (Verified)

#### **POST `/api/forward-fa`**
- **Description**: Faculty Advisor verifies and forwards to AA
- **Method**: POST
- **Request Body**:
  ```json
  {
    "regNo": "RA2411003010411",
    "dateStr": "01072025",
    "remarks": "Forwarded for approval" // Optional
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "FA verified & forwarded successfully"
  }
  ```
- **Behavior**: Sets `faStatus = "2"` (Verified & Forwarded)

#### **POST `/api/approve-aa`**
- **Description**: Academic Advisor verifies forwarded records
- **Method**: POST
- **Request Body**:
  ```json
  {
    "regNo": "RA2411003010411",
    "dateStr": "01072025",
    "remarks": "Approved" // Optional
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "AA approval successful"
  }
  ```
- **Behavior**: Sets `aaStatus = "1"` (Verified)
- **Precondition**: `faStatus` must be "2" (forwarded)

#### **GET `/api/download-report`**
- **Description**: Generates PDF attendance report for a section and month
- **Method**: GET
- **Query Parameters**:
  - `section` (string, required): Section identifier
  - `month` (string, required): Month in format "MMYYYY" (e.g., "072025")
- **Response**: PDF file download
- **Content-Type**: `application/pdf`
- **Headers**:
  - `Content-Disposition: attachment; filename="Attendance_Report_A_072025.pdf"`
- **Error Response** (404): Returns 204 No Content if no data found

### Achievement Management

#### **POST `/api/get-basic-student-info`**
- **Description**: Fetches basic student information
- **Method**: POST
- **Request Body**:
  ```json
  {
    "regNo": "RA2411003010411"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Student basic info fetched",
    "data": {
      "name": "John Doe",
      "regNo": "RA2411003010411",
      "section": "A"
    }
  }
  ```

#### **POST `/api/get-student-achievements`**
- **Description**: Fetches all achievements for a student
- **Method**: POST
- **Request Body**:
  ```json
  {
    "regNo": "RA2411003010411"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Achievements fetched",
    "data": {
      "name": "John Doe",
      "regNo": "RA2411003010411",
      "section": "A",
      "achievements": {
        "Participations": [
          {
            "id": "uuid-here",
            "Event Name": "Hackathon 2024",
            // ... other fields
          }
        ]
      }
    }
  }
  ```

#### **POST `/api/get-all-students-achievements`**
- **Description**: Fetches achievements for all students
- **Method**: POST
- **Request Body**: None
- **Response**:
  ```json
  {
    "success": true,
    "message": "All student data fetched",
    "data": [
      {
        "name": "John Doe",
        "regNo": "RA2411003010411",
        "section": "A",
        "achievements": {...}
      }
    ]
  }
  ```

#### **POST `/api/get-user-or-section-achievements`**
- **Description**: Fetches achievements by student or section
- **Method**: POST
- **Request Body**:
  ```json
  {
    "identifier": "RA2411003010411", // or section like "A"
    "type": "regNo" // or "section"
  }
  ```
- **Response**: Same structure as `get-student-achievements` or array for section

#### **POST `/api/submit-pending-achievement`**
- **Description**: Submits a new or updated achievement for approval
- **Method**: POST
- **Request Body**:
  ```json
  {
    "regNo": "RA2411003010411",
    "category": "Participations",
    "achievementData": {
      "id": "uuid-here", // For updates, existing ID; for new, generate UUID
      "Event Name": "Hackathon 2024",
      "Event Date (DD/MM/YYYY)": "15/08/2024",
      // ... all category-specific fields
    }
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Pending achievement saved."
  }
  ```
- **Behavior**: 
  - If `id` exists in pending items, replaces it (update)
  - Otherwise, adds new item (create)

#### **POST `/api/get-pending-updates`**
- **Description**: Fetches pending achievement submissions
- **Method**: POST
- **Request Body**:
  ```json
  {
    "identifier": "RA2411003010411", // or section like "A"
    "type": "regNo" // or "section"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "name": "John Doe",
      "regNo": "RA2411003010411",
      "section": "A",
      "pendingItems": [
        {
          "id": "uuid-here",
          "category": "Participations",
          "data": {...},
          "submissionDate": "2024-08-15T10:30:00Z"
        }
      ],
      "remarks": ["Please provide better proof link"]
    }
  }
  ```

#### **POST `/api/approve-pending-update`**
- **Description**: Approves all pending achievements for a student
- **Method**: POST
- **Request Body**:
  ```json
  {
    "regNo": "RA2411003010411",
    "remarks": "Approved" // Optional
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "All pending updates approved and applied."
  }
  ```
- **Behavior**:
  - Moves all pending items to `User.achievements`
  - Clears `pendingItems` array
  - Adds remarks to `remarks` array if provided

#### **POST `/api/reject-pending-update`**
- **Description**: Rejects all pending achievements
- **Method**: POST
- **Request Body**:
  ```json
  {
    "regNo": "RA2411003010411",
    "remarks": "Proof link not working" // Optional
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "All pending updates rejected and remarked."
  }
  ```
- **Behavior**:
  - Clears `pendingItems` array
  - Adds remarks to `remarks` array
  - If no remarks, deletes the document

#### **POST `/api/dismiss-remark`**
- **Description**: Clears all remarks for a student
- **Method**: POST
- **Request Body**:
  ```json
  {
    "regNo": "RA2411003010411"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Remarks dismissed successfully."
  }
  ```
- **Behavior**: 
  - Clears `remarks` array
  - If `pendingItems` is also empty, deletes document

#### **POST `/api/delete-approved-achievement`**
- **Description**: Deletes an approved achievement directly
- **Method**: POST
- **Request Body**:
  ```json
  {
    "regNo": "RA2411003010411",
    "category": "Participations",
    "achievementId": "uuid-here"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Achievement deleted successfully."
  }
  ```

### Email System

#### **POST `/api/send-emails`**
- **Description**: Sends email alerts to students, parents, and faculty advisors
- **Method**: POST
- **Request Body**:
  ```json
  {
    "studentIds": ["RA2411003010411", "RA2411003010412"],
    "type": "attendance", // or "marks"
    "imageMap": {
      "ra2411003010411": "https://...", // Optional, base64 image URLs keyed by lowercase regNo
      "ra2411003010412": "https://..."
    }
  }
  ```
- **Response**:
  ```json
  {
    "results": [
      {
        "id": "RA2411003010411",
        "status": "success", // "success", "partial", "failed", "skipped"
        "details": {
          "studentResult": {...},
          "parentResult": {...},
          "faResult": {...}
        }
      }
    ]
  }
  ```
- **Behavior**:
  - Sends three emails per student: student, parent, FA
  - For attendance: Only includes subjects with < 75%
  - Includes attachments if `imageMap` provided
  - Uses Resend API for email delivery
  - Returns status for each email recipient

---

## Frontend Components

### Core Components

#### **`app/page.js`** - Home/Login Page
- **Purpose**: Main entry point with authentication and role-based routing
- **Features**:
  - Google OAuth login
  - Role detection (Student/Teacher)
  - New user UID display for admin approval
  - Automatic dashboard routing
- **State Management**:
  - `userRole`: Current user role (null/student/teacher)
  - `regNo`: Student registration number
  - `section`: Student section
  - `secRole`: Teacher secondary role (FA/AA)
  - `isNewUser`: Flag for new user flow

#### **`app/layout.js`** - Root Layout
- **Purpose**: Wraps entire application with common UI elements
- **Features**:
  - Navigation bar with menu
  - Footer
  - Logout handler
  - HamsterLoader overlay
  - Side menu for navigation
- **Components Used**:
  - `NavBar`: Top navigation
  - `Footer`: Bottom footer
  - `AuthReset`: Authentication reset on mount

#### **`components/Admin-DashBoard.js`** - Admin/Teacher Dashboard
- **Purpose**: Main dashboard for Faculty Advisors and Academic Advisors
- **Props**:
  - `secRole`: "FA" or "AA"
  - `SectionofFA`: Section assigned to FA
  - `nameOfFA`: Display name of FA
- **Features**:
  - Card-based navigation to different modules
  - Role-based component rendering
  - Section-specific data filtering
- **Available Modules**:
  - Upload Attendance (`uploadAttendance`)
  - Email System (`emailSystem`) - Redirects to `/AAlogsForFAs` for AA
  - Achievements (`Achievements`)
  - Teacher Verification Table (`TeacherVerificationTable`)
  - Placement Matrix (redirects to `/placement-matrix`)

#### **`components/Students-DashBoard.js`** - Student Dashboard
- **Purpose**: Student-facing dashboard with personal data
- **Props**:
  - `regNo`: Student registration number
  - `section`: Student section
- **Features**:
  - Student profile display and editing
  - Attendance viewing
  - Achievement portal access
  - PDF report generation
  - Absent records viewing and reason submission
- **Key Functions**:
  - `handleChange`: Updates form data
  - `handleSave`: Saves profile changes to Firestore
  - `generatePDF`: Creates PDF profile report
  - `handleDeclineAlert`: Declines attendance alerts

#### **`components/Upload-Attendance/UploadSystem.js`**
- **Purpose**: Placeholder for attendance upload (currently minimal)
- **Status**: Basic stub component

#### **`components/Upload-Attendance/StudentAttendancePage.jsx`**
- **Purpose**: Student attendance viewing interface
- **Features**:
  - Displays attendance map
  - Shows low attendance warnings
  - Visual attendance charts

#### **`components/Email-System/EmailSystem.js`**
- **Purpose**: Email management system for teachers
- **Props**:
  - `SectionofFA`: Section filter
  - `nameOfFA`: FA name for display
- **Sub-components**:
  - `StudentsTable`: Main student listing with email actions
  - `MarksTable`: Marks-based email management
  - `CompleteStudentForm`: Student data entry form
  - `AddStudentForm`: Quick student addition

#### **`components/Email-System/StudentsTable.js`**
- **Purpose**: Lists students in a section with attendance/email actions
- **Features**:
  - Fetch students by section
  - Display attendance percentages
  - Bulk/single email sending
  - Image attachment support
  - Alert creation
  - Low attendance highlighting

#### **`components/Achievements/AdminAchievementDashboard.jsx`**
- **Purpose**: Admin interface for managing student achievements
- **Props**:
  - `secRole`: FA or AA role
  - `SectionofFA`: Section filter
- **Features**:
  - View pending achievements by section
  - Approve/reject submissions
  - View approved achievements
  - Delete approved achievements
  - Section-wide achievement viewing

#### **`components/Achievements/AchievementsTable.js`**
- **Purpose**: Displays achievement data in tabular format
- **Features**:
  - Category-wise grouping
  - Filtering and sorting
  - Proof link viewing

#### **`app/achievementsPage/StudentAchievementsPortal.jsx`**
- **Purpose**: Student interface for submitting achievements
- **Features**:
  - Multiple achievement category forms
  - Dynamic form generation based on category
  - Form validation
  - Pending submissions view
  - Approved achievements display
  - Remarks display
- **Categories Supported**:
  - Participations
  - PrizeWinners Technical
  - PrizeWinners Extra Curricular
  - Online Courses
  - Sports Activities
  - And more...

### Placement Matrix Components

#### **`app/placement-matrix/page.js`** - Placement Matrix Main Page
- **Purpose**: Entry point for placement matrix system
- **Features**:
  - Role-based component rendering
  - Format A/B selection for students
  - Teacher verification tables
- **For Students**: Shows Format A/B selection buttons
- **For Teachers**: Shows verification and approval interfaces

#### **`app/placement-matrix/FormatAForm.js`**
- **Purpose**: Comprehensive placement form A submission
- **Features**:
  - Extensive student information collection
  - Academic history (10th, 12th, CGPA)
  - Skills and certifications
  - Project experience
  - Proof link management
  - Save/submit functionality
  - Edit mode support
- **Data Storage**: `User/{regNo}/FormA` subcollection

#### **`app/placement-matrix/FormatBForm.js`**
- **Purpose**: Point-based placement scoring form
- **Features**:
  - Multiple scoring categories:
    - Academic (10th, 12th, CGPA)
    - GitHub activity
    - Coding practice
    - Internships
    - Certifications
    - Projects
    - Competitions
  - Automatic score calculation
  - Total score display
- **Data Storage**: `User/{regNo}/FormB` subcollection

#### **`app/placement-matrix/TeacherVerificationTable.js`**
- **Purpose**: Teacher interface for verifying placement forms
- **Features**:
  - Lists pending Form A submissions
  - Approve/reject actions
  - Remarks addition
  - Proof link verification

#### **`app/placement-matrix/ApprovedProofs.js`**
- **Purpose**: Displays approved placement proofs
- **Features**:
  - Filter by student/section
  - Proof link viewing

#### **`app/placement-matrix/Score.js`**
- **Purpose**: Scoring component for Form B
- **Features**:
  - Real-time score calculation
  - Category-wise breakdown

### Dashboard Components

#### **`components/DashboardComponents/NavBar.js`**
- **Purpose**: Top navigation bar
- **Features**:
  - Logo display
  - Menu toggle button
  - User info display
  - Logout button

#### **`components/DashboardComponents/Footer.js`**
- **Purpose**: Footer with links and information

#### **`components/DashboardComponents/HamsterLoader.js`**
- **Purpose**: Loading animation component
- **Usage**: Shown during authentication and data loading

#### **`components/DashboardComponents/DashCards.js`**
- **Purpose**: Card-based navigation component
- **Features**:
  - Icon-based cards
  - Click handlers for module selection

#### **`components/DashboardComponents/SearchBar.js`**
- **Purpose**: Search functionality component

#### **`components/DashboardComponents/AnimatedBlob.js`**
- **Purpose**: Animated background element

---

## Backend Services

### Flask Backend (`attendence_server_backend/app.py`)

#### **Main Application**
- **Framework**: Flask with CORS enabled
- **Upload Limit**: 100 MB maximum file size
- **Firebase Integration**: Uses Firebase Admin SDK for Firestore

#### **Endpoints**

##### **GET `/`** (Health Check)
- **Purpose**: Backend health check
- **Response**: `"✅ University Portal backend is live!"`

##### **POST `/extract-attendance`**
- **Purpose**: Extracts attendance data from PDF and updates Firestore
- **Request**: 
  - Content-Type: `multipart/form-data`
  - File field: `pdf` (PDF file)
- **Process**:
  1. Receives PDF file
  2. Extracts text using PyMuPDF
  3. Parses student data using regex patterns:
     - Student pattern: `(\d+)\s+(RA\d{13})\s+([A-Z ]+)`
     - Subject attendance pattern: `(21[A-Z]{3}\d{3}[TJL]?(?:\([A-Z]\))?)\s*[\r\n]+\s*(\d{2,3}\.\d+)`
  4. Creates CSV file
  5. Updates Firestore `User` collection with attendance data
  6. Cleans up temporary files
- **Response**:
  ```json
  {
    "message": "Upload and processing successful.",
    "csv_filename": "unique_id_filename.csv",
    "download_url": "/download/csv_filename"
  }
  ```
- **Error Handling**: Returns 500 with error message

##### **GET `/download/<filename>`**
- **Purpose**: Downloads processed CSV file
- **Response**: File download

#### **PDF Processing Logic**
- Uses regex to extract:
  - Student serial number
  - Registration number (RA format)
  - Student name
  - Subject codes (21XXX format)
  - Attendance percentages
- Handles subject code variations (with/without suffixes)
- Creates structured DataFrame for processing

---

## Key Features & Workflows

### 1. Attendance Management Workflow

#### **PDF Upload Process**:
1. Teacher uploads attendance PDF via React upload app
2. PDF sent to Flask backend (`/extract-attendance`)
3. Backend extracts text and parses student data
4. Attendance data updated in Firestore `User.attendance` map
5. Success confirmation returned

#### **Absent Alert Workflow**:
1. **Alert Creation** (`alert-student` API):
   - Teacher creates alert for student on specific date
   - Creates entry in `absentRecords` with status `0~0~~NA~NA~timestamp~NA~NA`
2. **Student Response** (`submit-reason` API):
   - Student views alert in dashboard
   - Submits reason for absence
   - Updates record: `0~0~reason~NA~NA~timestamp~NA~NA`
3. **FA Verification** (`approve-fa` or `forward-fa` API):
   - FA verifies reason
   - Option 1: Verify only (`approve-fa`): Sets status to `1~0~reason~faTimestamp~NA~timestamp~remarks~NA`
   - Option 2: Verify & Forward (`forward-fa`): Sets status to `2~0~reason~faTimestamp~NA~timestamp~remarks~NA`
4. **AA Verification** (`approve-aa` API):
   - AA can only verify records with `faStatus = "2"`
   - Sets final status: `2~1~reason~faTimestamp~aaTimestamp~timestamp~faRemarks~aaRemarks`
   - Record is now "resolved"

#### **Email Alert Workflow**:
1. Teacher selects students with low attendance
2. System identifies subjects with < 75% attendance
3. Emails sent to:
   - Student (student email)
   - Parent (parentEmail)
   - Faculty Advisor (faEmail)
4. Optional image attachments included
5. Email contains HTML formatted attendance summary

#### **Report Generation**:
1. Teacher selects section and month
2. System fetches all absent records for section
3. Filters by month (DDMMYYYY format, month part: positions 2-8)
4. Generates HTML report
5. Converts HTML to PDF using Puppeteer + Chromium
6. Returns PDF for download

### 2. Achievement Management Workflow

#### **Student Submission**:
1. Student accesses Achievement Portal
2. Selects achievement category
3. Fills dynamic form based on category
4. Submits via `submit-pending-achievement` API
5. Data stored in `pendingAchievements` collection
6. Status: Pending approval

#### **FA/AA Approval Process**:
1. Teacher views pending achievements in Admin Dashboard
2. Can filter by section or individual student
3. Reviews pending items and remarks
4. **Approve** (`approve-pending-update`):
   - All pending items moved to `User.achievements`
   - `pendingItems` array cleared
   - Optional remarks added
5. **Reject** (`reject-pending-update`):
   - `pendingItems` array cleared
   - Rejection remarks added
   - Student can resubmit

#### **Achievement Categories**:
- **Participations**: Event participations
- **PrizeWinners Technical**: Technical competition prizes
- **PrizeWinners Extra Curricular**: Non-technical prizes
- **Online Courses**: Course completions
- **Sports Activities**: Sports achievements
- Additional categories as configured

### 3. Placement Matrix Workflow

#### **Student Submission (Form A)**:
1. Student selects Format A
2. Fills comprehensive placement form
3. Provides proof links for verifications
4. Saves/submits form
5. Data stored in `User/{regNo}/FormA` subcollection
6. Status set to "pending"

#### **Student Submission (Form B)**:
1. Student selects Format B
2. Enters scoring-related data
3. System calculates points automatically
4. Total score displayed
5. Data stored in `User/{regNo}/FormB` subcollection

#### **Teacher Verification**:
1. Teacher views `TeacherVerificationTable`
2. Lists all pending Form A submissions
3. Reviews proof links
4. Approves or rejects with remarks
5. Approved proofs visible in `ApprovedProofs` component

### 4. Email System Workflow

#### **Attendance Email**:
1. Teacher views `StudentsTable`
2. Selects students with low attendance
3. System identifies subjects < 75%
4. Optionally attaches student photos
5. Sends HTML emails to three recipients
6. Email includes:
   - Subject line: "Attendance Alert"
   - Student/parent information
   - List of low attendance subjects
   - Attachment (if provided)

#### **Marks Email**:
1. Similar process for marks
2. Shows marks for all subjects
3. Different email template

---

## Environment Variables

### Next.js Application (`SRMproject/`)

Create `.env.local`:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Firebase Admin (Server-side)
FIREBASE_SERVICE_ACCOUNT_B64=base64-encoded-service-account-json

# Email Service (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Flask Backend URL
NEXT_PUBLIC_RENDER_DEPLOY_HOOK_URL=https://api.render.com/deploy/srv-xxxxx (optional)

# Render Backend URL
NEXT_PUBLIC_FLASK_BACKEND_URL=https://university-portal-b2v8.onrender.com
```

### Flask Backend (`attendence_server_backend/`)

Set environment variables in Render.com dashboard:

```bash
# Firebase Service Account (JSON as string)
FIREBASE_CREDS_JSON={"type":"service_account","project_id":"..."}

# Port (automatically set by Render)
PORT=10000
```

---

## Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- Firebase project with Firestore enabled
- Firebase Authentication (Google provider enabled)
- Resend API account (for emails)

### 1. Next.js Application Setup

```bash
cd SRMproject
npm install
```

Create `.env.local` with Firebase and Resend credentials (see Environment Variables).

### 2. Flask Backend Setup

```bash
cd attendence_server_backend
pip install -r requirements.txt
```

Set environment variables in deployment platform.

### 3. React Upload App Setup (Optional)

```bash
cd attendance_server_frontend
npm install
npm start
```

### 4. Firebase Configuration

1. Create Firebase project
2. Enable Firestore Database
3. Enable Authentication (Google provider)
4. Generate service account key
5. Add Firestore security rules (if needed)
6. Configure authorized domains for OAuth

### 5. Initial Data Setup

#### Create Teacher User:
```javascript
// In Firebase Console → Firestore
Collection: UsersLogin
Document ID: teacher-uid-or-email
{
  name: "Dr. Smith",
  email: "teacher@srmist.edu.in",
  role: "teacher",
  SecRole: "FA", // or "AA"
  section: "A",
  nameOfFA: "Dr. Smith"
}
```

#### Create Student User:
```javascript
// Collection: User
Document ID: RA2411003010411
{
  regNo: "RA2411003010411",
  name: "John Doe",
  email: "john.doe@srmist.edu.in",
  section: "A",
  department: "CSE"
  // ... other fields
}
```

---

## Deployment

### Next.js Application

#### Vercel (Recommended):
```bash
npm install -g vercel
cd SRMproject
vercel
```

Configure environment variables in Vercel dashboard.

#### Netlify:
```bash
cd SRMproject
npm run build
# Deploy dist folder
```

### Flask Backend

#### Render.com:
1. Connect GitHub repository
2. Select `attendence_server_backend` directory
3. Build command: `pip install -r requirements.txt`
4. Start command: `gunicorn app:app`
5. Set environment variables in dashboard

The `render.yaml` file configures the deployment automatically.

### Environment-Specific Configuration

- **Development**: Uses local Firebase emulator (optional)
- **Production**: Uses production Firebase project
- **Backend URL**: Update `NEXT_PUBLIC_FLASK_BACKEND_URL` in production

---

## Key Files Reference

### Core Logic Files

- **`attendanceLogic.js`**: 
  - All attendance-related business logic
  - Functions: `fetchStudentsBySection`, `alertStudent`, `submitReason`, `approveFA`, `approveAA`, `getAbsentRecords`, `bulkAlertStudents`, `generatePdfReport`

- **`components/Achievements/achievementFns.js`**: 
  - All achievement-related business logic
  - Functions: `getStudentAchievements`, `submitPendingAchievement`, `approvePendingUpdate`, `rejectPendingUpdate`, `getPendingUpdates`, `deleteApprovedAchievement`

### Utility Files

- **`lib/firebase.js`**: Firebase client configuration
- **`lib/firebase-admin.js`**: Firebase Admin SDK setup (server-side)
- **`lib/fetchFormA.js`**: Placement Form A data fetcher
- **`lib/fetchFormB.js`**: Placement Form B data fetcher

### Configuration Files

- **`next.config.mjs`**: Next.js configuration
- **`package.json`**: Dependencies and scripts
- **`jsconfig.json`**: JavaScript path aliases

---

## Development Notes

### Absent Record Status Format

The absent record string format is:
```
faStatus~aaStatus~reason~faTimestamp~aaTimestamp~alertTimestamp~faRemarks~aaRemarks
```

- **faStatus**: `'0'` = Pending, `'1'` = Verified, `'2'` = Verified & Forwarded
- **aaStatus**: `'0'` = Pending, `'1'` = Verified
- All fields use `~` as delimiter
- Missing values use `'NA'`

### Date Formats

- **Absent Records**: `DDMMYYYY` (e.g., "01072025" for July 1, 2025)
- **Timestamps**: `HH:MMampmDDMMYYYY` (e.g., "12:01pm01072025")
- **Achievements**: `DD/MM/YYYY` (e.g., "15/08/2024")
- **Input Fields**: ISO format `YYYY-MM-DD` for date inputs

### Registration Number Format

- Pattern: `RA\d{13}` (e.g., `RA2411003010411`)
- Extracted from Google display name: `"Name (RA2411003010411)"`

### Section Filtering

- FAs can only see/manage their assigned section
- AAs can see all sections (or specific ones based on configuration)
- Students see only their own data

---

## Troubleshooting

### Common Issues

1. **Authentication Fails**:
   - Verify Firebase project configuration
   - Check Google OAuth authorized domains
   - Ensure display name contains registration number

2. **PDF Upload Fails**:
   - Check Flask backend is running
   - Verify file size < 100 MB
   - Check PDF format matches expected structure

3. **Email Not Sending**:
   - Verify Resend API key
   - Check email addresses in student data
   - Review Resend dashboard for errors

4. **Firestore Permissions**:
   - Review Firestore security rules
   - Verify service account has proper permissions

5. **Missing Attendance Data**:
   - Verify PDF format matches expected pattern
   - Check regex patterns in Flask backend
   - Review Firestore `User.attendance` map

---

## Future Enhancements

- [ ] Real-time notifications
- [ ] Mobile app integration
- [ ] Advanced analytics dashboard
- [ ] Bulk student import
- [ ] Automated report scheduling
- [ ] Multi-language support
- [ ] Enhanced PDF processing with OCR
- [ ] Integration with university ERP

---

## License

This is a proprietary project for SRM Institute of Science and Technology.

---

## Support

For issues or questions:
- Email: admin@srmist.edu.in
- Contact development team through internal channels

---

**Last Updated**: 2024
**Version**: 1.0.0
**Maintained By**: SRM Development Team
