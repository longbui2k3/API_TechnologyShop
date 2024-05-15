import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductRepo } from 'src/models/repo/product.repo';
import { VoucherRepo } from 'src/models/repo/voucher.repo';

@Injectable()
export class VoucherService {
  constructor(
    private voucherRepo: VoucherRepo,
    private productRepo: ProductRepo,
  ) {}

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
  }) {
    if (
      new Date(body.startsAt).getTime() > new Date(body.expiresAt).getTime()
    ) {
      throw new BadRequestException(
        'Expire date must be greater than start date',
      );
    }
    if (
      new Date(body.expiresAt).getTime() - new Date(body.startsAt).getTime() <
      60 * 60 * 1000
    ) {
      throw new BadRequestException(
        'Duration between start date and expire date is greater than or equal to 1 hour!',
      );
    }

    if (new Date(body.expiresAt).getTime() < Date.now()) {
      throw new BadRequestException(
        'Expire of voucher must be greater than now!',
      );
    }
    if (body.type === 'percentage') {
      if (body.value < 1 || body.value > 100) {
        throw new BadRequestException('Discount percentage is not valid!');
      }
    } else if (body.type === 'fixed_amount') {
      if (body.value < 0) {
        throw new BadRequestException('Fixed amount percentage is not valid!');
      }
    }
    const products = await this.productRepo.getAllProducts({
      filter: body.applies_to,
    });

    const applied_products = products.map((product) => product._id);
    return {
      message: 'Create voucher successfully!',
      status: 201,
      metadata: {
        voucher: await this.voucherRepo.createVoucher({
          ...body,
          applied_products,
        }),
      },
    };
  }

  async getAllVouchers(code: string) {
    return {
      message: 'Get all vouchers successfully!',
      status: 200,
      metadata: {
        vouchers: await this.voucherRepo.getAllVouchers(code),
      },
    };
  }

  async getVoucher(id: string) {
    return {
      message: 'Get voucher successfully!',
      status: 200,
      metadata: {
        voucher: await this.voucherRepo.getVoucher(id),
      },
    };
  }

  async checkVoucherValid(
    id: string,
    payment: number,
    products: Array<string>,
  ) {
    return {
      message: 'Check voucher successfully!',
      status: 200,
      metadata: {
        isValid: await this.voucherRepo.checkVoucherValid(
          id,
          payment,
          products,
        ),
      },
    };
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
    },
  ) {
    if (
      new Date(body.startsAt).getTime() > new Date(body.expiresAt).getTime()
    ) {
      throw new BadRequestException(
        'Expire date must be greater than start date',
      );
    }
    if (
      new Date(body.expiresAt).getTime() - new Date(body.startsAt).getTime() <
      60 * 60 * 1000
    ) {
      throw new BadRequestException(
        'Duration between start date and expire date is greater than or equal to 1 hour!',
      );
    }

    if (new Date(body.expiresAt).getTime() < Date.now()) {
      throw new BadRequestException(
        'Expire of voucher must be greater than now!',
      );
    }
    if (body.type === 'percentage') {
      if (body.value < 1 || body.value > 100) {
        throw new BadRequestException('Discount percentage is not valid!');
      }
    } else if (body.type === 'fixed_amount') {
      if (body.value < 0) {
        throw new BadRequestException('Fixed amount percentage is not valid!');
      }
    }
    const products = await this.productRepo.getAllProducts({
      filter: body.applies_to,
    });

    const applied_products = products.map((product) => product._id);
    return {
      message: 'Update voucher successfully!',
      status: 200,
      metadata: {
        voucher: await this.voucherRepo.updateVoucher(id, {
          ...body,
          applied_products,
        }),
      },
    };
  }
}
