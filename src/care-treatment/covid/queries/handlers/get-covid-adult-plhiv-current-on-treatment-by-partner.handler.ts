import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCovidAdultPlhivCurrentOnTreatmentByPartnerQuery } from '../impl/get-covid-adult-plhiv-current-on-treatment-by-partner.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransNewCohort } from '../../../new-on-art/entities/fact-trans-new-cohort.model';
import { Repository } from 'typeorm';

@QueryHandler(GetCovidAdultPlhivCurrentOnTreatmentByPartnerQuery)
export class GetCovidAdultPLHIVCurrentOnTreatmentByPartnerHandler implements IQueryHandler<GetCovidAdultPlhivCurrentOnTreatmentByPartnerQuery> {
    constructor(
        @InjectRepository(FactTransNewCohort, 'mssql')
        private readonly repository: Repository<FactTransNewCohort>
    ) {
    }

    async execute(query: GetCovidAdultPlhivCurrentOnTreatmentByPartnerQuery): Promise<any> {
        const covidAdultsCurrentOnTreatmentByPartner = this.repository.createQueryBuilder('f')
            .select(['Count (*) Adults, CTPartner'])
            .where('f.ageLV >= 12 AND f.ARTOutcome=\'V\'');

        if (query.county) {
            covidAdultsCurrentOnTreatmentByPartner.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            covidAdultsCurrentOnTreatmentByPartner.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            covidAdultsCurrentOnTreatmentByPartner.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            covidAdultsCurrentOnTreatmentByPartner.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            covidAdultsCurrentOnTreatmentByPartner.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            covidAdultsCurrentOnTreatmentByPartner.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            // lacking age group
            // covidAdmissionByAge.andWhere('f.DATIM_AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }


        return await covidAdultsCurrentOnTreatmentByPartner
            .groupBy('CTPartner')
            .getRawMany();
    }
}
