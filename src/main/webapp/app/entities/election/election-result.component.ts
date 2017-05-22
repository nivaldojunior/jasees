import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'ng-jhipster';

import { Election } from './election.model';
import { ElectionService } from './election.service';

// ES6 Modules
import { default as swal } from 'sweetalert2';
import {ResponseWrapper} from '../../shared/model/response-wrapper.model';

@Component({
    selector: 'jhi-election-result',
    templateUrl: './election-result.component.html'
})
export class ElectionResultComponent implements OnInit, OnDestroy {

    electionId;
    election: Election;
    private subscription: any;
    results: any[];

    public max = 0;
    public showWarning: boolean;
    public dynamic: number;
    public type: string;
    constructor(private eventManager: EventManager,
                private electionService: ElectionService,
                private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.electionId = params['id'];
            this.load(params['id']);
        });
    }

    load(id) {
        const self = this;
        this.electionService.find(id).subscribe((res: ResponseWrapper) => {
            this.election = res.json;
        });
        this.electionService.results(id).subscribe((election) => {
            self.results = election;
            election.forEach(function(element) {
                self.max += element.votes;
            });
        });
    }

    getPercentage(value) {
        return ((value * 100) / this.max).toFixed(2);
    }

    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();

    }

    verifyVote() {
        const electionService = this.electionService;
        const electionId = this.electionId;
        swal({
            title: 'Verify Vote',
            input: 'text',
            showCancelButton: true,
            confirmButtonText: 'Submit',
            showLoaderOnConfirm: true,
            preConfirm: function(pNumber) {
                return new Promise(function(resolve, reject) {
                    electionService.verifyVote(electionId, pNumber).subscribe((results) => {
                        if (!results) {
                            reject('Put any error message here');
                        } else {
                            resolve(results);
                        }

                    });
                });
            },
            allowOutsideClick: false
        }).then(function(results) {

            if (results) {
                const imageUrl = results.imageUrl;
                swal({
                    title: results.firstName,
                    text: '',
                    imageUrl,
                    imageWidth: 300,
                    imageHeight: 300,
                    animation: true
                });
            } else {
                swal({
                    type: 'error',
                    title: 'Non-existent vote',
                    html: ''
                });
            }

        });
    }
}
