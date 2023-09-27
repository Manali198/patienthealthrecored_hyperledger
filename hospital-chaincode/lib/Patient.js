/**
 * @desc [The base patient class]
 */

/*
 * SPDX-License-Identifier: Apache-2.0
 */


class Patient {
  constructor(
    patientId,
    firstName,
    lastName,
    password,
    height,
    weight,
    Gender,
    DOB,
    Email,
  ) {
    this.patientId = patientId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.password = password;
    this.height = height;
    this.weight = weight;
    this.Gender = Gender;
    this.DOB = DOB;
    this.Email = Email;
   
    this.pwdTemp = true;
    return this;
  }
}
module.exports = Patient;