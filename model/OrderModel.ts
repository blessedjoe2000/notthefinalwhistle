import { Schema, model, models, Document } from "mongoose";

export interface OrderDocument extends Document {
  line_items?: Record<string, unknown>;
  name?: string;
  email?: string;
  phone?: string;
  address?: Record<string, unknown>;
  orderProducts?: Record<string, unknown>;
  paid?: boolean;
  status?: string;
}

const orderSchema = new Schema<OrderDocument>(
  {
    line_items: {
      type: Schema.Types.Mixed,
    },

    name: {
      type: String,
    },

    email: {
      type: String,
    },

    phone: {
      type: String,
    },

    address: {
      type: Schema.Types.Mixed,
    },

    orderProducts: {
      type: Schema.Types.Mixed,
    },

    paid: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

const OrderModel = models.Order || model<OrderDocument>("Order", orderSchema);

export default OrderModel;
