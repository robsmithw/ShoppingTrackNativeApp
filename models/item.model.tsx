import { v4 as uuid, NIL as emptyGuid } from "uuid";

interface IItem extends IEntity {
    userId: string,
    name: string,
    previousPrice: number,
    lastStoreId: string,
    purchased: boolean,
    currentStoreId: string
}

export class Item implements IItem {
    public id: string = uuid();
    public userId: string;
    public name: string;
    public previousPrice: number;
    public lastStoreId: string;
    public purchased: boolean = false;
    public currentStoreId: string;
    public createdDate: Date = new Date();
    public modifiedDate?: Date | undefined;
    public isDeleted: boolean = false;

    constructor(name: string, user_id: string, previous_price: number, last_store_id: string, current_store_id: string) {
        this.userId = user_id;
        this.name = name;
        this.previousPrice = previous_price;
        this.lastStoreId = last_store_id;
        this.currentStoreId = current_store_id;
    }
}

export default IItem;

export const getDefaultItem = (): Item => {
    return new Item('', emptyGuid, 0, emptyGuid, emptyGuid);
}

export class SelectItem {
    public label: string;
    public value: string;
    public icon?: JSX.Element;
    public hidden?: boolean;
    public disabled?: boolean;
    public selected?: boolean;

    constructor(label?: string, value?: string){
        this.label = label || '';
        this.value = value || '';
    }
}

export class StoreSelectItems {
    public storeSelect: SelectItem[];

    constructor(){
        this.storeSelect = [];
    }
}