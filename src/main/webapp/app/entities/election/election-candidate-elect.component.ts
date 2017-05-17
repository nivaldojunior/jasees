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
import {
    default as swal
} from 'sweetalert2'

@Component({
    selector: 'jhi-election-candidate-elect',
    templateUrl: './election-candidate-elect.component.html',
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
export class ElectionCandidateElectComponent implements OnInit, OnDestroy {

    election: Election;
    private subscription: any;
    candList: any[];
    isVoted: number;

    constructor(
        private eventManager: EventManager,
        private electionService: ElectionService,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.candList = [];
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
    }

    load(id) {

        this.electionService.find(id).subscribe(
            (res: Response) => this.onSuccess(res.json(), res.headers),
            (res: Response) => this.onError(res.json())
        );
    }

    private onSuccess(election, headers) {
        this.election = election;
        this.candList = this.election.candList
        this.isVoted = headers.get('x-jaseesapp-params');
    }

    private onError(error) {
        //this.alertService.error(error.message, null, null);
    }

    candidateSelected(userSelected) {
        let isVoted = this.isVoted; 
        if (isVoted <= 1) {
            let electionId = this.election.id;
            let electionService = this.electionService;
            swal({
                title: 'Are you sure?',
                text: "Your candidate selected is: " + userSelected.firstName,
                imageUrl: userSelected.imageUrl,
                imageWidth: 300,
                imageHeight: 300,
                animation: true,
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, Vote it!'
            }).then(function() {
                let voteVM = {
                    "bias": isVoted === "0" ? true : false,
                    "candidate": userSelected.id
                }
                electionService.vote(electionId, voteVM).subscribe((result) => {
                    
                    swal(
                        'Voted!',
                        'Your code is: ' + result,
                        'success'
                    )
                    isVoted = isVoted === "0" ? "1" : "2";
                });

            })

        } else {
            swal(
              'Sorry',
              'Can not vote anymore',
              'warning'
            )
        }
    }

    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}