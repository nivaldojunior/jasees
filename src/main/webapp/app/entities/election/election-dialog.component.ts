import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, AlertService } from 'ng-jhipster';

import { Election } from './election.model';
import { ElectionPopupService } from './election-popup.service';
import { ElectionService } from './election.service';

import { UserService } from '../../shared';

import { CompleterService, CompleterData } from 'ng2-completer';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'jhi-election-dialog',
    templateUrl: './election-dialog.component.html',
    styles: [`
    .election-dialog-auto-complete {
            position: absolute; top: 465px; margin-left: 14px; margin-right: 16px; width: 96%;
    }
    .election-dialog-auto-complete-edit {
            position: absolute; top: 544px; margin-left: 14px; margin-right: 16px; width: 96%;
    }
    .span-slide {
      font-size: 15px;
      position: absolute;
      bottom: 0px;
      margin-left: -44%;
    }

  `]
})
export class ElectionDialogComponent implements OnInit {

    election: Election;
    authorities: any[];
    private dataService: CompleterData;
    users: any[];
    isSaving: boolean;

    config: Object = {
        pagination: '.swiper-pagination',
        slidesPerView: 3,
        paginationClickable: true,
        spaceBetween: 30,
        freeMode: true,
        centeredSlides: true,
        keyboardControl: true,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev'
    };

    constructor(public activeModal: NgbActiveModal,
        private alertService: AlertService,
        private electionService: ElectionService,
        private eventManager: EventManager,
        private userService: UserService,
        private completerService: CompleterService) {
        this.dataService = completerService.local([], 'firstName', 'firstName');
        this.users = [];
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_ADMIN'];
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.election.id !== undefined) {
            this.subscribeToSaveResponse(
                this.electionService.update(this.election));
        } else {
            this.subscribeToSaveResponse(
                this.electionService.create(this.election));
        }
    }

    private subscribeToSaveResponse(result: Observable<Election>) {
        result.subscribe((res: Election) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: Election) {
        this.eventManager.broadcast({ name: 'electionListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError(error) {
        try {
            error.json();
        } catch (exception) {
            error.message = error.text();
        }
        this.isSaving = false;
        this.onError(error);
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }

    searchUsers(keyword) {
        if (keyword) {
            this.userService.like(keyword).subscribe((response) => this.onSuccess(response));
        }
    }

    onSelected(userSelected) {
        if (userSelected) {
            let bool = true;
            for (let i = 0; i < this.users.length; i++) {
                if (this.users[i].id === userSelected.originalObject.id) {
                    bool = false;
                    break;
                }
            }
            if (bool) {
                this.users.push(userSelected.originalObject);
            }
        }
    }

    candidateSelected(userSelected) {
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i].id === userSelected.id) {
                this.users.splice(i, 1);
                break;
            }
        }
    }

    onSuccess(response) {
        const timedRes = Observable.from([response]);
        this.dataService = this.completerService.local(timedRes, 'firstName', 'firstName');
    }
}

@Component({
    selector: 'jhi-election-popup',
    template: ''
})
export class ElectionPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private electionPopupService: ElectionPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.modalRef = this.electionPopupService
                    .open(ElectionDialogComponent, params['id']);
            } else {
                this.modalRef = this.electionPopupService
                    .open(ElectionDialogComponent);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
