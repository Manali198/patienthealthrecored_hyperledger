import { Router } from "express";
import * as patient from "../controller/patient.js";
const route = Router();
import { patientValidate } from "../validation/validate.js";
import AuthCheck from "../middleware/jwtPatient.js";

route.post("/sign-up",patientValidate('SignUp') ,patient.SignUp);
route.post("/login", patientValidate('LogIn'),patient.Login);
route.post("/forgot-password", patientValidate('ForgotPassword'),patient.ForgotPassword);
route.post("/reset-password", patientValidate("ResetPassword"), patient.ResetPassword);
route.post("/demographic", [patientValidate('Demographic'),AuthCheck],patient.DemographicAdd);
route.get("/demographic", [AuthCheck],patient.DemographicGet);
route.get("/get-all-phr", AuthCheck, patient.GetAllPhr);
route.post("/test", patient.testfun);
route.post("/create-admin", patient.CreateAdmin);
route.post("/test-login", patient.logintest);
route.post("/test-getAllPatients", patient.getAllPatients);


export { route };
