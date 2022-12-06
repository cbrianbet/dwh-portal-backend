import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactHtsUptakeAgeGender } from '../../../../hts/uptake/entities/fact-htsuptake-agegender.entity';
import { GetDWHHTSPOSByFacilityQuery } from '../impl/get-dwh-htspos-by-facility.query';

@QueryHandler(GetDWHHTSPOSByFacilityQuery)
export class GetDWHHTSPOSByFacilityHandler
    implements IQueryHandler<GetDWHHTSPOSByFacilityQuery> {
    constructor(
        @InjectRepository(FactHtsUptakeAgeGender)
        private readonly repository: Repository<FactHtsUptakeAgeGender>,
    ) {}

    async execute(query: GetDWHHTSPOSByFacilityQuery): Promise<any> {
        const params = [];
        let uptakeBySexSql = `SELECT
            FacilityName, County, SubCounty, Mflcode, CTPartner, sum(Positive) positive
            FROM fact_hts_agegender a WHERE Tested IS NOT NULL `;

        if (query.county) {
            uptakeBySexSql = `${uptakeBySexSql} and County IN (?)`;
            params.push(query.county);
        }

        if (query.subCounty) {
            uptakeBySexSql = `${uptakeBySexSql} and SubCounty IN (?)`;
            params.push(query.subCounty);
        }

        if (query.facility) {
            uptakeBySexSql = `${uptakeBySexSql} and FacilityName IN (?)`;
            params.push(query.facility);
        }

        if (query.partner) {
            uptakeBySexSql = `${uptakeBySexSql} and CTPartner IN (?)`;
            params.push(query.partner);
        }

        if (query.month) {
            uptakeBySexSql = `${uptakeBySexSql} and month=?`;
            params.push(query.month);
        }

        if (query.year) {
            uptakeBySexSql = `${uptakeBySexSql} and year=?`;
            params.push(query.year);
        }

        if (query.datimAgeGroup) {
            uptakeBySexSql = `${uptakeBySexSql} and EXISTS (SELECT 1 FROM dimagegroups WHERE a.DATIM_AgeGroup = dimagegroups.DATIM_AgeGroup and MOH_AgeGroup IN (?))`;
            params.push(query.datimAgeGroup);
        }

        // if (query.fromDate) {
        //     uptakeBySexSql = `${uptakeBySexSql} and CONCAT(year, LPAD(month, 2, '0'))>=?`;
        //     params.push(query.fromDate);
        // }

        // if (query.toDate) {
        //     uptakeBySexSql = `${uptakeBySexSql} and CONCAT(year, LPAD(month, 2, '0'))<=?`;
        //     params.push(query.toDate);
        // }

        uptakeBySexSql = `${uptakeBySexSql} GROUP BY FacilityName, County, SubCounty, Mflcode, CTPartner`;
        return await this.repository.query(uptakeBySexSql, params);
    }
}
