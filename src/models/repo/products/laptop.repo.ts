import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Laptop } from 'src/models/products/laptop.model';

export class LaptopRepo {
  constructor(@InjectModel('Laptop') private laptopModel: Model<Laptop>) {}

  async createLaptop(attributes: Laptop) {
    const laptop = await this.laptopModel.create(attributes);
    return laptop;
  }
  async updateLaptop(id: string, attributes: Laptop) {
    const updatedLaptop = await this.laptopModel.findByIdAndUpdate(
      id,
      attributes,
      { new: true },
    );
    return updatedLaptop;
  }
}
