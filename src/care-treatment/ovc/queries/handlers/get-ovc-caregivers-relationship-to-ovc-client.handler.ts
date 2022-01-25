import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOvcCaregiversRelationshipToOvcClientQuery } from '../impl/get-ovc-caregivers-relationship-to-ovc-client.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOvcEnrollments } from '../../entities/fact-trans-ovc-enrollments.model';
import { Repository } from 'typeorm';
import { FactTransOtzOutcome } from '../../../otz/entities/fact-trans-otz-outcome.model';

@QueryHandler(GetOvcCaregiversRelationshipToOvcClientQuery)
export class GetOvcCaregiversRelationshipToOvcClientHandler implements IQueryHandler<GetOvcCaregiversRelationshipToOvcClientQuery> {
    constructor(
        @InjectRepository(FactTransOvcEnrollments, 'mssql')
        private readonly repository: Repository<FactTransOtzOutcome>
    ) {
    }

    async execute(query: GetOvcCaregiversRelationshipToOvcClientQuery): Promise<any> {
        const ovcCareGiversRelationships = this.repository.createQueryBuilder('f')
            .select(['case when RelationshipToClient IS NULL then \'Undocumented\' else RelationshipToClient end as RelationshipToClient, ' +
            'case when RelationshipToClient IS NULL then \'Undocumented\' else RelationshipToClient end as RelationshipToClientCleaned, ' +
            'COUNT(*) relationships, COUNT(*) * 100.0 / SUM(COUNT(*)) OVER () AS Percentage'])
            .andWhere('f.OVCEnrollmentDate IS NOT NULL and TXCurr=1');

        if (query.county) {
            ovcCareGiversRelationships.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            ovcCareGiversRelationships.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            ovcCareGiversRelationships.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            ovcCareGiversRelationships.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            ovcCareGiversRelationships.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            ovcCareGiversRelationships.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            ovcCareGiversRelationships.andWhere('f.DATIM_AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await ovcCareGiversRelationships
            .groupBy('RelationshipToClient')
            .getRawMany();
    }
}
