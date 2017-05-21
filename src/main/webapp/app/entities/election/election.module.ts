import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FormsModule } from "@angular/forms";
import { BrowserModule } from '@angular/platform-browser';
import { Ng2CompleterModule } from "ng2-completer";
import { CarouselModule } from 'ngx-bootstrap/carousel';
import {ProgressBarModule} from "ngx-progress-bar";

import { JaseesSharedModule } from '../../shared';

import { ClipboardModule } from 'ngx-clipboard';

import { SwiperModule } from 'angular2-useful-swiper';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

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


@NgModule({
    imports: [
        JaseesSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true }),
        BrowserModule,
        Ng2CompleterModule,
        FormsModule,
        CarouselModule.forRoot(),
        ClipboardModule,
        SwiperModule,
        NgbModule.forRoot(),
        ProgressBarModule
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
