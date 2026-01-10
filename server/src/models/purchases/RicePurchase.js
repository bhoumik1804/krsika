import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { createNumberGeneratorMiddleware } from "../../utils/numberGenerator.js";
import {
  LOT_OPTION_VALUES,
  GUNNY_OPTION_VALUES,
  FCI_OPTION_VALUES,
  FRK_OPTION_VALUES,
  DELIVERY_OPTION_VALUES,
} from "../../utils/constants.js";

const ricePurchaseSchema = new mongoose.Schema(
  {
    date: { type: Date, default: Date.now },
    ricePurchaseNumber: { type: String, trim: true, unique: true },
    partyName: { type: String, required: true, trim: true },
    party: { type: mongoose.Schema.Types.ObjectId, ref: "Party" },
    brokerName: { type: String, trim: true },
    broker: { type: mongoose.Schema.Types.ObjectId, ref: "Broker" },
    delivery: { type: String, enum: DELIVERY_OPTION_VALUES },
    lotOptions: { type: String, enum: LOT_OPTION_VALUES },
    riceType: { type: String, trim: true },
    quantity: { type: String, trim: true },
    rate: { type: String, trim: true },
    wastagePercent: { type: String, trim: true },
    brokerage: { type: String, trim: true },
    gunnyOptions: {
      type: String,
      enum: GUNNY_OPTION_VALUES,
    },
    newGunnyRate: { type: String, trim: true },
    oldGunnyRate: { type: String, trim: true },
    plasticGunnyRate: { type: String, trim: true },
    fciOptions: { type: String, enum: FCI_OPTION_VALUES },
    frkOptions: { type: String, enum: FRK_OPTION_VALUES },
    frkRate: { type: String, trim: true },
    lotEntries: [{ lotNumber: { type: String, trim: true } }],
    riceInward: { type: String, trim: true },
    riceInwardBalance: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Auto-generate ricePurchaseNumber: RP-DDMMYY-N
ricePurchaseSchema.pre(
  "save",
  createNumberGeneratorMiddleware("ricePurchaseNumber", "RP")
);

ricePurchaseSchema.plugin(aggregatePaginate);

export default mongoose.model("RicePurchase", ricePurchaseSchema);
