import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { EventManager   } from 'ng-jhipster';

import { Election } from './election.model';
import { ElectionService } from './election.service';

@Component({
    selector: 'jhi-election-candidate-elect',
    templateUrl: './election-candidate-elect.component.html'
})
export class ElectionCandidateElectComponent implements OnInit, OnDestroy {

    election: Election;
    private subscription: any;

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
    }

    load(id) {        
        this.electionService.find(id).subscribe((election) => {
            this.election = election;
        });
    }

    loadUsers(){

    }

    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
