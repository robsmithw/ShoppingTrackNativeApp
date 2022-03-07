import { v4 as uuid, NIL as emptyGuid } from "uuid";

interface IStore extends IEntity {
    name: string
}

export default IStore;

export class Store implements IStore {
    public id: string = uuid();
    public createdDate: Date = new Date();
    public modifiedDate?: Date | undefined;
    public isDeleted: boolean = false;
    public name: string;

    constructor(name: string) {
        this.name = name;
    }
}