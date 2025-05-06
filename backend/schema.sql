-- Users Table
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    firebase_uid TEXT,
    role TEXT CHECK(role IN ('Student', 'Instructor', 'Client')) NOT NULL,
    join_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Projects Table
CREATE TABLE projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    skills_required TEXT,
    resources TEXT,
    client_id INTEGER,
    status TEXT DEFAULT 'Available',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES users(id)
);

-- Preferences Table
CREATE TABLE preferences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    project_id INTEGER,
    ranking INTEGER DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id),
    FOREIGN KEY (project_id) REFERENCES projects(id),
    UNIQUE(student_id, project_id)
);

-- Groups Table
CREATE TABLE groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER,
    name TEXT,
    status TEXT DEFAULT 'Forming',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- Group Members Table
CREATE TABLE group_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id INTEGER,
    student_id INTEGER,
    status TEXT DEFAULT 'Pending',
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES groups(id),
    FOREIGN KEY (student_id) REFERENCES users(id),
    UNIQUE(group_id, student_id)
);

-- Evaluations Table
CREATE TABLE evaluations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id INTEGER,
    instructor_id INTEGER,
    date DATETIME,
    notes TEXT,
    status TEXT DEFAULT 'Scheduled',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES groups(id),
    FOREIGN KEY (instructor_id) REFERENCES users(id)
);
