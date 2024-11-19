# SkillForge Frontend

SkillForge Frontend is a React-based application designed to facilitate role-based course management. The platform serves two user roles:

- **Admin**: Manages courses, users, modules, discussions, announcements, quizzes, and concerns.
- **Employee**: Interacts with assigned courses, reads modules, participates in discussions, attempts quizzes, and posts concerns.

---

## Features

### Admin Features
1. **User Management**:
   - Create, view, update, and delete users.
   - Assign and deassign courses to users.

2. **Course Management**:
   - Create, view, update, and delete courses.

3. **Module Management**:
   - Add, update, and delete modules within courses.
   - View course content structure.

4. **Discussion Management**:
   - Create, update, and delete discussions.
   - Monitor and manage discussion threads.

5. **Announcement Management**:
   - Post announcements for courses.
   - Manage existing announcements.

6. **Quiz Management**:
   - Create quizzes with questions.
   - Update and delete quizzes.

7. **Concern Management**:
   - View and reply to employee concerns.

### Employee Features
1. **Dashboard**:
   - View all courses assigned by the Admin.
   
2. **Course Interaction**:
   - Start and progress through assigned courses.
   - Read and mark modules as completed.
   
3. **Discussion Participation**:
   - View and participate in course discussions.

4. **Quizzes**:
   - Attempt quizzes assigned to their courses.
   
5. **Announcements**:
   - View course-specific announcements.
   
6. **Concerns**:
   - Post concerns to the Admin.
   - Reply to Admin responses on their concerns.

---

## Project Setup

### Prerequisites

Ensure the following are installed:
- **Node.js** (v16 or later)
- **npm** (v7 or later) or **yarn**

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/SkillForge-Frontend.git

2. Navigate to the project repository:
    ```bash
    cd SkillForge-Frontend

3. Install Dependencies:
    ```bash 
    npm install


### Running the Application

1. Start the Development Server:
    ```bash
    npm run dev

2. To build the project for Production:
    ```bash
    npm run build

3. Th preview the production build
    ```bash 
    npm run preview

4. Run tests
    ```bash 
    npm run tests


### Routing
The application uses React Router for navigation. Key routes include:

- /login: User login page.
- /dashboard: Dashboard for both Admins and Employees.
- /admin/create-course: Admin creates a new course.
- /course/:courseId: Course-specific details for both Admins and Employees.
- /course/:courseId/modules: List of course modules.
- /course/:courseId/quiz: Quiz management.
- /course/:courseId/announcements: Course announcements.
- /course/:courseId/discussions: Discussion threads.
- /concerns: Manage and respond to concerns.

