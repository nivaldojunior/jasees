import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { EventManager   } from 'ng-jhipster';

import { Election } from './election.model';
import { ElectionService } from './election.service';

@Component({
    selector: 'jhi-election-result',
    templateUrl: './election-result.component.html'
})
export class ElectionResultComponent implements OnInit, OnDestroy {

    election: Election;
    private subscription: any;
    private eventSubscriber: Subscription;
    dataSource: Object;

    constructor(
        private eventManager: EventManager,
        private electionService: ElectionService,
        private route: ActivatedRoute
    ) {
        this.dataSource = {
          "chart": {
            "caption": "Harry's SuperMart",
            "subCaption": "Top 5 stores in last month by revenue"
          },
          "data": [{
            "label": "Bakersfield Central",
             "value": "880000"
          }, {
            "label": "Garden Groove harbour",
            "value": "730000"
          }, {
            "label": "Los Angeles Topanga",
            "value": "590000"
          }, {
            "label": "Compton-Rancho Dom",
            "value": "520000"
          }, {
            "label": "Daly City Serramonte",
            "value": "330000"
          }]
        }
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
        this.eventManager.destroy(this.eventSubscriber);
    }

}
