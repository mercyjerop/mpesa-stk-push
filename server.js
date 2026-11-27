
const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.static("public"));

// Test whether the server is running
app.get("/", (req, res) => {
    res.send("Mercy's M-Pesa payment server is running!");
});

// Generate Daraja access token
async function getAccessToken() {
    const response = await axios.get(
        "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
        {
            auth: {
                username: process.env.CONSUMER_KEY,
                password: process.env.CONSUMER_SECRET
            }
        }
    );

    return response.data.access_token;
}

// Send STK Push request
app.post("/api/stkpush", async (req, res) => {
    try {
        const { phoneNumber, amount } = req.body;

        if (!phoneNumber || !amount || Number(amount) < 1) {
            return res.status(400).json({
                message: "Enter a valid phone number and amount."
            });
        }

        const token = await getAccessToken();

        const shortcode = process.env.BUSINESS_SHORT_CODE;
        const passkey = process.env.PASSKEY;

        const parts = new Intl.DateTimeFormat("en-GB", {
            timeZone: "Africa/Nairobi",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hourCycle: "h23"
        }).formatToParts(new Date());

        const time = {};
        parts.forEach(part => {
            time[part.type] = part.value;
        });

        const timestamp =
            time.year + time.month + time.day +
            time.hour + time.minute + time.second;

        const password = Buffer.from(
            shortcode + passkey + timestamp
        ).toString("base64");

        const phone = String(phoneNumber).replace(/\D/g, "");

        const response = await axios.post(
            "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
            {
                BusinessShortCode: shortcode,
                Password: password,
                Timestamp: timestamp,
                TransactionType: "CustomerPayBillOnline",
                Amount: Number(amount),
                PartyA: phone,
                PartyB: shortcode,
                PhoneNumber: phone,
                CallBackURL: process.env.CALLBACK_URL,
                AccountReference: "MercyPayment",
                TransactionDesc: "Payment"
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        res.json(response.data);

    } catch (error) {
        console.error(
            "Payment error:",
            error.response?.data || error.message
        );

        res.status(500).json({
            message: "Unable to initiate payment. Check the server terminal."
        });
    }
});

// Receive payment results from Daraja
app.post("/api/callback", (req, res) => {
    console.log("M-Pesa callback received:");
    console.log(JSON.stringify(req.body, null, 2));

    res.json({ ResultCode: 0, ResultDesc: "Accepted" });
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
