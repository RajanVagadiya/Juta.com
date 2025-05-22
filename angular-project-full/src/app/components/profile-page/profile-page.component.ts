
// import { CommonModule } from '@angular/common';
// import { HttpClient } from '@angular/common/http';
// import { Component } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import Swal from 'sweetalert2';

// @Component({
//   selector: 'app-profile-page',
//   imports: [CommonModule, FormsModule],
//   templateUrl: './profile-page.component.html',
//   styleUrls: ['./profile-page.component.css']
// })
// export class ProfilePageComponent {
//   user: any = null; 
//   isEditing: boolean = false; 

//   private userId: string|null = '';  

//   constructor(private http: HttpClient) {}

//   ngOnInit() {
//     this.userId = sessionStorage.getItem('UserId');
//     // Fetch user data on component initialization
//     this.http.get('https://localhost:7262/api/User/GetByIdUser/'+this.userId).subscribe(
//       (data) => {
//         // console.log(data);
//         this.user = data;
//       },
//       (error) => {
//         console.error('Error fetching user data', error);
//       }
//     );
//   }

//   toggleEdit() {
//     this.isEditing = !this.isEditing;
//   }

//   saveProfile() {
//     // Send the updated user data to the API using PUT request
//     this.http.put(`https://localhost:7262/api/User/UpdateUser/`+this.userId, this.user).subscribe(
//       (response) => {
//         alert('Profile updated successfully');
//         this.isEditing = false; 
//       },
//       (error) => {
//         console.error('Error saving profile', error);
//       }
//     );
//   }
// }


import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent {
  user: any = null;
  isEditing: boolean = false;

  private userId: string | null = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.userId = sessionStorage.getItem('UserId');

    this.http.get('https://localhost:7262/api/User/GetByIdUser/' + this.userId).subscribe(
      (data) => {
        this.user = data;
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to fetch user data!',
        });
        console.error('Error fetching user data', error);
      }
    );
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  // saveProfile() {
  //   this.http.put(`https://localhost:7262/api/User/UpdateUser/` + this.userId, this.user).subscribe(
  //     (response) => {
  //       Swal.fire({
  //         icon: 'success',
  //         title: 'Profile Updated',
  //         text: 'Your changes have been saved!',
  //         confirmButtonColor: '#3085d6'
  //       });
  //       this.isEditing = false;
  //     },
  //     (error) => {
  //       Swal.fire({
  //         icon: 'error',
  //         title: 'Save Failed',
  //         text: 'There was an issue saving your profile.',
  //       });
  //       console.error('Error saving profile', error);
  //     }
  //   );
  // }

  saveProfile() {
    Swal.fire({
      title: 'Save Changes?',
      text: 'Do you want to save the changes to your profile?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Save',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.put(`https://localhost:7262/api/User/UpdateUser/` + this.userId, this.user).subscribe(
          (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Profile Updated',
              text: 'Your changes have been saved!',
              confirmButtonColor: '#3085d6'
            });
            this.isEditing = false;
          },
          (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Save Failed',
              text: 'There was an issue saving your profile.',
            });
            console.error('Error saving profile', error);
          }
        );
      }
    });
  }
  
}
