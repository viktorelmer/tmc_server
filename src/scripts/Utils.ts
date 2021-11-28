import {Application, Response} from "express";
import {RESP_STATUSES, RESPONSE_B_TYPE, RESPONSE_DATA} from "./sConstants";
import bcrypt from 'bcrypt'

export const Utils = {

    response: (res: Response, data: RESPONSE_DATA, code: RESP_STATUSES) => {
        let response: RESPONSE_B_TYPE = {
            status: code,
            data: data
        }
        res.send(response)
    },
    cryptPass: (password: string, cb: Function) => {
        bcrypt.genSalt(10, function(err, salt) {
            if (err) return cb(false)

            bcrypt.hash(password, salt, function(errH, hash) {
                return cb(errH, hash)
            })
        })
    },
    comparePass: (pass: string, hashPass: string, cb: Function) => {
        bcrypt.compare(pass, hashPass, function(err, isMatch) {
            if (err) return cb(false)
            return(isMatch)
        })
    }
}
