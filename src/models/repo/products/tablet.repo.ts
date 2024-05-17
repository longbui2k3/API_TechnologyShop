import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tablet } from 'src/models/products/tablet.model';

export class TabletRepo {
  constructor(@InjectModel('Tablet') private tabletModel: Model<Tablet>) {}

  async createTablet(attributes: Tablet) {
    const Tablet = await this.tabletModel.create(attributes);
    return Tablet;
  }
  async updateTablet(id: string, attributes: Tablet) {
    const updatedTablet = await this.tabletModel.findByIdAndUpdate(
      id,
      attributes,
      { new: true },
    );
    return updatedTablet;
  }
}
