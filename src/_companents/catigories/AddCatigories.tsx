import { Button, Drawer, Form, Input, message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import useMyStore from "../../useMyStore";

function CategoriesDrawer({
  nomi,
  editItem,
  isOpen,
  setIsOpen,
  refresh,
}: {
  nomi: string;
  editItem?: any;
  isOpen: boolean;
  setIsOpen: any;
  refresh: () => void;
}) {
  const [loading, setLoading] = useState<boolean>(false);

  const [form] = Form.useForm();
  const accessToken = useMyStore((state) => state.accessToken);

  useEffect(() => {
    if (editItem) {
      form.setFieldsValue(editItem);
    } else {
      form.resetFields();
    }
  }, [editItem, isOpen]);

  function handleSubmit(values: any) {
    setLoading(true);
    const userData = {
      name: values.name,
      description: values.description,
    };

    const url = editItem?.id
      ? `https://nt.softly.uz/api/categories/${editItem.id}`
      : `https://nt.softly.uz/api/categories`;
    const method = editItem?.id ? "PATCH" : "post";

    axios({
      url: url,
      method: method,
      data: userData,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(() => {
        message.success(
          editItem?.id
            ? "kategoriya muvaffaqiyatli yangilandi"
            : "kategoriya muvaffaqiyatli qo'shildi"
        );
        setIsOpen(false);
        refresh();
        form.resetFields();
      })
      .catch((error) => {
        if (error.response?.status === 409) {
          message.error("Bu Kategoriya oldin qo'shilgan");
        } else {
          message.error("Kategoriyani saqlashda xatolik");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold mb-4">{nomi}</h2>
        <Button type="primary" onClick={() => setIsOpen(true)}>
          {editItem ? "Tahrirlash" : "Qo'shish"}
        </Button>
      </div>
      <Drawer open={isOpen} onClose={() => setIsOpen(false)}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={editItem}
        >
          <Form.Item label="description kiriting" name="description">
            <Input placeholder="description" />
          </Form.Item>
          <Form.Item
            label="Ism kiriting"
            name="name"
            rules={[{ required: true, message: "Ism kiritish majburiy!" }]}
          >
            <Input placeholder="Ism" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editItem ? "Yangilash" : "Qo'shish"}
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}

export default CategoriesDrawer;
