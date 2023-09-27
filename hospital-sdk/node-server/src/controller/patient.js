import Patient from "../models/patient.js";
import bcrypt from "bcryptjs";
import { HTTPResponse } from "../utils/HTTPResponse.js";
import GenrateToken from "../utils/genrateToken.js";
import Phr from "../models/phr.js";
import ForgetPasswordMail from "../utils/mailer.js";
import network from "../../../fabric-network/app.js";
import {Wallets} from "fabric-network"
import FabricCAServices from "fabric-ca-client"
import path,{ dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
import {
  buildCAClient,
  enrollAdmin,
} from "/home/vh/Videos/patient-data-management-using-hyperledger-fabric/hospital-sdk/fabric-network/CAUtil.js";

import {
  buildCCPHosp1,
  buildWallet,
} from "/home/vh/Videos/patient-data-management-using-hyperledger-fabric/hospital-sdk/fabric-network/AppUtil.js";
const ROLE_ADMIN = "admin"
const adminHospital1 = "hosp1admin";
const adminHospital1Passwd = "hosp1adminpw";
const walletPath = path.join(__dirname, "../../fabric-network/wallet");
import QRCode from 'qrcode'

async function enrollAdminHosp1() {
  try {
    // build an in memory object with the network configuration (also known as a connection profile)
    const ccp = buildCCPHosp1();

    // build an instance of the fabric ca services client based on
    // the information in the network configuration
    const caClient = buildCAClient(
      FabricCAServices,
      ccp,
      "ca.hospital1.geakminds.com"
    );
    

    // setup the wallet to hold the credentials of the application user
    const wallet = await buildWallet(Wallets, walletPath);

    // to be executed and only once per hospital. Which enrolls admin and creates admin in the wallet
    await enrollAdmin(
      caClient,
      wallet,
      mspHosp1,
      adminHospital1,
      adminHospital1Passwd
    );

    console.log(
      "msg: Successfully enrolled admin user " +
        adminHospital1 +
        " and imported it into the wallet"
    );
    await storeAdminCredentials({
      username: adminHospital1,
      password: hashPassword(adminHospital1Passwd, salt),
      role: ROLE_ADMIN,
      hospitalId: "1",
    });
  } catch (error) {
    console.error(
      `Failed to enroll admin user ' + ${adminHospital1} + : ${error}`
    );
    process.exit(1);
  }
}


const storeAdminCredentials = async (records) => {
  const url = `${BASE_URL}/storeAdminCredentials`;
  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify(records),
  };

  try {
    const fetch = (await import("node-fetch")).default;
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    console.log("Updated Succesfully");
  } catch (error) {
    console.error("Record Update Failed Please Try Again");
  }
};

