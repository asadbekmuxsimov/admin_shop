import api from "./api";

const BannerApi = {
  getAll: (params?: { order?: string }) => {
    return api.get("/api/banners", { params });
  },

  create: (data: { title: string; imageUrl: string; isActive: boolean }) => {
    return api.post("/api/banners", data);
  },

  update: (
    id: number,
    data: {
      title: string;
      imageUrl: string;
      isActive: boolean;
    }
  ) => {
    return api.patch(`/api/banners/${id}`, data);
  },

  delete: (id: number) => {
    return api.delete(`/api/banners/${id}`);
  },
};

export default BannerApi;
