import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { httpErrorInterceptor } from './core/interceptors/http-error.interceptor';
import { employeeReducer } from './store/employees/employee.reducer';
import { EmployeeEffects } from './store/employees/employee.effects';
import { countryReducer } from './store/countries/country.reducer';
import { CountryEffects } from './store/countries/country.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
    provideHttpClient(withInterceptors([httpErrorInterceptor])),
    provideAnimations(),
    provideStore({
      employees: employeeReducer,
      countries: countryReducer
    }),
    provideEffects([EmployeeEffects, CountryEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode()
    })
  ]
};

