import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCtViralLoadCascadeActiveArtClientsQuery } from '../impl/get-ct-viral-load-cascade-active-art-clients.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransHmisStatsTxcurr } from '../../entities/fact-trans-hmis-stats-txcurr.model';
import { Repository } from 'typeorm';

@QueryHandler(GetCtViralLoadCascadeActiveArtClientsQuery)
export class GetCtViralLoadCascadeActiveArtClientsHandler implements IQueryHandler<GetCtViralLoadCascadeActiveArtClientsQuery> {
    constructor(
        @InjectRepository(FactTransHmisStatsTxcurr, 'mssql')
        private readonly repository: Repository<FactTransHmisStatsTxcurr>
    ) {
    }

    async execute(query: GetCtViralLoadCascadeActiveArtClientsQuery): Promise<any> {
        const viralLoadCascade = this.repository.createQueryBuilder('f')
            .select(['SUM([TXCURR_Total]) TX_CURR, SUM([Eligible4VL]) Eligible4VL, SUM([Last12MonthVL]) Last12MonthVL, SUM([Last12MVLSup]) Last12MVLSup, SUM([HighViremia]) HighViremia, SUM([LowViremia]) LowViremia'])
            .where('f.[TXCURR_Total] IS NOT NULL');

        if (query.county) {
            viralLoadCascade
                .andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            viralLoadCascade
                .andWhere('f.Subcounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            viralLoadCascade
                .andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            viralLoadCascade
                .andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            viralLoadCascade.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            viralLoadCascade
                .andWhere('f.ageGroupCleaned IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            viralLoadCascade.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await viralLoadCascade
            .getRawOne();
    }
}
