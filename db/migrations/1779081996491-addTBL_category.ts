import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTBLCategory1779081996491 implements MigrationInterface {
    name = 'AddTBLCategory1779081996491'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "category_entity" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "addedById" integer, CONSTRAINT "PK_1a38b9007ed8afab85026703a53" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "category_entity" ADD CONSTRAINT "FK_b6e19ae089ef852374c05e101cb" FOREIGN KEY ("addedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category_entity" DROP CONSTRAINT "FK_b6e19ae089ef852374c05e101cb"`);
        await queryRunner.query(`DROP TABLE "category_entity"`);
    }

}
