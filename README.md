# Event Finder App

A Flask-based web application with React frontend for finding events in Berlin.

## Features

- Flask backend API
- React frontend with Material-UI
- Map integration with Mapbox
- Event search functionality

## Local Development

### Prerequisites

- Python 3.11+
- Node.js 16+
- Yarn

### Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Install Node.js dependencies:
```bash
yarn install
cd frontend && yarn install
```

3. Start the development server:
```bash
yarn start
```

This will start both the Flask backend and React frontend concurrently.

## Deployment to Fly.io

### Prerequisites

- Fly.io CLI installed (`flyctl`)
- Fly.io account

### Deployment Steps

1. **Login to Fly.io** (if not already logged in):
```bash
flyctl auth login
```

2. **Create the app** (first time only):
```bash
flyctl apps create event-finder-app
```

3. **Deploy the application**:
```bash
flyctl deploy
```

### Configuration

The app is configured with:
- **Port**: 8080 (configured in `fly.toml`)
- **Region**: Frankfurt (fra) - can be changed in `fly.toml`
- **Memory**: 256MB
- **CPU**: 1 shared CPU

### Environment Variables

The following environment variables are set:
- `PORT`: 8080
- `FLASK_APP`: app.py
- `FLASK_ENV`: production

### Build Process

The Dockerfile handles:
1. Installing Python dependencies
2. Installing Node.js dependencies
3. Building the React frontend
4. Running the Flask application

### Troubleshooting

If you encounter build issues:

1. **Lockfile issues**: The Dockerfile now installs dependencies without `--frozen-lockfile` to allow updates
2. **Node.js version**: The app is configured for Node.js 16+ compatibility
3. **Memory issues**: The app is configured with 256MB memory, which should be sufficient

### Monitoring

Check your app status:
```bash
flyctl status
```

View logs:
```bash
flyctl logs
```

Open the app:
```bash
flyctl open
```

## Project Structure

```
event-finder-app/
├── app.py                 # Flask backend
├── requirements.txt       # Python dependencies
├── package.json          # Root Node.js dependencies
├── frontend/             # React frontend
│   ├── package.json      # Frontend dependencies
│   ├── src/              # React source code
│   └── dist/             # Built frontend (generated)
├── fly.toml             # Fly.io configuration
├── Dockerfile           # Docker build configuration
└── .dockerignore        # Docker ignore file
```

## API Endpoints

- `GET /api/berlin-courses` - Fetches Berlin course data
- `GET /` - Serves the React frontend
- `GET /map` - Map view
- `GET /combined` - Combined view
