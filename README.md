# Employee Management System (EMS)

An enterprise-grade, responsive, and accessible Employee Management System built with **Angular 17+**, **NgRx (Store, Effects, Entity)**, **Angular Material**, **Reactive Forms**, and **RxJS**.

---

## ?? Key Features

- **Enterprise Dashboard**: High-level overview of personnel metrics, country distribution, and recently onboarded employees.
- **Employee Directory**:
  - Desktop: Dense, accessible **Angular Material Table** with sortable columns, avatars, country pills, and action menus.
  - Mobile / Tablet: Responsive card layout transforming dynamically for screens down to 375px.
- **Search Employee by ID**:
  - Direct GET `/employee/:id` lookup.
  - User-friendly empty states for non-existent IDs (`"No employee found with ID 123."`).
  - Search banner indicator with one-click **Clear Search** to restore the full directory.
- **Add Employee**:
  - Accessible Angular Material modal dialog and dedicated `/employees/add` page.
  - Robust **Reactive Forms** with strict validation (required, regex email, 7-15 digit mobile, whitespace rejection, min/max length).
  - Prevents duplicate submissions with inline loading state.
  - Immediate NgRx Entity state insertion without browser reloading.
- **Edit Employee**:
  - Modal dialog and dedicated `/employees/edit/:id` route.
  - Automatic form pre-population from store entities or API fetch.
  - Optimistic/instant NgRx Entity updates upon API confirmation.
- **Delete Employee**:
  - Guarded by an Angular Material Confirmation Modal highlighting employee name and ID.
  - Non-destructive cancel button and destructive delete action with loading feedback.
  - Instant removal from NgRx Entity state and UI.
- **Country Synchronization**:
  - Loads country catalog from MockAPI into NgRx State.
  - Smart cache filtering prevents redundant HTTP queries across components.
  - Clean mapping from API DTOs to UI domain models.
- **Centralized Error Handling**:
  - HTTP Interceptor maps 400, 401, 403, 404, 500, and offline states to user-friendly messages.
  - Granular Error State component with one-click retry.

---

## ??? Technology Stack

| Technology | Purpose |
| :--- | :--- |
| **Angular 17** | Modern standalone component architecture, signals & control flow |
| **TypeScript 5.4** | Strict type safety, interfaces, DTOs, and mappings |
| **NgRx Store 17** | Predictable state container |
| **NgRx Effects 17** | Side effect isolation (HTTP communication, notifications) |
| **NgRx Entity 17** | Normalized entity management with `createEntityAdapter` |
| **Angular Material 17** | Professional enterprise UI components (Table, Dialog, SnackBar, Toolbar, Sidenav, Cards, Inputs) |
| **Angular CDK** | Responsive BreakpointObserver for adaptive desktop/mobile viewports |
| **RxJS 7.8** | Reactive state streams, pipeable operators, async pipe |
| **SCSS** | Modular enterprise design system, CSS variables, theme palettes |
| **Jasmine & Karma** | Automated unit test suite with ChromeHeadless runner |

---

## ??? Architecture & Design Patterns

### 1. Smart / Dumb Component Architecture

The application strictly decouples business logic from presentation:

- **Smart (Container) Components**:
  - `EmployeePageComponent`: Injects NgRx Store, dispatches CRUD and search actions, passes observable state (`employees$`, `loading$`, `error$`, `searchedEmployee$`) into presentation components, manages dialog modals.
  - `EmployeeAddEditPageComponent`: Manages route-based creation/updating and route params.
  - `EmployeeFormDialogComponent`: Manages modal-based form lifecycle and auto-close on completion.
  - `DashboardPageComponent`: Selects aggregate metrics and country catalogs.
- **Dumb (Presentational) Components**:
  - `EmployeeTableComponent`: Pure UI table & mobile card view with `@Input()` and `@Output()` (`edit`, `delete`).
  - `EmployeeSearchComponent`: Reusable search bar emitting search & clear events.
  - `EmployeeFormComponent`: Reusable Reactive Form with comprehensive validations and inline error cues.
  - `EmployeeDeleteDialogComponent`: Presentational confirmation dialog with action buttons.
  - `LoadingStateComponent`: Animated table skeleton shimmer and spinners.
  - `EmptyStateComponent`: Illustrated placeholder for zero-result states.
  - `ErrorStateComponent`: Friendly alert banner with retry trigger.

### 2. NgRx Store, Effects & Entity

- **Normalized Entities**: Employed `createEntityAdapter<Employee>()` to store employees by ID in a normalized map (`entities`, `ids`), achieving $O(1)$ updates and removals.
- **Side Effect Isolation**: All HTTP communications and toast alerts run inside `EmployeeEffects` and `CountryEffects`, keeping UI components free of HTTP logic.
- **Memoized Selectors**: `selectAllEmployees`, `selectEmployeeTotal`, `selectEmployeesLoading`, `selectEmployeesError`, `selectSearchedEmployee`, `selectActionInProgress`, and parameterized `selectEmployeeById(id)`.

### 3. API DTO Separation & Data Mapping

API responses and UI models are strictly decoupled:
- **API DTOs** (`EmployeeDto`, `CountryDto`) reflect backend serialization (e.g. `emailId` vs `email`, `country` vs `name`).
- **Domain Models** (`Employee`, `Country`) guarantee consistent frontend contracts.
- **Pure Mapping Functions** (`mapEmployeeDtoToEmployee`, `mapEmployeeToDto`, `mapCountryDtoToCountry`) handle normalization, trimming, and fallback values.

