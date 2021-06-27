import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOtzVlSuppressionAmongAlhivEnrolledInOtzByCountyQuery } from '../impl/get-otz-vl-suppression-among-alhiv-enrolled-in-otz-by-county.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOtzEnrollments } from '../../entities/fact-trans-otz-enrollments.model';
import { Repository } from 'typeorm';

@QueryHandler(GetOtzVlSuppressionAmongAlhivEnrolledInOtzByCountyQuery)
export class GetOtzVlSuppressionAmongAlhivEnrolledInOtzByCountyHandler implements IQueryHandler<GetOtzVlSuppressionAmongAlhivEnrolledInOtzByCountyQuery> {
    constructor(
        @InjectRepository(FactTransOtzEnrollments, 'mssql')
        private readonly repository: Repository<FactTransOtzEnrollments>
    ) {
    }

    async execute(query: GetOtzVlSuppressionAmongAlhivEnrolledInOtzByCountyQuery): Promise<any> {
        const vlSuppressionOtzByCounty = this.repository.createQueryBuilder('f')
            .select(['[County], Last12MVLResult, COUNT(Last12MVLResult) AS vlSuppression'])
            .andWhere('f.MFLCode IS NOT NULL');

        if (query.county) {
            vlSuppressionOtzByCounty.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            vlSuppressionOtzByCounty.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            vlSuppressionOtzByCounty.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            vlSuppressionOtzByCounty.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        return await vlSuppressionOtzByCounty
            .groupBy('[County], Last12MVLResult')
            .getRawMany();
    }
}
