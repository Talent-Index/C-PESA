import axios from "axios";
import { getTimeStamp } from "../utils/timestamp.js";
import { authToken } from "../middlewares/authorization.js";

export async function stkPush({ phone, amount, callbackUrl }) {
  const timestamp = getTimeStamp();
  const password = Buffer.from(
    `${process.env.BusinessShortCode}${process.env.MPESA_PASSKEY}${timestamp}`
  ).toString("base64");

const access_token = req.authData;
        if (!access_token) {
          return res.status(401).json({ error: "Access token missing" });
        }


  const body = {
    BusinessShortCode: process.env.BusinessShortCode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: amount,
    PartyA: phone,
    PartyB: process.env.BusinessShortCode,
    PhoneNumber: phone,
    CallBackURL: callbackUrl,
    AccountReference: "C-PESA",
    TransactionDesc: "AVAX Purchase"
  };


   const stkUrl = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
  const response = await axios.post(stkUrl, body, {
          headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json'
          }
        });

  return response.data;
}
