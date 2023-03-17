// context/MyPage.js

import { createContext } from "react";

export const AuthContext = createContext();
export default function MyPage ({children}) {
   return (
      <AuthContext.Provider value={{}}>
         {children}
      </AuthContext.Provider>
   )
}