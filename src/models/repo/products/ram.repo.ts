import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ram } from 'src/models/products/ram.model';

export class RamRepo {
  constructor(@InjectModel('Ram') private ramModel: Model<Ram>) {}

  async createRam(attributes: Ram) {
    const ram = await this.ramModel.create(attributes);
    return ram;
  }
  async updateRam(id: string, attributes: Ram) {
    const updatedRam = await this.ramModel.findByIdAndUpdate(
      id,
      attributes,
      { new: true },
    );
    return updatedRam;
  }
}
