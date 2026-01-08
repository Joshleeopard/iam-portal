# IAM Access Portal

A web application for managing Identity and Access Management (IAM) access requests. Users can submit requests for Azure resources, and administrators can approve or reject them through an intuitive interface.

## Features

- **Access Request Submission**: Users can request various types of Azure access including:
  - Azure AD Groups
  - Service Principals
  - Role Assignments
  - Resource Access

- **Approval Workflow**: Administrators can review, approve, or reject access requests with optional notes

- **Request Tracking**: View all access requests with their current status (pending, approved, rejected)

- **Persistent Storage**: SQLite database for reliable data persistence

- **Modern UI**: Clean, responsive React interface with gradient designs and smooth animations

## Tech Stack

### Backend
- **Flask** - Python web framework
- **SQLAlchemy** - ORM for database operations
- **Flask-CORS** - Cross-origin resource sharing
- **SQLite** - Lightweight database

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Axios** - HTTP client
- **CSS3** - Modern styling with gradients and transitions

## Project Structure

```
iam-portal/
├── backend/
│   ├── app/
│   │   ├── __init__.py      # Flask app initialization
│   │   ├── models.py        # Database models
│   │   └── routes.py        # API endpoints
│   ├── run.py               # Application entry point
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main application component
│   │   ├── AccessRequestForm.jsx  # Request submission form
│   │   ├── RequestsList.jsx # Request list and approval UI
│   │   └── App.css          # Styling
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Installation

### Prerequisites
- Python 3.8+
- Node.js 18+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
```bash
# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. (Optional) Create a `.env` file for custom configuration:
```bash
cp ../.env.example .env
```

Edit `.env` to set:
- `SECRET_KEY` - Flask secret key for sessions
- `DATABASE_URL` - Database connection string (defaults to SQLite)

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

### Start the Backend

1. Make sure you're in the backend directory with the virtual environment activated
2. Run the Flask application:
```bash
python run.py
```

The backend will start on `http://localhost:5000`

### Start the Frontend

1. In a new terminal, navigate to the frontend directory
2. Start the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

3. Open your browser and navigate to `http://localhost:5173`

## Usage

### Submitting an Access Request

1. Fill out the form on the left side:
   - **Name**: Your full name
   - **Email**: Your email address
   - **Access Type**: Select from the dropdown (Azure AD Group, Service Principal, etc.)
   - **Justification**: Explain why you need this access

2. Click "Submit Request"

3. Your request will appear in the list on the right with a "pending" status

### Approving/Rejecting Requests

1. Find a pending request in the list on the right
2. Click either "Approve" or "Reject"
3. Enter your name as the approver
4. (Optional for approval / Required for rejection) Add notes explaining your decision
5. The request status will update immediately

## API Endpoints

### Health Check
```
GET /api/health
```
Returns the API health status.

### Get All Requests
```
GET /api/requests
```
Returns all access requests ordered by creation date (newest first).

### Create Request
```
POST /api/requests
```
Body:
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "access_type": "Azure AD Group",
  "justification": "Need access for project work"
}
```

### Get Single Request
```
GET /api/requests/<id>
```
Returns a specific access request by ID.

### Approve Request
```
POST /api/requests/<id>/approve
```
Body (optional):
```json
{
  "approved_by": "Jane Admin",
  "notes": "Approved for Q1 project"
}
```

### Reject Request
```
POST /api/requests/<id>/reject
```
Body (optional):
```json
{
  "approved_by": "Jane Admin",
  "notes": "Insufficient justification"
}
```

## Database Schema

### AccessRequest Table

| Column | Type | Description |
|--------|------|-------------|
| id | Integer | Primary key |
| name | String(100) | Requester's name |
| email | String(120) | Requester's email |
| access_type | String(50) | Type of access requested |
| justification | Text | Reason for access |
| status | String(20) | pending, approved, or rejected |
| created_at | DateTime | Request creation timestamp |
| updated_at | DateTime | Last update timestamp |
| approved_by | String(120) | Name of approver/rejector |
| approval_notes | Text | Notes from approver |

## Development

### Backend Development

The backend uses Flask with SQLAlchemy ORM. Database models are defined in `backend/app/models.py` and API routes in `backend/app/routes.py`.

To add new features:
1. Define models in `models.py`
2. Create routes in `routes.py`
3. Register blueprints in `app/__init__.py`

### Frontend Development

The frontend is built with React and Vite. Components are in `frontend/src/`:
- `App.jsx` - Main container
- `AccessRequestForm.jsx` - Form component
- `RequestsList.jsx` - List and approval UI

To customize:
- Modify styles in `App.css`
- Add new components in the `src/` directory
- Update API endpoints in component files

### Building for Production

Frontend:
```bash
cd frontend
npm run build
```

The build output will be in `frontend/dist/`.

## Future Enhancements

- **Authentication**: Add user login with Azure AD or OAuth
- **Azure Integration**: Actual integration with Azure AD Graph API
- **Email Notifications**: Send emails on request submission and status changes
- **Advanced Filtering**: Filter requests by status, date, or type
- **Audit Logs**: Track all actions for compliance
- **Role-Based Access**: Different permissions for requesters and approvers
- **Bulk Operations**: Approve/reject multiple requests at once

## License

This project is open source and available for use and modification.

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.
