import {
  Modal,
  Flex,
  Form,
  Button,
  Segmented,
  message,
  Upload,
  ConfigProvider,
} from "antd";
import React, { useState } from "react";
import {
  InfoCircleOutlined,
  AimOutlined,
  CheckCircleOutlined,
  EditOutlined,
  InboxOutlined,
} from "@ant-design/icons";
const { Dragger } = Upload;
const props = {
  name: "file",
  multiple: true,
  action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
  onChange(info) {
    const { status } = info.file;
    if (status !== "загрузка") {
      console.log(info.file, info.fileList);
    }
    if (status === "готово") {
      message.success(`${info.file.name} файл успешно загружен`);
    } else if (status === "ошибка") {
      message.error(`${info.file.name} загрузка файла не удалась`);
    }
  },
  onDrop(e) {
    console.log("Dropped files", e.dataTransfer.files);
  },
};

const InfoModal = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [exitBtn, setExitBtn] = useState(false);
  const showModalExit = () => {
    setExitBtn(true);
  };

  const sizeMedium = "large";
  const handleCancelExitInfo = () => {
    setIsModalInfo(false);
  };
  const [isModalInfo, setIsModalInfo] = useState(false);
  const showModalInfo = () => {
    setIsModalInfo(true);
  };
  const handleExitInfo = () => {
    setIsModalInfo(false);
  };

  return (
    <>
      {/* <Segmented
        options={["Собор", "Владыка"]}
        onChange={(value) => {
          console.log(value); // string
        }}
        style={{ marginRight: "24px", fontFamily: "Pompadur" }}
      /> */}
      <Modal
        title={<div style={{ width: "242px" }}>Оформление текста</div>}
        open={isModalInfo}
        onOk={handleExitInfo}
        onCancel={handleCancelExitInfo}
        footer={null}
        width={500}
        okButtonProps={{
          type: "primary",
          danger: true,
        }}
      >
        <div className="modalInfo">
          <div>
            <span>
              {" "}
              Выделение текста <span style={{ color: "red" }}>красным</span>:
              *текст*
            </span>
            <div>
              <b>Примечание: В воскресные дни, текст автоматически красный</b>
            </div>
          </div>
          <div>
            <span>
              {" "}
              Выделение текста <b>жирным</b>: @текст@
            </span>
          </div>
          <div>
            <span>
              {" "}
              Выделение текста <span style={{ color: "red" }}>
                красным
              </span> и <b>жирным</b>: @*текст*@ или *@текст@*
            </span>
          </div>
        </div>
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            width: "200px",
            maxWidth: 600,
            paddingRight: "74px",
            marginTop: "24px",
          }}
        ></Form>
      </Modal>
      <Button
        type="primary"
        shape="circle"
        size={sizeMedium}
        onClick={() => {
          showModalInfo();
        }}
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <InfoCircleOutlined
          style={{
            fontSize: "26px",
            lineHeight: 1,
            verticalAlign: "middle",
          }}
        />
      </Button>
    </>
  );
};

export { InfoModal };
