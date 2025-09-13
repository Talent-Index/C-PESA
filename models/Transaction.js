import mongoose from "mongoose";

const txSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  avaxWallet: { type: String, required: true },
  amountKES: { type: Number, required: true },
  merchantRequestID: String,
  checkoutRequestID: { type: String, index: true },
  mpesaReceiptNumber: String,
  feeKES: Number,
  netKES: Number,
  amountAVAX: Number,
  avaxTxHash: String,
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
  completedAt: Date,
  error: String
});

export default mongoose.model("Transaction", txSchema);
