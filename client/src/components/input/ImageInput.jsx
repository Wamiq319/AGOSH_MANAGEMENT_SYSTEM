import React, { useState } from "react";
import { HiX } from "react-icons/hi";

const ImageInput = ({
  required = true,
  label,
  name,
  onChange,
  className = "",
  error,
  disabled = false,
  initialValue,
}) => {
  const [preview, setPreview] = useState(initialValue || null);

  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });

  const handleImageUpload = async (e) => {
    if (disabled) return;
    const file = e.target.files[0];
    if (!file) return;
    const base64 = await convertToBase64(file);
    setPreview(base64);

    if (onChange) {
      onChange({ target: { name, value: base64 } });
    }
  };

  const handleRemoveImage = () => {
    if (disabled) return;
    setPreview(null);
    const syntheticEvent = {
      target: {
        name,
        value: null,
        files: [],
        type: "file",
      },
    };
    onChange(syntheticEvent);
  };

  return (
    <div className={`w-full mb-4 ${className}`}>
      <label className="block text-sm font-semibold mb-2 text-blue-700">
        {label} {required && <span className="text-red-600">*</span>}
      </label>

      <div className="space-y-3">
        {preview ? (
          <div className="relative w-full h-40 border border-blue-500 rounded-md overflow-hidden">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            {!disabled && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-1 right-1 bg-white/80 rounded-full p-1 hover:bg-red-500 hover:text-white transition"
              >
                <HiX size={18} />
              </button>
            )}
          </div>
        ) : (
          <label
            className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-blue-500 rounded-md cursor-pointer bg-[#F0F8FF] hover:bg-blue-50 transition ${
              disabled ? "opacity-60 cursor-not-allowed bg-gray-100" : ""
            }`}
          >
            <span className="text-blue-500 text-sm text-center">
              {disabled ? "Upload disabled" : "Click to upload"}
            </span>
            <input
              type="file"
              accept="image/*"
              name={name}
              className="hidden"
              onChange={handleImageUpload}
              disabled={disabled}
            />
          </label>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default ImageInput;
