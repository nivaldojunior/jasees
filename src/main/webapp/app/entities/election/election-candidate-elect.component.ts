import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Election} from './election.model';
import {ElectionService} from './election.service';
// ES6 Modules
import {default as swal} from 'sweetalert2';
import {ResponseWrapper} from '../../shared/model/response-wrapper.model';

@Component({
    selector: 'jhi-election-candidate-elect',
    templateUrl: './election-candidate-elect.component.html'

})
export class ElectionCandidateElectComponent implements OnInit, OnDestroy {
    alertService: any;
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
        private electionService: ElectionService,
        private route: ActivatedRoute,
    ) {}

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
    }

    load(id) {
        this.electionService.find(id).subscribe(
            (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }

    private onSuccess(election, headers) {
        this.election = election;
        this.candList = this.election.candList;
        this.isVoted = headers.get('X-jaseesApp-params');
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }

    candidateSelected(userSelected) {
        const self = this;
        if (self.isVoted <= 1) {
            const electionId = this.election.id;
            const electionService = this.electionService;
            swal({
                title: 'Are you sure?',
                text: 'Your candidate selected is: ' + userSelected.firstName,
                imageUrl: userSelected.imageUrl,
                imageWidth: 300,
                imageHeight: 300,
                animation: true,
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, Vote it!'
            }).then(function(x) {
                const voteVM = {
                    'bias': self.isVoted === 0 ? true : false,
                    'candidate': userSelected.id
                };
                electionService.vote(electionId, voteVM).subscribe((result) => {
                    swal({
                        type: 'success',
                        html: 'Your vote is: ' + result._body,
                        confirmButtonText: '<i class="fa fa-files-o"></i> Copy!'
                    });
                    self.isVoted = self.isVoted === 0 ? 1 : 2;
                });

            });
        } else {
            swal(
                'Sorry',
                'Can not vote anymore',
                'warning'
            );
        }
    }

    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
