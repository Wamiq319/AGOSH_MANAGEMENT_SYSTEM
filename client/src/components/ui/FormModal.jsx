import React, { useEffect, useState } from "react";
import { InputField, Dropdown, ImageInput, TextArea } from "@/components/input";
import { Button } from "@/components/ui"; // Import Button

const defaultInitialData = {};

const FormModal = ({
  initialData = defaultInitialData,
  fields = [],
  onSubmit,
  formId,
  children,
  submitText, // Add submitText prop
  isSubmitting, // Add isSubmitting prop
}) => {
  const [formData, setFormData] = useState(initialData);
  const [validationError, setValidationError] = useState("");

  // Initialize default values
  useEffect(() => {
    const defaultState = {};
    fields.forEach((field) => {
      defaultState[field.name] = field.defaultValue || "";
    });
    setFormData({ ...defaultState, ...initialData });
  }, [fields, initialData]);

  // Handle normal field change
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle dropdown select change
  const handleDropdownChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Submit handler
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

  // Field renderer (supports dropdown + all input types including image)
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
            color="blue" // theme color
          />
        );

      case "image":
        return (
          <ImageInput
            {...props}
            onChange={handleChange}
            initialValue={value}
          />
        );
      
      case "textarea":
        return (
          <TextArea
            {...props}
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
            color="blue" // theme color
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
        <p className="text-orange-600 text-sm font-medium">{validationError}</p>
      )}

      {children && <div>{children}</div>}

      {/* Default Submit Button */}
      {submitText && (
        <div className="flex justify-end mt-6">
          <Button
            type="submit"
            variant="filled"
            color="blue"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : submitText}
          </Button>
        </div>
      )}
    </form>
  );
};

export default FormModal;
