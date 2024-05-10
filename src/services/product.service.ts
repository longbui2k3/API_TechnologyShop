import { BadRequestException, Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { Laptop } from 'src/models/products/laptop.model';
import { Ram } from 'src/models/products/ram.model';
import { CategoryRepo } from 'src/models/repo/category.repo';
import { ProductRepo } from 'src/models/repo/product.repo';
import { LaptopRepo } from 'src/models/repo/products/laptop.repo';
import { RamRepo } from 'src/models/repo/products/ram.repo';
@Injectable()
class ProductFactory {
  constructor(
    private ramRepo: RamRepo,
    private laptopRepo: LaptopRepo,
    private productRepo: ProductRepo,
    private categoryRepo: CategoryRepo,
  ) {}
  static productRegistry = {};
  productRegistryRepo = {
    ram: this.ramRepo,
    laptop: this.laptopRepo,
  };
  static registerProductType(type: string, classRef: any) {
    ProductFactory.productRegistry[type] = classRef;
  }

  async createProduct(
    type: string,
    payload: {
      body: {
        name: string;
        price: Number;
        description: string;
        type: string;
        attributes: Object;
        category: string;
        linkytb: string;
      };
      files: Array<Express.Multer.File> | [];
    },
  ) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new BadRequestException(`Invalid Product Types ${type}`);
    return await new productClass(
      this.productRegistryRepo[type],
      this.productRepo,
      this.categoryRepo,
    ).createProduct(payload.body, payload.files);
  }

  async updateProduct(
    type: string,
    payload: {
      id: string;
      body: {
        name: string;
        price: Number;
        description: string;
        attributes: Object;
        category: string;
        linkytb: string;
        images: Array<string>;
      };
      files: Array<Express.Multer.File> | [];
    },
  ) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new BadRequestException(`Invalid Product Types ${type}`);
    return await new productClass(
      this.productRegistryRepo[type],
      this.productRepo,
      this.categoryRepo,
    ).updateProduct(payload.id, payload.body, payload.files);
  }
  async getProduct(product_id: string) {
    return await new ProductService(
      this.productRepo,
      this.categoryRepo,
    ).getProduct(product_id);
  }

  async getTop10NewestProducts() {
    return await new ProductService(
      this.productRepo,
      this.categoryRepo,
    ).getTop10NewestProducts();
  }

  async getAllProducts(query: {
    filter: { category: string };
    search: string;
    sort: string;
  }) {
    return await new ProductService(
      this.productRepo,
      this.categoryRepo,
    ).getAllProducts(query);
  }
}

@Injectable()
export class ProductService {
  constructor(
    private productRepo: ProductRepo,
    private categoryRepo: CategoryRepo,
  ) {}

  async addProduct(
    body: {
      _id: mongoose.Types.ObjectId;
      name: string;
      price: Number;
      description: string;
      type: string;
      attributes: Object;
      category: string;
      linkytb: string;
    },
    files: Array<Express.Multer.File> | [],
  ) {
    const checkCategoryExists = await this.categoryRepo.checkCategoryExists(
      body.category,
    );
    return {
      message: 'Create product successfully!',
      status: 201,
      metadata: {
        product: await this.productRepo.addProduct(body, files),
      },
    };
  }

  async modifyProduct(
    id: string,
    body: {
      name: string;
      price: Number;
      description: string;
      attributes: Object;
      category: string;
      linkytb: string;
      images: Array<string>;
    },
    files: Array<Express.Multer.File>,
  ) {
    const checkProductExists = await this.productRepo.checkProductExists(id);
    const checkCategoryExists = await this.categoryRepo.checkCategoryExists(
      body.category,
    );
    return {
      message: 'Update product successfully!',
      status: 200,
      metadata: {
        product: await this.productRepo.updateProduct(id, body, files),
      },
    };
  }

  async getProduct(product_id: string) {
    const checkProductExists =
      await this.productRepo.checkProductExists(product_id);
    await this.productRepo.updateViewsProduct(product_id);
    return {
      message: 'Get product successfully!',
      status: 200,
      metadata: {
        product: await this.productRepo.getProduct(product_id),
      },
    };
  }

  async getTop10NewestProducts() {
    return {
      message: 'Get Top 10 newest products successfully!',
      status: 200,
      metadata: {
        products: await this.productRepo.getTop10NewestProducts(),
      },
    };
  }
  async getAllProducts(query: {
    filter: { category: string };
    search: string;
    sort: string;
  }) {
    if (query.filter.category !== undefined) {
      const checkCategoryExists = await this.categoryRepo.checkCategoryExists(
        query.filter.category,
      );
    }

    return {
      message: 'Get products successfully!',
      status: 200,
      metadata: {
        products: await this.productRepo.getAllProducts({
          ...query,
          unselect: ['__v', 'createdAt', 'updatedAt'],
        }),
      },
    };
  }
}

@Injectable()
class RamService extends ProductService {
  constructor(
    private ramRepo: RamRepo,
    productRepo: ProductRepo,
    categoryRepo: CategoryRepo,
  ) {
    super(productRepo, categoryRepo);
  }
  async createProduct(
    body: {
      name: string;
      price: Number;
      description: string;
      type: string;
      attributes: Ram;
      category: string;
      linkytb: string;
    },
    files: Array<Express.Multer.File> | [],
  ) {
    const newRam = await this.ramRepo.createRam(body.attributes);

    return await super.addProduct({ ...body, _id: newRam._id }, files);
  }

  async updateProduct(
    id: string,
    body: {
      name: string;
      price: Number;
      description: string;
      attributes: Ram;
      category: string;
      linkytb: string;
      images: Array<string>;
    },
    files: Array<Express.Multer.File> | [],
  ) {
    const updatedRam = await this.ramRepo.updateRam(id, body.attributes);
    return await super.modifyProduct(id, body, files);
  }
}

@Injectable()
class LaptopService extends ProductService {
  constructor(
    private laptopRepo: LaptopRepo,
    productRepo: ProductRepo,
    categoryRepo: CategoryRepo,
  ) {
    super(productRepo, categoryRepo);
  }

  async createProduct(
    body: {
      name: string;
      price: Number;
      description: string;
      type: string;
      attributes: Laptop;
      category: string;
      linkytb: string;
    },
    files: Array<Express.Multer.File> | [],
  ) {
    const newLaptop = await this.laptopRepo.createLaptop(body.attributes);

    return await super.addProduct({ ...body, _id: newLaptop._id }, files);
  }

  async updateProduct(
    id: string,
    body: {
      name: string;
      price: Number;
      description: string;
      attributes: Laptop;
      category: string;
      linkytb: string;
      images: Array<string>;
    },
    files: Array<Express.Multer.File> | [],
  ) {
    const updatedLaptop = await this.laptopRepo.updateLaptop(
      id,
      body.attributes,
    );
    return await super.modifyProduct(id, body, files);
  }
}

ProductFactory.registerProductType('ram', RamService);
ProductFactory.registerProductType('laptop', LaptopService);
export default ProductFactory;
