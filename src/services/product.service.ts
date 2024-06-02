import { BadRequestException, Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { Laptop } from 'src/models/products/laptop.model';
import { Smartphone } from 'src/models/products/smartphone.model';
import { Tablet } from 'src/models/products/tablet.model';
import { CategoryRepo } from 'src/models/repo/category.repo';
import { ProductRepo } from 'src/models/repo/product.repo';
import { LaptopRepo } from 'src/models/repo/products/laptop.repo';
import { SmartphoneRepo } from 'src/models/repo/products/smartphone.repo';
import { TabletRepo } from 'src/models/repo/products/tablet.repo';
import { flattenObject, removeKeyInObject } from 'src/utils';
import {
  laptopBrands,
  laptopCPUs,
  laptopHardDrives,
  laptopRams,
  laptopScreenResolutions,
  laptopScreenSizes,
} from 'src/utils/filters/laptopFilter';
import {
  smartphoneBattery,
  smartphoneBrands,
  smartphoneRams,
  smartphoneStorages,
  smartphoneTypes,
} from 'src/utils/filters/smartphoneFilter';
import {
  tabletBatteries,
  tabletBrands,
  tabletRams,
  tabletStorages,
} from 'src/utils/filters/tabletFilter';
@Injectable()
class ProductFactory {
  constructor(
    private laptopRepo: LaptopRepo,
    private smartphoneRepo: SmartphoneRepo,
    private tabletRepo: TabletRepo,
    private productRepo: ProductRepo,
    private categoryRepo: CategoryRepo,
  ) {}
  static productRegistry = {};
  productRegistryRepo = {
    laptop: this.laptopRepo,
    smartphone: this.smartphoneRepo,
    tablet: this.tabletRepo,
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
    const {
      brand,
      fromPrice,
      toPrice,
      ram,
      resolution,
      screen_size,
      cpu,
      hard_drive,
    } = query.filter;
    // check brand
    if (brand && !laptopBrands.includes(brand)) {
      throw new BadRequestException('Brand is invalid!');
    }
    // check price
    if (fromPrice && !toPrice) {
      throw new BadRequestException(
        'Query toPrice is required when having fromPrice!',
      );
    }
    if (!fromPrice && toPrice) {
      throw new BadRequestException(
        'Query fromPrice is required when having toPrice!',
      );
    }

    if (fromPrice > toPrice) {
      throw new BadRequestException(
        'Query toPrice must be greater than query fromPrice!',
      );
    }

    // check ram
    if (ram && !laptopRams.includes(ram)) {
      throw new BadRequestException('Ram is invalid!');
    }

    // check screen size
    if (screen_size && !laptopScreenSizes.includes(screen_size)) {
      throw new BadRequestException('Screen_size is invalid!');
    }
    // check resolution
    if (resolution && !laptopScreenResolutions.includes(resolution)) {
      throw new BadRequestException('Resolution is invalid!');
    }

    // check cpu
    if (cpu && !laptopCPUs.includes(cpu)) {
      throw new BadRequestException('CPU is invalid!');
    }

    // check hard drive
    if (hard_drive && !laptopHardDrives.includes(hard_drive)) {
      throw new BadRequestException('Hard drive is invalid!');
    }

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
      'screen_size',
      'resolution',
    ]);

    // Condition for description
    query.filter.description.ram = query.filter.description.ram
      ? RegExp(`^${ram ? ram : ''}`)
      : undefined;

    query.filter.description.screen = RegExp(
      `${screen_size ? `^${screen_size}.*` : ''}${resolution ? resolution : ''}`,
    );
    query.filter.description.cpu = RegExp(`^${cpu ? cpu : ''}`);
    query.filter.description.hard_drive = RegExp(`^${hard_drive ? hard_drive : ''}`);
    // Flatten object
    query.filter = flattenObject(
      removeKeyInObject(query.filter, [
        ...laptopDescription,
        'screen_size',
        'resolution',
      ]),
    );
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
    const {
      brand,
      fromPrice,
      toPrice,
      operating_system,
      ram,
      storage,
      battery,
    } = query.filter;

    // check brand
    if (brand && !smartphoneBrands.includes(brand)) {
      throw new BadRequestException('Brand is invalid!');
    }

    // check price
    if (fromPrice && !toPrice) {
      throw new BadRequestException(
        'Query toPrice is required when having fromPrice!',
      );
    }
    if (!fromPrice && toPrice) {
      throw new BadRequestException(
        'Query fromPrice is required when having toPrice!',
      );
    }

    if (fromPrice > toPrice) {
      throw new BadRequestException(
        'Query toPrice must be greater than query fromPrice!',
      );
    }

    // check ram
    if (ram && !smartphoneRams.includes(ram)) {
      throw new BadRequestException('Ram is invalid!');
    }

    // check storage
    if (storage && !smartphoneStorages.includes(storage)) {
      throw new BadRequestException('Storage is invalid!');
    }

    // check operating system
    if (operating_system && !smartphoneTypes.includes(operating_system)) {
      throw new BadRequestException('Operating system is invalid!');
    }

    // check battery
    if (battery && !smartphoneBattery.includes(battery)) {
      throw new BadRequestException('Battery is invalid!');
    }
    const smartphoneDescription = [
      'screen',
      'operating_system',
      'front_camera',
      'rear_camera',
      'chip',
      'ram',
      'storage',
      'sim',
      // 'battery',
      'brand',
    ];
    query.filter.description = removeKeyInObject(query.filter, [
      'category',
      '_id',
      'type',
      'fromPrice',
      'toPrice',
      'battery',
    ]);

    // Condition for description
    query.filter.description.operating_system = operating_system
      ? RegExp(`^${operating_system ? operating_system : ''}`)
      : undefined;

    query.filter = flattenObject(
      removeKeyInObject(query.filter, smartphoneDescription),
    );
    console.log(query);
    return super.getAllProducts(query);
  }
}

