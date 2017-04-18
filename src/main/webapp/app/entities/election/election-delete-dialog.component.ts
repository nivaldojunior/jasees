import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager } from 'ng-jhipster';

import { Election } from './election.model';
import { ElectionPopupService } from './election-popup.service';
import { ElectionService } from './election.service';

@Component({
    selector: 'jhi-election-delete-dialog',
    templateUrl: './election-delete-dialog.component.html'
})
export class ElectionDeleteDialogComponent {

    election: Election;

    constructor(
        private electionService: ElectionService,
        public activeModal: NgbActiveModal,
        private eventManager: EventManager
    ) {
    }

    clear () {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete (id: number) {
        this.electionService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'electionListModification',
                content: 'Deleted an election'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-election-delete-popup',
    template: ''
})
export class ElectionDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private electionPopupService: ElectionPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            this.modalRef = this.electionPopupService
                .open(ElectionDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
