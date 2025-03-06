# Role-Based Ticketing System

This project is a role-based support ticketing system, where users can create support tickets and admins can manage and update the status of tickets. It is built with React on the frontend and Node.js with MongoDB on the backend, with JWT-based authentication and role management.

## Features

### User Features:

- **User Registration**: when first page loads user can signup or login.
- **Ticket Creation**: Users can create tickets with a title, description.
- **User Dashboard**: Users can view and manage only their own tickets.

### Admin Features:

- **Admin Registration**: use /admin-login route to login the admin and use email:-admin@example.com and password:-admin123.
- **Ticket Management**: Admins can view all support tickets, update their status (Open, In Progress, Closed), and assign them to users.
- **Admin Dashboard**: Admins can manage tickets and update their statuses.

### Authentication & Authorization:

- **JWT-based Authentication**: Users must authenticate via JWT to access the system.
- **Role-Based Access Control**: Admins have full control over tickets, while users can only access their own tickets.

## How to Get Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YOUR-USERNAME/YOUR-REPO.git
   cd YOUR-REPO
   ```
