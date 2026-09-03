import React, { useState, useRef } from "react";
import AvatarEditor from "react-avatar-editor";
import {
  IconTrash,
  IconRefresh,
  IconRestart,
  IconDiskette,
  IconZoomOut,
  IconZoomIn,
  IconPen,
} from "../icons";
import { Button } from "@heroui/react";

const AvatarPhoto = () => {
  const [scale, setScale] = useState(1.2);
  const [image, setImage] = useState(null); // Хранит загруженное изображение
  const [isEditing, setIsEditing] = useState(true); // Режим редактирования
  const editorRef = useRef(null); // Ссылка на компонент AvatarEditor
  const fileInputRef = useRef(null); // Ссылка на инпут для загрузки файл
  const [savedImage, setSavedImage] = useState(null); // Сохранённое изображение
  const [isMirrored, setIsMirrored] = useState(false);

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
                cursor: image ? "move" : "pointer",
                position: "relative",
              }}
            >
              <AvatarEditor
                ref={editorRef}
                image={image || "placeHolder.png"}
                width={200}
                height={200}
                border={50}
                color={[255, 255, 255, 0.6]}
                scale={scale}
                rotate={0}
                borderRadius={125}
                style={{
                  clipPath: image ? "none" : "circle(34%)",
                  transform: isMirrored ? "scaleX(-1)" : "none",
                  pointerEvents: image ? "auto" : "none",
                }}
                onDragStart={image ? (e) => e.preventDefault() : null}
              />
            </div>

            <div style={{ display: "flex", marginLeft: "32px", gap: "10px" }}>
              <Button onPress={handleSave} isDisabled={!image} isIconOnly variant="outline" aria-label="Сохранить">
                <IconDiskette size={18} />
              </Button>
              <Button onPress={handleZoomIn} isDisabled={!image} isIconOnly variant="outline" aria-label="Приблизить">
                <IconZoomIn size={18} />
              </Button>
              <Button onPress={handleZoomOut} isDisabled={!image} isIconOnly variant="outline" aria-label="Отдалить">
                <IconZoomOut size={18} />
              </Button>
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
                <Button onPress={toggleMirror} isDisabled={!image} isIconOnly variant="outline" aria-label="Отразить">
                  {isMirrored ? <IconRefresh size={18} /> : <IconRestart size={18} />}
                </Button>
                <Button onPress={handleDelete} isDisabled={!image} isIconOnly variant="danger" aria-label="Удалить">
                  <IconTrash size={18} />
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
                  margin: "48px",
                }}
              />
            ) : (
              <p>Нет сохранённого изображения</p>
            )}
            <Button onPress={handleEdit} style={{ marginTop: "10px" }} isIconOnly variant="outline" aria-label="Редактировать">
              <IconPen size={18} />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default AvatarPhoto;
