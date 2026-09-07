import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  showPassword = false;
  returnUrl = '/home';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });

    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/home';
  }

  async onSubmit(): Promise<void> {
  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  this.isSubmitting = true;
  this.errorMessage = '';

  const { email, password } = this.loginForm.value;

  try {

    await this.authService.loginWithAppwrite(
      email,
      password
    );

    this.router.navigateByUrl(this.returnUrl);

  } catch (err: any) {

    this.errorMessage =
      err?.message || 'Invalid email or password.';

  } finally {

    this.isSubmitting = false;

  }
}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
