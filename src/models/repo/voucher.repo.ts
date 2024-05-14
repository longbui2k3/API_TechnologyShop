import { InjectModel } from '@nestjs/mongoose';
import { Voucher } from '../voucher.model';
import { Model } from 'mongoose';
import { removeUndefinedInObject } from 'src/utils';
import { BadRequestException } from '@nestjs/common';

export class VoucherRepo {
  constructor(@InjectModel('Voucher') private voucherModel: Model<Voucher>) {}

  async checkVoucherExists(id: string) {
    const voucher = await this.voucherModel.findById(id);
    if (!voucher) {
      throw new BadRequestException(`Voucher with id ${id} is not found!`);
    }
    return voucher;
  }

  async createVoucher(body: {
    name: string;
    value: number;
    type: string;
    code: string;
    minimumPayment: number;
    startsAt: Date;
    expiresAt: Date;
    description: string;
    left: number;
    applies_to: { category: string; _id: string };
    applied_products: Array<string>;
  }) {
    return await this.voucherModel.create(body);
  }
  async getAllVouchers(code: string) {
    return await this.voucherModel.find(
      removeUndefinedInObject({
        code,
        startsAt: { $lte: Date.now() },
        expiresAt: { $gte: Date.now() },
      }),
    );
  }
  async checkVoucherValid(
    id: string,
    payment: number,
    products: Array<string>,
  ): Promise<boolean> {
    const voucher = await this.voucherModel.findOne({
      _id: id,
      minimumPayment: { $lte: payment },
      startsAt: { $lte: Date.now() },
      expiresAt: { $gte: Date.now() },
    });
    if (voucher) {
      for (const product of products) {
        if (
          voucher.applied_products
            .map((product) => product._id.toString())
            .includes(product)
        ) {
          return true;
        }
      }
      return false;
    }
    return false;
  }
  async updateVoucher(
    id: string,
    body: {
      name: string;
      value: number;
      type: string;
      code: string;
      minimumPayment: number;
      startsAt: Date;
      expiresAt: Date;
      description: string;
      left: number;
      applies_to: { category: string; _id: string };
      applied_products: Array<string>;
    },
  ) {
    return await this.voucherModel.findByIdAndUpdate(id, body, { new: true });
  }
}
