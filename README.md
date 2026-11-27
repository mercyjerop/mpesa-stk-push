# M-Pesa STK Push Integration

## About the Project
A web-based payment application built using Node.js, Express, HTML, CSS, and JavaScript, integrated with Safaricom Daraja API to initiate M-Pesa STK Push requests.

The application allows a user to enter a phone number and amount and initiate an STK Push request.

## Features
- Payment form for entering phone number and amount
- Node.js and Express backend
- Daraja API integration
- OAuth access token generation
- STK Push request handling
- Callback endpoint for receiving payment responses
- Environment variables for configuration and credential protection

## Technologies Used
- HTML
- CSS
- JavaScript
- Node.js
- Express
- Axios
- Safaricom Daraja API
- ngrok

## Project Structure
```text
MercyMpesaPayment/
├── public/
│   └── index.html
├── server.js
├── package.json
├── package-lock.json
└── .gitignore
```

## Setup Instructions

1. Clone this repository.
2. Open the project folder in your terminal.
3. Install dependencies:

```bash
npm install
```

4. Configure your environment variables in a `.env` file.
5. Start the server:

```bash
node server.js
```

6. Open the application in your browser at:

```text
http://localhost:3000
```

## Security
- API credentials are stored in environment variables.
- The `.env` file should never be uploaded to GitHub.
- `node_modules` should not be committed to the repository.

## Testing Notice
This project was created for learning and API integration practice. An unexpected real-money deduction occurred during testing, and further verification of the Sandbox payment setup is required. This project is not a production-ready payment system.

## Author
Software Engineering Student
