import { RESPONSE_CODE } from 'src/configs/enum';

export interface IBaseResponse<T> {
  code: RESPONSE_CODE;
  message: string;
  data: T | null;
}

export const BaseResponseData = <T>({
  code = RESPONSE_CODE.SUCCESS,
  message = 'Thành công',
  data = null,
}: {
  code: RESPONSE_CODE;
  message: string;
  data: T | null;
}): IBaseResponse<T> => {
  return {
    code,
    message,
    data,
  };
};
