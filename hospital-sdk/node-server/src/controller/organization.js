import Organization from "../models/organization.js";
import Phr from "../models/phr.js";
import bcrypt from "bcryptjs";
import { HTTPResponse, StatusCodes } from "../utils/HTTPResponse.js";
import GenrateToken from "../utils/genrateToken.js";
import Patient from "../models/patient.js";
import ForgetPasswordMail from "../utils/mailer.js";
import Activity from "../models/activity.js";

export async function Login(req, res) {
  try {
    let { password, email } = req.body;

    const checkEmail = await Organization.findOne({ email });
    if (!checkEmail) {
      return HTTPResponse.BAD_REQUEST(res, {
        message: "organization is not exist by this email",
      });
    }
    const match = await bcrypt.compare(password, checkEmail.password);
    if (!match) {
      return HTTPResponse.BAD_REQUEST(res, {
        message: "email and password are mismatch",
      });
    }
    const token = await GenrateToken({
      id: checkEmail._id,
      type: "Organization",
    });
    return HTTPResponse.OK(res, {
      message: "success",
      data: { token, type: "Organization" },
    });
  } catch (e) {
    return HTTPResponse.INTERNAL_SERVER_ERROR(res, {
      message: e.message,
    });
  }
}
export async function SignUp(req, res) {
  try {
    let { password, email } = req.body;
    const salt = await bcrypt.genSalt(10);
    let encreptPassword = await bcrypt.hash(password, salt);
    let checkEmail = await Organization.findOne({ email });
    if (checkEmail) {
      return HTTPResponse.BAD_REQUEST(res, {
        message: "Email already exist.",
      });
    }
    new Organization({ ...req.body, password: encreptPassword })
      .save()
      .then((e) => {
        return HTTPResponse.CREATED(res, {
          message: "Organization created",
        });
      });
  } catch (e) {
    return HTTPResponse.INTERNAL_SERVER_ERROR(res, {
      message: e.message,
    });
  }
}
export async function GetProfile(req, res) {
  try {
    const patientDemographic = await Organization.findOne(
      {
        _id: req.decodedId,
      },
      { _id: 0, firstName: 1, lastName: 1, email: 1 }
    );
    return HTTPResponse.OK(res, {
      message: "success",
      data: patientDemographic,
    });
  } catch (e) {
    return HTTPResponse.INTERNAL_SERVER_ERROR(res, {
      message: e.message,
    });
  }
}

export async function UpdateProfile(req, res) {
  try {
    await Organization.updateOne(
      {
        _id: req.decodedId,
      },
      { $set: req.body }
    );
    return HTTPResponse.OK(res, {
      message: "success",
    });
  } catch (e) {
    return HTTPResponse.INTERNAL_SERVER_ERROR(res, {
      message: e.message,
    });
  }
}
export async function GetAllPatient(req, res) {
  try {
    const { userId, abha } = req.query;

    const patientList = await Patient[userId || abha ? "findOne" : "find"](
      userId || abha
        ? { [userId ? "_id" : "demographicDetails.abha"]: userId || +abha }
        : {}
    ).select(
      `${userId || abha ? "demographicDetails" : "_id firstName lastName email"}`
    );
  
    return HTTPResponse.OK(res, {
      message: "success",
      data: patientList,
    });
  } catch (e) {
    return HTTPResponse.INTERNAL_SERVER_ERROR(res, {
      message: e.message,
    });
  }
}

export async function AddPhr(req, res) {
  try {
    new Phr({ ...req.body, organizationId: req.decodedId }).save();
    return HTTPResponse.CREATED(res, {
      message: "success",
    });
  } catch (e) {
    return HTTPResponse.INTERNAL_SERVER_ERROR(res, {
      message: e.message,
    });
  }
}

export async function GetAllPatientPhr(req, res) {
  try {
    const { patientId } = req.query;
    const patientList = await Phr.find({
      organizationId: req.decodedId,
      patientId,
    })
      .select("_id diagnosis remedies recommendation patientId createdAt")
      .populate("patientId", "firstName lastName")
      .populate("organizationId", "firstName lastName");
    return HTTPResponse.OK(res, {
      message: "success",
      data: patientList,
    });
  } catch (e) {
    return HTTPResponse.INTERNAL_SERVER_ERROR(res, {
      message: e.message,
    });
  }
}

export async function ForgotPassword(req, res) {
  let { email } = req.body;
  let checkEmail = await Organization.findOne({ email });
  if (!checkEmail) {
    return HTTPResponse.BAD_REQUEST(res, {
      message: "User not found.",
    });
  }
  const otp = Math.floor(1000 + Math.random() * 9000);
  await Organization.updateOne({ _id: checkEmail._id }, { $set: { otp } });
  let MailData = {
    name: checkEmail.firstName,
    to: checkEmail.email,
    newPassword: otp,
  };
  ForgetPasswordMail(MailData);
  return HTTPResponse.OK(res, {
    message: "Email sent",
  });
}

export async function ResetPassword(req, res) {
  let { email, otp, password } = req.body;
  let checkEmail = await Organization.findOne({ email, otp });
  if (!checkEmail) {
    return HTTPResponse.BAD_REQUEST(res, {
      message: "Invalid otp",
    });
  }
  // const otp = 4444;
  const salt = await bcrypt.genSalt(10);
  let encreptPassword = await bcrypt.hash(password, salt);
  await Organization.updateOne(
    { _id: checkEmail._id },
    { $set: { otp: null, password: encreptPassword } }
  );
  return HTTPResponse.OK(res, {
    message: "Password changed.",
  });
}

export async function AddActivityLog(req, res) {
  try {
    const { patientId, type } = req.body;
    new Activity({ patientId, type, organizationId: req.decodedId })
      .save()
      .then((e) => {
        return HTTPResponse.OK(res, {
          message: "success",
        });
      });
  } catch (e) {
    return HTTPResponse.INTERNAL_SERVER_ERROR(res, {
      message: e.message,
    });
  }
}
