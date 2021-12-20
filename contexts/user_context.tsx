import React, { useState } from "react";
import { isUndefinedOrNull } from "../utils/utils";

type UserContextType = {
    isAuthenticated: () => boolean,
    accessToken: string,
    setAccessToken: React.Dispatch<React.SetStateAction<string>>,
    userId: number | null,
    setUserId: React.Dispatch<React.SetStateAction<number | null>> | null

}

export const UserContext = React.createContext<UserContextType>({
    isAuthenticated: () => (false),
    accessToken: "",
    setAccessToken: () => (""),
    userId: null,
    setUserId: null,
});

export const UserProvider: React.FC = ({children}) => {

    const [accessToken, setAccessToken] = useState<string>("");
    const [userId, setUserId] = useState<number | null>(null);

    const isAuthenticated = (): boolean => {
        return !isUndefinedOrNull(accessToken);
    }

    return (
        <UserContext.Provider value={{isAuthenticated, accessToken, setAccessToken, userId, setUserId}}>{children}</UserContext.Provider>
    );

}