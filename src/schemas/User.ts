import {Connection, getManager, getMongoManager, getMongoRepository} from "typeorm";
import {Application, response} from "express";

import {UserModel} from "../models/UserModel";
import {ADD_USER, GET_TOKEN, GET_USER_DATA} from "../mConstants";
import {Utils} from "../scripts/Utils";
import {RESPONSE_B_TYPE, RESPONSE_DATA} from "../scripts/sConstants";
import * as crypto from "crypto";
import {get} from "http";

type UserProps = {
    connection: Connection,
    app: Application
}


const User = (({app, connection}: UserProps) => {
    console.log("test")
    const USER_URL = '/user/',
        userRepos = getMongoRepository(UserModel)


    async function getUserData(req, res) {
        const {user_id, username} = req.body

        let result
        if (user_id) {
            result = await userRepos.findOne(user_id)
        } else {
            result = await userRepos.find({where: {username: {$eq: username}}})
        }

        console.log(result)
        Utils.response(res, Array.isArray(result) ? result : [result], 200)
    }


    async function addUser(req, res) {
        const {password, username} = req.body
        Utils.cryptPass(password, (err, hash) => {
            if (err) throw new Error('Ошибка хеширования пароля')
            else {
                const hashPass = hash
                crypto.randomBytes(48, async function (err, buffer) {
                    const token = buffer.toString("hex")
                    const user = await userRepos.create({
                        password: hashPass,
                        username: username,
                        token: token
                    })
                    const result = await userRepos.save(user)
                    Utils.response(res, [result], 200)
                })
            }
        })
    }

    function getToken(req, res) {

    }

    /**
     * /user/getUserData - получить информацию о пользователе
     * user_id {string}
     */
    app.get(USER_URL + GET_USER_DATA, getUserData)
    /**
     * /user/addUser - получить информацию о пользователе
     * password {string}
     * username {string}
     */
    app.post(USER_URL + ADD_USER, addUser)
    /**
     * /user/getToken
     */
    app.get(USER_URL + GET_TOKEN, getToken)

})

export const loadUserSchema = User