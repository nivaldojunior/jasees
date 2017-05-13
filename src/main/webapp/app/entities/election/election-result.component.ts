import {
    Component,
    OnInit,
    OnDestroy
} from '@angular/core';
import {
    ActivatedRoute
} from '@angular/router';
import {
    Subscription
} from 'rxjs/Rx';
import {
    EventManager
} from 'ng-jhipster';

import {
    Election
} from './election.model';
import {
    ElectionService
} from './election.service';



@Component({
    selector: 'jhi-election-result',
    templateUrl: './election-result.component.html'
})
export class ElectionResultComponent implements OnInit, OnDestroy {

    election: any[];
    private subscription: any;
    private eventSubscriber: Subscription;

    public barChartOptions: any = {
        scaleShowVerticalLines: false,
        responsive: true
    };
    public barChartLabels: string[];
    public barChartType: string = 'horizontalBar';
    public barChartLegend: boolean = false;

    public barChartData: any[] = [{
        data: []
    }];

    // events
    public chartClicked(e: any): void {
        console.log(e);
    }

        public chartHovered(e: any): void {
        console.log(e);
    }

        constructor(
        private eventManager: EventManager,
        private electionService: ElectionService,
        private route: ActivatedRoute
    ) {}

      ngOnInit() {
        this.barChartLabels = [];
        this.barChartData[0].data = []
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
    }

    load(id) {
        this.electionService.results(id).subscribe((election) => {
            //this.election = election;

            this.election = [{
                "candidate": "Teste",
                "vote": 20
            },{
                "candidate": "Maria",
                "vote": 30
            },{
                "candidate": "Victor",
                "vote": 50
            }, {
                "candidate": "Joao",
                "vote": 70
            }];

            for(let i=0; i < this.election.length; i++){
              this.barChartLabels.push(this.election[i].candidate);
              this.barChartData[0].data.push(this.election[i].vote);
            }

        });
    }

    loadUsers() {

    }

        previousState() {
        window.history.back();
    }

        ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

}