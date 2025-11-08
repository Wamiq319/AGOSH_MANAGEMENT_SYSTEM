import React, { useEffect, useState } from "react";
import { InputField, Dropdown } from "@/components/input";

const defaultInitialData = {};

const FormModal = ({
  initialData = defaultInitialData,
  fields = [],
  onSubmit,
  formId,
  children,
}) => {
  const [formData, setFormData] = useState(initialData);
  const [validationError, setValidationError] = useState("");

  // initialize default values
  useEffect(() => {
    const defaultState = {};
    fields.forEach((field) => {
      defaultState[field.name] = field.defaultValue || "";
    });
    setFormData({ ...defaultState, ...initialData });
  }, [fields, initialData]);

  // Normal field change (text, textarea, password, etc.)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //  Dropdown select change
  const handleDropdownChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  //  Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();

    for (const field of fields) {
      if (field.required && !formData[field.name]) {
        setValidationError(`${field.label || field.name} is required.`);
        return;
      }
    }

    setValidationError("");
    onSubmit(formData);
  };

  //  Field renderer (supports dropdown + all input types including image)
  const renderField = (field) => {
    const { type, ...props } = field;
    const value = formData[props.name] || "";

    switch (type) {
      case "dropdown":
        return (
          <Dropdown
            {...props}
            selectedValue={value}
            onChange={(val) => handleDropdownChange(props.name, val)}
          />
        );

      // handle image upload using InputField
      case "image":
        return (
          <InputField
            {...props}
            type="image"
            value={value}
            onChange={handleChange}
          />
        );

      default:
        return (
          <InputField
            {...props}
            type={type}
            value={value}
            onChange={handleChange}
          />
        );
    }
  };

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field) => (
          <div key={field.name} className={field.className || ""}>
            {renderField(field)}
          </div>
        ))}
      </div>

      {validationError && (
        <p className="text-red-600 text-sm">{validationError}</p>
      )}
      {children && <div>{children}</div>}
    </form>
  );
};

export default FormModal;
