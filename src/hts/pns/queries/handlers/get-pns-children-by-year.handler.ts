import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPnsChildrenByYearQuery } from '../impl/get-pns-children-by-year.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactPNSChildren } from '../../entities/fact-pns-children.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetPnsChildrenByYearQuery)
export class GetPnsChildrenByYearHandler implements IQueryHandler<GetPnsChildrenByYearQuery> {
    constructor(
        @InjectRepository(FactPNSChildren)
        private readonly repository: Repository<FactPNSChildren>
    ) {

    }

    async execute(query: GetPnsChildrenByYearQuery): Promise<any> {
        const pnsChildrenByYear = this.repository.createQueryBuilder('q')
            .select(['q.year, q.month, SUM(q.ChildrenElicited) elicited, SUM(q.ChildTested) tested, SUM(q.Positive) positive, SUM(q.Linked) linked, SUM(q.KnownPositive) knownPositive'])
            .where('q.Mflcode IS NOT NULL')
            .andWhere('q.year IS NOT NULL')
            .andWhere('q.month IS NOT NULL');

        if(query.county) {
            pnsChildrenByYear.andWhere('q.County IN (:...county)', { county: query.county });
        }

        if(query.subCounty) {
            pnsChildrenByYear.andWhere('q.SubCounty IN (:...subCounty)', { subCounty: query.subCounty });
        }

        if(query.facility) {
            pnsChildrenByYear.andWhere('q.FacilityName IN (:...facility)', { facility: query.facility });
        }

        if(query.partner) {
            pnsChildrenByYear.andWhere('q.CTPartner IN (:...partner)', { partner: query.partner });
        }

        // if(query.month) {
        //     pnsChildrenByYear.andWhere('q.month = :month', { month: query.month });
        // }

        // if(query.year) {
        //     pnsChildrenByYear.andWhere('q.year = :year', { year: query.year});
        // }

        if (query.fromDate) {
            pnsChildrenByYear.andWhere(
                `CONCAT(year, LPAD(month, 2, '0'))>= :fromDate`,
                { fromDate: query.fromDate },
            );
        }

        if (query.toDate) {
            pnsChildrenByYear.andWhere(
                `CONCAT(year, LPAD(month, 2, '0'))<= :toDate`,
                { toDate: query.toDate },
            );
        }

        return await pnsChildrenByYear
            .groupBy('q.year, q.month')
            .orderBy('q.year, q.month')
            .getRawMany();
    }
}
