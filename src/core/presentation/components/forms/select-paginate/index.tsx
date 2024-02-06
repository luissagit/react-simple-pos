import { AsyncPaginate } from 'react-select-async-paginate';
import { useEffect, useState } from 'react';
import {
  collection, endAt, getDocs, orderBy, query, startAt,
} from 'firebase/firestore';
import { db } from '@jshop/core';
import { v4 } from 'uuid';
import { SelectPaginateProps } from '../select/entities';

export function SelectPaginate(props: SelectPaginateProps) {
  const {
    value,
    onChange,
    isMulti,
    table,
    isClearable = true,
    transformOptions,
    // filterOptions = [],
  } = props;
  const dataRef = collection(db, table);
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
    if (data === '' || !data) resultSelectedValue = null;
    setSelectedValue(resultSelectedValue);
  }

  useEffect(() => {
    generateDefaultValue(value);
  }, [value]);

  async function loadOptions(search: string, { page }: any): Promise<any> {
    const first = query(
      dataRef,
      orderBy('name'),
      startAt(search?.toUpperCase()),
      endAt(`${search?.toUpperCase()}\uf8ff`),
    );
    const documentSnapshots = await getDocs(first);
    let items: any[] = [];
    documentSnapshots.forEach((document: any) => {
      const item = document.data();
      const resultItem = {
        ...item,
        id: document?.id,
      };
      items = [...items, resultItem];
    });

    if (transformOptions) items = transformOptions(items);

    const options = items?.map((item: any) => ({
      label: item?.name,
      value: item,
    }));

    return {
      options,
      hasMore: false,
      additional: {
        page: page + 1,
      },
    };
  }

  return (
    <AsyncPaginate
      value={selectedValue}
      loadOptions={loadOptions}
      onChange={onChangeSelect}
      isClearable={isClearable}
      menuPortalTarget={document.body}
      key={v4()}
      styles={{
        control: (baseStyles) => ({
          ...baseStyles,
          borderRadius: 0,
        }),
        menuPortal(base) {
          return {
            ...base,
            fontFamily: 'sans-serif',
            fontSize: '12px',
            zIndex: 99999,
          };
        },
      }}
      additional={{
        page: 1,
      }}
    />
  );
}
