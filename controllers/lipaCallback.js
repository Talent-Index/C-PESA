import express from "express";
import Transaction from "../models/Transaction.js";
import { getAvaxPriceKES, sendAvax } from "../services/avax.js";

const router = express.Router();

router.post("/callbackURL", async (req, res) => {
  res.status(200).send("OK"); 

  try {
    const stk = req.body?.Body?.stkCallback;
    if (!stk) {
      console.warn("callback format iko wrong:", req.body);
      return;
    }

    if (stk.ResultCode !== 0) {
      console.log("Payment failed:", stk.ResultDesc);
      await Transaction.findOneAndUpdate(
        { checkoutRequestID: stk.CheckoutRequestID },
        { status: "uza uji : failed", error: stk.ResultDesc }
      );
      return;
    }

    const items = stk.CallbackMetadata?.Item || [];
    const find = (name) => items.find((i) => i.Name === name)?.Value;

    const grossAmount = Number(find("Amount"));
    const mpesaReceipt = find("MpesaReceiptNumber");
    const phone = find("PhoneNumber");
    const checkoutRequestID = stk.CheckoutRequestID;

  
    const tx = await Transaction.findOneAndUpdate(
      { checkoutRequestID, status: "pending" },
      { status: "processing", mpesaReceiptNumber: mpesaReceipt },
      { new: true }
    );

    if (!tx) {
      console.log("No pending tx found for:", checkoutRequestID);
      return;
    }

    const feeKES = +(grossAmount * 0.015).toFixed(2);
    const netKES = +(grossAmount - feeKES).toFixed(2);

    const avaxPriceKES = await getAvaxPriceKES();
    const amountAVAX = +(netKES / avaxPriceKES).toFixed(8);

    if (amountAVAX <= 0 || netKES < 50) {
      await Transaction.findByIdAndUpdate(tx._id, {
        status: "failed",
        error: "Amount too small"
      });
      return;
    }

    let avaxTxHash;
    try {
      avaxTxHash = await sendAvax(tx.avaxWallet, amountAVAX);
    } catch (err) {
      console.error("Error sending AVAX:", err);
      await Transaction.findByIdAndUpdate(tx._id, {
        status: "failed",
        error: err.message
      });
      return;
    }

    await Transaction.findByIdAndUpdate(tx._id, {
      status: "completed",
      feeKES,
      netKES,
      amountAVAX,
      avaxTxHash,
      completedAt: new Date()
    });

    console.log(
      `KES ${grossAmount} → ${amountAVAX} AVAX sent to ${tx.avaxWallet}, tx=${avaxTxHash}`
    );
  } catch (err) {
    console.error("Callback error:", err);
  }
});

export default router;
