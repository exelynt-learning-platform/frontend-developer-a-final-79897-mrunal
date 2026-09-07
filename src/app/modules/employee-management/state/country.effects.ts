import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { CountryService } from '../country.service';
import * as CountryActions from './country.actions';

@Injectable()
export class CountryEffects {
  loadCountries$ = createEffect(() => this.actions$.pipe(
    ofType(CountryActions.loadCountries),
    exhaustMap(() => this.countryService.getCountries().pipe(
      map((countries) => CountryActions.loadCountriesSuccess({ countries })),
      catchError((error: Error) => of(CountryActions.loadCountriesFailure({ error: error.message || 'Failed to load countries' })))
    ))
  ));

  constructor(private actions$: Actions, private countryService: CountryService) {}
}
