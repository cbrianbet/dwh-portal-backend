import { InjectRepository } from '@nestjs/typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { AggregateVLDurable } from '../../entities/aggregate-vl-durable.model';
import { GetVlCategorizationUToUQuery } from '../impl/get-vl-categorization-U-to-U.query';

@QueryHandler(GetVlCategorizationUToUQuery)
export class GetVlCategorizationUToUHandler
    implements IQueryHandler<GetVlCategorizationUToUQuery> {
    constructor(
        @InjectRepository(AggregateVLDurable, 'mssql')
        private readonly repository: Repository<AggregateVLDurable>,
    ) {}

    async execute(query: GetVlCategorizationUToUQuery): Promise<any> {
        const vlUptake = this.repository
            .createQueryBuilder('f')
            .select([
                `SUM(TXCurr) data, 
                CASE WHEN ValidVLResultCategory = 'Undetectable' 
                    THEN '<50' 
                    ELSE ValidVLResultCategory 
                END  ValidVLResultCategory
                `,
            ])
            .where('f.Gender IS NOT NULL');

        if (query.county) {
            vlUptake.andWhere('f.County IN (:...counties)', {
                counties: query.county,
            });
        }

        if (query.subCounty) {
            vlUptake.andWhere('f.SubCounty IN (:...subCounties)', {
                subCounties: query.subCounty,
            });
        }

        if (query.facility) {
            vlUptake.andWhere('f.FacilityName IN (:...facilities)', {
                facilities: query.facility,
            });
        }

        if (query.partner) {
            vlUptake.andWhere('f.PartnerName IN (:...partners)', {
                partners: query.partner,
            });
        }

        if (query.agency) {
            vlUptake.andWhere('f.AgencyName IN (:...agencies)', {
                agencies: query.agency,
            });
        }

        if (query.datimAgeGroup) {
            vlUptake.andWhere('f.AgeGroup IN (:...ageGroups)', {
                ageGroups: query.datimAgeGroup,
            });
        }

        if (query.gender) {
            vlUptake.andWhere('f.Gender IN (:...genders)', {
                genders: query.gender,
            });
        }

        if (query.pbfw) {
            vlUptake.andWhere('f.PBFWCategory IN (:...pbfws)', {
                pbfws: query.pbfw,
            });
        }

        return await vlUptake
            .groupBy(
                `CASE WHEN ValidVLResultCategory = 'Undetectable' THEN '<50' ELSE ValidVLResultCategory END`,
            )
            .getRawMany();
    }
}