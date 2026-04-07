import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { ProductService } from './product.service';
import { ProductResponseDto } from './dto/product-response.dto';

import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('Product')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('v1/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: 'Get products.' })
  @ApiOkResponse({ type: ProductResponseDto, isArray: true })
  async findAll(): Promise<ProductResponseDto[]> {
    return this.productService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create product.' })
  @ApiCreatedResponse({ type: ProductResponseDto })
  async create(@Body() product: CreateProductDto): Promise<ProductResponseDto> {
    return await this.productService.create(product);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update product.' })
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNotFoundResponse({ description: 'Product not found.' })
  async update(
    @Param('id') id: string,
    @Body() product: UpdateProductDto,
  ): Promise<void> {
    return await this.productService.update(id, product);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete product.' })
  @ApiNoContentResponse()
  @ApiBadRequestResponse({ description: 'Product not found.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.productService.delete(id);
  }
}
