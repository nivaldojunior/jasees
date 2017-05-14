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

// ES6 Modules
import { default as swal } from 'sweetalert2'

@Component({
    selector: 'jhi-election-result',
    templateUrl: './election-result.component.html'
})
export class ElectionResultComponent implements OnInit, OnDestroy {

    electionId;
    election: Election;
    private subscription: any;
    

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
            this.electionId = params['id']; 
            this.load(params['id']);
        });
    }

    load(id) {

        this.electionService.find(id).subscribe((election) => {
            this.election = election;
        });
        this.electionService.results(id).subscribe((election) => {
            for(let i=0; i < election.length; i++){
              this.barChartLabels.push(election[i].candidate.firstName);
              this.barChartData[0].data.push(election[i].votes);
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
        
    }

    verifyVote() {
      let electionService = this.electionService;
      let electionId = this.electionId;
      swal({
      title: 'Verify Vote',
      input: 'text',
      showCancelButton: true,
      confirmButtonText: 'Submit',
      showLoaderOnConfirm: true,
      preConfirm: function (pNumber) {
        return new Promise(function (resolve, reject){
          electionService.verifyVote(electionId, pNumber).subscribe((results) => {
            if(!results){
              reject('Put any error message here')
            }else{
              resolve(results)
            }
            
          });
        })
      },
      allowOutsideClick: false
    }).then(function (results) {

      if(results){
        let imageUrl = results.imageUrl ? results.imageUrl;
        swal({
          title: results.firstName,
          text: '',
          imageUrl: imageUrl,
          imageWidth: 300,
          imageHeight: 300,
          animation: true
        })
      }else{
        swal({
          type: 'error',
          title: 'Non-existent vote',
          html: ''
        })
      }
      
    })
    }

}