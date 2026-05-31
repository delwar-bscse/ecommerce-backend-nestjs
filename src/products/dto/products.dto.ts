import { Expose, Transform, Type } from "class-transformer";


export class ProductsDto {
  @Expose()
  totalProducts!: number;

  @Expose()
  limit!: number;

  @Expose()
  @Type(() => ProductListDto)
  products!: ProductListDto[];
}

export class ProductListDto {
  @Expose({ name: "products_id" })
  id!: number;

  @Expose({ name: "products_title" })
  title!: string;

  @Expose({ name: "products_description" })
  description!: string;

  @Expose({ name: "products_price" })
  @Transform(({ value }) => Number(value))
  price!: number;

  @Expose({ name: "products_stock" })
  stock!: number;

  @Expose({ name: "products_images" })
  @Transform(({ value }) =>
    typeof value === "string" ? value.split(",") : value
  )
  images!: string[];

  @Expose({ name: "products_createdAt" })
  createdAt!: Date;

  @Expose({ name: "products_updatedAt" })
  updatedAt!: Date;

  @Expose({ name: "products_addedById" })
  addedById!: number;

  @Expose({ name: "products_categoryId" })
  categoryId!: number;

  @Expose({name: "reviewcount"})
  review!: number;   

  @Expose({name: "avgrating"})
  rating!: number;
}

