import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1775524598110 implements MigrationInterface {
  name = 'InitialSchema1775524598110';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "Products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "category" character varying NOT NULL, "description" text NOT NULL, "price" numeric(10,2) NOT NULL, "stockQuantity" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_36a07cc432789830e7fb7b58a83" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "OrderItems" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" integer NOT NULL, "priceAtPurchase" numeric(10,2) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "orderId" uuid, "productId" uuid, CONSTRAINT "PK_567f75d7ff079b9ab3e6dd33708" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "totalPrice" numeric(10,2) NOT NULL, "status" character varying NOT NULL DEFAULT 'PENDING', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_ce8e3c4d56e47ff9c8189c26213" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_3c3ab3f49a87e6ddb607f3c4945" UNIQUE ("email"), CONSTRAINT "PK_16d4f7d636df336db11d87413e3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "OrderItems" ADD CONSTRAINT "FK_f91820d35e8129e7dd09881d886" FOREIGN KEY ("orderId") REFERENCES "Orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OrderItems" ADD CONSTRAINT "FK_f11d5c16edede51cea87a8c4bfd" FOREIGN KEY ("productId") REFERENCES "Products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Orders" ADD CONSTRAINT "FK_cc257418e0228f05a8d7dcc5553" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Orders" DROP CONSTRAINT "FK_cc257418e0228f05a8d7dcc5553"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OrderItems" DROP CONSTRAINT "FK_f11d5c16edede51cea87a8c4bfd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OrderItems" DROP CONSTRAINT "FK_f91820d35e8129e7dd09881d886"`,
    );
    await queryRunner.query(`DROP TABLE "Users"`);
    await queryRunner.query(`DROP TABLE "Orders"`);
    await queryRunner.query(`DROP TABLE "OrderItems"`);
    await queryRunner.query(`DROP TABLE "Products"`);
  }
}
