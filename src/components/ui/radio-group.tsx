import React, { useState } from 'react';

interface RadioGroupProps {
  value?: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

interface RadioGroupItemProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  id: string;
}

const RadioGroupContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
}>({
  value: '',
  onValueChange: () => {},
});

const RadioGroup = ({ value = '', onValueChange, children, className }: RadioGroupProps) => {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange }}>
      <div className={`grid gap-2 ${className || ''}`}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
};

const RadioGroupItem = ({ value, id, className, ...props }: RadioGroupItemProps) => {
  const { value: selectedValue, onValueChange } = React.useContext(RadioGroupContext);
  
  const isChecked = selectedValue === value;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      onValueChange(value);
    }
  };
  
  return (
    <input
      type="radio"
      id={id}
      value={value}
      checked={isChecked}
      onChange={handleChange}
      className={`aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
      {...props}
    />
  );
};

export { RadioGroup, RadioGroupItem };