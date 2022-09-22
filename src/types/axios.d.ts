export interface Result<T = any> {
  result_code: string | number;
  msg: string;
  elapsed_time: number;
  data: T;
}
