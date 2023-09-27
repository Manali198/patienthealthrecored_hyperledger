import mongoose from "mongoose";
const patientSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
    forgotId: {
      type: String,
      required: false,
    },
    mobileNumber: {
      type: Number,
      required: false,
    },
    password: {
      type: String,
      required: false,
    },
    otp: {
      type: Number,
      required: false,
    },
    demographicDetails: {
      name: {
        type: String,
        required: false,
      },
      gender: {
        type: String,
        required: false,
      },
    DOB: {
        type: Date,
        required: false,
      },
      height: {
        type: String,
        required: false,
      },
      weight: {
        type: String,
        required: false,
      },
      abha:{
        type: Number,
        required: false,
      }
    },
    qrCode: {
      type: String,
      require: false,
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

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;
