import { Button, Drawer, Form, InputNumber, message, Select } from "antd";
import { useEffect, useState } from "react";
import { MijozlarType, ProductlarType } from "../../Type";
import api from "../../api/api";

function OrdersDrawer({
  editItem,
  nomi,
  setIsOpen,
  isOpen,
  refresh,
}: {
  editItem: any;
  nomi: string;
  setIsOpen: any;
  isOpen: boolean;
  refresh: () => void;
}) {
  const [form] = Form.useForm();
  const [product, setProduct] = useState<ProductlarType>();
  const [user, setUser] = useState<MijozlarType>();

  useEffect(() => {
    if (editItem) {
      const initialValues = {
        customerId: editItem.customerId,
        productId: editItem.items?.[0]?.productId,
        quantity: editItem.items?.[0]?.quantity,
        status: editItem.status,
      };
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [editItem, form]);

  const handleSubmit = (values: any) => {
    console.log(values);

    const method = editItem ? "patch" : "post";
    const ordersData = editItem
      ? { status: values.status || "pending" }
      : {
          customerId: values.customerId,
          items: [
            {
              productId: values.productId,
              quantity: values.quantity,
            },
          ],
        };

    api({
      url: editItem ? `/api/orders/${editItem.id}` : "/api/orders",
      method: method,
      data: ordersData,
    })
      .then(() => {
        message.success(
          editItem
            ? "Buyurtma muvaffaqiyatli yangilandi"
            : "Buyurtma muvaffaqiyatli qo'shildi"
        );
        form.resetFields();
        refresh();
        setIsOpen(false);
      })
      .catch(() => {
        message.error("Xatolik yuz berdi");
      });
  };

  useEffect(() => {
    api.get("/api/products").then((response) => {
      setProduct(response.data);
    });

    api.get("/api/users").then((response) => {
      setUser(response.data);
    });
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold mb-4">{nomi}</h2>
        <Button type="primary" onClick={() => setIsOpen(true)}>
          {editItem ? "Tahrirlash" : "Qo'shish"}
        </Button>
      </div>
      <Drawer open={isOpen} onClose={() => setIsOpen(false)} destroyOnClose>
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          {editItem ? (
            <>
              <Form.Item
                name="status"
                label="Buyurtma statusi"
                rules={[{ required: true, message: "Status tanlang" }]}
              >
                <Select
                  placeholder="Statusni tanlang"
                  options={[
                    { label: "pending", value: "pending" },
                    { label: "processing", value: "processing" },
                    { label: "delivered", value: "delivered" },
                    { label: "cancelled", value: "cancelled" },
                  ]}
                />
              </Form.Item>
            </>
          ) : (
            <>
              <Form.Item
                name="customerId"
                label="Mijozni tanlang"
                rules={[{ required: true, message: "Mijoz tanlang" }]}
              >
                <Select
                  placeholder="Mijoz tanlang"
                  options={user?.items.map((item) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                />
              </Form.Item>

              <Form.Item
                name="productId"
                label="Mahsulotni tanlang"
                rules={[{ required: true, message: "Mahsulot tanlang" }]}
              >
                <Select
                  placeholder="Mahsulot tanlang"
                  options={product?.items.map((item) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                />
              </Form.Item>

              <Form.Item
                name="quantity"
                label="Miqdori"
                rules={[{ required: true, message: "Miqdor kiriting" }]}
              >
                <InputNumber min={1} style={{ width: "100%" }} />
              </Form.Item>
            </>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {editItem ? "Tahrirlash" : "Qo'shish"}
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}

export default OrdersDrawer;
