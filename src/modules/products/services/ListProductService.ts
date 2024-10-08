import { redisKey } from '@config/redisKeys';
import redisCache from '@shared/cache/RedisCache';
import { getCustomRepository } from 'typeorm';
import Product from '../typeorm/entities/Product';
import ProductRepository from '../typeorm/repositories/ProductsRepository';

class ListProductService {
  public async execute(): Promise<Product[]> {
    const productsRepository = getCustomRepository(ProductRepository);

    let products = await redisCache.recover<Product[]>(redisKey.SELLER_API_PRODUCT_LIST);

    if (!products) {
      products = await productsRepository.find();

      await redisCache.save(redisKey.SELLER_API_PRODUCT_LIST, products);
    }

    return products;
  }
}

export default ListProductService;
