import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProportionOfOvcClientsEnrolledInCpimsByGenderQuery } from '../impl/get-proportion-of-ovc-clients-enrolled-in-cpims-by-gender.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOvcEnrollments } from '../../entities/fact-trans-ovc-enrollments.model';
import { Repository } from 'typeorm';
import { FactTransOtzOutcome } from '../../../otz/entities/fact-trans-otz-outcome.model';

@QueryHandler(GetProportionOfOvcClientsEnrolledInCpimsByGenderQuery)
export class GetProportionOfOvcClientsEnrolledInCpimsByGenderHandler implements IQueryHandler<GetProportionOfOvcClientsEnrolledInCpimsByGenderQuery> {
    constructor(
        @InjectRepository(FactTransOvcEnrollments, 'mssql')
        private readonly repository: Repository<FactTransOtzOutcome>
    ) {
    }

    async execute(query: GetProportionOfOvcClientsEnrolledInCpimsByGenderQuery): Promise<any> {
        const enrolledInCIPMS = this.repository.createQueryBuilder('f')
            .select(['EnrolledinCPIMSCleaned EnrolledinCPIMS, COUNT(*) Enrollments, Gender'])
            .andWhere('f.OVCEnrollmentDate IS NOT NULL and f.TXCurr=1');

        if (query.county) {
            enrolledInCIPMS.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            enrolledInCIPMS.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            enrolledInCIPMS.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            enrolledInCIPMS.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            enrolledInCIPMS.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            enrolledInCIPMS.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            enrolledInCIPMS.andWhere('f.DATIM_AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await enrolledInCIPMS
            .groupBy('Gender, EnrolledinCPIMSCleaned')
            .getRawMany();
    }
}
