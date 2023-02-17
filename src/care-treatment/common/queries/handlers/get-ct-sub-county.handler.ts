import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCtSubCountyQuery } from '../impl/get-ct-sub-county.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransHmisStatsTxcurr } from '../../entities/fact-trans-hmis-stats-txcurr.model';
import { Repository } from 'typeorm';
import { LinelistFACTART } from './../../entities/linelist-fact-art.model';

@QueryHandler(GetCtSubCountyQuery)
export class GetCtSubCountyHandler implements IQueryHandler<GetCtSubCountyQuery> {
    constructor(
        @InjectRepository(LinelistFACTART, 'mssql')
        private readonly repository: Repository<LinelistFACTART>
    ) {

    }

    async execute(query: GetCtSubCountyQuery): Promise<any> {
        const subCounties = this.repository.createQueryBuilder('f')
            .select(['distinct Subcounty subCounty'])
            .where('f.Subcounty IS NOT NULL');

        if (query.county) {
            subCounties.andWhere('f.County IN (:...county)', { county: query.county });
        }

        // if (query.subCounty) {
        //     subCounties.andWhere('f.Subcounty IN (:...subCounty)', { subCounty: query.subCounty });
        // }

        // if (query.facility) {
        //     subCounties.andWhere('f.FacilityName IN (:...facility)', { facility: query.facility });
        // }

        // if (query.partner) {
        //     subCounties.andWhere('f.CTPartner IN (:...partner)', { partner: query.partner });
        // }

        // if (query.agency) {
        //     subCounties.andWhere('f.agency IN (:...agency)', { agency: query.agency });
        // }

        // if (query.project) {
        //     subCounties.andWhere('f.project IN (:...project)', { project: query.project });
        // }

        return await subCounties.orderBy('f.Subcounty').getRawMany();
    }
}
