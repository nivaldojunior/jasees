import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { DateUtils } from 'ng-jhipster';

import { Election } from './election.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class ElectionService {

    private resourceUrl = 'api/elections';

    constructor(private http: Http, private dateUtils: DateUtils) { }

    create(election: Election): Observable<Election> {
        const copy = this.convert(election);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
        });
    }

    update(election: Election): Observable<Election> {
        const copy = this.convert(election);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
        });
    }

    find(id: number): Observable<ResponseWrapper> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return this.convertResponse(res);
        });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: Response) => this.convertResponse(res));
    }

    results(id: number): Observable<any> {
        return this.http.get(`${this.resourceUrl}/${id}/results`).map((res: Response) => {
            const jsonResponse = res.json();
            return jsonResponse;
        });
    }

    vote(electionId: string, voteVM: any): Observable<any> {

        return this.http.put(`${this.resourceUrl}/${electionId}/vote`, voteVM).map((res: Response) => {
            return res;
        });
    }

    verifyVote(electionId: number, pNumber: number): Observable<any> {
        return this.http.get(`${this.resourceUrl}/${electionId}/verifyVote?pNumber=${pNumber}`).map((res: Response) => {
            return res.json();
        });
    }

    delete(id: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        for (let i = 0; i < jsonResponse.length; i++) {
            this.convertItemFromServer(jsonResponse[i]);
        }
        return new ResponseWrapper(res.headers, jsonResponse);
    }

    private convertItemFromServer(entity: any) {
        entity.initDate = this.dateUtils
            .convertDateTimeFromServer(entity.initDate);
        entity.endDate = this.dateUtils
            .convertDateTimeFromServer(entity.endDate);
    }

    private convert(election: Election): Election {
        const copy: Election = Object.assign({}, election);
        copy.initDate = this.dateUtils.toDate(election.initDate);
        copy.endDate = this.dateUtils.toDate(election.endDate);
        return copy;
    }
}
