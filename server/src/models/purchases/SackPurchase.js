import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { createNumberGeneratorMiddleware } from "../../utils/numberGenerator.js";
import { GUNNY_DELIVERY_OPTION_VALUES } from "../../utils/constants.js";

const sackPurchaseSchema = new mongoose.Schema(
  {
    date: { type: Date, default: Date.now },
    sackPurchaseNumber: { type: String, trim: true, unique: true },
    partyName: { type: String, required: true, trim: true },
    party: { type: mongoose.Schema.Types.ObjectId, ref: "Party" },
    deliveryOptions: {
      type: String,
      enum: GUNNY_DELIVERY_OPTION_VALUES,
      trim: true,
    },
    newGunnyCount: { type: String, trim: true },
    newGunnyRate: { type: String, trim: true },
    oldGunnyCount: { type: String, trim: true },
    oldGunnyRate: { type: String, trim: true },
    plasticGunnyCount: { type: String, trim: true },
    plasticGunnyRate: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Auto-generate sackPurchaseNumber: SP-DDMMYY-N
sackPurchaseSchema.pre(
  "save",
  createNumberGeneratorMiddleware("sackPurchaseNumber", "SP")
);

sackPurchaseSchema.plugin(aggregatePaginate);

export default mongoose.model("SackPurchase", sackPurchaseSchema);
