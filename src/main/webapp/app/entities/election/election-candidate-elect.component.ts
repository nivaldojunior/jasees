import {
    Component,
    OnInit,
    OnDestroy,
    ChangeDetectorRef,
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
    templateUrl: './election-candidate-elect.component.html'

})
export class ElectionCandidateElectComponent implements OnInit, OnDestroy {


    election: Election;
    private subscription: any;
    candList: any[];
    isVoted: number;

    config: Object = {
        pagination: '.swiper-pagination',
        slidesPerView: 3,
        paginationClickable: true,
        spaceBetween: 30,
        freeMode: true,
        centeredSlides: true,
        keyboardControl: true,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev'
    };

    constructor(
        private eventManager: EventManager,
        private electionService: ElectionService,
        private route: ActivatedRoute,
        private cdRef:ChangeDetectorRef
    ) {
        this.candList = [ {
                            "id" : "user-2",
                            "login" : "admin",
                            "firstName" : "admin",
                            "lastName" : "Administrator",
                            "email" : "admin@localhost",
                            "activated" : true,
                            "langKey" : "en",
                            "imageUrl" : "http://rismedia.com/wp-content/uploads/2016/08/residential_real_estate.jpg",
                            "resetKey" : null,
                            "resetDate" : null
                          }, {
                            "id" : "user-1",
                            "login" : "anonymoususer",
                            "firstName" : "Anonymous",
                            "lastName" : "User",
                            "email" : "anonymous@localhost",
                            "activated" : true,
                            "langKey" : "en",
                            "imageUrl" : "http://s2.glbimg.com/cly6PDa5rOrXhmSpEggtfmFdqPE=/620x465/s.glbimg.com/jo/g1/f/original/2016/08/26/arnaldozimmermann.jpg",
                            "resetKey" : null,
                            "resetDate" : null
                          } ]
    }

    ngOnInit() {
        
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
        //this.candList = this.election.candList
        this.isVoted = headers.get('X-jaseesApp-params');
    }

    renderized() {
        //this.cdRef.detectChanges();   
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
                    swal({
                        type: 'success',
                        html: "Your vote is: " + result,
                        confirmButtonText:
                         '<i class="fa fa-files-o"></i> Copy!'
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