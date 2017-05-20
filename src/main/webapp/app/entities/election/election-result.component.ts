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
    results: any[];
    
    public max: number = 0;
    public showWarning: boolean;
    public dynamic: number;
    public type: string;


    constructor(
        private eventManager: EventManager,
        private electionService: ElectionService,
        private route: ActivatedRoute
    ) {}

      ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.electionId = params['id']; 
            this.load(params['id']);
        });
    }

    load(id) {
        let self = this;
        this.electionService.find(id).subscribe((election) => {
            this.election = election;
        });
        this.electionService.results(id).subscribe((election) => {
            self.results = election
            election.forEach(function(element){
              self.max += element.votes;
            })
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
        let imageUrl = results.imageUrl;
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