import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetCtTxCurrVerifiedByCountyQuery } from '../impl/get-ct-tx-curr-verified-county.query';
import { FactNUPI } from '../../entities/fact-nupi.model';

@QueryHandler(GetCtTxCurrVerifiedByCountyQuery)
export class GetCtTxCurrVerifiedByCountyHandler
    implements IQueryHandler<GetCtTxCurrVerifiedByCountyQuery> {
    constructor(
        @InjectRepository(FactNUPI, 'mssql')
        private readonly repository: Repository<FactNUPI>,
    ) {}

    async execute(query: GetCtTxCurrVerifiedByCountyQuery): Promise<any> {
        let txCurrByCounty = this.repository
            .createQueryBuilder('f')
            .select(['County, sum (NumNUPI) NumNupi'])
            .where('f.[County] IS NOT NULL');

        if (query.datimAgePopulations) {
            if (
                query.datimAgePopulations.includes('>18') &&
                query.datimAgePopulations.includes('<18')
            ) {
            } else if (query.datimAgePopulations.includes('>18'))
                txCurrByCounty = this.repository
                    .createQueryBuilder('f')
                    .select(['County, sum (Adults) NumNupi'])
                    .where('f.[County] IS NOT NULL');
            else if (query.datimAgePopulations.includes('<18'))
                txCurrByCounty = this.repository
                    .createQueryBuilder('f')
                    .select(['County, sum (Children) NumNupi'])
                    .where('f.[County] IS NOT NULL');
        }

        if (query.county) {
            txCurrByCounty.andWhere('f.County IN (:...counties)', {
                counties: query.county,
            });
        }

        if (query.subCounty) {
            txCurrByCounty.andWhere('f.Subcounty IN (:...subCounties)', {
                subCounties: query.subCounty,
            });
        }

        if (query.facility) {
            txCurrByCounty.andWhere('f.FacilityName IN (:...facilities)', {
                facilities: query.facility,
            });
        }

        if (query.partner) {
            txCurrByCounty.andWhere('f.CTPartner IN (:...partners)', {
                partners: query.partner,
            });
        }

        if (query.agency) {
            txCurrByCounty.andWhere('f.CTAgency IN (:...agencies)', {
                agencies: query.agency,
            });
        }

        if (query.datimAgeGroup) {
            txCurrByCounty.andWhere('f.DATIM_AgeGroup IN (:...ageGroups)', {
                ageGroups: query.datimAgeGroup,
            });
        }

        if (query.gender) {
            txCurrByCounty.andWhere('f.Gender IN (:...genders)', {
                genders: query.gender,
            });
        }

        return await txCurrByCounty
            .groupBy('[County]')
            .orderBy('NumNupi', 'DESC')
            .getRawMany();
        
    }
}
