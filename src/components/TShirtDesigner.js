import React, { useState, useRef } from "react";
import "./styles/TShirtDesigner.css";

const TShirtDesigner = () => {
  const [tShirt, setTShirt] = useState(null); // For T-shirt image
  const [logo, setLogo] = useState(null); // For logo image
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [logoSize, setLogoSize] = useState(100); // Logo width in pixels
  const tShirtRef = useRef(null);

  // Handle T-shirt image upload
  const handleTShirtUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setTShirt(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Handle logo upload
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setLogo(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Handle drag and drop of logo
  const handleDrag = (e) => {
    const rect = tShirtRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left - logoSize / 2,
      y: e.clientY - rect.top - logoSize / 2,
    });
  };

  // Handle resizing of logo
  const handleResize = (e) => {
    setLogoSize(Number(e.target.value));
  };

  // Save the final image (T-shirt + Logo)
  const saveFinalImage = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const tShirtImage = tShirtRef.current.querySelector("img");
    canvas.width = tShirtImage.width;
    canvas.height = tShirtImage.height;

    // Draw T-shirt
    const tShirtBackground = new Image();
    tShirtBackground.src = tShirt;
    tShirtBackground.onload = () => {
      ctx.drawImage(tShirtBackground, 0, 0, canvas.width, canvas.height);

      // Draw Logo
      if (logo) {
        const logoImage = new Image();
        logoImage.src = logo;
        logoImage.onload = () => {
          ctx.drawImage(
            logoImage,
            position.x,
            position.y,
            logoSize,
            (logoImage.height / logoImage.width) * logoSize
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
  };

  return (
    <div className="designer-container">
      <div className="tshirt-area" ref={tShirtRef}>
        {tShirt ? (
          <img
            src={tShirt}
            alt="T-Shirt"
            className="tshirt-image"
          />
        ) : (
          <p className="placeholder-text">Upload a T-Shirt image</p>
        )}
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
        <label htmlFor="tshirt-upload">Upload T-Shirt:</label>
        <input type="file" id="tshirt-upload" onChange={handleTShirtUpload} />

        <label htmlFor="logo-upload">Upload Logo:</label>
        <input type="file" id="logo-upload" onChange={handleLogoUpload} />

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
