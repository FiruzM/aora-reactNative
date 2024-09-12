import { getCurrentUser } from "@/lib/appwrite";
import { createContext, useContext, useEffect, useState } from "react";

interface GlobalContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  user: null | object; // Assuming user is an object
  setUser: any;
  isLoading: boolean;
}

const GlobalContext = createContext<GlobalContextType | null>(null);

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res) {
          setIsLoggedIn(true);
          setUser(res as any);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      })
      .catch((err: Error | any) => {
        console.log(err);
      })

      .finally(() => setIsLoading(false));
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        isLoading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
