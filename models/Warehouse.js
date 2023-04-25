/* Model Fields:
    id: int
    location: int
    status: str
*/

import mongoose from "mongoose";

const WarehouseSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

const Warehouse =
  mongoose.models.Warehouse || mongoose.model("Warehouse", WarehouseSchema);
export default Warehouse;
