import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingByPartnerQuery } from '../impl/get-proportion-of-alhiv-enrolled-in-otz-who-have-completed-otz-training-by-partner.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOtzEnrollments } from '../../entities/fact-trans-otz-enrollments.model';
import { Repository } from 'typeorm';

@QueryHandler(GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingByPartnerQuery)
export class GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingByPartnerHandler implements IQueryHandler<GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingByPartnerQuery> {
    constructor(
        @InjectRepository(FactTransOtzEnrollments, 'mssql')
        private readonly repository: Repository<FactTransOtzEnrollments>
    ) {
    }

    async execute(query: GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingByPartnerQuery): Promise<any> {
        const proportionWhoCompletedTrainingByCounty = this.repository.createQueryBuilder('f')
            .select(['CTPartner partner, COUNT([OTZ_Traning]) count_training, COUNT([OTZ_Traning]) * 100.0/ SUM(SUM([OTZ_Traning])) over () as proportion_training_percent'])
            .andWhere('f.OTZEnrollmentDate IS NOT NULL AND OTZ_Traning = 1');

        if (query.county) {
            proportionWhoCompletedTrainingByCounty.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            proportionWhoCompletedTrainingByCounty.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            proportionWhoCompletedTrainingByCounty.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            proportionWhoCompletedTrainingByCounty.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            proportionWhoCompletedTrainingByCounty.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            proportionWhoCompletedTrainingByCounty.andWhere('f.DATIM_AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            proportionWhoCompletedTrainingByCounty.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await proportionWhoCompletedTrainingByCounty
            .groupBy('CTPartner')
            .getRawMany();
    }
}
