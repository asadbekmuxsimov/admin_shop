import api from "./api";

const MijozlarApi = {
  getAll: (params: { order: string }) => {
    return api.get("/api/users", {
      params: params,
    });
  },
  delete: (id: number) => {
    return api.delete(`/api/users/${id}`);
  },
  create: (data: {
    name: string;
    email: string;
    password: string;
    role: string;
    image: string;
  }) => {
    return api.post("/api/users", data);
  },
  update: (
    id: number,
    data: {
      name: string;
      email: string;
      password: string;
      role: string;
      image: string;
    }
  ) => {
    return api.patch(`/api/users/${id}`, data);
  },
};
export default MijozlarApi;
