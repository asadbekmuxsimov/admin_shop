import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Image, message, Pagination, Table } from "antd";
import { useEffect, useState } from "react";
import useMyStore from "../../useMyStore";
import MijozlarApi from "../../api/user";
import DrawerPage from "./AddUser";
import { MijozlarType } from "../../Type";

function User() {
  const state = useMyStore();
  const [mijozlar, setMijozlar] = useState<MijozlarType>();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<Object>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const limit = 10;

  const users = () => {
    setLoading(true);
    MijozlarApi.getAll({ order: "ASC" })
      .then((response) => {
        setMijozlar(response.data);
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
  }, []);

  function onDeleted(id: number) {
    setLoading(true);
    const user = mijozlar?.items.find((item) => item.id === id);

    if (user?.role === "admin") {
      return message.error("Admin foydalanuvchini o'chirish mumkin emas");
    }

    MijozlarApi.delete(id)
      .then(() => {
        message.success("Mijoz muvaffaqiyatli o'chirildi");
        setMijozlar((prev) =>
          prev
            ? {
                ...prev,
                items: prev.items.filter((item) => item.id !== id),
                total: (prev.total || 0) - 1,
              }
            : undefined
        );
      })
      .catch(() => {
        message.error("O'chirishda xatolik yuz berdi");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div className="p-6 w-[1300px] h-[640px] ml-[150px] border-b border-b-gray-300 bg-white rounded-lg overflow-y-auto">
      <DrawerPage
        nomi="Mijozlar"
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
            title: "Email",
            dataIndex: "email",
            key: "email",
          },
          {
            title: "Roli",
            dataIndex: "role",
            key: "role",
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
            title: "image",
            dataIndex: "image",
            key: "image",
            render: (image) => {
              return (
                <div>
                  <Image
                    width={70}
                    height={50}
                    src={image}
                    placeholder={
                      <Image preview={false} src={image} width={200} />
                    }
                  />
                </div>
              );
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
        dataSource={mijozlar?.items}
        rowKey="id"
        pagination={false}
        className="w-full"
      />
      <div className="flex justify-end mt-4">
        <Pagination
          pageSize={limit}
          defaultCurrent={currentPage}
          total={mijozlar?.total}
          onChange={(page) => {
            setCurrentPage(page);
          }}
        />
      </div>
    </div>
  );
}

export default User;
