import {
    Component,
    OnInit
} from '@angular/core';
import {
    NgbModalRef
} from '@ng-bootstrap/ng-bootstrap';
import {
    EventManager
} from 'ng-jhipster';

import {
    Account,
    LoginModalService,
    Principal
} from '../shared';

@Component({
    selector: 'jhi-home',
    templateUrl: './home.component.html',
    styleUrls: [
        'home.scss'
    ]

})
export class HomeComponent implements OnInit {
    account: Account;
    modalRef: NgbModalRef;

    elections = []
    bkpElections = []
    filter: string;

    constructor(
        private principal: Principal,
        private loginModalService: LoginModalService,
        private eventManager: EventManager
    ) {
        this.filter = '';
    }

    ngOnInit() {
        this.principal.identity().then((account) => {
            this.account = account;
        });
        this.registerAuthenticationSuccess();

        this.bkpElections = [{
            "candList": [
                "string"
            ],
            "desc": "Nome alternativo para Assentos (ex: Mandatos, Deputados)",
            "endDate": "2017-05-11T21:18:52.763Z",
            "id": "1",
            "initDate": "2017-05-10T21:18:52.763Z",
            "name": "Eleição Uberlândia"
        }, {
            "candList": [
                "string"
            ],
            "desc": "Cor a utilizar para o partido e/ou barras (linha 1)(o)",
            "endDate": "2017-05-09T21:18:52.763Z",
            "id": "2",
            "initDate": "2017-05-08T21:18:52.763Z",
            "name": "Eleição Araguari"
        }, {
            "candList": [
                "string"
            ],
            "desc": "Nome alternativo para Assentos (ex: Mandatos, Deputados)",
            "endDate": "2017-05-11T21:18:52.763Z",
            "id": "3",
            "initDate": "2017-05-09T22:18:52.763Z",
            "name": "Eleição Catalao"
        },{
            "candList": [
                "string"
            ],
            "desc": "Nome alternativo para Assentos (ex: Mandatos, Deputados)",
            "endDate": "2017-05-08T21:18:52.763Z",
            "id": "4",
            "initDate": "2017-05-02T22:18:52.763Z",
            "name": "Eleição Goiania"
        }]

        this.elections = this.bkpElections;
        setInterval(() => {
            for (let i = 0; i < this.bkpElections.length; i++) {
                this.calculeTime(this.bkpElections[i]);
            } 
          }, 1000);
    }

    registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', (message) => {
            this.principal.identity().then((account) => {
                this.account = account;
            });
        });
    }

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }


    compareDate(date1, date2) {
        let seconds = Math.floor((date2 - (date1)) / 1000);
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);
        let days = Math.floor(hours / 24);

        hours = hours - (days * 24);
        minutes = minutes - (days * 24 * 60) - (hours * 60);
        seconds = seconds - (days * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);

        return {
            days: days,
            hours: hours,
            minutes: minutes,
            seconds: seconds
        };
    };

    convertToDate(date) {
        let fullyear = date.split("-");

        let year = fullyear[0];
        let month = fullyear[1];

        let removeT = fullyear[2].split("T");
        let day = removeT[0];

        let fullHour = removeT[1].split(":");

        let hours = fullHour[0];
        let minutes = fullHour[1];

        let seconds = fullHour[2].split(".")[0];

        return new Date(year, month - 1, day, hours, minutes, seconds, 0);
    };

    calculeTime(item) {

        let date = new Date(item.initDate);
        let stringInitDate = item.initDate;
        let stringEndDate = item.endDate;

        let type = "";
        let result={
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
        };

        let now = new Date();
        let initDate = this.convertToDate(stringInitDate);
        let endDate = this.convertToDate(stringEndDate);


        if (endDate.getTime() - now.getTime() <= 0) {
            type = "FINALIZED";
        } else {
            if (initDate.getTime() - now.getTime() >= 0) {
                type = "NOT_STARTED"
                result = this.compareDate(now, initDate);
            } else {
                type = "INITIATED";
                result = this.compareDate(initDate, endDate);
            }
        }
        item.type = type;
        item.days = result.days;
        item.hours = result.hours;
        item.minutes = result.minutes;
        item.seconds = result.seconds;
    }

    itemSelected(item){
        if(item.type === 'NOT_STARTED' || item.type === 'INITIATED'){
            alert("Name: " + item.name + " Chamar tela: Votar")    
        }else{
            alert("Name: " + item.name + " Chamar tela: Resultados")
        }
        
    }

    searchByCheckbox(type, flag){
        
        if(type === 'ALL' && flag){
            this.elections = this.bkpElections;
        }
        if(type !== 'ALL'){
            let tmp = this.elections.length >= this.bkpElections.length ? [] : this.elections;
            if(flag){
                this.bkpElections.forEach(function(element){
                    if(element.type === type){
                        tmp.push(element);
                    }
                })
            }else{
                for (var i = 0; i < tmp.length; i++) {
                    if(tmp[i].type === type){
                        tmp.splice(i, 1);
                        i=-1;
                    }
                }
            }
            this.elections = tmp;
        }
    }
}