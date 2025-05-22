  // import { Component } from '@angular/core';
  // import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
  // import { HttpserviceService } from '../../../httpservice.service';
  // import { ActivatedRoute, Router } from '@angular/router';
  // import { CommonModule } from '@angular/common';
  // import { Category, Subcategory } from '../../../Interface/interface-all';
  // import { HttpClient } from '@angular/common/http';
  // import { Observable } from 'rxjs';

  // @Component({
  //   selector: 'app-product-edit',
  //   imports: [ReactiveFormsModule, CommonModule,FormsModule],
  //   templateUrl: './product-edit.component.html',
  //   styleUrls: ['./product-edit.component.css']
  // })
  // export class ProductEditComponent {

  // productForm: FormGroup;
  // productId!: number;
  // productImageUrl: string | null = null; 
  // showImageInput: boolean = false;

  // constructor(
  //   private http: HttpClient,
  //   private route: ActivatedRoute,
  //   private router: Router,
  //   private fb: FormBuilder
  // ) {
  //   this.productForm = this.fb.group({
  //     ProductId: [''],
  //     Name: ['', Validators.required],
  //     Description: ['', Validators.required],
  //     Price: ['', Validators.required],
  //     Stock: ['', Validators.required],
  //     Image: [null] // Image field to store file
  //   });
  // }

  // ngOnInit(): void {
  //   this.route.paramMap.subscribe(params => {
  //     const productIdStr = params.get('id');
  //     if (productIdStr) {
  //       this.productId = +productIdStr; // Convert to number
  //       this.getProductDetails(this.productId); // Fetch product details
  //     } else {
  //       console.error('Product ID not found in the route parameters.');
  //     }
  //   });
  // }

  // getProductDetails(id: number): void {
  //   this.http.get<any>(`https://localhost:7262/api/Admin/GetById/${id}`).subscribe(
  //     (product) => {
  //       // console.log(product);
  //       this.productForm.patchValue({
  //         ProductId: product.productId,
  //         Name: product.name,
  //         Description: product.description,
  //         Price: product.price,
  //         Stock: product.stock
  //       });
  //       if (product.imageUrl) {
  //         this.productImageUrl = product.imageUrl;
  //       }
  //     },
  //     (error) => {
  //       console.error('Error fetching product details:', error);
  //     }
  //   );
  // }

  // // Handle file input change to capture the image
  // onFileChange(event: any): void {
  //   const file = event.target.files[0];
  //   if (file) {
  //     // Update the Image form control with the selected file
  //     this.productForm.patchValue({
  //       Image: file
  //     });

  //     // Optionally, preview the image before uploading
  //     this.productImageUrl = URL.createObjectURL(file); // Preview the uploaded image
  //   }
  // }

  // onSubmit(): void {
  //   if (this.productForm.invalid) {
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append('ProductId', this.productForm.get('ProductId')?.value);
  //   formData.append('Name', this.productForm.get('Name')?.value);
  //   formData.append('Description', this.productForm.get('Description')?.value);
  //   formData.append('Price', this.productForm.get('Price')?.value);
  //   formData.append('Stock', this.productForm.get('Stock')?.value);

  //   // Append the selected image file (if any) to FormData
  //   const imageFile = this.productForm.get('Image')?.value;
  //   if (imageFile) {
  //     formData.append('Image', imageFile, imageFile.name);
  //   }

  //   this.updateProduct(formData).subscribe(
  //     (response) => {
  //       console.log('Product updated successfully!', response);
  //       this.router.navigate(['/admin/show-product']);  // Navigate to product list after update
  //     },
  //     (error) => {
  //       console.error('Error updating product', error);
  //     }
  //   );
  // }

  // updateProduct(formData: FormData): Observable<any> {
  //   return this.http.put('https://localhost:7262/api/Admin/updateProduct', formData);
  // }
  // }


  import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpserviceService } from '../../../httpservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Category, Subcategory } from '../../../Interface/interface-all';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2'; // Import SweetAlert2

@Component({
  selector: 'app-product-edit',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent {

  productForm: FormGroup;
  productId!: number;
  productImageUrl: string | null = null; 
  showImageInput: boolean = false;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      ProductId: [''],
      Name: ['', Validators.required],
      Description: ['', Validators.required],
      Price: ['', Validators.required],
      Stock: ['', Validators.required],
      Image: [null] // Image field to store file
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const productIdStr = params.get('id');
      if (productIdStr) {
        this.productId = +productIdStr; // Convert to number
        this.getProductDetails(this.productId); // Fetch product details
      } else {
        console.error('Product ID not found in the route parameters.');
      }
    });
  }

  getProductDetails(id: number): void {
    this.http.get<any>(`https://localhost:7262/api/Admin/GetById/${id}`).subscribe(
      (product) => {
        // console.log(product);
        this.productForm.patchValue({
          ProductId: product.productId,
          Name: product.name,
          Description: product.description,
          Price: product.price,
          Stock: product.stock
        });
        if (product.imageUrl) {
          this.productImageUrl = product.imageUrl;
        }
      },
      (error) => {
        console.error('Error fetching product details:', error);
      }
    );
  }

  // Handle file input change to capture the image
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Update the Image form control with the selected file
      this.productForm.patchValue({
        Image: file
      });

      // Optionally, preview the image before uploading
      this.productImageUrl = URL.createObjectURL(file); // Preview the uploaded image
    }
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('ProductId', this.productForm.get('ProductId')?.value);
    formData.append('Name', this.productForm.get('Name')?.value);
    formData.append('Description', this.productForm.get('Description')?.value);
    formData.append('Price', this.productForm.get('Price')?.value);
    formData.append('Stock', this.productForm.get('Stock')?.value);

    // Append the selected image file (if any) to FormData
    const imageFile = this.productForm.get('Image')?.value;
    if (imageFile) {
      formData.append('Image', imageFile, imageFile.name);
    }

    this.updateProduct(formData).subscribe(
      (response) => {
        // console.log('Product updated successfully!', response);

        // Show SweetAlert success message
        // Swal.fire({
        //   icon: 'success',
        //   title: 'Product Updated!',
        //   text: 'The product has been updated successfully.',
        //   confirmButtonText: 'OK'
        // });

        // // Navigate to product list after update
        // this.router.navigate(['/admin/show-product']);
        Swal.fire({
          icon: 'success',
          title: 'Product Updated!',
          text: 'The product has been updated successfully.',
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          showCancelButton: true, // Shows the "Cancel" button
        }).then((result) => {
          if (result.isConfirmed) {
            // If the user clicked "OK"
            this.router.navigate(['/admin/show-product']);
          } else if (result.isDismissed) {
            // If the user clicked "Cancel"
            console.log('Product update canceled');
          }
        });
        
      },
      (error) => {
        console.error('Error updating product', error);

        // Show SweetAlert error message if the update fails
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was an issue updating the product. Please try again.',
          confirmButtonText: 'OK'
        });
      }
    );
  }

  updateProduct(formData: FormData): Observable<any> {
    return this.http.put('https://localhost:7262/api/Admin/updateProduct', formData);
  }
}
