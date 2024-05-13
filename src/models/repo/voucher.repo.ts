import { InjectModel } from '@nestjs/mongoose';
import { Voucher } from '../voucher.model';
import { Model } from 'mongoose';
import { removeUndefinedInObject } from 'src/utils';

export class VoucherRepo {
  constructor(@InjectModel('Voucher') private voucherModel: Model<Voucher>) {}

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
      }),
    );
  }
  async checkVoucherValid(id: string, payment: number): Promise<boolean> {
    const voucher = await this.voucherModel.findOne({
      _id: id,
      minimumPayment: { $lte: payment },
      startsAt: { $lte: Date.now() },
      expiresAt: { $gte: Date.now() },
    });
    return Boolean(voucher);
  }
}
