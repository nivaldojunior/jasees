import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { EventManager  } from 'ng-jhipster';

import { Election } from './election.model';
import { ElectionService } from './election.service';

@Component({
    selector: 'jhi-election-detail',
    templateUrl: './election-detail.component.html'
})
export class ElectionDetailComponent implements OnInit, OnDestroy {

    election: Election;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: EventManager,
        private electionService: ElectionService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInElections();
    }

    load(id) {
        this.electionService.find(id).subscribe((election) => {
            this.election = election;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInElections() {
        this.eventSubscriber = this.eventManager.subscribe(
            'electionListModification',
            (response) => this.load(this.election.id)
        );
    }
}
