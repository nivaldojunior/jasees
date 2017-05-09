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

    elections = [{
        "candList": [
            "string"
        ],
        "desc": "Nome alternativo para Assentos (ex: Mandatos, Deputados)",
        "endDate": "2017-05-09T21:18:52.763Z",
        "id": "1",
        "initDate": "2017-05-09T21:18:52.763Z",
        "name": "Eleição Uberlândia"
    }, {
        "candList": [
            "string"
        ],
        "desc": "Cor a utilizar para o partido e/ou barras (linha 1)(o)",
        "endDate": "2017-05-09T21:18:52.763Z",
        "id": "2",
        "initDate": "2017-05-09T21:18:52.763Z",
        "name": "Eleição Araguari"
    },{
        "candList": [
            "string"
        ],
        "desc": "Nome alternativo para Assentos (ex: Mandatos, Deputados)",
        "endDate": "2017-05-09T21:18:52.763Z",
        "id": "1",
        "initDate": "2017-05-09T21:18:52.763Z",
        "name": "Eleição Uberlândia"
    }]

    constructor(
        private principal: Principal,
        private loginModalService: LoginModalService,
        private eventManager: EventManager
    ) {}

    ngOnInit() {
        this.principal.identity().then((account) => {
            this.account = account;
        });
        this.registerAuthenticationSuccess();
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

    calculeTime (item) {
        //initDate, endDate
        
        var date = new Date(item.initDate);
        console.log(date.getDay())
        console.log(date.getHours())
        console.log(date.getMinutes())
        console.log(date.getMinutes())
        
        debugger;
    }
}