import Creatable from 'react-select/creatable';
import type { CreatableProps } from 'react-select/creatable';
import { withAsyncPaginate } from 'react-select-async-paginate';
import type { UseAsyncPaginateParams, ComponentProps } from 'react-select-async-paginate';
import { GroupBase } from 'react-select';
import { ReactElement, useEffect, useState } from 'react';
import { collection, endAt, getDocs, orderBy, query, startAt } from 'firebase/firestore';
import { db, submitData } from '@jshop/core';
import { v4 } from 'uuid';
import { SelectPaginateProps } from '../select/entities';

type AsyncPaginateCreatableProps<
  OptionType,
  Group extends GroupBase<OptionType>,
  Additional,
  IsMulti extends boolean,
> = CreatableProps<OptionType, IsMulti, Group> &
  UseAsyncPaginateParams<OptionType, Group, Additional> &
  ComponentProps<OptionType, Group, IsMulti>;

type AsyncPaginateCreatableType = <
  OptionType,
  Group extends GroupBase<OptionType>,
  Additional,
  IsMulti extends boolean = false,
>(
  props: AsyncPaginateCreatableProps<OptionType, Group, Additional, IsMulti>,
) => ReactElement;

export const CreatableAsyncPaginate = withAsyncPaginate(Creatable) as AsyncPaginateCreatableType;

export function CreatableSelectPaginate(props: SelectPaginateProps) {
  const { value, onChange, isMulti, table, isClearable = true } = props;
  const dataRef = collection(db, table);
  const [selectedValue, setSelectedValue] = useState<any>();
  async function onChangeSelect(data: any, meta: any) {
    const item = data?.value;
    if (typeof item === 'string') {
      const newValue = {
        id: v4(),
        code: item?.toUpperCase(),
        name: item?.toUpperCase(),
      };
      if (onChange) onChange(newValue, meta);
      await submitData(table, newValue);
    } else if (onChange) onChange(item, meta);
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
    <CreatableAsyncPaginate
      value={selectedValue}
      loadOptions={loadOptions}
      onChange={onChangeSelect}
      isClearable={isClearable}
      key={v4()}
      menuPortalTarget={document.body}
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
