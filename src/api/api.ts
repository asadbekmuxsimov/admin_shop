import axios from "axios";

const api = axios.create({
  baseURL: "https://nt.softly.uz",
});

api.interceptors.response.use(null, (e) => {
  if (e.status === 401) {
    import("../useMyStore").then((response) => {
      const useGlobalStore = response.default;
      useGlobalStore.getState().logout();
    });
  }
});

export default api;