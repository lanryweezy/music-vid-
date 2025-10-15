import React, { useState } from 'react';

interface SelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

interface SelectContentProps {
  children: React.ReactNode;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
}

const SelectContext = React.createContext<{
  open: boolean;
  value: string;
  onValueChange: (value: string) => void;
  setOpen: (open: boolean) => void;
}>({
  open: false,
  value: '',
  onValueChange: () => {},
  setOpen: () => {},
});

const Select = ({ value = '', onValueChange, children }: SelectProps) => {
  const [open, setOpen] = useState(false);
  
  return (
    <SelectContext.Provider value={{ open, value, onValueChange, setOpen }}>
      <div className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  );
};

const SelectTrigger = ({ children, className, ...props }: SelectTriggerProps) => {
  const { open, setOpen } = React.useContext(SelectContext);
  
  return (
    <button
      type="button"
      className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
      {...props}
      onClick={() => setOpen(!open)}
    >
      {children}
      <span className="ml-2">▼</span>
    </button>
  );
};

const SelectContent = ({ children }: SelectContentProps) => {
  const { open } = React.useContext(SelectContext);
  
  if (!open) return null;
  
  return (
    <div className="absolute z-50 mt-1 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
      {children}
    </div>
  );
};

const SelectItem = ({ value, children }: SelectItemProps) => {
  const { value: selectedValue, onValueChange, setOpen } = React.useContext(SelectContext);
  
  const isSelected = selectedValue === value;
  
  const handleClick = () => {
    onValueChange(value);
    setOpen(false);
  };
  
  return (
    <div
      className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground ${isSelected ? 'bg-accent' : ''}`}
      onClick={handleClick}
    >
      {isSelected && (
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          <span className="h-2 w-2 bg-current rounded-full" />
        </span>
      )}
      <span>{children}</span>
    </div>
  );
};

const SelectValue = ({ placeholder }: { placeholder?: string }) => {
  const { value } = React.useContext(SelectContext);
  
  return value || <span className="text-muted-foreground">{placeholder}</span>;
};

export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue };