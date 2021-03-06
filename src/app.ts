import express, {Request, Response, ErrorHandler} from 'express';
import {createConnection, Connection} from "typeorm";
import bodyParser from "body-parser";
import {DB_CONFIG, SERVER_PORT} from "./constants";
import "reflect-metadata";
import cors from 'cors'
import {loadUserSchema} from "./schemas/User";

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cors())

let connection: Connection


async function loadConnection() {
    try {
        connection = await createConnection(DB_CONFIG)
        loadSchemas()
    } catch (e) {
    }
}


function loadSchemas() {
    loadUserSchema({connection, app})
}


app.get('/', (req: Request, res: Response) => {
    res.send('tmc api server');
});

app.listen(SERVER_PORT, (err: ErrorHandler) => {
    if (err) {
        return console.error(err);
    }
    loadConnection()
    return console.log(`server is listening on ${SERVER_PORT}`);
});