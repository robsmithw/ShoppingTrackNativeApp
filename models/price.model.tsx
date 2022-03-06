import { v4 as uuid, NIL as emptyGuid } from "uuid";

export interface IPrice extends IEntity {
    itemId: string,
    userId: string,
    currentPrice: number,
    storeId: string,
    dateOfPrice: Date
}

export class Price implements IPrice {
    public id: string = uuid();
    public createdDate: Date = new Date();
    public modifiedDate?: Date | undefined;
    public isDeleted: boolean = false;
    public itemId: string;
    public userId: string;
    public currentPrice: number;
    public storeId: string;
    public dateOfPrice: Date;

    constructor(itemId: string, userId: string, currentPrice: number, storeId: string, dateOfPrice: Date) {
        this.itemId = itemId;
        this.userId = userId;
        this.currentPrice = currentPrice;
        this.storeId = storeId;
        this.dateOfPrice = dateOfPrice;
    }
}