import mongoose from "mongoose";
const phrSchema = mongoose.Schema(
  {
    patientId:{ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
    organizationId:{ type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
    diagnosis: {
      type: String,
      required: false,
    },
    remedies: {
      type: String,
      required: false,
    },
    recommendation: {
      type: String,
      required: false,
    },
    deletedStatus: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Phr = mongoose.model("Phr", phrSchema);

export default Phr;
