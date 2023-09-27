/**
 * @desc [Smartcontract to read, update patient details in legder]
 */

/*
 * SPDX-License-Identifier: Apache-2.0
 */
"use strict";

const AdminContract = require("./admin-contract.js");
const PrimaryContract = require("./primary-contract.js");

class DoctorContract extends AdminContract {
  //Read patient details based on patientId
  async readPatient(ctx, patientId) {
    let asset = await PrimaryContract.prototype.readPatient(ctx, patientId);

    // Get the doctorID, retrieves the id used to connect the network
    const doctorId = await this.getClientId(ctx);
    // Check if doctor has the permission to read the patient
    const permissionArray = asset.permissionGranted;
    if (!permissionArray.includes(doctorId)) {
      throw new Error(
        `The doctor ${doctorId} does not have permission to patient ${patientId}`
      );
    }
    asset = {
      patientId: patientId,
      firstName: asset.firstName,
      lastName: asset.lastName,
      DOB: asset.DOB,
      Gender: asset.Gender,
      height: asset.height,
      weight: asset.weight,
      Email: asset.Email,
    };
    return asset;
  }

  async readPhr(ctx,doctorId, patientId) {
    let asset = await PrimaryContract.prototype.readPhr(ctx,doctorId,patientId);

    // Get the doctorID, retrieves the id used to connect the network
    const doctorId = await this.getClientId(ctx);
    // Check if doctor has the permission to read the patient
    const permissionArray = asset.permissionGranted;
    if (!permissionArray.includes(doctorId)) {
      throw new Error(
        `The doctor ${doctorId} does not have permission to patient ${patientId}`
      );
    }
    asset = {
      doctorId: doctorId,
      patientId: patientId,
      Diagnosis: asset.Diagnosis,
      Remedy: asset.Remedy,
      Recommendation: asset.Recommendation,
      Files: asset.Files,
      Timestamp: asset.Timestamp
    };
    return asset;
  }

  //Read patients based on lastname
  async queryPatientsByLastName(ctx, lastName) {
    return await super.queryPatientsByLastName(ctx, lastName);
  }

  //Read patients based on firstName
  async queryPatientsByFirstName(ctx, firstName) {
    return await super.queryPatientsByFirstName(ctx, firstName);
  }

  //Retrieves patient medical history based on patientId
  async getPatientHistory(ctx, patientId) {
    let resultsIterator = await ctx.stub.getHistoryForKey(patientId);
    let asset = await this.getAllPatientResults(resultsIterator, true);

    return this.fetchLimitedFields(asset, true);
  }

  //Retrieves all patients details
  async queryAllPatients(ctx, doctorId) {
    let resultsIterator = await ctx.stub.getStateByRange("", "");
    let asset = await this.getAllPatientResults(resultsIterator, false);
    const permissionedAssets = [];
    for (let i = 0; i < asset.length; i++) {
      const obj = asset[i];
      if (
        "permissionGranted" in obj.Record &&
        obj.Record.permissionGranted.includes(doctorId)
      ) {
        permissionedAssets.push(asset[i]);
      }
    }

    return this.fetchLimitedFields(permissionedAssets);
  }

  fetchLimitedFields = (asset, includeTimeStamp = false) => {
    for (let i = 0; i < asset.length; i++) {
      const obj = asset[i];
      asset[i] = {
        patientId: obj.Key,
        firstName: obj.Record.firstName,
        lastName: obj.Record.lastName,
        DOB: obj.Record.DOB,
        Gender: obj.Record.Gender,
        height: obj.Record.height,
        Weight: obj.Record.Weight,
        Email: obj.Record.Email,
      };
      if (includeTimeStamp) {
        asset[i].changedBy = obj.Record.changedBy;
        asset[i].Timestamp = obj.Timestamp;
      }
    }

    return asset;
  };

  /**
   * @description Get the client used to connect to the network.
   */
  async getClientId(ctx) {
    const clientIdentity = ctx.clientIdentity.getID();
    // Ouput of the above - 'x509::/OU=client/CN=hosp1admin::/C=US/ST=North Carolina/L=Durham/O=hosp1.lithium.com/CN=ca.hosp1.lithium.com'
    let identity = clientIdentity.split("::");
    identity = identity[1].split("/")[2].split("=");
    return identity[1].toString("utf8");
  }
}
module.exports = DoctorContract;
