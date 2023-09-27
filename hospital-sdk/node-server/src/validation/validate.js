import * as patientValidators from "./schemas/patientSchema.js"
import * as organizationValidators from "./schemas/organizationSchema.js"

export function patientValidate(validator) {
    return async function(req, res, next) {
        try {
            const validated = await patientValidators[validator].validateAsync(req.body)
            req.body = validated
            next()
        } catch (err) {
            if(err.isJoi) {
                res.status(400).send({
                    message:err.details[0].message.replaceAll('\"', ''),
                })
            }
        }
    }
}

export function organizationValidate(validator) {
    return async function(req, res, next) {
        try {
            const validated = await organizationValidators[validator].validateAsync(req.body)
            req.body = validated
            next()
        } catch (err) {
            if(err.isJoi) {
                res.status(400).send({
                    message:err.details[0].message.replaceAll('\"', ''),
                })
            }
        }
    }
}