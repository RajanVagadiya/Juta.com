// import { CommonModule } from '@angular/common';
// import { HttpClientModule } from '@angular/common/http';
// import { Component, inject } from '@angular/core';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { Router, RouterLink } from '@angular/router';
// import { HttpserviceService } from '../../httpservice.service';
// import { passwordStrengthValidator } from '../../Interface/Password-validation';
// import Swal from 'sweetalert2';

// @Component({
//   selector: 'app-register-page',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, RouterLink],
//   templateUrl: './register-page.component.html',
//   styleUrls: ['./register-page.component.css']
// })
// export class RegisterPageComponent {
//   registrationForm: FormGroup;
//   otpVerificationForm: FormGroup;
//   otpSent: boolean = false;
//   otp: string = '';
//   otpExpirationTime: Date | null = null;
//   http1 = inject(HttpserviceService);




//   isSubmitting: boolean = false;

//   constructor(
//     private fb: FormBuilder,
//     private router: Router
//   ) {
//     this.registrationForm = this.fb.group({
//       FirstName: ['', Validators.required],
//       LastName: ['', Validators.required],
//       Email: ['', [Validators.required, Validators.email]],
//       Password: ['', [Validators.required, passwordStrengthValidator()]],
//       cPassword: ['', Validators.required],
//       PhoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
//       Gender: ['', Validators.required],
//       Address: ['', Validators.required],
//       PinCode: ['', Validators.required],
//     });

//     this.otpVerificationForm = this.fb.group({
//       Otp: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]]
//     });
//   }

//   onSubmit() {
//     this.registrationForm.markAllAsTouched();

//     if (this.registrationForm.invalid) {
//       return;
//     }

//     const { FirstName, LastName, Email, Password, PhoneNumber, Gender ,Address} = this.registrationForm.value;

//     if (Password !== this.registrationForm.get('cPassword')?.value) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Oops...',
//         text: 'Passwords do not match!',
//       });
//       return;
//     }

//     const formData = new FormData();
//     formData.append('FirstName', FirstName);
//     formData.append('LastName', LastName);
//     formData.append('Email', Email);
//     formData.append('Password', Password);
//     formData.append('PhoneNumber', PhoneNumber);
//     formData.append('Gender', Gender);
//     formData.append('Address', Address);

//     sessionStorage.setItem('registrationData', JSON.stringify(this.registrationForm.value));

//     this.isSubmitting = true;

//     this.http1.register(formData).subscribe(
//       (response: any) => {
//         console.log(response);

//         if (response.message === 'OTP sent to email. Please verify to complete registration.') {
//           this.otpSent = true;
//           this.otp = response.otp;
//           this.otpExpirationTime = new Date(response.otpExpirationTime);
//           sessionStorage.setItem('otp', JSON.stringify({ otp: this.otp, expirationTime: this.otpExpirationTime }));
          
//           Swal.fire({
//             icon: 'info',
//             title: 'OTP Sent',
//             text: 'An OTP has been sent to your email. Please verify.',
//           });
//         } else {
//           Swal.fire({
//             icon: 'info',
//             title: 'Info',
//             text: response.message,
//           });
//         }

//         this.isSubmitting = false;
//       },
//       (error) => {
//         console.error('Error:', error);
//         Swal.fire({
//           icon: 'error',
//           title: 'Error',
//           text: 'An error occurred during registration.',
//         });
//         this.isSubmitting = false;
//       }
//     );
//   }

//   onVerifyOtp() {
//     const otp = this.otpVerificationForm.get('Otp')?.value;

//     if (otp !== this.otp) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Invalid OTP',
//         text: 'Please enter the correct OTP sent to your email.',
//       });
//       return;
//     }

//     if (this.otpExpirationTime && new Date() > this.otpExpirationTime) {
//       Swal.fire({
//         icon: 'warning',
//         title: 'OTP Expired',
//         text: 'OTP has expired. Please request a new one.',
//       });
//       return;
//     }

//     const verificationData = new FormData();
//     verificationData.append('Email', this.registrationForm.value.Email);
//     verificationData.append('Otp', otp);

//     this.http1.verifyOtp(verificationData).subscribe(
//       (response: any) => {
//         if (response.message === 'Registration successful') {
//           Swal.fire({
//             icon: 'success',
//             title: 'Success!',
//             text: 'Registration successful. Redirecting to login...',
//             timer: 3000,
//             showConfirmButton: false
//           });

//           sessionStorage.removeItem('registrationData');
//           sessionStorage.removeItem('otp');
//           this.registrationForm.reset();
//           this.otpVerificationForm.reset();
//           this.otpSent = false;
//           this.router.navigate(['/login']);
//         } else {
//           Swal.fire({
//             icon: 'info',
//             title: 'Info',
//             text: response.message,
//           });
//         }

//         this.isSubmitting = false;
//       },
//       (error) => {
//         console.error('Error:', error);
//         Swal.fire({
//           icon: 'error',
//           title: 'Error',
//           text: 'An error occurred during OTP verification.',
//         });
//         this.isSubmitting = false;
//       }
//     );
//   }

 
  
