import { useState, useMemo, type ReactNode } from "react";
import { Checkbox, CheckboxGroup, Fieldset, Input } from "@chakra-ui/react";
import React from "react";
import { RAL } from "ral-colors/index"

export interface Item {
  value: string;
  label: string | React.ReactNode;
}

interface FilterableCheckboxGroupProps {
  items: Record<string, string | React.ReactNode>;
  selected: string[];
  onChange: (values: string[]) => void;
  height?: number | string;
}

const FilterableCheckboxGroup = ({
  items,
  selected,
  onChange,
  height = 200,
}: FilterableCheckboxGroupProps) => {
  const [search, setSearch] = useState("");

const filteredItems = useMemo(() => {
  return Object.entries(items).filter(([key, label]) => {
    let labelText = "";

    if (typeof label === "string") {
      labelText = label;
    } else if (React.isValidElement(label)) {
      const ralKey = label.props.ralColorKey;
      const ralColors = label.props.ralColors ?? RAL.classic;
      const description = ralColors[ralKey]?.description ?? "";
      labelText = `${ralKey} ${description}`;
    }

    return labelText.toLowerCase().includes(search.toLowerCase());
  });
}, [search, items]);

  return (
    <Fieldset.Root>
        <Input
            placeholder="Пошук..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />

      <Fieldset.Legend>
      </Fieldset.Legend>

      <CheckboxGroup value={selected} onValueChange={onChange}>
        <Fieldset.Content
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            overflowY: "auto",
            maxHeight: height,
          }}
        >
          {filteredItems.map(([key, value]) => (
            <Checkbox.Root key={key} value={key}>
              <Checkbox.HiddenInput />
              <Checkbox.Control>
                <Checkbox.Indicator />
              </Checkbox.Control>
              <Checkbox.Label>{value}</Checkbox.Label>
            </Checkbox.Root>
          ))}
        </Fieldset.Content>
      </CheckboxGroup>
    </Fieldset.Root>
  );
};

export default FilterableCheckboxGroup;
