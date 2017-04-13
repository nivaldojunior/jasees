import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

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

let ENTITY_STATES = [
    ...electionRoute,
    ...electionPopupRoute,
];

@NgModule({
    imports: [
        JaseesSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
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
