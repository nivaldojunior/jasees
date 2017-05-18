import {
    Component,
    OnInit,
    OnDestroy,
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

import * as $ from 'jquery';


@Component({
    selector: 'jhi-election-candidate-elect',
    templateUrl: './election-candidate-elect.component.html',
    styleUrls: [
        'election-candidate-elect.component.scss'
    ]

})
export class ElectionCandidateElectComponent implements OnInit, OnDestroy {


    election: Election;
    private subscription: any;
    candList: any[];
    isVoted: number;
    mycode: any;


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
        this.isVoted = headers.get('X-jaseesApp-params');

    }

    private onError(error) {
        //this.alertService.error(error.message, null, null);
    }

    candidateSelected(userSelected) {
        let self = this;
        if (self.isVoted <= 1) {
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
            }).then(function(x) {
                console.log(this)
                let voteVM = {
                    "bias": self.isVoted == 0 ? true : false,
                    "candidate": userSelected.id
                }
                electionService.vote(electionId, voteVM).subscribe((result) => {
                    self.mycode = result
                    swal({
                        type: 'success',
                        html: "<div class='input-group'>"+
                                  "<input id='swal-input1' readonly type='text' class='form-control'>"+
                              "</div>",
                        confirmButtonText:
                         '<i class="fa fa-files-o"></i> Copy!',
                        onOpen: function () {
                            $('#swal-input1').val(result);
                            
                        }
                    })
                    self.isVoted = self.isVoted == 0 ? 1 : 2;
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