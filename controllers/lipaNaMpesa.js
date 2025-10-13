import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import { getTimeStamp } from '../utils/timestamp.js';
import {authToken} from '../middlewares/authorization.js'
import { isAddress } from "ethers";
import Transaction from "../models/Transaction.js";
import { stkPush } from "../services/mpesa.js"; 


dotenv.config();
const router = express.Router();


router.post("/mpesastk", authToken, async (req, res) => {
  try {


    const phoneNumber = req.body.phoneNumber.replace(/^0/, ''); // remove leading 0 if any
        const phone = `254${phoneNumber}`;
        const avaxWallet = req.body.chain;
        const timestamp = getTimeStamp();
        const amount = req.body.amount;
    // const { phoneNumber: rawPhone, amount, avaxWallet } = req.body;

    console.log(phone)
    console.log(avaxWallet)
    console.log(amount)
    if (!phone || !amount || !avaxWallet) {
      return res.status(400).json({ error: "You're number or avax address is incorrect" });
    }

    if (!isAddress(avaxWallet)) {
      return res.status(400).json({ error: "Invalid AVAX address" });
    }

    if (Number(amount) < 100) {
      return res.status(400).json({ error: "Minimum amount is 100 KES" });
    }

    
    // const number = rawPhone.replace(/^0/, "");
    // const phone = `254${number}`;


        



    // pending transaction saved
    const tx = await Transaction.create({
      phone,
      avaxWallet,
      amountKES: Number(amount),
      status: "pending"
    });

    // stk push yenyewe sasa
    const stkResp = await stkPush({
      phone,
      amount: Number(amount),
      callbackUrl: `${process.env.DOMAIN}/callbackURL`
    });

    // Save Safaricom IDs
    tx.merchantRequestID = stkResp.MerchantRequestID;
    tx.checkoutRequestID = stkResp.CheckoutRequestID;
    await tx.save();

    // return to frontend
    return res.json({
      success: true,
      message: "STK push sent. Confirm on your phone.",
      checkoutRequestID: stkResp.CheckoutRequestID,
      txId: tx._id
    });
  } catch (err) {
    console.error("STK Push Error:", err.response?.data || err.message);
    return res.status(500).json({ error: err.message || "STK push failed" });
  }
});

export default router;
