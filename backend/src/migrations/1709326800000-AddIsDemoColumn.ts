import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsDemoColumn1709326800000 implements MigrationInterface {
    name = 'AddIsDemoColumn1709326800000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add isDemo column to users table
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "isDemo" boolean NOT NULL DEFAULT (0)`);
        
        // Add isDemo column to missions table
        await queryRunner.query(`ALTER TABLE "missions" ADD COLUMN "isDemo" boolean NOT NULL DEFAULT (0)`);
        
        // Add isDemo column to offers table
        await queryRunner.query(`ALTER TABLE "offers" ADD COLUMN "isDemo" boolean NOT NULL DEFAULT (0)`);
        
        // Add isDemo column to contributions table
        await queryRunner.query(`ALTER TABLE "contributions" ADD COLUMN "isDemo" boolean NOT NULL DEFAULT (0)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove isDemo column from contributions table
        await queryRunner.query(`ALTER TABLE "contributions" DROP COLUMN "isDemo"`);
        
        // Remove isDemo column from offers table
        await queryRunner.query(`ALTER TABLE "offers" DROP COLUMN "isDemo"`);
        
        // Remove isDemo column from missions table
        await queryRunner.query(`ALTER TABLE "missions" DROP COLUMN "isDemo"`);
        
        // Remove isDemo column from users table
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isDemo"`);
    }
}
