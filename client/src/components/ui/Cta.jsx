import React from "react";
import { Button } from "@/components";
import { useNavigate } from "react-router-dom";

const CTA = ({ data = {} }) => {
  const navigate = useNavigate();

  const {
    title,
    description,
    buttonText,
    buttonLink,
    gradientFrom = "blue-600",
    gradientTo = "orange-500",
    textColor = "white",
    buttonVariant = "filled",
    buttonColor = "blue",
    rounded = true,
    className = "",
  } = data;

  return (
    <section
      className={`py-20 bg-gradient-to-tr from-${gradientFrom} to-${gradientTo} ${className}`}
    >
      <div className="container mx-auto px-6 text-center">
        {title && (
          <h2 className={`text-4xl font-extrabold text-${textColor} mb-4`}>
            {title}
          </h2>
        )}

        {description && (
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            {description}
          </p>
        )}

        {buttonText && buttonLink && (
          <Button
            onClick={() => navigate(buttonLink)}
            variant={buttonVariant}
            color={buttonColor}
            rounded={rounded}
            className="text-lg"
          >
            {buttonText}
          </Button>
        )}
      </div>
    </section>
  );
};

export default CTA;
