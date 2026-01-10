import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { createNumberGeneratorMiddleware } from "../../utils/numberGenerator.js";
import {
  DELIVERY_OPTION_VALUES,
  PURCHASE_TYPE_VALUES,
  GUNNY_OPTION_VALUES,
} from "../../utils/constants.js";

const paddyPurchaseSchema = new mongoose.Schema(
  {
    date: { type: Date, default: Date.now },
    partyName: { type: String, required: true, trim: true },
    paddyPurchaseNumber: { type: String, trim: true, unique: true },
    party: { type: mongoose.Schema.Types.ObjectId, ref: "Party" },
    brokerName: { type: String, trim: true },
    broker: { type: mongoose.Schema.Types.ObjectId, ref: "Broker" },
    delivery: { type: String, enum: DELIVERY_OPTION_VALUES },
    purchaseType: { type: String, enum: PURCHASE_TYPE_VALUES },
    doEntries: [
      {
        doNumber: { type: String, trim: true },
        committeeName: { type: String, trim: true },
        doPaddyQuantity: { type: String, trim: true },
      },
    ],
    paddyQuantity: { type: String, trim: true },
    paddyRatePerQuintal: { type: String, trim: true },
    wastagePercent: { type: String, trim: true },
    brokerage: { type: String, trim: true },
    gunnyOption: {
      type: String,
      enum: GUNNY_OPTION_VALUES,
    },
    newGunnyRate: { type: String, trim: true },
    oldGunnyRate: { type: String, trim: true },
    plasticGunnyRate: { type: String, trim: true },
    paddyType: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Auto-generate paddyPurchaseNumber: PPP-DDMMYY-N
paddyPurchaseSchema.pre(
  "save",
  createNumberGeneratorMiddleware("paddyPurchaseNumber", "PPP")
);

paddyPurchaseSchema.plugin(aggregatePaginate);

export default mongoose.model("PaddyPurchase", paddyPurchaseSchema);
