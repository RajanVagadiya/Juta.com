// import { CommonModule } from '@angular/common';
// import { HttpClient } from '@angular/common/http';
// import { Component, OnInit } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { Router, RouterLink } from '@angular/router';

// @Component({
//   selector: 'app-show-user',
//   imports: [CommonModule, FormsModule],
//   templateUrl: './show-user.component.html',
//   styleUrl: './show-user.component.css'
// })
// export class ShowUserComponent implements OnInit {
//  users: any[] = [];
//   filteredusers: any[] = [];
//   nameFilter: string = '';
//   categoryFilter: string = '';
//   subcategoryFilter: string = '';

//   constructor(private http: HttpClient, private router: Router) { }

//   ngOnInit(): void {
//     this.getusers();
//   }

//   getusers(): void {
//     this.http.get<any[]>('https://localhost:7262/api/User/GetAllUser')
//       .subscribe(
//         data => {
//           // console.log(data);
          
//           this.users = data;
//           this.filteredusers = data;  // Initially, display all users
//         },
//         error => {
//           console.error('Error fetching users:', error);
//         }
//       );
//   }

//   deleteuser(userId: number): void {
//     const confirmation = confirm('Are you sure you want to delete this User?');
//     if (confirmation) {
//       this.http.delete(`https://localhost:7262/api/User/DeleteById/${userId}`)
//         .subscribe(
//           () => {
//             alert('User deleted successfully');
//             this.getusers();  // Refresh the product list
//           },
//           error => {
//             console.error('Error deleting User:', error);
//           }
//         );
//     }
//   }

 
// }


import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';  // Import SweetAlert2

@Component({
  selector: 'app-show-user',
  imports: [CommonModule, FormsModule],
  templateUrl: './show-user.component.html',
  styleUrl: './show-user.component.css'
})
export class ShowUserComponent implements OnInit {
  users: any[] = [];
  filteredusers: any[] = [];
  nameFilter: string = '';
  categoryFilter: string = '';
  subcategoryFilter: string = '';

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.getusers();
  }

  // Fetch users from the API
  getusers(): void {
    this.http.get<any[]>('https://localhost:7262/api/User/GetAllUser')
      .subscribe(
        data => {
          this.users = data;
          this.filteredusers = data;  // Initially, display all users
        },
        error => {
          console.error('Error fetching users:', error);
        }
      );
  }

  // Handle delete user with SweetAlert2
  deleteuser(userId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This user will be deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`https://localhost:7262/api/User/DeleteById/${userId}`)
          .subscribe(
            () => {
              Swal.fire(
                'Deleted!',
                'The user has been deleted.',
                'success'
              );
              this.getusers();  // Refresh the user list
            },
            error => {
              console.error('Error deleting user:', error);
              Swal.fire(
                'Error!',
                'There was an issue deleting the user.',
                'error'
              );
            }
          );
      }
    });
  }
}
