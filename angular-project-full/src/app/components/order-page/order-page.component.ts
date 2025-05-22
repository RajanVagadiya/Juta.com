// import { Component, OnInit } from '@angular/core';
// import { HttpserviceService } from '../../httpservice.service';
// import { Router } from '@angular/router';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-order-page',
//   imports: [CommonModule],
//   templateUrl: './order-page.component.html',
//   styleUrls: ['./order-page.component.css']
// })
// export class OrderPageComponent implements OnInit {

//   pendingOrders: any[] = [];
//   paidOrders: any[] = [];
//   subtotal: number = 0;
//   deliveryCharge: number = 10;
//   totalAmount: number = 0;
//   paymentProcessed: boolean = false;  // To track if payment was successful
//   userId: string = sessionStorage.getItem('UserId') || '';
//   loadingPending: boolean = true;
//   loadingPaid: boolean = true;
//   errorMessage: string = '';
//   paymentInProgress: boolean = false;
//   showConfirmPayment: boolean = false;  // To control confirmation popup
//   redirectInProgress: boolean = false; 

//   constructor(private orderService: HttpserviceService, private router: Router) { }

//   ngOnInit(): void {
//     this.fetchPendingOrders();
//     this.fetchPaidOrders();
//   }

//   fetchPendingOrders(): void {
//     this.orderService.getPendingOrders(this.userId).subscribe(response => {
//       if (Array.isArray(response)) {
//         this.pendingOrders = response;
//         this.calculateSubtotal();
//         this.updateTotalAmount();
//         this.errorMessage = '';
//       } else {
//         this.errorMessage = response.message;
//         this.pendingOrders = [];
//       }
//       this.loadingPending = false;
//     }, error => {
//       console.error('Error fetching pending orders:', error);
//       this.errorMessage = 'Error fetching pending orders. Please try again later.';
//       this.loadingPending = false;
//     });
//   }

//   fetchPaidOrders(): void {
//     this.orderService.getPaidOrders(this.userId).subscribe(response => {
//       this.paidOrders = response;
//       this.loadingPaid = false;
//     }, error => {
//       console.error('Error fetching paid orders:', error);
//       this.loadingPaid = false;
//     });
//   }

//   calculateSubtotal(): void {
//     this.subtotal = this.pendingOrders.reduce((sum, order) => sum + order.total, 0);
//   }

//   updateTotalAmount(): void {
//     this.totalAmount = this.subtotal + this.deliveryCharge;
//   }

//   removeOrder(orderId: string, productId: string): void {
//     this.orderService.removeOrder(orderId, productId).subscribe(() => {
//       this.pendingOrders = this.pendingOrders.filter(order => order.orderId !== orderId);
//       window.location.reload();
//       this.calculateSubtotal();
//       this.updateTotalAmount();
//     });
//   }

//   payNow(): void {
//     // Show confirmation buttons
//     this.showConfirmPayment = true;
//   }

//   confirmPayment(): void {
//     this.paymentInProgress = true;
//     this.showConfirmPayment = false;

//     // Call the payment API
//     this.orderService.createPayment(this.userId).subscribe(response => {
//       setTimeout(() => {
//         this.paymentInProgress = false;  // Hide the loading overlay
//         this.paymentProcessed = true;  // Show success message

//         // Redirect after payment is successful
//         this.redirectInProgress = true;  
//         setTimeout(() => {
//           this.navigateToOrderPaid();
//         }, 500);  // Wait a little before navigating

//         this.generateInvoice();  // Generate the invoice after payment
//       }, 3000);  // Simulate a 3-second delay for payment processing
//     }, error => {
//       this.paymentInProgress = false;
//       this.errorMessage = 'Error processing payment.';
//     });
//   }

//   cancelPayment(): void {
//     // Hide confirmation buttons and do nothing
//     this.showConfirmPayment = false;
//   }

//   generateInvoice(): void {
//     var url = `https://localhost:7262/api/Cart/PdfGenerate/${this.userId}`;
//     window.location.href = url;
//   }

//   navigateToOrderPaid(): void {
//     this.router.navigateByUrl('/paid-order');
//   }
// }


import { Component, OnInit } from '@angular/core';
import { HttpserviceService } from '../../httpservice.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order-page',
  imports: [CommonModule],
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.css']
})
export class OrderPageComponent implements OnInit {

