type mijozType = {
  createdAt: string;
  email: string;
  id: number;
  name: string;
  role: string;
  password: string;
  image: string;
};

export type MijozlarType = {
  items: mijozType[];
  total: number;
  page: number;
};

type productType = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  createdAt: string;
  imageUrl: string;
};

export type ProductlarType = {
  items: productType[];
  total: number;
  page: number;
};

export type OrderProduct = {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
};

export type BuyurtmalarItemType = {
  id: number;
  customerId: number;
  totalPrice: number;
  status: "pending" | "processing" | "delivered" | "cancelled";
  createdAt: string;
  items: OrderProduct[];
};

export type BuyurtmalarType = {
  items: BuyurtmalarItemType[];
  total: number;
  page: number;
  message: string;
};
type categoryType = {
  id: number;
  name: string;
  description: string;
  createdAt: string;
};
export type CategoriesType = {
  items: categoryType[];
  total: number;
  page: number;
};

type bannerType = {
  id: number;
  title: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
};

export type BannerlarType = {
  items: bannerType[];
  limit: number;
  total: number;
};

export type DashboardType = {
  totalUsers: string;
  totalOrders: string;
  totalProducts: string;
  totalRevenue: string;
  recentOrders: {
    id: number;
    customerId: number;
    totalPrice: number;
    status: string;
    createdAt: string;
  }[];
};
