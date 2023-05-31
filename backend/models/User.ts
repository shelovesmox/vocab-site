import { Entity, Column, OneToMany, PrimaryGeneratedColumn, BaseEntity, PrimaryColumn } from "typeorm";
import { Word } from "./Word";
import { BaseClass } from "./BaseClass";

@Entity('users')
export class User extends BaseClass {
    @PrimaryColumn()
    uuid: string;

    @Column({nullable: false})
    username: string;

    @Column({nullable: false})
    email: string

    @Column({nullable: false})
    password: string;
    
    @Column({nullable: true})
    avatar: string;

    @OneToMany(() => Word, word => word.user)
    definitions: Word[]

}
