interface IItem {
    itemId: number,
    user_Id: number,
    name: string,
    previous_Price: number,
    last_Store_Id: number,
    deleted: boolean,
    purchased: boolean,
    currentStoreId: number
}

export default IItem;

export const getDefaultItem = (): IItem => {
    return { itemId: 0, user_Id: 0, name: '',
     previous_Price: 0, last_Store_Id: 0, 
     deleted: false, purchased: false, 
     currentStoreId: 0 }
}

export class ISelectItem {
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

export class IStoreSelectItems {
    public storeSelect: ISelectItem[];

    constructor(){
        this.storeSelect = [];
    }
}