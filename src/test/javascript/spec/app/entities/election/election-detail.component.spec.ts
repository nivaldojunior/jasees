import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { DateUtils, DataUtils, EventManager } from 'ng-jhipster';
import { JaseesTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { ElectionDetailComponent } from '../../../../../../main/webapp/app/entities/election/election-detail.component';
import { ElectionService } from '../../../../../../main/webapp/app/entities/election/election.service';
import { Election } from '../../../../../../main/webapp/app/entities/election/election.model';

describe('Component Tests', () => {

    describe('Election Management Detail Component', () => {
        let comp: ElectionDetailComponent;
        let fixture: ComponentFixture<ElectionDetailComponent>;
        let service: ElectionService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [JaseesTestModule],
                declarations: [ElectionDetailComponent],
                providers: [
                    DateUtils,
                    DataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    ElectionService,
                    EventManager
                ]
            }).overrideComponent(ElectionDetailComponent, {
                set: {
                    template: ''
                }
            }).compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ElectionDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ElectionService);
        });


        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new Election('aaa')));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.election).toEqual(jasmine.objectContaining({id:'aaa'}));
            });
        });
    });

});
