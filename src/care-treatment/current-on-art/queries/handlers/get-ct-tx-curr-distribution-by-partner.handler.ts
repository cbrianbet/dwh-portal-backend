import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCtTxCurrDistributionByPartnerQuery } from '../impl/get-ct-tx-curr-distribution-by-partner.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransHmisStatsTxcurr } from '../../entities/fact-trans-hmis-stats-txcurr.model';
import { Repository } from 'typeorm';
import { DimAgeGroups } from '../../../common/entities/dim-age-groups.model';

@QueryHandler(GetCtTxCurrDistributionByPartnerQuery)
export class GetCtTxCurrDistributionByPartnerHandler implements IQueryHandler<GetCtTxCurrDistributionByPartnerQuery> {
    constructor(
        @InjectRepository(FactTransHmisStatsTxcurr, 'mssql')
        private readonly repository: Repository<FactTransHmisStatsTxcurr>
    ) {
    }

    async execute(query: GetCtTxCurrDistributionByPartnerQuery): Promise<any> {
        const txCurrDistributionByPartner = this.repository.createQueryBuilder('f')
            .select(['[CTPartner],SUM([TXCURR_Total]) txCurr'])
            // .innerJoin(DimAgeGroups, 'v', 'f.ageGroup = v.AgeGroup')
            .where('f.[TXCURR_Total] IS NOT NULL');

        if (query.county) {
            txCurrDistributionByPartner
                .andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            txCurrDistributionByPartner
                .andWhere('f.Subcounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            txCurrDistributionByPartner
                .andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            txCurrDistributionByPartner
                .andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            txCurrDistributionByPartner.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            txCurrDistributionByPartner.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            txCurrDistributionByPartner
                .andWhere('f.ageGroupCleaned IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await txCurrDistributionByPartner
            .groupBy('[CTPartner]')
            .orderBy('SUM([TXCURR_Total])', 'DESC')
            .getRawMany();
    }
}
