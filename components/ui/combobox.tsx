import * as React from "react";
import * as RadixSelect from "@radix-ui/react-select";

// Define the props for the reusable Combobox component
interface ComboboxProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  disabled?: boolean;
}

const Combobox: React.FC<ComboboxProps> = ({ value, onChange, options, placeholder, disabled = false }) => {
  return (
    <RadixSelect.Root value={value} onValueChange={onChange} disabled={disabled}>
      <RadixSelect.Trigger
        className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        aria-label={placeholder}
      >
        <RadixSelect.Value placeholder={placeholder} />
      </RadixSelect.Trigger>
      <RadixSelect.Portal>
        <RadixSelect.Content className="w-full bg-white border border-gray-300 rounded-md shadow-lg">
          <RadixSelect.ScrollUpButton />
          <RadixSelect.Viewport>
            {options.map((option) => (
              <RadixSelect.Item
                key={option.value}
                value={option.value}
                className="px-3 py-2 hover:bg-indigo-600 hover:text-white"
              >
                {option.label}
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
          <RadixSelect.ScrollDownButton />
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
};

export default Combobox;
