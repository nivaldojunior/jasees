import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, AlertService } from 'ng-jhipster';

import { Election } from './election.model';
import { ElectionPopupService } from './election-popup.service';
import { ElectionService } from './election.service';

import { User, UserService } from '../../shared';

import { CompleterService, CompleterData } from 'ng2-completer';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';

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
    .carousel-item {
        margin-left: 33%;
    }

    .span-no-candidate {
        font-size: 24px;
        color: #ff0000;
        margin-left: 33%;
    }

    .slide-carousel {
      background: darkgray;
    }

    .span-slide {
        font-size: 23px;
        margin-left: 30%;
        color: black;
        font-weight: 500;
    }

  `]
})
export class ElectionDialogComponent implements OnInit {

    election: Election;
    authorities: any[];
    private dataService: CompleterData;
    users: any[];
    isSaving: boolean;
    
    constructor(
        public activeModal: NgbActiveModal,
        private alertService: AlertService,
        private electionService: ElectionService,
        private eventManager: EventManager,
        private userService: UserService,
        private completerService: CompleterService
    ) {
        this.dataService = completerService.local([], 'firstName', 'firstName');
        this.users = [];
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    }
    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        //let candList = []
        // this.users.forEach(function(element){
        //     candList.push(element.id);
        // })
        this.election.candList = this.users;
        if (this.election.id !== undefined) {
            this.electionService.update(this.election)
                .subscribe((res: Election) =>
                    this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
        } else {
            this.electionService.create(this.election)
                .subscribe((res: Election) =>
                    this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
        }
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
        this.alertService.error(error.error, error.message, null);
    }

    searchUsers(keyword) {
        if (keyword) {
            this.userService.like(keyword).subscribe((response) => this.onSuccess(response));
        }
    }

    onSelected (userSelected) {
        if(userSelected){
            let bool = true;
            for(let i=0; i < this.users.length; i++){
                if(this.users[i].id === userSelected.originalObject.id){
                    bool= false;
                    break;
                }
            }
            if(bool){
                this.users.push(userSelected.originalObject)
            }
        }
    }

    candidateSelected (userSelected) {
        for(let i=0; i < this.users.length; i++){
            if(this.users[i].id === userSelected.id){
                this.users.splice(i,1);
                break;
            }
        }
    }

    onSuccess (response) {
        let timedRes = Observable.from([response]);
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
