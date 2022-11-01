import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOtzEnrollments } from '../../entities/fact-trans-otz-enrollments.model';
import { Repository } from 'typeorm';
import { GetOtzVlSuppressionAmongAlhivNotEnrolledInOtzByPartnerQuery } from '../impl/get-otz-vl-suppression-among-alhiv-not-enrolled-in-otz-by-partner.query';

@QueryHandler(GetOtzVlSuppressionAmongAlhivNotEnrolledInOtzByPartnerQuery)
export class GetOtzVlSuppressionAmongAlhivNotEnrolledInOtzByPartnerHandler
    implements
        IQueryHandler<
            GetOtzVlSuppressionAmongAlhivNotEnrolledInOtzByPartnerQuery
        > {
    constructor(
        @InjectRepository(FactTransOtzEnrollments, 'mssql')
        private readonly repository: Repository<FactTransOtzEnrollments>,
    ) {}

    async execute(
        query: GetOtzVlSuppressionAmongAlhivNotEnrolledInOtzByPartnerQuery,
    ): Promise<any> {
        const vlSuppressionOtzByPartner = this.repository
            .createQueryBuilder('f')
            .select([
                '[CTPartner], Last12MVLResult, SUM([Last12MonthVL]) AS vlSuppression',
            ])
            .andWhere(
                'f.MFLCode IS NOT NULL AND Last12MVLResult IS NOT NULL AND OTZEnrollmentDate IS NULL',
            );

        if (query.county) {
            vlSuppressionOtzByPartner.andWhere('f.County IN (:...counties)', {
                counties: query.county,
            });
        }

        if (query.subCounty) {
            vlSuppressionOtzByPartner.andWhere(
                'f.SubCounty IN (:...subCounties)',
                { subCounties: query.subCounty },
            );
        }

        if (query.facility) {
            vlSuppressionOtzByPartner.andWhere(
                'f.FacilityName IN (:...facilities)',
                { facilities: query.facility },
            );
        }

        if (query.partner) {
            vlSuppressionOtzByPartner.andWhere(
                'f.CTPartner IN (:...partners)',
                { partners: query.partner },
            );
        }

        if (query.agency) {
            vlSuppressionOtzByPartner.andWhere('f.CTAgency IN (:...agencies)', {
                agencies: query.agency,
            });
        }

        if (query.datimAgeGroup) {
            vlSuppressionOtzByPartner.andWhere(
                'f.DATIM_AgeGroup IN (:...ageGroups)',
                { ageGroups: query.datimAgeGroup },
            );
        }

        if (query.gender) {
            vlSuppressionOtzByPartner.andWhere('f.Gender IN (:...genders)', {
                genders: query.gender,
            });
        }

        return await vlSuppressionOtzByPartner
            .groupBy('[CTPartner], Last12MVLResult')
            .orderBy('[CTPartner]')
            .getRawMany();
    }
}
