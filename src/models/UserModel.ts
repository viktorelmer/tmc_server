import {Entity, ObjectIdColumn, Column, ObjectID} from "typeorm";


@Entity()
export class UserModel {

    @ObjectIdColumn()
    id: string;

    @Column()
    username: string;

    @Column()
    password: string

    @Column()
    token: string
}

