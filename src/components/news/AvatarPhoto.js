import React, { useState, useEffect, useRef } from "react";
import AvatarEditor from "react-avatar-editor";
import {
  DeleteOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  SaveOutlined,
  ShrinkOutlined,
  ArrowsAltOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Button } from "antd";

// const getBase64 = (img, callback) => {
//   const reader = new FileReader();
//   reader.addEventListener("load", () => callback(reader.result));
//   reader.readAsDataURL(img);
// };
// const beforeUpload = (file) => {
//   const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
//   if (!isJpgOrPng) {
//     message.error("You can only upload JPG/PNG file!");
//   }
//   const isLt2M = file.size / 1024 / 1024 < 2;
//   if (!isLt2M) {
//     message.error("Image must smaller than 2MB!");
//   }
//   return isJpgOrPng && isLt2M;
// };

const AvatarPhoto = () => {
  //
  // const [loading, setLoading] = useState(false);
  // const [imageUrl, setImageUrl] = useState();
  // const handleChange = (info) => {
  //   if (info.file.status === "uploading") {
  //     setLoading(true);
  //     return;
  //   }
  //   if (info.file.status === "done") {
  //     // Get this url from response in real world.
  //     getBase64(info.file.originFileObj, (url) => {
  //       setLoading(false);
  //       setImageUrl(url);
  //     });
  //   }
  // };
  // const uploadButton = (
  //   <button
  //     style={{
  //       border: 0,
  //       background: "none",
  //     }}
  //     type="button"
  //   >
  //     {loading ? <LoadingOutlined /> : <PlusOutlined />}
  //     <div
  //       style={{
  //         marginTop: 8,
  //       }}
  //     >
  //       Upload
  //     </div>
  //   </button>
  // );
  //

  const [scale, setScale] = useState(1.2);
  const [image, setImage] = useState(null); // Хранит загруженное изображение
  const [isEditing, setIsEditing] = useState(true); // Режим редактирования
  const editorRef = useRef(null); // Ссылка на компонент AvatarEditor
  const fileInputRef = useRef(null); // Ссылка на инпут для загрузки файл
  const [savedImage, setSavedImage] = useState(null); // Сохранённое изображение
  const [isMirrored, setIsMirrored] = useState(false);
  const [size, setSize] = useState("large"); // default is 'middle'

  const handleZoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.1, 5)); // Максимум 5
  };

  const handleZoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.1, 0.5)); // Минимум 0.5
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result); // Устанавливаем изображение из файла
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputClick = () => {
    // Открываем инпут при клике на аватар, если изображение ещё не загружено
    if (!image && fileInputRef.current) {
      fileInputRef.current.click(); // Имитируем клик по скрытому инпуту
    }
  };

  // Сохранение результата
  const handleSave = () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas();

      // Применяем зеркальное отражение при сохранении
      if (isMirrored) {
        const ctx = canvas.getContext("2d");
        ctx.translate(canvas.width, 0); // Перемещаем по оси X
        ctx.scale(-1, 1); // Зеркалим по горизонтали
        ctx.drawImage(canvas, 0, 0);
      }

      const imageURL = canvas.toDataURL("image/jpeg/png", 1.0);
      setSavedImage(imageURL);
    }
    setIsEditing(false);
  };

  // Переключение в режим редактирования
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Удаление изображения
  const handleDelete = () => {
    setImage(null); // Сбрасываем загруженное изображение
    setSavedImage(null); // Сбрасываем сохранённое изображение
    setScale(1.2); // Сбрасываем масштаб
  };

  const toggleMirror = () => {
    setIsMirrored((prevState) => !prevState); // Переключение состояния зеркала
  };

  return (
    <div>
      <div>
        {isEditing ? (
          <>
            <div
              onClick={handleInputClick}
              style={{
                display: "inline-block",
                cursor: image ? "move" : "pointer", // Устанавливаем курсор только при наличии изображения
                position: "relative", // Убедитесь, что элемент аватара будет занимать пространство
              }}
            >
              <AvatarEditor
                ref={editorRef}
                image={image || "placeHolder.png"} // Если нет загруженного изображения, используем placeholder
                width={200}
                height={200}
                border={50}
                color={[255, 255, 255, 0.6]} // RGBA
                scale={scale}
                rotate={0}
                borderRadius={125}
                style={{
                  clipPath: image ? "none" : "circle(34%)", // Обрезаем только если нет изображения
                  transform: isMirrored ? "scaleX(-1)" : "none", // Применение зеркала
                  pointerEvents: image ? "auto" : "none",
                }}
                onDragStart={image ? (e) => e.preventDefault() : null}
              />
            </div>

            {/* Контейнер для кнопок с выравниванием в одну линию */}
            <div
              style={{
                display: "flex",
                marginLeft: "32px",
                gap: "10px", // Расстояние между кнопками
              }}
            >
              <Button
                onClick={handleSave}
                disabled={!image}
                shape="circle"
                size={size}
              >
                <SaveOutlined />
              </Button>
              <Button
                onClick={handleZoomIn}
                disabled={!image}
                shape="circle"
                size={size}
              >
                <ArrowsAltOutlined />
              </Button>

              <Button
                onClick={handleZoomOut}
                disabled={!image}
                shape="circle"
                size={size}
              >
                <ShrinkOutlined />
              </Button>

              {/* Контейнер для других кнопок */}
              <div
                style={{
                  display: "flex",
                  gap: "10px", // Расстояние между кнопками
                }}
              >
                <input
                  ref={fileInputRef} // Ссылка на инпут
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }} // Скрытие инпута
                />

                <Button
                  onClick={toggleMirror}
                  disabled={!image}
                  shape="circle"
                  size={size}
                >
                  {isMirrored ? (
                    <RotateLeftOutlined />
                  ) : (
                    <RotateRightOutlined />
                  )}
                </Button>
                <Button
                  onClick={handleDelete}
                  type="primary"
                  danger
                  shape="circle"
                  size={size}
                >
                  <DeleteOutlined />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            {savedImage ? (
              <img
                src={savedImage}
                alt="Сохранённое изображение"
                style={{
                  width: "200px",
                  height: "200px",
                  borderRadius: "125px",
                  border: "2px solid #ccc",
                  marginLeft: "48px",
                  marginTop: "48px",
                  marginRight: "48px",
                }}
              />
            ) : (
              <p>Нет сохранённого изображения</p>
            )}
            <Button
              onClick={handleEdit}
              style={{ marginTop: "10px" }}
              shape="circle"
              size={size}
            >
              <EditOutlined />
            </Button>
          </>
        )}
      </div>
      {/* <div>
        <Upload
          name="avatar"
          listType="picture-circle"
          className="avatar-uploader"
          showUploadList={false}
          action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
          beforeUpload={beforeUpload}
          onChange={handleChange}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="avatar"
              style={{
                width: "100%",
              }}
            />
          ) : (
            uploadButton
          )}
        </Upload>
      </div> */}
    </div>
  );
};

export default AvatarPhoto;
