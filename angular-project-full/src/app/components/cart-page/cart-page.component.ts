

import { Component } from '@angular/core';
import { HttpserviceService } from '../../httpservice.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent {
  cartItems: any[] = [];
  totalPrice: number = 0;
  userId: any = sessionStorage.getItem('UserId');
  apiMessage: string = '';
  apiMessageType: string = '';
  loading: boolean = false;

  // Address form fields
  showAddressPopup: boolean = false;
  blockNumber: string = '';
  houseAddress: string = '';
  area: string = '';
  areas: string[] = [];
  state: string = '';
  country: string = '';
  pinCode: string = '';
  city: string = '';

  // Address choice modal
  
  showAddressChoice: boolean = false;
  selectedAddressType: string = 'permanent';

  constructor(private http: HttpserviceService) {}

  ngOnInit() {
    this.loadCartItems();
  }

  loadCartItems() {
    const userId = sessionStorage.getItem('UserId');
    if (!userId) {
      window.location.href = '/login';
      return;
    }

    this.http.getCartItems(userId).subscribe((data: any) => {
      if (data.message) {
        this.apiMessage = data.message;
        this.apiMessageType = 'error';
      }

      if (Array.isArray(data)) {
        this.cartItems = data;

        this.cartItems.forEach(item => {
          item.selectedSize = item.shoesNumber;
          if (item.categoryName === 'Man') {
            item.availableSizes = [7, 8, 9, 10, 11, 12];
          } else if (item.categoryName === 'Woman') {
            item.availableSizes = [4, 5, 6, 7, 8, 9];
          } else if (item.categoryName === 'Children') {
            item.availableSizes = [1, 2, 3, 4, 5, 6];
          }
        });

        this.calculateTotalPrice();
      }
    });
  }

  calculateTotalPrice() {
    this.totalPrice = this.cartItems.reduce((total, item) => total + (item.price * item.stock), 0);
  }

  onOrderClick(): void {
    const userId = sessionStorage.getItem('UserId');
    if (!userId) {
      alert('User is not logged in.');
      return;
    }

    this.showAddressChoice = true;
  }

  closeAddressChoice() {
    this.showAddressChoice = false;
  }

  onAddressTypeContinue() {
    if (this.selectedAddressType === 'permanent') {
      this.fetchPermanentAddressAndPlaceOrder();
    } else {
      this.showAddressChoice = false;
      this.showAddressPopup = true;
    }
  }

  // fetchPermanentAddressAndPlaceOrder() {
  //   this.loading = true;
  //   const userId = sessionStorage.getItem('UserId') || '';

  //   this.http.getUserDetails(userId).subscribe(
  //     (user: any) => {
  //       console.log(user);
        
  //       if (user && user.address) {
  //         this.placeOrder(user.address);
  //         setTimeout(() => {
  //           this.loading = false;
  //           window.location.href = '/order';
  //         }, 2000);
  //       } else {
  //         alert('No permanent address found. Please enter a new one.');
  //         this.showAddressPopup = true;
  //       }
  //       this.showAddressChoice = false;
  //     },
  //     error => {
  //       console.error('Error fetching user details:', error);
  //       alert('Error fetching address. Please try again.');
  //       this.loading = false;
  //     }
  //   );
  // }


  fetchPermanentAddressAndPlaceOrder() {
    this.loading = true;
    const userId = sessionStorage.getItem('UserId') || '';
  
    this.http.getUserDetails(userId).subscribe(
      (user: any) => {
        if (user && user.address) {
          this.showAddressChoice = false;
          this.loading = false;
  
          // SweetAlert confirmation popup with the permanent address
          Swal.fire({
            title: 'Use Permanent Address?',
            html: ` Address: <span style="text-align:center; font-size:14px; ">${user.address}</span>`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33'
          }).then((result) => {
            if (result.isConfirmed) {
              // Proceed with placing order
              this.loading = true;
              this.placeOrder(user.address);
              setTimeout(() => {
                this.loading = false;
                window.location.href = '/order';
              }, 2000);
            } else {
              // Do nothing or let user pick another option
            }
          });
  
        } else {
          this.loading = false;
          alert('No permanent address found. Please enter a new one.');
          this.showAddressPopup = true;
        }
      },
      error => {
        console.error('Error fetching user details:', error);
        this.loading = false;
        alert('Error fetching address. Please try again.');
      }
    );
  }
  
  onPinCodeChange() {
    if (this.pinCode && this.pinCode.length === 6) {
      this.fetchLocationDetails();
    }
  }

  fetchLocationDetails() {
    this.http.getPincodeInfo(this.pinCode).subscribe(
      (data: any) => {
        if (data && data[0]?.PostOffice?.length) {
          const postOffices = data[0].PostOffice;
          this.areas = postOffices.map((p: any) => p.Name);
          this.city = postOffices[0].District;
          this.state = postOffices[0].State;
          this.country = postOffices[0].Country;

          if (this.areas.length === 1) this.area = this.areas[0];
        }
      },
      (error) => {
        alert('Failed to fetch location details.');
      }
    );
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Address',
        text: 'Please fill in all the required fields.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      });
      return;
    }

    this.loading = true;
    const fullAddress = `${this.blockNumber}, ${this.houseAddress}, ${this.area}, ${this.city}, ${this.state}, ${this.country}`;
    this.placeOrder(fullAddress);

    setTimeout(() => {
      this.loading = false;
      window.location.href = '/order';
    }, 3000);

    this.closeAddressPopup();
  }

  closeAddressPopup() {
    this.showAddressPopup = false;
  }

  placeOrder(address: string) {
    const userId = sessionStorage.getItem('UserId') || '';

    this.http.getCartItems(userId).subscribe((cartData) => {
      if (!cartData || cartData.length === 0) {
        alert('Cart is empty.');
        return;
      }

      this.http.placeOrder(userId, address).subscribe(
        (response) => {
          if (response.orderId) {
            // Order successful
          } else {
            alert('Failed to place order: ' + response.message);
          }
        },
        (error) => {
          alert('Error placing the order.');
        }
      );
    });
  }

  updateQuantity(productId: string, size: number) {
    const data = new FormData();
    data.append('ProductId', productId);
    data.append('UserId', this.userId);
    data.append('Size', size.toString());

    this.http.updateQuantity(data).subscribe(
      (response: any) => {
        this.apiMessage = response.message;
        this.apiMessageType = 'success';
        setTimeout(() => {
          this.apiMessage = '';
          this.apiMessageType = '';
        }, 1000);
        this.loadCartItems();
      },
      (error) => {
        this.apiMessage = 'An error occurred';
        this.apiMessageType = 'error';
      }
    );
  }

  decreaseQuantity(productId: string) {
    const data = new FormData();
    data.append('ProductId', productId);
    data.append('UserId', this.userId);

    this.http.DecreaseQuantity(data).subscribe(
      (response: any) => {
        this.apiMessage = response.message;
        this.apiMessageType = 'success';
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      (error) => {
        this.apiMessage = 'An error occurred';
        this.apiMessageType = 'error';
      }
    );
  }

  removeCart(productId: number) {
    this.http.removeItem(this.userId, productId).subscribe(
      (response: any) => {
        this.apiMessage = response.message;
        this.apiMessageType = 'success';
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      (error) => {
        this.apiMessage = 'An error occurred';
        this.apiMessageType = 'error';
      }
    );
  }


    onSizeChange(item: any) {
    const data = new FormData();
    data.append('pid', item.productId);
    data.append('uid', this.userId);
    data.append('newSize', item.selectedSize.toString());

    this.http.updateSizeInCart(data).subscribe(
      (response: any) => {
        this.apiMessage = response.message;
        this.apiMessageType = 'success';
        setTimeout(() => {
          this.apiMessage = '';
          this.apiMessageType = '';
        }, 3000);
      },
      (error) => {
        this.apiMessage = 'An error occurred while updating size';
        this.apiMessageType = 'error';
      }
    );
  }
}
