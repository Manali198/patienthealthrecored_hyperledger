import { Router } from "express";
import * as organization from "../controller/organization.js";
const route = Router();
import { organizationValidate } from "../validation/validate.js";
import AuthCheck from "../middleware/jwtOrganization.js";

route.post("/sign-up", organizationValidate("SignUp"), organization.SignUp);
route.post("/login", organizationValidate("LogIn"), organization.Login);
route.get("/profile", AuthCheck, organization.GetProfile);
route.post("/profile", [organizationValidate("Profile"),AuthCheck], organization.UpdateProfile);
route.post(
  "/forgot-password",
  organizationValidate("ForgotPassword"),
  organization.ForgotPassword
);
route.post(
  "/reset-password",
  organizationValidate("ResetPassword"),
  organization.ResetPassword
);
route.post(
  "/add-phr",
  [organizationValidate("AddPhr"), AuthCheck],
  organization.AddPhr
);
route.get("/get-all-patients", AuthCheck, organization.GetAllPatient);
route.get("/get-all-patients-phr", AuthCheck, organization.GetAllPatientPhr);
route.post("/add-activity-log", AuthCheck, organization.AddActivityLog);

export { route };
