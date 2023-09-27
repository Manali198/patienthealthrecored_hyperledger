import mongoose from "mongoose";
const organizationSchema = mongoose.Schema(
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

const Organization = mongoose.model("Organization", organizationSchema);

export default Organization;
