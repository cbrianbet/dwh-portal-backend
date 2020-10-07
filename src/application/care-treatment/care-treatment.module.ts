import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigurationModule } from '../../config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FactTransHmisStatsTxcurr } from '../../entities/care_treatment/fact-trans-hmis-stats-txcurr.model';
import { GetActiveArtHandler } from './queries/handlers/get-active-art.handler';
import { CareTreatmentController } from './controllers/care-treatment.controller';
import { GetActiveChildrenHandler } from './queries/handlers/get-active-children.handler';
import { GetActiveAdultsHandler } from './queries/handlers/get-active-adults.handler';
import { GetActiveArtAdolescentsHandler } from './queries/handlers/get-active-art-adolescents.handler';
import { GetActiveArtByGenderHandler } from './queries/handlers/get-active-art-by-gender.handler';
import { GetCtCountyHandler } from './queries/handlers/get-ct-county.handler';
import { GetCtSubCountyHandler } from './queries/handlers/get-ct-sub-county.handler';
import { GetCtFacilitiesHandler } from './queries/handlers/get-ct-facilities.handler';
import { GetCtPartnersHandler } from './queries/handlers/get-ct-partners.handler';
import { GetCtTxNewHandler } from './queries/handlers/get-ct-tx-new.handler';
import { FactTransNewlyStarted } from '../../entities/care_treatment/fact-trans-newly-started.model';
import { GetCtStabilityStatusAmongActivePatientsHandler } from './queries/handlers/get-ct-stability-status-among-active-patients.handler';
import { FactTransDsdCascade } from '../../entities/care_treatment/fact-trans-dsd-cascade.model';
import { GetCtViralLoadCascadeActiveArtClientsHandler } from './queries/handlers/get-ct-viral-load-cascade-active-art-clients.handler';
import { GetCtViralLoadSuppressionPercentageHandler } from './queries/handlers/get-ct-viral-load-suppression-percentage.handler';
import { GetCtTxCurrByAgeAndSexHandler } from './queries/handlers/get-ct-tx-curr-by-age-and-sex.handler';
import { GetCtTxCurrDistributionByCountyHandler } from './queries/handlers/get-ct-tx-curr-distribution-by-county.handler';
import { GetCtTxCurrDistributionByPartnerHandler } from './queries/handlers/get-ct-tx-curr-distribution-by-partner.handler';
import { GetTxNewTrendsHandler } from './queries/handlers/get-tx-new-trends.handler';
import { GetTxNewByAgeSexHandler } from './queries/handlers/get-tx-new-by-age-sex.handler';
import { GetTimeToArtHandler } from './queries/handlers/get-time-to-art.handler';
import { GetTimeToArtFacilitiesHandler } from './queries/handlers/get-time-to-art-facilities.handler';
import { GetMedianTimeToArtByYearHandler } from './queries/handlers/get-median-time-to-art-by-year.handler';
import { GetMedianTimeToArtByCountyHandler } from './queries/handlers/get-median-time-to-art-by-county.handler';
import { GetMedianTimeToArtByPartnerHandler } from './queries/handlers/get-median-time-to-art-by-partner.handler';
import { FactCTTimeToArt } from 'src/entities/care_treatment/fact-ct-time-to-art-grp.model';
import { FactTransDsdUnstable } from 'src/entities/care_treatment/fact-trans-dsd-unstable.model';
import { FactTransDsdMmdStable } from 'src/entities/care_treatment/fact-trans-dsd-mmd-stable.model';
import { FactTransDsdStabilityStatus } from 'src/entities/care_treatment/fact-trans-dsd-stability-status.model';
import { GetDsdCascadeHandler } from './queries/handlers/get-dsd-cascade.handler';
import { GetDsdUnstableHandler } from './queries/handlers/get-dsd-unstable.handler';
import { GetDsdMmdStableHandler } from './queries/handlers/get-dsd-mmd-stable.handler';
import { GetDsdStabilityStatusHandler } from './queries/handlers/get-dsd-stability-status.handler';
import { GetDsdAppointmentByStabilityStatusHandler } from './queries/handlers/get-dsd-appointment-by-stability-status.handler';
import { FactTransDsdAppointmentByStabilityStatus } from '../../entities/care_treatment/fact-trans-dsd-appointment-by-stability-status.model';
import { GetDsdAppointmentDurationCategorizationByStabilityStatusHandler } from './queries/handlers/get-dsd-appointment-duration-categorization-by-stability-status.handler';

@Module({
    imports: [
        CqrsModule,
        ConfigurationModule,
        TypeOrmModule.forFeature(
            [
                FactTransHmisStatsTxcurr,
                FactTransNewlyStarted,
                FactCTTimeToArt,
                FactTransDsdCascade,
                FactTransDsdUnstable,
                FactTransDsdMmdStable,
                FactTransDsdStabilityStatus,
                FactTransDsdAppointmentByStabilityStatus,
            ],
            'mssql'
        )
    ],
    providers: [
        GetActiveArtHandler,
        GetActiveChildrenHandler,
        GetActiveAdultsHandler,
        GetActiveArtAdolescentsHandler,
        GetActiveArtByGenderHandler,
        GetCtCountyHandler,
        GetCtSubCountyHandler,
        GetCtFacilitiesHandler,
        GetCtPartnersHandler,
        GetCtTxNewHandler,
        GetCtStabilityStatusAmongActivePatientsHandler,
        GetCtViralLoadCascadeActiveArtClientsHandler,
        GetCtViralLoadSuppressionPercentageHandler,
        GetCtTxCurrByAgeAndSexHandler,
        GetCtTxCurrDistributionByCountyHandler,
        GetCtTxCurrDistributionByPartnerHandler,
        GetTxNewTrendsHandler,
        GetTxNewByAgeSexHandler,
        GetTimeToArtHandler,
        GetTimeToArtFacilitiesHandler,
        GetMedianTimeToArtByYearHandler,
        GetMedianTimeToArtByCountyHandler,
        GetMedianTimeToArtByPartnerHandler,
        GetCtViralLoadSuppressionPercentageHandler,
        GetCtTxCurrByAgeAndSexHandler,
        GetDsdCascadeHandler,
        GetDsdUnstableHandler,
        GetDsdMmdStableHandler,
        GetDsdStabilityStatusHandler,
        GetDsdAppointmentByStabilityStatusHandler,
        GetDsdAppointmentDurationCategorizationByStabilityStatusHandler
    ],
    controllers: [CareTreatmentController]
})
export class CareTreatmentModule {}