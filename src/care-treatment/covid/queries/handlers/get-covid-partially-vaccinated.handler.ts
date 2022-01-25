import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCovidPartiallyVaccinatedQuery } from '../impl/get-covid-partially-vaccinated.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransCovidVaccines } from '../../entities/fact-trans-covid-vaccines.model';
import { Repository } from 'typeorm';
import { FactTransNewCohort } from '../../../new-on-art/entities/fact-trans-new-cohort.model';

@QueryHandler(GetCovidPartiallyVaccinatedQuery)
export class GetCovidPartiallyVaccinatedHandler implements IQueryHandler<GetCovidPartiallyVaccinatedQuery> {
    constructor(
        @InjectRepository(FactTransCovidVaccines, 'mssql')
        private readonly repository: Repository<FactTransCovidVaccines>
    ) {
    }

    async execute(query: GetCovidPartiallyVaccinatedQuery): Promise<any> {
        const covidPartiallyVaccinated = this.repository.createQueryBuilder('f')
            .select(['Count (f.PatientID) PartiallyVaccinated'])
            .leftJoin(FactTransNewCohort, 'g', 'f.PatientID = g.PatientID and f.SiteCode = g.MFLCode and f.PatientPK = g.PatientPK')
            .where('g.ageLV >= 18 AND g.ARTOutcome = \'V\' AND f.VaccinationStatus=\'Partially Vaccinated\' ');

        if (query.county) {
            covidPartiallyVaccinated.andWhere('g.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            covidPartiallyVaccinated.andWhere('g.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            covidPartiallyVaccinated.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            covidPartiallyVaccinated.andWhere('g.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            covidPartiallyVaccinated.andWhere('g.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            covidPartiallyVaccinated.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            covidPartiallyVaccinated.andWhere('f.DATIM_AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await covidPartiallyVaccinated.getRawOne();
    }
}