// }



import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpserviceService } from '../../httpservice.service';
import { passwordStrengthValidator } from '../../Interface/Password-validation';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent {
  registrationForm: FormGroup;
  otpVerificationForm: FormGroup;
  otpSent: boolean = false;
  otp: string = '';
  otpExpirationTime: Date | null = null;
  isSubmitting: boolean = false;
  areas: string[] = [];

  http1 = inject(HttpserviceService);

  constructor(private fb: FormBuilder, private router: Router) {
    this.registrationForm = this.fb.group({
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required, passwordStrengthValidator()]],
      cPassword: ['', Validators.required],
      PhoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      Gender: ['', Validators.required],
      Address: ['', Validators.required],
      PinCode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      Area: ['', Validators.required],
      City: [{ value: '', disabled: true }, Validators.required],
      State: [{ value: '', disabled: true }, Validators.required],
      Country: [{ value: '', disabled: true }, Validators.required]
    });

    this.otpVerificationForm = this.fb.group({
      Otp: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]]
    });
  }

  onPinCodeChange() {
    const pinCode = this.registrationForm.get('PinCode')?.value;
    if (pinCode && pinCode.length === 6) {
      this.http1.getPincodeInfo(pinCode).subscribe(
        (data: any) => {
          if (data && data[0]?.PostOffice?.length) {
            const postOffices = data[0].PostOffice;
            const firstPostOffice = postOffices[0];

            this.registrationForm.patchValue({
              City: firstPostOffice.District,
              State: firstPostOffice.State,
              Country: firstPostOffice.Country
            });

            this.areas = postOffices.map((p: any) => p.Name);

            if (this.areas.length === 1) {
              this.registrationForm.patchValue({ Area: this.areas[0] });
            }
          }
        },
        (error) => {
          Swal.fire('Error', 'Failed to fetch location details.', 'error');
        }
      );
    }
  }

  onSubmit() {
    this.registrationForm.markAllAsTouched();

    if (this.registrationForm.invalid) return;

    const {
      FirstName,
      LastName,
      Email,
      Password,
      PhoneNumber,
      Gender,
      Address,
      Area,
      City,
      State,
      Country,
      PinCode
    } = this.registrationForm.getRawValue();

    if (Password !== this.registrationForm.get('cPassword')?.value) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Passwords do not match!'
      });
      return;
    }

    const fullAddress = `${Address}, ${Area}, ${City}, ${State}, ${Country} - ${PinCode}`;
    const formData = new FormData();
    formData.append('FirstName', FirstName);
    formData.append('LastName', LastName);
    formData.append('Email', Email);
    formData.append('Password', Password);
    formData.append('PhoneNumber', PhoneNumber);
    formData.append('Gender', Gender);
    formData.append('Address', fullAddress);

    sessionStorage.setItem('registrationData', JSON.stringify(this.registrationForm.value));
    this.isSubmitting = true;

    this.http1.register(formData).subscribe(
      (response: any) => {
        if (response.message === 'OTP sent to email. Please verify to complete registration.') {
          this.otpSent = true;
          this.otp = response.otp;
          this.otpExpirationTime = new Date(response.otpExpirationTime);
          sessionStorage.setItem('otp', JSON.stringify({ otp: this.otp, expirationTime: this.otpExpirationTime }));

          Swal.fire({
            icon: 'info',
            title: 'OTP Sent',
            text: 'An OTP has been sent to your email. Please verify.'
          });
        } else {
          Swal.fire('Info', response.message, 'info');
        }

        this.isSubmitting = false;
      },
      (error) => {
        Swal.fire('Error', 'An error occurred during registration.', 'error');
        this.isSubmitting = false;
      }
    );
  }

  onVerifyOtp() {
    const otp = this.otpVerificationForm.get('Otp')?.value;

    if (otp !== this.otp) {
      Swal.fire('Invalid OTP', 'Please enter the correct OTP sent to your email.', 'error');
      return;
    }

    if (this.otpExpirationTime && new Date() > this.otpExpirationTime) {
      Swal.fire('OTP Expired', 'OTP has expired. Please request a new one.', 'warning');
      return;
    }

    const verificationData = new FormData();
    verificationData.append('Email', this.registrationForm.value.Email);
    verificationData.append('Otp', otp);

    this.http1.verifyOtp(verificationData).subscribe(
      (response: any) => {
        if (response.message === 'Registration successful') {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Registration successful. Redirecting to login...',
            timer: 3000,
            showConfirmButton: false
          });

          sessionStorage.removeItem('registrationData');
          sessionStorage.removeItem('otp');
          this.registrationForm.reset();
          this.otpVerificationForm.reset();
          this.otpSent = false;
          this.router.navigate(['/login']);
        } else {
          Swal.fire('Info', response.message, 'info');
        }

        this.isSubmitting = false;
      },
      (error) => {
        Swal.fire('Error', 'An error occurred during OTP verification.', 'error');
        this.isSubmitting = false;
      }
    );
  }
}
