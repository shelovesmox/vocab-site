import { BaseEntity } from "typeorm";

export class BaseClass extends BaseEntity {
    private get construct() {
        return this.constructor
    }
}