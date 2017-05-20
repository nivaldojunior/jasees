import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, BaseRequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Election } from './election.model';
import { DateUtils } from 'ng-jhipster';
@Injectable()
export class ElectionService {

    private resourceUrl = 'api/elections';

    constructor(private http: Http, private dateUtils: DateUtils) { }

    create(election: Election): Observable<Election> {
        const copy: Election = Object.assign({}, election);
        copy.initDate = this.dateUtils.toDate(election.initDate);
        copy.endDate = this.dateUtils.toDate(election.endDate);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(election: Election): Observable<Election> {
        const copy: Election = Object.assign({}, election);

        copy.initDate = this.dateUtils.toDate(election.initDate);

        copy.endDate = this.dateUtils.toDate(election.endDate);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: number): Observable<Election> {
        return this.http.get(`${this.resourceUrl}/${id}`)
        .map((res: any) => this.convertResponse(res));
    }

    query(req?: any): Observable<Response> {
        const options = this.createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: any) => this.convertResponse(res))
        ;
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

    private convertResponse(res: any): any {
        const jsonResponse = res.json();
        for (let i = 0; i < jsonResponse.length; i++) {
            jsonResponse[i].initDate = this.dateUtils
                .convertDateTimeFromServer(jsonResponse[i].initDate);
            jsonResponse[i].endDate = this.dateUtils
                .convertDateTimeFromServer(jsonResponse[i].endDate);
        }
        res._body = jsonResponse;
        return res;
    }

    private createRequestOption(req?: any): BaseRequestOptions {
        const options: BaseRequestOptions = new BaseRequestOptions();
        if (req) {
            const params: URLSearchParams = new URLSearchParams();
            params.set('page', req.page);
            params.set('size', req.size);
            if (req.sort) {
                params.paramsMap.set('sort', req.sort);
            }
            params.set('query', req.query);

            options.search = params;
        }
        return options;
    }
}
