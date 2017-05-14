import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { EventManager   } from 'ng-jhipster';

import { Election } from './election.model';
import { ElectionService } from './election.service';

// ES6 Modules
import { default as swal } from 'sweetalert2'

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

    constructor(
        private eventManager: EventManager,
        private electionService: ElectionService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.candList = [];
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
    }

    load(id) {        
        this.electionService.find(id).subscribe((election) => {
            this.election = election;
            this.candList = this.election.candList

            this.candList = [{id: "user-2", firstName: 'Victor Cesar', imageUrl:'http://s2.glbimg.com/PnOZ0wBrJuWEYaPR9sR5zKMnY2A=/s.glbimg.com/jo/g1/f/original/2016/08/24/rodrigo620.jpg'},
            {id: "admin", firstName: 'Joao Ribeiro', imageUrl:'https://pbs.twimg.com/profile_images/303984501/twitter.jpg'},
            {id: "user-3", firstName: 'Mario Castro', imageUrl:'http://s2.glbimg.com/6N7STiRsFk1IkGuI_WNZIvGv7Qk=/620x465/s.glbimg.com/jo/g1/f/original/2016/08/24/ivanrocha.jpg'}]
        });
    }

    candidateSelected (userSelected) {
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
        }).then(function () {
            let voteVM =  { "bias": true, "candidate": userSelected.id }
            electionService.vote(electionId, voteVM).subscribe((result) => {
                console.log(result);
                swal(
                    'Voted!',
                    'Your file has been deleted.',
                    'success'
                  )
            });
          
        })
        console.log(userSelected);
    }

    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
