import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { BaseResponseData } from 'src/common/response.helper';
import { RESPONSE_CODE } from 'src/configs/enum';

@Injectable()
export class UploadService {
  async uploadSingle(file: Express.Multer.File) {
    try {
      if (!file) {
        return BaseResponseData({
          code: RESPONSE_CODE.ERROR,
          message: 'Không tìm thấy file đầu vào!',
          data: null,
        });
      }

      const result = await new Promise<
        UploadApiResponse | UploadApiErrorResponse
      >((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'shop-book' },
          (
            errorUpload: UploadApiErrorResponse,
            responseUpload: UploadApiResponse,
          ) => {
            if (errorUpload) return reject(errorUpload);
            if (!responseUpload)
              return reject(
                new Error(
                  'Upload thất bại! Không có dữ liệu trả về từ Cloudinary',
                ),
              );
            resolve(responseUpload);
          },
        );
        stream.end(file.buffer);
      });

      return BaseResponseData({
        code: RESPONSE_CODE.SUCCESS,
        message: 'Upload thành công!',
        data: result?.secure_url,
      });
    } catch (error) {
      console.log('Error', error);

      return BaseResponseData({
        code: RESPONSE_CODE.ERROR,
        message: 'Upload thất bại!',
        data: null,
      });
    }
  }

  async uploadMultiple(files: Express.Multer.File[]) {
    try {
      if (files.length == 0) {
        return BaseResponseData({
          code: RESPONSE_CODE.ERROR,
          message: 'Không tìm thấy file đầu vào!',
          data: null,
        });
      }

      const results = await Promise.all(
        files.map(
          (file) =>
            new Promise<UploadApiResponse | UploadApiErrorResponse>(
              (resolve, reject) => {
                cloudinary.uploader
                  .upload_stream(
                    { folder: 'shop-book' },
                    (
                      errorUpload: UploadApiErrorResponse,
                      responseUpload: UploadApiResponse,
                    ) => {
                      if (errorUpload) {
                        return reject(errorUpload);
                      }
                      if (!responseUpload) {
                        return reject(
                          new Error(
                            'Upload thất bại! Không có dữ liệu trả về từ Cloudinary',
                          ),
                        );
                      }
                      resolve(responseUpload);
                    },
                  )
                  .end(file.buffer);
              },
            ),
        ),
      );

      return BaseResponseData({
        code: RESPONSE_CODE.SUCCESS,
        message: 'Upload thành công!',
        data: results?.map((v) => v?.secure_url),
      });
    } catch (error) {
      console.log('Error', error);

      return BaseResponseData({
        code: RESPONSE_CODE.ERROR,
        message: 'Upload thất bại!',
        data: null,
      });
    }
  }
}
