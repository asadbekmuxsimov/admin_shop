import { Button, Drawer, Form, Input, message, Radio, Upload } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import MijozlarApi from "../../api/user";

function DrawerPage({
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

  useEffect(() => {
    if (editItem) {
      form.setFieldsValue(editItem);
    } else {
      form.resetFields();
    }
  }, [editItem, isOpen]);

  async function handleSubmit(values: any) {
    setLoading(true);

    const userData = {
      name: values.name,
      email: values.email,
      password: values.password || undefined,
      role: values.role || "customer",
      image: values.image.file.response.url || "",
    };
    try {
      if (editItem?.id) {
        await MijozlarApi.update(editItem.id, userData);
        message.success("Mijoz muvaffaqiyatli yangilandi");
      } else {
        await MijozlarApi.create(userData);
        message.success("Mijoz muvaffaqiyatli qo'shildi");
      }
      setIsOpen(false);
      refresh();
      form.resetFields();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        message.error("Bu mijoz oldin qo'shilgan");
      } else {
        message.error("Mijozni saqlashda xatolik" + error);
      }
    } finally {
      setLoading(false);
    }
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
          <Form.Item
            label="Email kiriting"
            name="email"
            rules={[{ required: true, message: "Email kiritish majburiy!" }]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            label="Ism kiriting"
            name="name"
            rules={[{ required: true, message: "Ism kiritish majburiy!" }]}
          >
            <Input placeholder="Ism" />
          </Form.Item>
          {!editItem?.id && (
            <Form.Item
              label="Password kiriting"
              name="password"
              rules={[
                { required: true, message: "Parol kiritish majburiy!" },
                {
                  min: 6,
                  message: "Parol kamida 6 ta belgidan iborat bo'lishi kerak!",
                },
              ]}
            >
              <Input placeholder="Password" />
            </Form.Item>
          )}
          <Form.Item label="Roli tanlang" name="role">
            <Radio.Group
              options={[
                { label: "Admin", value: "admin" },
                { label: "Customer", value: "customer" },
              ]}
              buttonStyle="solid"
              optionType="button"
            />
          </Form.Item>
          <Form.Item label="Image kiriting" name="image">
            <Upload
              name="file"
              action="https://nt.softly.uz/api/files/upload"
              headers={{
                authorization: "authorization-text",
              }}
              onChange={(info) => {
                console.log(info);

                if (info.file.status !== "uploading") {
                  console.log(info.file, info.fileList);
                }
                if (info.file.status === "done") {
                  message.success(`${info.file.name} loaded`);
                } else if (info.file.status === "error") {
                  message.error(`${info.file.name} file upload failed.`);
                }
              }}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
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

export default DrawerPage;
