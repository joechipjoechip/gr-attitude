import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPerformanceIndexes1772215687718 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Missions: Index on createdAt (sorting, recent missions)
        await queryRunner.query(
            `CREATE INDEX "IDX_missions_createdAt" ON "missions" ("createdAt")`
        );

        // Missions: Index on category (filtering by category)
        await queryRunner.query(
            `CREATE INDEX "IDX_missions_category" ON "missions" ("category")`
        );

        // Missions: Index on urgency (filtering by urgency level)
        await queryRunner.query(
            `CREATE INDEX "IDX_missions_urgency" ON "missions" ("urgency")`
        );

        // Missions: Index on status (filtering by mission status)
        await queryRunner.query(
            `CREATE INDEX "IDX_missions_status" ON "missions" ("status")`
        );

        // Missions: Composite index for common query (status + createdAt)
        await queryRunner.query(
            `CREATE INDEX "IDX_missions_status_createdAt" ON "missions" ("status", "createdAt")`
        );

        // Offers: Index on createdAt (sorting, recent offers)
        await queryRunner.query(
            `CREATE INDEX "IDX_offers_createdAt" ON "offers" ("createdAt")`
        );

        // Offers: Index on category (filtering by category)
        await queryRunner.query(
            `CREATE INDEX "IDX_offers_category" ON "offers" ("category")`
        );

        // Offers: Index on offerType (filtering by offer type)
        await queryRunner.query(
            `CREATE INDEX "IDX_offers_offerType" ON "offers" ("offerType")`
        );

        // Contributions: Index on missionId (fetch contributions for a mission)
        await queryRunner.query(
            `CREATE INDEX "IDX_contributions_missionId" ON "contributions" ("missionId")`
        );

        // Contributions: Index on userId (fetch user's contributions)
        await queryRunner.query(
            `CREATE INDEX "IDX_contributions_userId" ON "contributions" ("userId")`
        );

        // Correlations: Index on missionId (fetch matches for a mission)
        await queryRunner.query(
            `CREATE INDEX "IDX_correlations_missionId" ON "correlations" ("missionId")`
        );

        // Correlations: Index on offerId (fetch matches for an offer)
        await queryRunner.query(
            `CREATE INDEX "IDX_correlations_offerId" ON "correlations" ("offerId")`
        );

        // Correlations: Composite index for score-based queries
        await queryRunner.query(
            `CREATE INDEX "IDX_correlations_score" ON "correlations" ("score")`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes in reverse order
        await queryRunner.query(`DROP INDEX "IDX_correlations_score"`);
        await queryRunner.query(`DROP INDEX "IDX_correlations_offerId"`);
        await queryRunner.query(`DROP INDEX "IDX_correlations_missionId"`);
        await queryRunner.query(`DROP INDEX "IDX_contributions_userId"`);
        await queryRunner.query(`DROP INDEX "IDX_contributions_missionId"`);
        await queryRunner.query(`DROP INDEX "IDX_offers_offerType"`);
        await queryRunner.query(`DROP INDEX "IDX_offers_category"`);
        await queryRunner.query(`DROP INDEX "IDX_offers_createdAt"`);
        await queryRunner.query(`DROP INDEX "IDX_missions_status_createdAt"`);
        await queryRunner.query(`DROP INDEX "IDX_missions_status"`);
        await queryRunner.query(`DROP INDEX "IDX_missions_urgency"`);
        await queryRunner.query(`DROP INDEX "IDX_missions_category"`);
        await queryRunner.query(`DROP INDEX "IDX_missions_createdAt"`);
    }

}
