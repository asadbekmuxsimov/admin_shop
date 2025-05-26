import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, message, Pagination, Table } from "antd";
import { useEffect, useState } from "react";
import { CategoriesType } from "../../Type";
import useMyStore from "../../useMyStore";
import api from "../../api/api";
import CategoriesDrawer from "./AddCatigories";

function Kategoriyalar() {
  const state = useMyStore();
  const [Kategoriyalar, setKategoriyalar] = useState<CategoriesType>();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<Object>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1)
  const limit = 10

  const users = () => {
    setLoading(true);
    api
      .get("/api/categories?order=ASC", {
        params: {
          page: currentPage,
          limit: limit
        }
      })
      .then((response) => {
        setKategoriyalar(response.data);
      })
      .catch((error) => {
        if (error.status === 401) {
          state.logout();
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    users();
  }, [currentPage]);

  function onDeleted(id: number) {
    api
      .delete(`/api/categories/${id}`)
      .then(() => {
        message.success("Kategoriya muvaffaqiyatli o'chirildi");
        setKategoriyalar((prev) => prev ? {
          ...prev,
          items: prev.items.filter((item) => item.id !== id),
          total: (prev.total || 0) - 1
        } : undefined);
      })
      .catch(() => {
        message.error("O'chirishda xatolik yuz berdi");
      });
  }

  return (
    <div className="p-6 w-full h-[640px] border-b border-b-gray-300 bg-white rounded-lg overflow-y-auto">
      <CategoriesDrawer
        nomi="Kategoriyalar"
        editItem={selectedUser}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        refresh={users}
      />
      <Table
        loading={loading}
        columns={[
          {
            title: "ID",
            dataIndex: "id",
            key: "id",
          },
          {
            title: "Ism",
            dataIndex: "name",
            key: "name",
          },
          {
            title: "description",
            dataIndex: "description",
            key: "description",
          },
          {
            title: "Yaratilgan sana",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (item: string) => {
              const date = new Date(item);
              const day = String(date.getDate()).padStart(2, "0");
              const month = String(date.getMonth() + 1).padStart(2, "0");
              const year = date.getFullYear();
              return `${day}.${month}.${year}`;
            },
          },
          {
            title: "Boshqalar",
            dataIndex: "id",
            key: "id",
            render: (id: number, rent) => {
              return (
                <div className="flex gap-2 items-center">
                  <Button
                    onClick={() => {
                      setSelectedUser(rent);
                      setIsOpen(true);
                    }}
                  >
                    <EditOutlined />
                  </Button>
                  <Button onClick={() => onDeleted(id)} danger>
                    <DeleteOutlined />
                  </Button>
                </div>
              );
            },
          },
        ]}
        dataSource={Kategoriyalar?.items}
        rowKey="id"
        pagination={false}
        className="w-full"
      />
      <div className="flex justify-end mt-4">
        <Pagination
          pageSize={limit}
          defaultCurrent={currentPage}
          total={Kategoriyalar?.total}
          onChange={(page) => {
            setCurrentPage(page)
          }}
        />
      </div>
    </div>
  );
}

export default Kategoriyalar;
