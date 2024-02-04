import { ReactNode, useState, useCallback, useEffect } from "react";
import { Movie } from "src/types/Movie";
import createSafeContext from "src/lib/createSafeContext";
import { User } from "src/types/User";
import { meApi } from "src/api/user";

export interface GlobalConsumerProps {
  isLogin: boolean;
  setIsLogin: (isLogin: boolean) => void;
  user: User;
  setUser: (user: User) => void;
}

export const [useAuth, Provider] = createSafeContext<GlobalConsumerProps>();

export default function GlobalProvider({ children }: { children: ReactNode }) {

  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [user, setUser] = useState<User>(null);


  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    const userInfo = localStorage.getItem("userInfo");

    if (accessToken !== null && refreshToken !== null) {

      meApi().then((res) => {
        if (res.status === 200) {
          setIsLogin(true);
          setUser(res.data);
        }
      }).catch((err) => {
        console.log(err);
      });





      // get user info from accessToken jwt


    }
  }, []);

  return (
    <Provider
      value={{
        isLogin,
        setIsLogin,
        user,
        setUser,
      }}
    >
      {children}
    </Provider>
  );
}
