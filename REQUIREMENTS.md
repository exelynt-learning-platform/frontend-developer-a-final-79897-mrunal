# Employee Management System (EMS)

An enterprise-grade, responsive, and accessible Employee Management System built with **Angular 17+, NgRx, Angular Material, Reactive Forms, and RxJS**.

The application provides complete employee lifecycle management including employee listing, search, creation, editing, deletion, country synchronization, centralized error handling, and responsive layouts.

See [REQUIREMENTS.md]for the assessment traceability matrix and the distinction between automated verification and manual review items.

## Key Features

### Enterprise Dashboard

- High-level overview of employee metrics.
- Country distribution.
- Recently onboarded employees.
- Responsive dashboard layout.

### Employee Directory

- Desktop view using an accessible Angular Material Table.
- Sortable employee columns.
- Employee avatars and country indicators.
- Action menus for employee operations.
- Responsive card-based layout for mobile and tablet.
- Supports screen sizes down to 375px.

### Search Employee by ID

- Direct `GET /employee/:id` lookup.
- User-friendly empty state for non-existent employees.
- Example: `No employee found with ID 123.`
- Search banner indicates when a filtered result is active.
- One-click Clear Search restores the complete employee directory.

### Add Employee

- Accessible Angular Material dialog.
- Dedicated `/employees/add` route.
- Reactive Forms with strict validation.
- Required field validation.
- Email format validation.
- Mobile number validation with 7–15 digit restriction.
- Whitespace rejection.
- Minimum and maximum length validation.
- Prevents duplicate submissions with loading state.
- Newly created employees are immediately inserted into NgRx Entity state without browser reload.

### Edit Employee

- Edit employee through a modal dialog.
- Dedicated `/employees/edit/:id` route.
- Automatically pre-populates employee information.
- Retrieves employee data from NgRx store or API when required.
- Updates NgRx Entity state after successful API confirmation.

### Delete Employee

- Angular Material confirmation dialog.
- Displays employee name and ID before deletion.
- Cancel action prevents accidental deletion.
- Delete action provides loading feedback.
- Employee is immediately removed from NgRx Entity state and UI after successful deletion.

### Country Synchronization

- Loads country catalog from MockAPI.
- Stores countries in NgRx state.
- Smart caching prevents unnecessary HTTP requests.
- Consistent mapping between API DTOs and UI domain models.

### Centralized Error Handling

- HTTP interceptor for centralized error processing.
- Handles `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Internal Server Error`, and offline/network errors.
- Converts technical errors into user-friendly messages.
- Reusable error state component with one-click retry.

## Technology Stack

| Technology | Purpose |
| --- | --- |
| Angular 17 | Standalone component architecture, signals and modern Angular control flow |
| TypeScript 5.4 | Strict type safety, interfaces, DTOs and data mapping |
| NgRx Store 17 | Predictable centralized state management |
| NgRx Effects 17 | Handles HTTP operations and side effects |
| NgRx Entity 17 | Normalized employee and country entity management |
| Angular Material 17 | Enterprise UI components such as Table, Dialog, SnackBar, Toolbar and Sidenav |
| Angular CDK | Responsive breakpoint detection using `BreakpointObserver` |
| RxJS 7.8 | Reactive programming, observables and asynchronous data streams |
| SCSS | Modular styling, design system and theme variables |
| Jasmine & Karma | Automated unit testing |

## Architecture & Design Patterns

### 1. Smart / Dumb Component Architecture

The application separates business logic from presentation logic using Smart (Container) and Dumb (Presentational) components.

#### Smart / Container Components

**EmployeePageComponent**

- Injects the NgRx Store.
- Dispatches CRUD and search actions.
- Provides employee observables such as `employees$`, `loading$`, `error$`, and `searchedEmployee$`.
- Manages employee dialogs.

**EmployeeAddEditPageComponent**

- Handles route-based employee creation and editing.
- Reads route parameters.
- Coordinates form submission and employee operations.

**EmployeeFormDialogComponent**

- Manages modal form lifecycle.
- Handles dialog open/close behavior.
- Automatically closes after successful operations.

**DashboardPageComponent**

- Selects employee metrics from the store.
- Loads and displays country information.

#### Dumb / Presentational Components

| Component | Responsibility |
| --- | --- |
| EmployeeTableComponent | Desktop table and responsive mobile card UI |
| EmployeeSearchComponent | Employee ID search and clear actions |
| EmployeeFormComponent | Reactive form and validation UI |
| EmployeeDeleteDialogComponent | Delete confirmation UI |
| LoadingStateComponent | Skeleton loader and progress indicators |
| EmptyStateComponent | Empty-result placeholder |
| ErrorStateComponent | Error message and retry action |

