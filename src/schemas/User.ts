import {Connection, getMongoRepository} from "typeorm";
import {Application} from "express";

import {UserModel} from "../models/UserModel";
import {ADD_USER, GET_TOKEN, GET_USER_DATA, LOGIN_USER} from "../mConstants";
import {Utils} from "../scripts/Utils";
import * as crypto from "crypto";

type UserProps = {
    connection: Connection,
    app: Application
}


const User = (({app, connection}: UserProps) => {
    const USER_URL = '/user/',
        userRepos = getMongoRepository(UserModel)

    async function getUserData(user_id?: string, username?: string) {
        let result
        if (user_id) {
            result = await userRepos.findOne(user_id)
        } else {
            result = await userRepos.find({where: {username: {$eq: username}}})
        }

        return result
    }


    async function getUserDataRequest(req, res) {
        const {user_id, username} = req.body
        const result = await getUserData(user_id, username)
        Utils.response(res, Array.isArray(result) ? result : [result], 200, 0)
    }


    async function addUser(req, res) {
        const {password, username} = req.body
        const usersWithSameName = await getUserData(null, username)
        if (usersWithSameName.length) {
            Utils.response(res, [{message: "Ошибка, пользователь с таким именем существует"}], 200, 1)
        } else {
            Utils.cryptPass(password, (err, hash) => {
                if (err) Utils.response(res, [{message: "Ошибка хеширования пароля"}], 200, 1)
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
                        Utils.response(res, [result], 200, 0)
                    })
                }
            })
        }
    }

    async function getToken(req, res) {
        const {user_id} = req.body
        const result = await getUserData(user_id)

        Utils.response(res, [result['token']], 200, 0)
    }

    async function loginUser(req, res) {
        const {username} = req.body
        const findedData = await getUserData(null, username)

        if (findedData.length > 0) {
            const {password} = findedData[0]
            Utils.comparePass(req.body.password, password, (isMatch) => {
                if (isMatch)
                    Utils.response(res, [findedData[0]], 200, 0)
                else
                    Utils.response(res, [{message: 'Ошибка, не верные данные 2'}], 200, 1)
            })
        } else {
            Utils.response(res, [{message: 'Ошибка, не верные данные 1'}], 200, 1)
        }
    }

    /**
     * /user/getUserData - получить информацию о пользователе
     * user_id {string}
     */
    app.post(USER_URL + GET_USER_DATA, getUserDataRequest)
    /**
     * /user/addUser - добавить нового пользователя
     * password {string}
     * username {string}
     */
    app.post(USER_URL + ADD_USER, addUser)
    /**
     * /user/getToken
     * user_id {string}
     */
    app.post(USER_URL + GET_TOKEN, getToken)
    /**
     * /user/getToken
     * user_id {string}
     */
    app.post(USER_URL + LOGIN_USER, loginUser)

})

export const loadUserSchema = User