# University Data ETL Service

A Node.js ETL (Extract, Transform, Load) service that processes university data from an external API, validates it, and provides it in CSV format.

## Features

- Automated ETL pipeline for university data
- Data validation using Joi
- Scheduled data refresh at midnight UTC
- CSV download endpoint
- Error handling and logging
- RESTful API endpoints

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Git

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/nevanhzaidi/Universities_etl.git
    cd universities-etl
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create environment file:

    ```bash
    cp .env.example .env
    ```

4. Update environment variables in `.env`:

    ```env
    PORT=3000
    NODE_ENV=development
    ```

## Project Structure

src/
├── config/          # Configuration files
├── services/        # Business logic
├── controllers/     # Route controllers
├── models/          # Data models and validation
├── routes/          # API routes
├── utils/           # Utility functions
├── middleware/      # Express middleware
└── app.js          # Application entry point

data/               # Stored data files
logs/               # Application logs


## Available Scripts

- Start the application

    ```bash
    npm start
    ```

- Run in development mode with hot reload

    ```bash
    npm run dev
    ```

- Run tests

    ```bash
    npm test
    ```

## API Endpoints

- `GET /api/download-csv`  
  Downloads university data in CSV format

- `GET /api/health`  
  Health check endpoint

## Data Validation

The service validates the following fields for each university:

- `name` (required)
- `country` (must be "United States")
- `state-province` (optional)
- `domains` (array of valid domains)
- `web_pages` (array of valid URLs)
- `alpha_two_code` (must be "US")

## Error Handling

- Comprehensive error logging
- Retry mechanism for API calls
- Validation error reporting
- Global error handler middleware

## Logging

Logs are stored in:

- `logs/error.log` - Error-level logs
- `logs/combined.log` - All logs

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
