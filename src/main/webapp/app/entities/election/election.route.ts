import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { PaginationUtil } from 'ng-jhipster';

import { ElectionComponent } from './election.component';
import { ElectionDetailComponent } from './election-detail.component';
import { ElectionPopupComponent } from './election-dialog.component';
import { ElectionDeletePopupComponent } from './election-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class ElectionResolvePagingParams implements Resolve<any> {

  constructor(private paginationUtil: PaginationUtil) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      const page = route.queryParams['page'] ? route.queryParams['page'] : '1';
      const sort = route.queryParams['sort'] ? route.queryParams['sort'] : 'id,asc';
      return {
          page: this.paginationUtil.parsePage(page),
          predicate: this.paginationUtil.parsePredicate(sort),
          ascending: this.paginationUtil.parseAscending(sort)
    };
  }
}

export const electionRoute: Routes = [
  {
    path: 'election',
    component: ElectionComponent,
    resolve: {
      'pagingParams': ElectionResolvePagingParams
    },
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'Elections'
    },
    canActivate: [UserRouteAccessService]
  }, {
    path: 'election/:id',
    component: ElectionDetailComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'Elections'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const electionPopupRoute: Routes = [
  {
    path: 'election-new',
    component: ElectionPopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'Elections'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'election/:id/edit',
    component: ElectionPopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'Elections'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'election/:id/delete',
    component: ElectionDeletePopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'Elections'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
