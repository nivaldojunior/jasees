import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FormsModule } from "@angular/forms";
import { BrowserModule } from '@angular/platform-browser';
import { Ng2CompleterModule } from "ng2-completer";
import { CarouselModule } from 'ngx-bootstrap/carousel';

import { ChartsModule } from 'ng2-charts';

import { JaseesSharedModule } from '../../shared';

import { ClipboardModule } from 'ngx-clipboard';

import { SwiperModule } from 'ngx-swiper-wrapper';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';

import {
    ElectionService,
    ElectionPopupService,
    ElectionComponent,
    ElectionDetailComponent,
    ElectionDialogComponent,
    ElectionPopupComponent,
    ElectionDeletePopupComponent,
    ElectionDeleteDialogComponent,
    electionRoute,
    electionPopupRoute,
    ElectionResolvePagingParams,
    ElectionCandidateElectComponent,
    ElectionResultComponent,
} from './';

const ENTITY_STATES = [
    ...electionRoute,
    ...electionPopupRoute,
];

const SWIPER_CONFIG: SwiperConfigInterface = {
    pagination: '.swiper-pagination',
    slidesPerView: 3,
    paginationClickable: true,
    spaceBetween: 30,
    freeMode: true,
    centeredSlides: true,
    keyboardControl: true
};


@NgModule({
    imports: [
        JaseesSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true }),
        BrowserModule,
        Ng2CompleterModule,
        FormsModule,
        CarouselModule.forRoot(),
        ChartsModule,
        ClipboardModule,
        SwiperModule.forRoot(SWIPER_CONFIG)
    ],
    declarations: [
        ElectionComponent,
        ElectionDetailComponent,
        ElectionDialogComponent,
        ElectionDeleteDialogComponent,
        ElectionPopupComponent,
        ElectionDeletePopupComponent,
        ElectionCandidateElectComponent,
        ElectionResultComponent,
    ],
    entryComponents: [
        ElectionComponent,
        ElectionDialogComponent,
        ElectionPopupComponent,
        ElectionDeleteDialogComponent,
        ElectionDeletePopupComponent,
    ],
    providers: [
        ElectionService,
        ElectionPopupService,
        ElectionResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JaseesElectionModule {}
