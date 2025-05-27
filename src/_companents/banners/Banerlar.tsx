import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Image, message, Pagination, Switch, Table } from "antd";
import { useEffect, useState } from "react";
import BannersApi from "../../api/banner";
import BannerDrawer from "./AddBanerlar";
import { BannerlarType } from "../../Type";

function Bannerlar() {
  const [bannerlar, setBannerlar] = useState<BannerlarType>();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedBanner, setSelectedBanner] = useState<object | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const limit = 10;

  const fetchBanners = () => {
    setLoading(true);
    BannersApi.getAll({
      order: "ASC",
      // page: currentPage,
      // limit: limit,
    })
      .then((response) => {
        setBannerlar(response.data);
      })
      .catch((error) => {
        message.error("Xatolik yuz berdi: " + error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBanners();
  }, [currentPage]);

  const onDeleted = (id: number) => {
    setLoading(true);
    BannersApi.delete(id)
      .then(() => {
        message.success("Banner muvaffaqiyatli o‘chirildi");
        setBannerlar((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            items: prev.items.filter((item) => item.id !== id),
            total: prev.total - 1,
          };
        });
      })
      .catch(() => {
        message.error("O‘chirishda xatolik yuz berdi");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleToggle = (record: any, checked: boolean) => {
    setBannerlar((prev) =>
      prev
        ? {
            ...prev,
            items: prev.items.map((item) =>
              item.id === record.id ? { ...item, isActive: checked } : item
            ),
          }
        : prev
    );

    BannersApi.update(record.id, {
      title: record.title,
      imageUrl: record.imageUrl,
      isActive: checked,
    })
      .then(() => {
        message.success("Banner holati yangilandi");
      })
      .catch(() => {
        message.error("Holatni o‘zgartirishda xatolik yuz berdi");
      });
  };

  return (
    <div className="p-6 w-[1300px] ml-[150px] min-h-[640px] border-b border-b-gray-300 bg-white rounded-lg overflow-y-auto">
      <BannerDrawer
        nomi="Bannerlar"
        editItem={selectedBanner}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        refresh={fetchBanners}
      />

      <Table
        loading={loading}
        dataSource={bannerlar?.items || []}
        rowKey="id"
        pagination={false}
        className="w-full"
        columns={[
          {
            title: "ID",
            dataIndex: "id",
            key: "id",
          },
          {
            title: "Sarlavha",
            dataIndex: "title",
            key: "title",
          },
          {
            title: "Holati",
            dataIndex: "isActive",
            key: "isActive",
            render: (isActive: boolean, record: any) => (
              <Switch
                checked={isActive}
                onChange={(checked) => handleToggle(record, checked)}
              />
            ),
          },
          {
            title: "Yaratilgan sana",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (createdAt: string) => {
              const date = new Date(createdAt);
              const day = String(date.getDate()).padStart(2, "0");
              const month = String(date.getMonth() + 1).padStart(2, "0");
              const year = date.getFullYear();
              return `${day}.${month}.${year}`;
            },
          },
          {
            title: "Rasm",
            dataIndex: "imageUrl",
            key: "imageUrl",
            render: (url: string) => (
              <Image
                width={60}
                height={50}
                src={url}
                placeholder={<Image preview={false} src={url} width={70} />}
              />
            ),
          },
          {
            title: "Amallar",
            key: "actions",
            render: (_, record: any) => (
              <div className="flex gap-2 items-center">
                <Button
                  icon={<EditOutlined />}
                  onClick={() => {
                    setSelectedBanner(record);
                    setIsOpen(true);
                  }}
                />
                <Button
                  icon={<DeleteOutlined />}
                  danger
                  onClick={() => onDeleted(record.id)}
                />
              </div>
            ),
          },
        ]}
      />

      <div className="flex justify-end mt-4">
        <Pagination
          pageSize={limit}
          current={currentPage}
          total={bannerlar?.total || 0}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}

export default Bannerlar;