  pendingOrders: any[] = [];
  paidOrders: any[] = [];
  subtotal: number = 0;
  deliveryCharge: number = 10;
  totalAmount: number = 0;
  paymentProcessed: boolean = false;
  userId: string = sessionStorage.getItem('UserId') || '';
  loadingPending: boolean = true;
  loadingPaid: boolean = true;
  errorMessage: string = '';
  paymentInProgress: boolean = false;
  showConfirmPayment: boolean = false;

  constructor(private orderService: HttpserviceService, private router: Router) { }

  ngOnInit(): void {
    this.fetchPendingOrders();
    this.fetchPaidOrders();
  }

  fetchPendingOrders(): void {
    this.orderService.getPendingOrders(this.userId).subscribe(
      response => {
        if (Array.isArray(response)) {
          this.pendingOrders = response;
          this.calculateSubtotal();
          this.updateTotalAmount();
          this.errorMessage = '';
        } else {
          this.errorMessage = response.message;
          this.pendingOrders = [];
        }
        this.loadingPending = false;
      },
      error => {
        console.error('Error fetching pending orders:', error);
        this.errorMessage = 'Error fetching pending orders. Please try again later.';
        this.loadingPending = false;
      }
    );
  }

  fetchPaidOrders(): void {
    this.orderService.getPaidOrders(this.userId).subscribe(
      response => {
        this.paidOrders = response;
        this.loadingPaid = false;
      },
      error => {
        console.error('Error fetching paid orders:', error);
        this.loadingPaid = false;
      }
    );
  }

  calculateSubtotal(): void {
    this.subtotal = this.pendingOrders.reduce((sum, order) => sum + order.total, 0);
  }

  updateTotalAmount(): void {
    this.totalAmount = this.subtotal + this.deliveryCharge;
  }

  // removeOrder(orderId: string, productId: string): void {
  //   this.orderService.removeOrder(orderId, productId).subscribe(() => {
  //     this.pendingOrders = this.pendingOrders.filter(order => order.orderId !== orderId);
  //     this.calculateSubtotal();
  //     this.updateTotalAmount();
  //   });
  // }


  removeOrder(orderId: string, productId: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to remove this order?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        this.orderService.removeOrder(orderId, productId).subscribe(() => {
          this.pendingOrders = this.pendingOrders.filter(order => order.orderId !== orderId);
          this.calculateSubtotal();
          this.updateTotalAmount();
  
          Swal.fire({
            title: 'Removed!',
            text: 'The order has been removed.',
            icon: 'success',
            confirmButtonColor: '#3085d6'
          });
        }, () => {
          Swal.fire({
            title: 'Error!',
            text: 'Failed to remove the order. Please try again.',
            icon: 'error',
            confirmButtonColor: '#d33'
          });
        });
      }
    });
  }
  
  payNow(): void {
    this.showConfirmPayment = true;
  }

  confirmPayment(): void {
    this.paymentInProgress = true;
    this.showConfirmPayment = false;

    this.orderService.createPayment(this.userId).subscribe(
      () => {
        // Now generate invoice
        this.orderService.generateInvoice(this.userId).subscribe(
          (pdfBlob) => {
            // Optional: Auto-download PDF
            const blob = new Blob([pdfBlob], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = 'Invoice.pdf';
            link.click();

            this.paymentInProgress = false;

            Swal.fire({
              title: 'Payment Successful!',
              text: 'Your order has been placed successfully.',
              icon: 'success',
              confirmButtonText: 'Continue',
              confirmButtonColor: '#3085d6'
            }).then(() => {
              this.paymentProcessed = true;
              this.navigateToOrderPaid();
            });
          },
          () => {
            this.paymentInProgress = false;
            this.errorMessage = 'Payment done, but failed to generate invoice.';

            Swal.fire({
              title: 'Payment Completed',
              text: 'But we were unable to generate the invoice. Please try downloading it later.',
              icon: 'warning',
              confirmButtonText: 'OK',
              confirmButtonColor: '#d33'
            });
          }
        );
      },
      error => {
        this.paymentInProgress = false;
        this.errorMessage = 'Error processing payment. Please try again later.';

        Swal.fire({
          title: 'Payment Failed',
          text: this.errorMessage,
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#d33'
        });
      }
    );
  }

  cancelPayment(): void {
    this.showConfirmPayment = false;
  }

  navigateToOrderPaid(): void {
    this.router.navigateByUrl('/paid-order');
  }



  
}

