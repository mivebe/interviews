import { useState } from "react";
import { Modal, Form, Input, InputNumber, Upload, Image } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const base = import.meta.env.BASE_URL;

const BuildingModal = ({ open, onClose, onSubmit, building }) => {
  const [form] = Form.useForm();
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState(null);

  const isEdit = !!building;

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit({
        ...values,
        imageID: fileName || building?.imageID || null,
        ...(isEdit ? { id: building.id } : {}),
      });
      form.resetFields();
      setPreview(null);
      setFileName(null);
      onClose();
    } catch {
      // validation failed
    }
  };

  const handleFileChange = (info) => {
    const file = info.file.originFileObj || info.file;
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const imageUrl = preview
    ? preview
    : building?.imageID
      ? `${base}images/${building.imageID}`
      : `${base}images/placeholderImage.png`;

  return (
    <Modal
      title={isEdit ? "Edit Building" : "Add Building"}
      open={open}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields();
        setPreview(null);
        setFileName(null);
        onClose();
      }}
      okText={isEdit ? "Save" : "Add"}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={
          isEdit
            ? {
                name: building.name,
                area: building.area,
                location: building.location === "N/A" ? "" : building.location,
              }
            : {}
        }
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please enter a building name" }]}
        >
          <Input placeholder="Building name" />
        </Form.Item>
        <Form.Item
          name="area"
          label="Area"
          rules={[{ required: true, message: "Please enter the area" }]}
        >
          <InputNumber
            placeholder="Area"
            style={{ width: "100%" }}
            min={1}
          />
        </Form.Item>
        <Form.Item name="location" label="Location">
          <Input placeholder="Location" />
        </Form.Item>
        <Form.Item label="Image">
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Upload
              beforeUpload={() => false}
              onChange={handleFileChange}
              showUploadList={false}
              maxCount={1}
            >
              <span
                style={{ cursor: "pointer", color: "#1668dc" }}
              >
                <UploadOutlined /> Upload image
              </span>
            </Upload>
            <Image
              src={imageUrl}
              width={80}
              height={60}
              style={{ objectFit: "cover", borderRadius: 4 }}
              fallback={`${base}images/placeholderImage.png`}
              preview={false}
            />
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BuildingModal;
