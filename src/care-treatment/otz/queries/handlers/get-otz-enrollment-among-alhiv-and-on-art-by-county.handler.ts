import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOtzEnrollmentAmongAlhivAndOnArtByCountyQuery } from '../impl/get-otz-enrollment-among-alhiv-and-on-art-by-county.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOtzEnrollments } from '../../entities/fact-trans-otz-enrollments.model';
import { Repository } from 'typeorm';

@QueryHandler(GetOtzEnrollmentAmongAlhivAndOnArtByCountyQuery)
export class GetOtzEnrollmentAmongAlhivAndOnArtByCountyHandler implements IQueryHandler<GetOtzEnrollmentAmongAlhivAndOnArtByCountyQuery> {
    constructor(
        @InjectRepository(FactTransOtzEnrollments, 'mssql')
        private readonly repository: Repository<FactTransOtzEnrollments>
    ) {
    }

    async execute(query: GetOtzEnrollmentAmongAlhivAndOnArtByCountyQuery) {
        const otzEnrollmentsCounty = this.repository.createQueryBuilder('f')
            .select(['[County], COUNT(OTZ_Traning) count_training, SUM([TXCurr]) TXCurr, SUM(f.[TXCurr]) * 100.0 / SUM(SUM(f.[TXCurr])) OVER () AS Percentage'])
            .andWhere('f.OTZEnrollmentDate IS NOT NULL');

        if (query.county) {
            otzEnrollmentsCounty.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            otzEnrollmentsCounty.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            otzEnrollmentsCounty.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            otzEnrollmentsCounty.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            otzEnrollmentsCounty.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            otzEnrollmentsCounty.andWhere('f.DATIM_AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            otzEnrollmentsCounty.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await otzEnrollmentsCounty
            .groupBy('County')
            .getRawMany();
    }
}