---

## ?? Project Structure

```
src/
+-- app/
�   +-- core/
�   �   +-- interceptors/
�   �   �   +-- http-error.interceptor.ts   # Centralized HTTP status code error handler
�   �   +-- models/
�   �   �   +-- employee.model.ts          # Employee Domain & DTO interfaces + mappers
�   �   �   +-- country.model.ts           # Country Domain & DTO interfaces + mappers
�   �   +-- services/
�   �   �   +-- employee.service.ts        # Employee REST API service
�   �   �   +-- country.service.ts         # Country REST API service
�   �   �   +-- notification.service.ts    # MatSnackBar notification wrapper
�   �   +-- validators/
�   �       +-- custom-validators.ts       # Strict email, mobile regex, whitespace validator
�   +-- shared/
�   �   +-- components/
�   �       +-- loading-state/             # Shimmer skeleton loader & progress spinner
�   �       +-- empty-state/               # Reusable empty data placeholder
�   �       +-- error-state/               # Reusable error banner with retry
�   �       +-- employee-delete-dialog/    # Accessible confirmation modal
�   +-- features/
�   �   +-- dashboard/
�   �   �   +-- pages/
�   �   �       +-- dashboard-page/        # Dashboard overview & analytics
�   �   +-- employees/
�   �       +-- components/
�   �       �   +-- employee-table/        # Material table + responsive cards
�   �       �   +-- employee-search/       # ID search input + clear button
�   �       �   +-- employee-form/         # Reactive Form with validations
�   �       �   +-- employee-form-dialog/  # Modal dialog wrapper for form
�   �       +-- pages/
�   �           +-- employee-page/         # Master employee directory page (Smart)
�   �           +-- employee-add-edit-page/# Dedicated add/edit routed page
�   +-- layout/
�   �   +-- header/                        # Top bar with logo, live counter, profile
�   �   +-- sidebar/                       # Collapsible navigation drawer
�   +-- store/
�   �   +-- employees/
�   �   �   +-- employee.actions.ts        # Typed NgRx actions
�   �   �   +-- employee.models.ts         # EmployeeState & EntityAdapter
�   �   �   +-- employee.reducer.ts        # Reducer handling CRUD mutations
�   �   �   +-- employee.effects.ts        # Async HTTP effects & snackbars
�   �   �   +-- employee.selectors.ts      # Memoized selectors
�   �   +-- countries/
�   �       +-- country.actions.ts         # Country actions
�   �       +-- country.models.ts          # CountryState & EntityAdapter
�   �       +-- country.reducer.ts         # Reducer
�   �       +-- country.effects.ts         # Country fetch with caching
�   �       +-- country.selectors.ts       # Country selectors
�   +-- app.component.ts                   # Shell layout with Sidenav container
�   +-- app.routes.ts                      # Lazy-loaded route declarations
�   +-- app.config.ts                      # Application providers (Store, Effects, Interceptors)
+-- environments/
�   +-- environment.ts                     # Production environment configuration
�   +-- environment.development.ts         # Development environment configuration
+-- styles.scss                            # Enterprise Material theme & design system
```

---

## ?? API Configuration

All endpoint paths reside inside `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://669b3f09276e45187d34eb4e.mockapi.io/api/v1',
  endpoints: {
    employees: '/employee',
    countries: '/country'
  }
};
```

### API Endpoints
- **Countries**: `GET /country`
- **Employees List**: `GET /employee`
- **Employee by ID**: `GET /employee/:id`
- **Create Employee**: `POST /employee`
- **Update Employee**: `PUT /employee/:id`
- **Delete Employee**: `DELETE /employee/:id`

---

## ?? Testing Suite

The project includes **54 automated unit tests** covering business-critical paths:

- **EmployeeService**: Mock HTTP testing for GET, GET by ID, POST, PUT, DELETE, and 500 status propagation.
- **CountryService**: Mock HTTP testing for country list and error fallback.
- **Employee Reducer**: Tests for initial state, entity additions, modifications, removals, loading flags, search loading/error/clear.
- **Employee Selectors**: Tests for entity sorting, total counts, loading/error states, parameterized employee lookup.
- **Employee Effects**: Tests for `loadEmployees$`, `loadEmployeeById$`, `createEmployee$`, `updateEmployee$`, `deleteEmployee$`, error handling, and toast notifications.
- **EmployeeFormComponent**: Tests for required validation, whitespace rejection, email regex, mobile format, invalid form prevention, valid form emit, and edit pre-population.
- **EmployeeTableComponent**: Desktop table rendering, mobile card rendering, and edit/delete event emission.
- **EmployeeDeleteDialogComponent**: Employee name display, cancel button, confirm button.
- **EmployeeSearchComponent**: Valid ID emission, Enter key press, clear search emission, empty input handling.
- **AppComponent**: Shell creation, navigation drawer, and header integration.

### Run Unit Tests
```bash
npm test -- --watch=false --browsers=ChromeHeadless
```
**Result**: 54 SUCCESS (100% passing)

---

## ?? Installation & Running

### Prerequisites
- Node.js (v18.x - v22.x)
- npm (v9.x - v10.x)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
ng serve
# or
npm start
```
Navigate your browser to `http://localhost:4200/`.

### 3. Production Build
```bash
npm run build
```
Build output will be bundled into `dist/ems` with Ahead-Of-Time (AOT) compilation and optimization.
