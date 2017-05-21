import { Component, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager } from 'ng-jhipster';

import { Account, LoginModalService, Principal } from '../shared';

import { ActivatedRoute, Router } from '@angular/router';
import { Response } from '@angular/http';
import { ElectionService } from '../entities/election/election.service';

@Component({
    selector: 'jhi-home',
    templateUrl: './home.component.html',
    styleUrls: [
        'home.scss'
    ]
})
export class HomeComponent implements OnInit {
    account: Account;
    modalRef: NgbModalRef;

    elections = [];
    bkpElections = [];
    filter: string;

    error: any;
    success: any;
    routeData: any;
    links: any;
    totalItems: any;
    queryCount: any;
    itemsPerPage: any;
    page: any;
    predicate: any;
    previousPage: any;
    reverse: any;

    constructor(
        private principal: Principal,
        private loginModalService: LoginModalService,
        private electionService: ElectionService,
        private eventManager: EventManager,
        private router: Router
    ) {
        this.filter = '';

    }

    loadAll() {
        this.electionService.query({
            page: this.page - 1,
            size: this.itemsPerPage,
            sort: this.sort()}).subscribe(
            (res: Response) => this.onSuccess(res.json(), res.headers),
            (res: Response) => this.onError(res.json())
        );
    }

    private onSuccess(data, headers) {
        this.totalItems = headers.get('X-Total-Count');
        this.queryCount = this.totalItems;
        this.bkpElections = data;
        this.elections = data;
        setInterval(() => {
            for (let i = 0; i < this.bkpElections.length; i++) {
                this.calculateTime(this.bkpElections[i]);
            }
        }, 500);
    }

    private onError(error) {
        this.bkpElections = [];
    }

    ngOnInit() {
        this.principal.identity().then((account) => {
            this.account = account;
        });
        this.registerAuthenticationSuccess();

        this.loadAll();
    }

    registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', (message) => {
            this.principal.identity().then((account) => {
                this.account = account;
            });
        });
    }

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }

    compareDate(date1, date2) {
        let seconds = Math.floor((date2 - (date1)) / 1000);
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        hours = hours - (days * 24);
        minutes = minutes - (days * 24 * 60) - (hours * 60);
        seconds = seconds - (days * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);

        return {
            days,
            hours,
            minutes,
            seconds
        };
    };

    calculateTime(item) {

        const now = new Date();
        const initDate = new Date(item.initDate);
        const endDate = new Date(item.endDate);

        let type = '';
        let result = {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
        };

        if (endDate.getTime() - now.getTime() <= 0) {
            type = 'FINALIZED';
        } else {
            if (initDate.getTime() - now.getTime() >= 0) {
                type = 'NOT_STARTED';
                result = this.compareDate(now, initDate);
            } else {
                type = 'INITIATED';
                result = this.compareDate(now, endDate);
            }
        }
        item.type = type;
        item.days = result.days;
        item.hours = result.hours;
        item.minutes = result.minutes;
        item.seconds = result.seconds;
    }

    itemSelected(item) {
        if (item.type === 'NOT_STARTED' || item.type === 'INITIATED') {
            this.router.navigate(['/election-vote/' + item.id]);
        } else {
            this.router.navigate(['/election-result/' + item.id]);
        }

    }

    searchByCheckbox(type, flag) {

        if (type === 'ALL' && flag) {
            this.elections = this.bkpElections;
        }
        if (type !== 'ALL') {
            const tmp = this.elections.length >= this.bkpElections.length ? [] : this.elections;
            if (flag) {
                this.bkpElections.forEach(function(element) {
                    if (element.type === type) {
                        tmp.push(element);
                    }
                });
            } else {
                for (let i = 0; i < tmp.length; i++) {
                    if (tmp[i].type === type) {
                        tmp.splice(i, 1);
                        i = -1;
                    }
                }
            }
            this.elections = tmp;
        }
    }

    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }
}
