import { Button, Drawer, Form, Input, message, Switch, Upload } from "antd";
import { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import BannerApi from "../../api/banner";

function BannerDrawer({
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
      form.setFieldsValue({ title: "", imageUrl: "", isActive: false });
    }
  }, [editItem, isOpen]);

  const handleSubmit = async (values: any) => {
    setLoading(true);

    const userData = {
      title: values.title,
      imageUrl: values.imageUrl.file.response.url,
      isActive: values.isActive === true,
    };

    try {
      if (editItem?.id) {
        await BannerApi.update(editItem.id, userData);
        message.success("Banner muvaffaqiyatli yangilandi");
      } else {
        await BannerApi.create(userData);
        message.success("Banner muvaffaqiyatli qo'shildi");
      }

      form.resetFields();
      setIsOpen(false);
      refresh();
    } catch (error) {
      message.error("Bannerni saqlashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold mb-4">{nomi}</h2>
        <Button type="primary" onClick={() => setIsOpen(true)}>
          {editItem ? "Tahrirlash" : "Qo'shish"}
        </Button>
      </div>
      <Drawer open={isOpen} onClose={() => setIsOpen(false)}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Title kiriting"
            name="title"
            rules={[{ required: true, message: "Title kiritish majburiy!" }]}
          >
            <Input placeholder="Title" />
          </Form.Item>
          <Form.Item
            label="isActive kiriting"
            name="isActive"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            label="Image kiriting"
            name="imageUrl"
            rules={[{ required: true }]}
          >
            <Upload
              name="file"
              action='https://nt.softly.uz/api/files/upload'
              headers={{
                authorization: 'authorization-text',
              }}
              onChange={(info) => {
                console.log(info);

                if (info.file.status !== 'uploading') {
                  console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                  message.success(`${info.file.name} loaded`);
                } else if (info.file.status === 'error') {
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

export default BannerDrawer;
