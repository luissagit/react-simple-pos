import { QueryConstraint } from 'firebase/firestore';
import { Props, GroupBase } from 'react-select';
import { AsyncPaginateProps, LoadOptions } from 'react-select-async-paginate';

export interface BaseSelectProps {
  key?: string;
  keyLabel?: string;
  customLabel?(row: any): string;
}
export interface AdditionalSelectProps {
  page: number;
  limit: number;
}
export interface OptionsType {
  label: string;
  value: any;
}

export interface SelectProps extends Props, BaseSelectProps {}
export interface SelectPaginateProps
  extends Omit<AsyncPaginateProps<any, GroupBase<any>, AdditionalSelectProps, boolean>, 'loadOptions'>,
    BaseSelectProps {
  itemAllOption?: OptionsType;
  keySearch?: string;
  filterRequest?: any;
  dataSourceUrl?: string;
  baseDataSourceUrl?: string;
  useOptionAllScheme?: boolean;
  customKey?(value: any): string;
  transformOptions?(options: any[]): any;
  customFilterRequest?(payload: any): any;
  loadOptions?: LoadOptions<any, GroupBase<any>, AdditionalSelectProps>;
  customLoadOptions?: LoadOptions<any, GroupBase<any>, AdditionalSelectProps>;
  table: string;
  filterOptions?: QueryConstraint[];
}