Presentational components communicate with their parent components using `@Input()` and `@Output()`.

### 2. NgRx Store, Effects & Entity

The application uses NgRx for centralized and predictable state management.

#### Normalized Entity State

Employees are stored using:

```typescript
createEntityAdapter<Employee>()
```

This creates a normalized state structure containing `entities` and `ids`, making employee lookup, insertion, modification and removal efficient.

#### Effects

All HTTP communication and notification side effects are isolated inside `EmployeeEffects` and `CountryEffects`. This keeps HTTP and side-effect logic outside the UI components.

#### Memoized Selectors

The application uses selectors including `selectAllEmployees`, `selectEmployeeTotal`, `selectEmployeesLoading`, `selectEmployeesError`, `selectSearchedEmployee`, `selectActionInProgress`, and `selectEmployeeById(id)`.

### 3. API DTO Separation & Data Mapping

The application separates backend API models from frontend domain models.

#### API DTOs

DTOs represent the backend response structure: `EmployeeDto` and `CountryDto`.

For example, the backend may use `emailId` and `country`, while the frontend domain model uses `email` and `name`.

#### Domain Models

The application uses strongly typed domain models: `Employee` and `Country`.

#### Mapping Functions

Pure mapping functions keep API and UI contracts independent:

```typescript
mapEmployeeDtoToEmployee()
mapEmployeeToDto()
mapCountryDtoToCountry()
```

These functions handle data normalization, trimming, fallback values, and API-to-UI transformation.

## Project Structure

```text
src/
|-- app/
|   |-- core/
|   |   |-- interceptors/
|   |   |-- models/
|   |   |-- services/
|   |   `-- validators/
|   |-- shared/
|   |   `-- components/
|   |-- features/
|   |   |-- dashboard/
|   |   `-- employees/
|   |-- layout/
|   |-- store/
|   |   |-- employees/
|   |   `-- countries/
|   |-- app.component.ts
|   |-- app.routes.ts
|   `-- app.config.ts
|-- environments/
`-- styles.scss
```

## API Configuration

All API endpoint paths are centralized inside `src/environments/environment.ts`.

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

| Operation | Method | Endpoint |
| --- | --- | --- |
| Get Countries | `GET` | `/country` |
| Get Employees | `GET` | `/employee` |
| Get Employee by ID | `GET` | `/employee/:id` |
| Create Employee | `POST` | `/employee` |
| Update Employee | `PUT` | `/employee/:id` |
| Delete Employee | `DELETE` | `/employee/:id` |

## Testing Suite

The project includes **174 automated unit tests** covering the application's business-critical functionality, including services, reducers, selectors, effects, forms, tables, dialogs, search, and the application shell.

## Run Unit Tests

```bash
npm test -- --watch=false --browsers=ChromeHeadless
```

### Test Result

```text
174 SUCCESS
100% passing
```

## Installation & Running

### Prerequisites

- Node.js v18.x – v22.x
- npm v9.x – v10.x

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
ng serve
```

Or:

```bash
npm start
```

Open `http://localhost:4200/` in your browser.

### Create Production Build

```bash
npm run build
```

The optimized production build is generated inside `dist/ems` using Angular's Ahead-of-Time (AOT) compilation and production optimizations.

## Responsive Design

The application is designed to work across desktop, tablet and mobile devices. Desktop uses an Angular Material data table, while tablet and mobile use responsive employee cards and touch-friendly controls. The layout is optimized for screens down to 375px.

## Accessibility

Accessibility is considered throughout the application using semantic HTML, Angular Material accessible components, keyboard-friendly controls, accessible dialogs, form validation messages, clear focus states, meaningful labels, and screen-reader-friendly UI states.

## Error Handling

The application uses a centralized HTTP error interceptor to provide consistent, user-friendly messages for `400`, `401`, `403`, `404`, `500`, and offline/network errors. Errors are displayed through reusable UI components and notifications, with retry functionality where applicable.

## Assessment Highlights

- Angular standalone architecture.
- TypeScript strict typing.
- NgRx Store, Effects and Entity.
- Reactive Forms and custom validators.
- RxJS and Angular Material.
- REST API integration with DTO/domain model separation.
- Smart/Dumb component architecture.
- Centralized HTTP error handling.
- Responsive and accessible UI.
- Comprehensive unit testing.

## License

This project was developed as part of a frontend development assessment.
