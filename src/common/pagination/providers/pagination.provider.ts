import { Inject, Injectable } from '@nestjs/common';
import { Document, Model } from 'mongoose';
import { Paginated } from '../interfaces/paginated.interface';
import { PaginationQueryDto } from '../dtos/pagination-query.dto';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';

@Injectable()
export class PaginationProvider {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  async paginateQuery<T extends Document>(
    model: Model<T>,
    paginationOptions: PaginationQueryDto,
    filter: Record<string, unknown> = {},
  ): Promise<Paginated<T>> {
    const { page = 1, limit = 10 } = paginationOptions;
    const skip = (page - 1) * limit;
    const total = await model.countDocuments(filter).exec();
    const data = await model.find(filter).skip(skip).limit(limit).exec();

    const newUrl = new URL(
      this.request.url,
      `${this.request.protocol}://${this.request.headers.host}/`,
    );

    return {
      data,
      meta: {
        itemsPerPage: limit,
        totalItems: total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      },
      links: {
        first: `${newUrl.origin}${newUrl.pathname}?page=1&limit=${limit}`,
        last: `${newUrl.origin}${newUrl.pathname}?page=${Math.ceil(total / limit)}&limit=${limit}`,
        current: `${newUrl.origin}${newUrl.pathname}?page=${page}&limit=${limit}`,
        next: `${newUrl.origin}${newUrl.pathname}?page=${page + 1}&limit=${limit}`,
        previous: `${newUrl.origin}${newUrl.pathname}?page=${page - 1}&limit=${limit}`,
      },
    };
  }
}
