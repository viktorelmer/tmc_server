import {Connection, ConnectionOptions, DatabaseType} from "typeorm";
import {UserModel} from "./models/UserModel";

export const SERVER_PORT = 5050

export const DB_CONFIG: ConnectionOptions= {
    type: "mongodb",
    url: 'mongodb+srv://admin:T9vVRh5kWXGJWhnJ@cluster0.6jnhe.mongodb.net/textme?retryWrites=true&w=majority',
    useNewUrlParser: true,
    useUnifiedTopology: true,
    entities: [UserModel]
}