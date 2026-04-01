import { useContext, useEffect, useState } from "react";
import { Table, Button, Space, Popconfirm, Image } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { BuildingsContext } from "../contexts/BuildingsContext";
import BuildingModal from "./BuildingModal";

const base = import.meta.env.BASE_URL;

const BuildingsTable = () => {
  const { buildings, loading, fetchBuildings, addBuilding, editBuilding, deleteBuilding } =
    useContext(BuildingsContext);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalData, setEditModalData] = useState(null);

  useEffect(() => {
    fetchBuildings();
  }, [fetchBuildings]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Area",
      dataIndex: "area",
      key: "area",
      width: 100,
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      render: (val) => val || "N/A",
    },
    {
      title: "Image",
      dataIndex: "imageID",
      key: "imageID",
      width: 100,
      render: (imageID) => (
        <Image
          src={imageID ? `${base}images/${imageID}` : `${base}images/placeholderImage.png`}
          width={60}
          height={40}
          style={{ objectFit: "cover", borderRadius: 4 }}
          fallback={`${base}images/placeholderImage.png`}
          preview={!!imageID}
        />
      ),
    },
    {
      title: (
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="small"
          onClick={() => setAddModalOpen(true)}
        >
          Add
        </Button>
      ),
      key: "actions",
      width: 160,
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => setEditModalData(record)}
            style={{ color: "#1668dc" }}
          />
          <Popconfirm
            title="Delete this building?"
            onConfirm={() => deleteBuilding(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              danger
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={buildings}
        rowKey="id"
        loading={loading}
        pagination={false}
        bordered
        style={{
          boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
          borderRadius: 8,
          overflow: "hidden",
        }}
      />

      <BuildingModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={addBuilding}
      />

      <BuildingModal
        open={!!editModalData}
        onClose={() => setEditModalData(null)}
        onSubmit={editBuilding}
        building={editModalData}
      />
    </>
  );
};

export default BuildingsTable;
