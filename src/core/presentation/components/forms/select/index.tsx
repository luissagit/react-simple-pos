import ReactSelect from 'react-select';
import { useEffect, useState } from 'react';
import { SelectProps } from './entities';

export function Select(props: SelectProps) {
  const {
    value,
    isClearable = true,
    placeholder = 'Choose',
    classNamePrefix = 'react-select-custom-prefix',
    onChange,
    isMulti,
  } = props;
  const [selectedValue, setSelectedValue] = useState<any>();

  function onChangeSelect(data: any, meta: any) {
    const item = data?.value;
    if (onChange) onChange(item, meta);
  }

  function generateDefaultValue(data: any) {
    let resultSelectedValue: any[] | any;
    if (isMulti) {
      if (data?.length > 0) {
        data?.forEach((item: any) => {
          if (typeof data === 'string') {
            resultSelectedValue = [
              ...resultSelectedValue,
              {
                label: item,
                value: item,
              },
            ];
          } else {
            resultSelectedValue = [
              ...resultSelectedValue,
              {
                label: item?.name ?? item?.code,
                value: item,
              },
            ];
          }
        });
      } else {
        resultSelectedValue = [];
      }
    } else if (typeof data === 'string' && data) resultSelectedValue = { label: data, data };
    else {
      resultSelectedValue = {
        label: data?.name ?? data?.code,
        value,
      };
    }
    if (data === '') resultSelectedValue = null;
    setSelectedValue(resultSelectedValue);
  }

  useEffect(() => {
    generateDefaultValue(value);
  }, [value]);

  return (
    <ReactSelect
      {...props}
      isClearable={isClearable}
      placeholder={placeholder}
      classNamePrefix={classNamePrefix}
      value={selectedValue}
      styles={{
        control: (baseStyles) => ({
          ...baseStyles,
          borderRadius: 0,
        }),
      }}
      onChange={(data: any, meta: any) => onChangeSelect(data, meta)}
    />
  );
}
