import { create } from "zustand";
import api from "./api/api";

type MyStoreType = {
  user: string | null;
  accessToken: string;
  setUser: (user: string | null, token: string) => void;
  logout: () => void;
};

const useMyStore = create<MyStoreType>((set) => {
  const ls_string = localStorage.getItem("auth");
  const ls = ls_string ? JSON.parse(ls_string) : undefined;

  if (ls?.accessToken) {
    api.defaults.headers.Authorization = `Bearer ${ls.accessToken}`;
  }

  return {
    user: ls?.user || null,
    accessToken: ls?.accessToken || "",

    setUser: (user, token) => {
      const newData = { user, accessToken: token };
      localStorage.setItem("auth", JSON.stringify(newData));

      api.defaults.headers.Authorization = `Bearer ${token}`;

      set(newData);
    },

    logout: () => {
      localStorage.removeItem("auth");
      api.defaults.headers.Authorization = "";

      set({
        accessToken: "",
        user: null,
      });
    },
  };
});

export default useMyStore;
