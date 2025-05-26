import { Button, Card, Form, Input, message } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import useMyStor from "../useMyStore";

function LoginPage() {
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useMyStor(); // ✅ setUser funksiyasini store'dan olamiz

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-[400px]">
        <Form
          layout="vertical"
          initialValues={{
            email: "admin@nt.uz",
            password: "pass123",
          }}
          onFinish={(values) => {
            setloading(true);
            api
              .post("/api/auth/login", values)
              .then((res) => {
                // ✅ Faol tokenni sozlash
                api.defaults.headers.Authorization = `Bearer ${res.data.accessToken}`;

                // ✅ Zustand store va localStorage'ga yozish
                setUser(res.data.user, res.data.accessToken);

                message.success("Logindan muvaffaqiyatli o'tildi 😊");

                navigate("/"); // ✅ Bosh sahifaga o'tish
              })
              .catch((e) => {
                console.error(e);
                message.error("Xatolik: login amalga oshmadi");
              })
              .finally(() => {
                setloading(false);
              });
          }}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Loginni kiriting",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Parol"
            name="password"
            rules={[
              {
                required: true,
                message: "Parolni kiriting",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button loading={loading} type="primary" block htmlType="submit">
              Kirish
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default LoginPage;
