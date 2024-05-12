import { InjectModel } from '@nestjs/mongoose';
import mongoose, { ClientSession, Model, PipelineStage, Types } from 'mongoose';
import { Product, ProductSchema } from '../product.model';
import { UploadFiles } from 'src/utils/uploadFiles';
import { BadRequestException } from '@nestjs/common';
import {
  convertToObjectId,
  getUnselectData,
  removeUndefinedInObject,
} from 'src/utils';

export class ProductRepo {
  constructor(@InjectModel('Product') private productModel: Model<Product>) {}
  // async updateExpiredProducts(products) {
  //   return await Promise.all(
  //     products.map(async (product) => {
  //       if (
  //         product.status !== 'expired' &&
  //         product.expiresAt.getTime() < Date.now()
  //       )
  //         return await this.productModel.findByIdAndUpdate(
  //           product._id,
  //           {
  //             status: 'expired',
  //           },
  //           { new: true },
  //         );
  //       else return product;
  //     }),
  //   );
  // }
  async checkProductExists(product_id: string) {
    const product = await this.productModel.findById(product_id);
    if (!product) {
      throw new BadRequestException(
        `Product with id ${product_id} is not found!`,
      );
    }
    return product;
  }
  async addProduct(
    body: {
      _id: mongoose.Types.ObjectId;
      name: string;
      price: Number;
      sale_price: Number;
      information: string;
      type: string;
      description: Object;
      category: string;
      linkytb: string;
      extraInfo: Array<string>;
      variants: Array<{ label: string; variants: Array<string> }>;
      left: Number;
    },
    files: Array<Express.Multer.File> | [] = [],
  ) {
    const images = await Promise.all(
      files.map(async (file: Express.Multer.File) => {
        const image = await new UploadFiles(
          'products',
          'image',
          file,
        ).uploadFileAndDownloadURL();
        return image;
      }),
    );
    const product = new this.productModel({ ...body, images });
    await product.save();
    return product;
  }

  async updateProduct(
    id: string,
    body: {
      name: string;
      price: Number;
      sale_price: Number;
      information: string;
      description: Object;
      category: string;
      linkytb: string;
      extraInfo: Array<string>;
      variants: Array<{ label: string; variants: Array<string> }>;
      left: Number;
      images: Array<string>;
    },
    files: Array<Express.Multer.File>,
  ) {
    let updateImages = undefined;
    if (files) {
      updateImages = await Promise.all(
        files.map(async (file: Express.Multer.File) => {
          const image = await new UploadFiles(
            'products',
            'image',
            file,
          ).uploadFileAndDownloadURL();
          return image;
        }),
      );
    }
    return await this.productModel.findByIdAndUpdate(
      id,
      removeUndefinedInObject({
        ...body,
        images: [...updateImages, ...body.images],
      }),
      { new: true },
    );
  }

  async getProduct(product_id: string) {
    const product = await this.productModel.findById(product_id).populate({
      path: 'category',
    });
    return product;
  }

  async getTop10NewestProducts() {
    const products = await this.productModel
      .find()
      .sort('-createdAt')
      .limit(10);
    return products;
  }

  async getAllProducts(query: {
    filter: { category: string };
    search: string;
    sort: string;
    unselect: Array<string>;
  }) {
    const sortBy: Record<string, 1 | -1> = Object.fromEntries(
      [query.sort].map((item) => [item, -1]),
    );
    const category: Types.ObjectId = query.filter.category
      ? convertToObjectId(query.filter.category)
      : undefined;
    const agg: PipelineStage[] = [
      {
        $match: removeUndefinedInObject({ ...query.filter, category }),
      },
      {
        $project: {
          ...getUnselectData(query.unselect),
        },
      },
      {
        $sort: sortBy,
      },
    ];
    if (query.search) {
      agg.unshift({
        $search: {
          index: 'default',
          autocomplete: {
            query: query.search || ' ',
            path: 'name',
            tokenOrder: 'sequential',
            fuzzy: { maxEdits: 1, prefixLength: 0 },
          },
        },
      });
    }
    const products = await this.productModel.aggregate(agg);
    return products;
  }

  async updateViewsProduct(id: string) {
    return await this.productModel.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true },
    );
  }
  async updateLeftOfProduct(
    body: { id: string; quantity: number },
    session?: ClientSession,
  ) {
    return await this.productModel.findByIdAndUpdate(
      body.id,
      {
        $inc: {
          left: body.quantity,
        },
      },
      { new: true, session },
    );
  }
}
