import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FormsModule } from "@angular/forms";
import { BrowserModule } from '@angular/platform-browser';
import { Ng2CompleterModule } from "ng2-completer";
import { CarouselModule } from 'ngx-bootstrap/carousel';

import { JaseesSharedModule } from '../../shared';
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
        CarouselModule.forRoot()
    ],
    declarations: [
        ElectionComponent,
        ElectionDetailComponent,
        ElectionDialogComponent,
        ElectionDeleteDialogComponent,
        ElectionPopupComponent,
        ElectionDeletePopupComponent,
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
