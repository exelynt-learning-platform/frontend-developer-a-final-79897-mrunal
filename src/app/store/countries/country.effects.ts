import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom, filter } from 'rxjs/operators';
import { CountryService } from '../../core/services/country.service';
import * as CountryActions from './country.actions';
import { selectCountriesLoaded } from './country.selectors';

@Injectable()
export class CountryEffects {
  private actions$ = inject(Actions);
  private countryService = inject(CountryService);
  private store = inject(Store);

  loadCountries$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CountryActions.loadCountries),
      withLatestFrom(this.store.select(selectCountriesLoaded)),
      filter(([action, loaded]) => action.force || !loaded),
      switchMap(() =>
        this.countryService.getCountries().pipe(
          map((countries) => CountryActions.loadCountriesSuccess({ countries })),
          catchError((error) =>
            of(
              CountryActions.loadCountriesFailure({
                error: error.message || 'Unable to load countries.'
              })
            )
          )
        )
      )
    )
  );
}
