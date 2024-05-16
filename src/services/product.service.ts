import { BadRequestException, Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { Laptop } from 'src/models/products/laptop.model';
import { Smartphone } from 'src/models/products/smartphone.model';
import { CategoryRepo } from 'src/models/repo/category.repo';
import { ProductRepo } from 'src/models/repo/product.repo';
import { LaptopRepo } from 'src/models/repo/products/laptop.repo';
import { SmartphoneRepo } from 'src/models/repo/products/smartphone.repo';
import { flattenObject, removeKeyInObject } from 'src/utils';
@Injectable()
class ProductFactory {
  constructor(
    private laptopRepo: LaptopRepo,
    private smartphoneRepo: SmartphoneRepo,
    private productRepo: ProductRepo,
    private categoryRepo: CategoryRepo,
  ) {}
  static productRegistry = {};
  productRegistryRepo = {
    laptop: this.laptopRepo,
    smartphone: this.smartphoneRepo,
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
        sale_price: Number;
        information: string;
        type: string;
        description: Object;
        category: string;
        linkytb: string;
        extraInfo: Array<string>;
        variants: Array<{ label: string; variants: Array<string> }>;
        left: Number;
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
        sale_price: Number;
        information: string;
        description: Object;
        category: string;
        linkytb: string;
        extraInfo: Array<string>;
        variants: Array<{ label: string; variants: Array<string> }>;
        left: Number;
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

  async getAllProducts(
    type: string,
    query: {
      filter: Object;
      search: string;
      sort: string;
    },
  ) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) {
      return await new ProductService(
        this.productRepo,
        this.categoryRepo,
      ).getAllProducts(query);
    }
    return await new productClass(
      this.productRegistryRepo[type],
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
  async getAllProducts(query: { filter: any; search: string; sort: string }) {
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
      sale_price: Number;
      information: string;
      type: string;
      description: Laptop;
      category: string;
      linkytb: string;
      extraInfo: Array<string>;
      variants: Array<{ label: string; variants: Array<string> }>;
      left: Number;
    },
    files: Array<Express.Multer.File> | [],
  ) {
    const newLaptop = await this.laptopRepo.createLaptop(body.description);

    return await super.addProduct({ ...body, _id: newLaptop._id }, files);
  }

  async updateProduct(
    id: string,
    body: {
      name: string;
      price: Number;
      sale_price: Number;
      information: string;
      type: string;
      description: Laptop;
      category: string;
      linkytb: string;
      extraInfo: Array<string>;
      variants: Array<{ label: string; variants: Array<string> }>;
      left: Number;
      images: Array<string>;
    },
    files: Array<Express.Multer.File> | [],
  ) {
    const updatedLaptop = await this.laptopRepo.updateLaptop(
      id,
      body.description,
    );
    return await super.modifyProduct(id, body, files);
  }

  async getAllProducts(query: { filter: any; search: string; sort: string }) {
    // check input cac filter
    // check brands
    
    const laptopDescription = [
      'cpu',
      'ram',
      'hard_drive',
      'screen',
      'graphics_card',
      'port',
      'operating_system',
      'design',
      'size',
      'released_date',
      'brand',
    ];
    query.filter.description = removeKeyInObject(query.filter, [
      'category',
      '_id',
      'type',
      'fromPrice',
      'toPrice',
    ]);

    if (Object.keys(query.filter.description).length === 0)
      query.filter.description = undefined;

    // Condition for description
    query.filter.description.ram = query.filter.description.ram
      ? RegExp(`^${query.filter.description.ram}`)
      : undefined;

    query.filter = flattenObject(
      removeKeyInObject(query.filter, laptopDescription),
    );
    console.log(query);
    return super.getAllProducts(query);
  }
}

@Injectable()
class SmartphoneService extends ProductService {
  constructor(
    private smartphoneRepo: SmartphoneRepo,
    productRepo: ProductRepo,
    categoryRepo: CategoryRepo,
  ) {
    super(productRepo, categoryRepo);
  }

  async createProduct(
    body: {
      name: string;
      price: Number;
      sale_price: Number;
      information: string;
      type: string;
      description: Smartphone;
      category: string;
      linkytb: string;
      extraInfo: Array<string>;
      variants: Array<{ label: string; variants: Array<string> }>;
      left: Number;
    },
    files: Array<Express.Multer.File> | [],
  ) {
    const newSmartphone = await this.smartphoneRepo.createSmartphone(
      body.description,
    );

    return await super.addProduct({ ...body, _id: newSmartphone._id }, files);
  }

  async updateProduct(
    id: string,
    body: {
      name: string;
      price: Number;
      sale_price: Number;
      information: string;
      description: Smartphone;
      category: string;
      linkytb: string;
      extraInfo: Array<string>;
      variants: Array<{ label: string; variants: Array<string> }>;
      left: Number;
      images: Array<string>;
    },
    files: Array<Express.Multer.File> | [],
  ) {
    const updatedSmartphone = await this.smartphoneRepo.updateSmartphone(
      id,
      body.description,
    );
    return await super.modifyProduct(id, body, files);
  }
  async getAllProducts(query: { filter: any; search: string; sort: string }) {
    const smartphoneDescription = [
      'screen',
      'operating_system',
      'front_camera',
      'rear_camera',
      'chip',
      'ram',
      'storage',
      'sim',
      'battery',
      'brand',
    ];
    query.filter.description = removeKeyInObject(query.filter, [
      'category',
      '_id',
      'type',
    ]);
    if (Object.keys(query.filter.description).length === 0)
      query.filter.description = undefined;
    query.filter = flattenObject(
      removeKeyInObject(query.filter, smartphoneDescription),
    );
    return super.getAllProducts(query);
  }
}

ProductFactory.registerProductType('smartphone', SmartphoneService);
ProductFactory.registerProductType('laptop', LaptopService);
export default ProductFactory;
