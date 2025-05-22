
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpserviceService } from '../../httpservice.service';
import { passwordStrengthValidator } from '../../Interface/Password-validation';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  loginForm: FormGroup;

  http1 = inject(HttpserviceService);

  constructor(private router: Router, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, passwordStrengthValidator()]] 
    });
  }

  // Submit form
  // onSubmit(): void {
  //   if (this.loginForm.invalid) {
  //     this.loginForm.markAllAsTouched(); 
  //     alert('Please fill out the form correctly.');
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append('Email', this.loginForm.value.email);
  //   formData.append('Password', this.loginForm.value.password);

  //   // Call the login method from the service
  //   this.http1.login(formData).subscribe(
  //     (response: any) => {
  //       console.log('Login Success');
  //       alert(response.message);

  //       sessionStorage.setItem('UserId', response.data.userId);
  //       sessionStorage.setItem('Role', response.data.role);

  //       const userRole = response.data.role;

  //       // Navigate based on role
  //       this.router.navigate([userRole === 'Admin' ? '/admin/home' : '/home']).then(() => {
  //         window.location.reload(); 
  //       });
  //     },
  //     (error) => {
  //       console.error('Login Error:', error);
  //       alert('Login failed. Please check your credentials.');
  //     }
  //   );
  // }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
  
      Swal.fire({
        icon: 'error',
        title: 'Invalid Form',
        text: 'Please fill out the form correctly.'
      });
  
      return;
    }
  
    const formData = new FormData();
    formData.append('Email', this.loginForm.value.email);
    formData.append('Password', this.loginForm.value.password);
  
    this.http1.login(formData).subscribe(
      (response: any) => {
        console.log('Login Response:', response);
    
        if (response && response.data) {
          sessionStorage.setItem('UserId', response.data.userId);
          sessionStorage.setItem('Role', response.data.role);
    
          const userRole = response.data.role;
    
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
          });
    
          Toast.fire({
            icon: 'success',
            title: 'Signed in successfully'
          }).then(() => {
            this.router.navigate([userRole === 'Admin' ? '/admin/home' : '/home']).then(() => {
              window.location.reload();
            });
          });
    
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: response?.message || 'Invalid response from server.'
          });
        }
      },
      (error) => {
        console.error('Login Error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: error?.error?.message || 'Please check your email or password.'
        });
      }
    );
    
  }
  

  // Getter for email control
  get email() {
    return this.loginForm.get('email');
  }

  // Getter for password control
  get password() {
    return this.loginForm.get('password');
  }

  // Check if email is invalid
  get emailInvalid() {
    return this.email?.hasError('email') && this.email?.touched;
  }

  // Check if password is invalid (weak)
  get passwordInvalid() {
    return this.password?.hasError('weakPassword') && this.password?.touched;
  }
}
