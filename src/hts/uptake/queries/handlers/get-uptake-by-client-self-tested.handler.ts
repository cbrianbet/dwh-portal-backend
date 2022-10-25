import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUptakeByClientSelfTestedQuery } from '../impl/get-uptake-by-client-self-tested.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsClientSelfTested } from '../../entities/fact-hts-clientselftested.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetUptakeByClientSelfTestedQuery)
export class GetUptakeByClientSelfTestedHandler implements IQueryHandler<GetUptakeByClientSelfTestedQuery>{
    constructor(
        @InjectRepository(FactHtsClientSelfTested)
        private readonly repository: Repository<FactHtsClientSelfTested>
    ){}

    async execute(query: GetUptakeByClientSelfTestedQuery): Promise<any> {
        const params = [];
        let uptakeByClientSelfTestedSql = 'SELECT \n' +
            '`ClientSelfTested` AS ClientSelfTested,\n' +
            'SUM(`Tested`) Tested, \n' +
            'SUM(CASE WHEN `positive` IS NULL THEN 0 ELSE `positive` END) positive, \n' +
            '((SUM(CASE WHEN `positive` IS NULL THEN 0 ELSE `positive` END)/SUM(`Tested`))*100) AS positivity \n' +
            '\n' +
            'FROM `fact_hts_clientselftested`\n' +
            'WHERE `ClientSelfTested` IS NOT NULL ';

        if(query.county) {
            uptakeByClientSelfTestedSql = `${uptakeByClientSelfTestedSql} and County IN (?)`;
            params.push(query.county);
        }

        if(query.subCounty) {
            uptakeByClientSelfTestedSql = `${uptakeByClientSelfTestedSql} and SubCounty IN (?)`;
            params.push(query.subCounty);
        }

        if(query.facility) {
            uptakeByClientSelfTestedSql = `${uptakeByClientSelfTestedSql} and FacilityName IN (?)`;
            params.push(query.facility);
        }

        if(query.partner) {
            uptakeByClientSelfTestedSql = `${uptakeByClientSelfTestedSql} and CTPartner IN (?)`;
            params.push(query.partner);
        }

        // if(query.month) {
        //     uptakeByClientSelfTestedSql = `${uptakeByClientSelfTestedSql} and month=?`;
        //     params.push(query.month);
        // }

        // if(query.year) {
        //     uptakeByClientSelfTestedSql = `${uptakeByClientSelfTestedSql} and year=?`;
        //     params.push(query.year);
        // }

        if (query.fromDate) {
            uptakeByClientSelfTestedSql = `${uptakeByClientSelfTestedSql} and CONCAT(year, LPAD(month, 2, '0'))>=?`;
            params.push(query.fromDate);
        }

        if (query.toDate) {
            uptakeByClientSelfTestedSql = `${uptakeByClientSelfTestedSql} and CONCAT(year, LPAD(month, 2, '0'))<=?`;
            params.push(query.toDate);
        }

        uptakeByClientSelfTestedSql = `${uptakeByClientSelfTestedSql} GROUP BY ClientSelfTested`;

        return  await this.repository.query(uptakeByClientSelfTestedSql, params);
    }
}
