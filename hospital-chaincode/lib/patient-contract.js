/**
 * @desc [Patient Smartcontract to read, update and delete patient details in legder]
 */

/*
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const crypto = require("crypto");
const PrimaryContract = require("./primary-contract.js");
const { Context } = require("fabric-contract-api");

class PatientContract extends PrimaryContract {
  //Read patient details based on patientId
  async readPatient(ctx, patientId) {
    return await super.readPatient(ctx, patientId);
  }

  async readPhr(ctx,doctorId, patientId) {
    return await super.readPhr(ctx,doctorId, patientId);
  }

  //Returns the patient's password
  async getPatientPassword(ctx, patientId) {
    let patient = await this.readPatient(ctx, patientId);
    patient = {
      password: patient.password,
      pwdTemp: patient.pwdTemp,
    };
    return patient;
  }

  //Retrieves patient medical history based on patientId
  async getPatientHistory(ctx, patientId) {
    let resultsIterator = await ctx.stub.getHistoryForKey(patientId);
    let asset = await this.getAllPatientResults(resultsIterator, true);

    return this.fetchLimitedFields(asset, true);
  }

  fetchLimitedFields = (asset, includeTimeStamp = false) => {
    for (let i = 0; i < asset.length; i++) {
      const obj = asset[i];
      asset[i] = {
        patientId: obj.Key,
        firstName: obj.Record.firstName,
        lastName: obj.Record.lastName,
        Email: obj.Record.Email,
        Gender: obj.Record.Gender,
        height: obj.Record.height,
        weight: obj.Record.weight,
        DOB: obj.Record.DOB,
      };
      if (includeTimeStamp) {
        asset[i].changedBy = obj.Record.changedBy;
        asset[i].Timestamp = obj.Timestamp;
      }
    }

    return asset;
  };

}
module.exports = PatientContract;
