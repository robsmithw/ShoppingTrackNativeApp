import React, { useState } from "react";
import IItem from "../models/item.model";

type PropContextType = {
    storeId: string | null,
    setStoreId: React.Dispatch<React.SetStateAction<string | null>> | null,
    item: IItem | null,
    setItem: React.Dispatch<React.SetStateAction<IItem | null>> | null,
}

export const PropContext = React.createContext<PropContextType>({
    storeId: null,
    setStoreId: null,
    item: null,
    setItem: null,
});

export const PropProvider: React.FC = ({children}) => {

    const [storeId, setStoreId] = useState<string | null>(null);
    const [item, setItem] = useState<IItem | null>(null);

    return (
        <PropContext.Provider value={{storeId, setStoreId, item, setItem}}>{children}</PropContext.Provider>
    );

}
