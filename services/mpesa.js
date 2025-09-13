import axios from "axios";
import { getTimeStamp } from "../utils/timestamp.utils.js";

export async function stkPush({ phone, amount, callbackUrl }) {
  const timestamp = getTimeStamp();
  const password = Buffer.from(
    `${process.env.BusinessShortCode}${process.env.MPESA_PASSKEY}${timestamp}`
  ).toString("base64");

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

  const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
  const resp = await axios.post(url, body, {
    headers: {
      Authorization: `Bearer ${process.env.MPESA_TOKEN}`, 
      "Content-Type": "application/json"
    }
  });

  return resp.data;
}
