import { redisKey } from '@config/redisKeys';
import redisCache from '@shared/cache/RedisCache';
import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import ProductRepository from '../typeorm/repositories/ProductsRepository';

interface IRequest {
  id: string;
}

class DeleteProductService {
  public async execute({ id }: IRequest): Promise<void> {
    const productsRepository = getCustomRepository(ProductRepository);

    const product = await productsRepository.findOne(id);

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    await redisCache.invalidate(redisKey.SELLER_API_PRODUCT_LIST);

    await productsRepository.remove(product);
  }
}

export default DeleteProductService;
