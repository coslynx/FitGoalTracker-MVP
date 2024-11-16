#!/bin/bash

set -euo pipefail

# Load environment variables
export $(grep -v '^#' .env | xargs)

# Log file
LOG_FILE="./startup.log"

# Function to log info messages
log_info() {
  echo "$(date +"%Y-%m-%d %H:%M:%S") INFO: $1" >> "$LOG_FILE"
}

# Function to log error messages
log_error() {
  echo "$(date +"%Y-%m-%d %H:%M:%S") ERROR: $1" >&2 >> "$LOG_FILE"
}

# Function to check if PostgreSQL is running
check_postgres() {
  pg_isready -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" -d "$POSTGRES_DB"
}

# Function to start the backend server
start_backend() {
  cd api && npm start &
  BACKEND_PID=$!
}

# Cleanup function
cleanup() {
  if [ -n "$BACKEND_PID" ]; then
    kill -TERM "$BACKEND_PID"
    wait "$BACKEND_PID"
  fi
  rm -f "$PID_FILE"
}

trap cleanup EXIT ERR

# Check if required tools are installed
command -v psql >/dev/null 2>&1 || { log_error "psql is not installed"; exit 1; }
command -v npm >/dev/null 2>&1 || { log_error "npm is not installed"; exit 1; }


# Check PostgreSQL connection
log_info "Checking PostgreSQL connection..."
if ! check_postgres; then
    log_error "PostgreSQL connection failed. Check your DATABASE_URL in .env"
    exit 1
fi
log_info "PostgreSQL connection successful"

# Start backend server
log_info "Starting backend server..."
start_backend

#Check backend server status
if [ $? -ne 0 ]; then
  log_error "Failed to start backend server"
  exit 2
fi

log_info "Backend server started successfully"

log_info "Startup complete"
```