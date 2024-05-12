import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Smartphone } from 'src/models/products/smartphone.model';

export class SmartphoneRepo {
  constructor(
    @InjectModel('Smartphone') private smartphoneModel: Model<Smartphone>,
  ) {}

  async createSmartphone(attributes: Smartphone) {
    const Smartphone = await this.smartphoneModel.create(attributes);
    return Smartphone;
  }
  async updateSmartphone(id: string, attributes: Smartphone) {
    const updatedSmartphone = await this.smartphoneModel.findByIdAndUpdate(
      id,
      attributes,
      { new: true },
    );
    return updatedSmartphone;
  }
}
