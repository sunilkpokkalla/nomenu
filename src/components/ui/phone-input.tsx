"use client";

import * as React from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

export interface PhoneInputProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string | undefined) => void;
  placeholder?: string;
  className?: string;
  name?: string;
  id?: string;
  required?: boolean;
}

export function PhoneInputField({
  value: controlledValue,
  defaultValue,
  onChange: controlledOnChange,
  placeholder,
  className = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
  name,
  id,
  required,
}: PhoneInputProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue || "");

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const handleChange = (val: string | undefined) => {
    if (!isControlled) {
      setInternalValue(val || "");
    }
    if (controlledOnChange) {
      controlledOnChange(val);
    }
  };
  return (
    <div className={`flex w-full items-center`}>
      <style dangerouslySetInnerHTML={{__html: `
        .PhoneInput { display: flex; align-items: center; width: 100%; }
        .PhoneInputCountry { margin-right: 0.5rem; }
        .PhoneInputInput { 
          flex: 1; 
          min-width: 0; 
          background: transparent; 
          border: 0; 
          outline: none; 
          font-size: inherit; 
          color: inherit;
        }
        .PhoneInputInput:focus { outline: none; box-shadow: none; }
      `}} />
      <div className={className}>
        <PhoneInput
          international
          defaultCountry="US"
          value={value}
          onChange={handleChange as never}
          placeholder={placeholder}
          name={name}
          id={id}
          required={required}
          className="w-full"
        />
      </div>
    </div>
  );
}