export async function Login(req, res) {
  try {
    let { password, email } = req.body;
    const checkEmail = await Patient.findOne({ email });
    if (!checkEmail) {
      return HTTPResponse.BAD_REQUEST(res, {
        message: "Patient is not exist by this email",
      });
    }
    const match = await bcrypt.compare(password, checkEmail.password);
    if (!match) {
      return HTTPResponse.BAD_REQUEST(res, {
        message: "email and password are mismatch",
      });
    }
    const token = await GenrateToken({ id: checkEmail._id, type: "Patient" });
    return HTTPResponse.OK(res, {
      message: "success",
      data: { token, type: "Patient" },
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
    let checkEmail = await Patient.findOne({ email });
    if (checkEmail) {
      return HTTPResponse.BAD_REQUEST(res, {
        message: "Email already exist.",
      });
    }
    new Patient({ ...req.body, password: encreptPassword }).save().then(async(e) => {
     await Patient.updateOne({_id:e._id},{$set:{qrCode:await QRCode.toDataURL(e._id.toString())}})
      return HTTPResponse.CREATED(res, {
        message: "Patient created",
      });
    });
  } catch (e) {
    return HTTPResponse.INTERNAL_SERVER_ERROR(res, {
      data: e.message,
    });
  }
}
export async function DemographicAdd(req, res) {
  try {
    console.log(req.decodedId);
    const check = await Patient.updateOne(
      { _id: req.decodedId },
      { demographicDetails: req.body }
    );
    console.log(check);
    return HTTPResponse.OK(res, {
      message: "success",
    });
  } catch (e) {
    return HTTPResponse.INTERNAL_SERVER_ERROR(res, {
      message: e.message,
    });
  }
}
export async function DemographicGet(req, res) {
  try {
    const patientDemographic = await Patient.findOne({
      _id: req.decodedId,
    }).select("qrCode demographicDetails");
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

export async function GetAllPhr(req, res) {
  try {
    const patientList = await Phr.find({ patientId: req.decodedId })
      .select("_id diagnosis remedies recommendation patientId createdAt")
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
  let checkEmail = await Patient.findOne({ email });
  if (!checkEmail) {
    return HTTPResponse.BAD_REQUEST(res, {
      message: "User not found.",
    });
  }
  const otp = Math.floor(1000 + Math.random() * 9000);
  await Patient.updateOne({ _id: checkEmail._id }, { $set: { otp } });
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
  let checkEmail = await Patient.findOne({ email, otp });
  if (!checkEmail) {
    return HTTPResponse.BAD_REQUEST(res, {
      message: "Invalid otp",
    });
  }
  // const otp = 4444;
  const salt = await bcrypt.genSalt(10);
  let encreptPassword = await bcrypt.hash(password, salt);
  await Patient.updateOne(
    { _id: checkEmail._id },
    { $set: { otp: null, password: encreptPassword } }
  );
  return HTTPResponse.OK(res, {
    message: "Password changed.",
  });
}

export async function testfun(req,res){
  let { hospitalId, username, password, speciality } = req.body;
  hospitalId = parseInt(hospitalId);

  // const isValidate = await validateRole([ROLE_ADMIN], userRole, res);
  // if (isValidate) return res.status(401).json({ message: "Unauthorized Role" });

  req.body.userId = username;
  req.body.role = "doctor";
  password = hashPassword(password);
  req.body = JSON.stringify(req.body);
  const args = [req.body];

  // Enrol and register the user with the CA and adds the user to the wallet.
  const response = await network.registerUser(args);
  console.log(response);
}

export async function logintest(req,res){
  let { hospitalId, username, password, speciality } = req.body;
  
  hospitalId = parseInt(hospitalId);

  // const isValidate = await validateRole([ROLE_ADMIN], userRole, res);
  // if (isValidate) return res.status(401).json({ message: "Unauthorized Role" });

  req.body.userId = username;
  req.body.role = "doctor";
  password = hashPassword(password);
  req.body = JSON.stringify(req.body);
  const args = [req.body];

  // Enrol and register the user with the CA and adds the user to the wallet.
  const response = await network.connectToNetwork("maulik");
  console.log(response);
}

export const getAllPatients = async (req, res) => {
  try {
    // User role from the request header is validated
    const userRole = req.headers.role;
    // const isValidate = await validateRole(
    //   [ROLE_ADMIN, ROLE_DOCTOR],
    //   userRole,
    //   res
    // );
    // if (isValidate)
    //   return res.status(401).json({ message: "Unauthorized Role" });
    // Set up and connect to Fabric Gateway using the username in header
    const networkObj = await network.connectToNetwork(req.headers.username);
    if (networkObj.error) return res.status(400).send(networkObj.error);
    // Invoke the smart contract function
    const response = await network.invoke(
      networkObj,
      true,
      capitalize(userRole) + "Contract:queryAllPatients",
      userRole === "doctor" ? req.headers.username : [""]
    );
    console.log(response);
    // const parsedResponse = await JSON.parse(response);
    // res.status(200).send(response);
  } catch (err) {
    console.log(err);
    res.status(405).send("Unable to Get All Patient Records..");
  }
};

const hashPassword = (password, sampleSalt) => {
  const salt = sampleSalt || bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

const capitalize = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const generateHospitalAdmin = (hospitalId) => {
  let admins = {
    1: "hosp1admin",
    2: "hosp2admin",
  };
  return admins[hospitalId] || "";
};

export async function CreateAdmin(req,res){
  await enrollAdminHosp1()
}