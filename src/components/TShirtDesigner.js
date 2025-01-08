import React, { useState, useRef } from "react";
import "./styles/TShirtDesigner.css";

const TShirtDesigner = () => {
  const [logo, setLogo] = useState(null);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [logoSize, setLogoSize] = useState(100); // Logo width in pixels
  const tShirtRef = useRef(null);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setLogo(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e) => {
    const rect = tShirtRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left - logoSize / 2,
      y: e.clientY - rect.top - logoSize / 2,
    });
  };

  const handleResize = (e) => {
    setLogoSize(Number(e.target.value));
  };

  const saveFinalImage = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const tShirtImage = tShirtRef.current.querySelector("img");
    canvas.width = tShirtImage.width;
    canvas.height = tShirtImage.height;

    // Draw T-shirt
    ctx.drawImage(tShirtImage, 0, 0, canvas.width, canvas.height);

    // Draw Logo
    if (logo) {
      const img = new Image();
      img.src = logo;
      img.onload = () => {
        ctx.drawImage(
          img,
          position.x,
          position.y,
          logoSize,
          (img.height / img.width) * logoSize
        );

        // Save the final image
        const finalImage = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = finalImage;
        link.download = "custom_tshirt.png";
        link.click();
      };
    }
  };

  return (
    <div className="designer-container">
      <div className="tshirt-area" ref={tShirtRef}>
        <img
          src="https://via.placeholder.com/300x400.png?text=T-Shirt"
          alt="T-Shirt"
          className="tshirt-image"
        />
        {logo && (
          <img
            src={logo}
            alt="Logo"
            className="logo-image"
            draggable="true"
            onDragEnd={handleDrag}
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`,
              width: `${logoSize}px`,
              height: "auto",
            }}
          />
        )}
      </div>
      <div className="controls">
        <input type="file" onChange={handleLogoUpload} />
        {logo && (
          <>
            <label htmlFor="logo-size">Resize Logo:</label>
            <input
              type="range"
              id="logo-size"
              min="50"
              max="200"
              value={logoSize}
              onChange={handleResize}
            />
          </>
        )}
        <button onClick={saveFinalImage}>Submit</button>
      </div>
    </div>
  );
};

export default TShirtDesigner;
