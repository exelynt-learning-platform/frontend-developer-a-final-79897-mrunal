import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Components
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoaderComponent } from './components/loader/loader.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { SearchComponent } from './components/search/search.component';
import { NoDataComponent } from './components/no-data/no-data.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { LayoutComponent } from './components/layout/layout.component';
import { ToastComponent } from './components/toast/toast.component';

// Directives & Pipes
import { HighlightDirective } from './directives/highlight.directive';
import { TitleCasePipe } from './pipes/title-case.pipe';
import { PhoneFormatPipe } from './pipes/phone-format.pipe';

@NgModule({
  declarations: [
    // Components
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    LoaderComponent,
    PaginationComponent,
    SearchComponent,
    NoDataComponent,
    ConfirmDialogComponent,
    LayoutComponent,
    ToastComponent,
    // Directives
    HighlightDirective,
    // Pipes
    TitleCasePipe,
    PhoneFormatPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    // Re-export modules
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    // Components
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    LoaderComponent,
    PaginationComponent,
    SearchComponent,
    NoDataComponent,
    ConfirmDialogComponent,
    LayoutComponent,
    ToastComponent,
    // Directives
    HighlightDirective,
    // Pipes
    TitleCasePipe,
    PhoneFormatPipe
  ]
})
export class SharedModule { }
