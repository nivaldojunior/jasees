import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { Election } from './election.model';
import { ElectionService } from './election.service';
@Injectable()
export class ElectionPopupService {
    private isOpen = false;
    constructor (
        private datePipe: DatePipe,
        private modalService: NgbModal,
        private router: Router,
        private electionService: ElectionService

    ) {}

    open (component: Component, id?: number | any): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        if (id) {
            this.electionService.find(id).subscribe(election => {
                election.initDate = this.datePipe
                    .transform(election.initDate, 'yyyy-MM-ddThh:mm');
                election.endDate = this.datePipe
                    .transform(election.endDate, 'yyyy-MM-ddThh:mm');
                this.electionModalRef(component, election);
            });
        } else {
            return this.electionModalRef(component, new Election());
        }
    }

    electionModalRef(component: Component, election: Election): NgbModalRef {
        let modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.election = election;
        modalRef.result.then(result => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.isOpen = false;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.isOpen = false;
        });
        return modalRef;
    }
}