@Injectable()
class TabletService extends ProductService {
  constructor(
    private tabletRepo: TabletRepo,
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
      description: Tablet;
      category: string;
      linkytb: string;
      extraInfo: Array<string>;
      variants: Array<{ label: string; variants: Array<string> }>;
      left: Number;
    },
    files: Array<Express.Multer.File> | [],
  ) {
    const newTablet = await this.tabletRepo.createTablet(body.description);

    return await super.addProduct({ ...body, _id: newTablet._id }, files);
  }

  async updateProduct(
    id: string,
    body: {
      name: string;
      price: Number;
      sale_price: Number;
      information: string;
      description: Tablet;
      category: string;
      linkytb: string;
      extraInfo: Array<string>;
      variants: Array<{ label: string; variants: Array<string> }>;
      left: Number;
      images: Array<string>;
    },
    files: Array<Express.Multer.File> | [],
  ) {
    const updatedTablet = await this.tabletRepo.updateTablet(
      id,
      body.description,
    );
    return await super.modifyProduct(id, body, files);
  }

  async getAllProducts(query: { filter: any; search: string; sort: string }) {
    const {
      brand,
      fromPrice,
      toPrice,
      ram,
      storage,
      fromScreen_size,
      toScreen_size,
      battery,
    } = query.filter;

    // check brand
    if (brand && !tabletBrands.includes(brand)) {
      throw new BadRequestException('Brand is invalid!');
    }

    // check price
    if (fromPrice && !toPrice) {
      throw new BadRequestException(
        'Query toPrice is required when having fromPrice!',
      );
    }
    if (!fromPrice && toPrice) {
      throw new BadRequestException(
        'Query fromPrice is required when having toPrice!',
      );
    }

    if (parseInt(fromPrice) > parseInt(toPrice)) {
      throw new BadRequestException(
        'Query toPrice must be greater than query fromPrice!',
      );
    }

    // check ram
    if (ram && !tabletRams.includes(ram)) {
      throw new BadRequestException('Ram is invalid!');
    }

    // check storage
    if (storage && !tabletStorages.includes(storage)) {
      throw new BadRequestException('Storage is invalid!');
    }

    // check battery
    if (battery && !tabletBatteries.includes(battery)) {
      throw new BadRequestException('Battery is invalid!');
    }

    // check screen size
    if (fromScreen_size && !toScreen_size) {
      throw new BadRequestException(
        'Query toScreen_size is required when having fromScreen_size!',
      );
    }
    if (!fromScreen_size && toScreen_size) {
      throw new BadRequestException(
        'Query fromScreen_size is required when having toScreen_size!',
      );
    }

    if (parseFloat(fromScreen_size) > parseFloat(toScreen_size)) {
      throw new BadRequestException(
        'Query toScreen_size must be greater than query fromScreen_size!',
      );
    }

    const tabletDescription = [
      'screen',
      'operating_system',
      'chip',
      'ram',
      'storage',
      'connect',
      'front_camera',
      'rear_camera',
      // 'battery',
      'brand',
    ];

    query.filter.description = removeKeyInObject(query.filter, [
      'category',
      '_id',
      'type',
      'fromPrice',
      'toPrice',
      'fromScreen_size',
      'toScreen_size',
      'battery',
    ]);

    // Condition for description
    query.filter.description.brand = brand ? RegExp(`^${brand ? brand : ''}`) : undefined;

    // Flatten object
    query.filter = flattenObject(
      removeKeyInObject(query.filter, [...tabletDescription]),
    );

    console.log(query);
    return super.getAllProducts(query);
  }
}

ProductFactory.registerProductType('smartphone', SmartphoneService);
ProductFactory.registerProductType('laptop', LaptopService);
ProductFactory.registerProductType('tablet', TabletService);
export default ProductFactory;
