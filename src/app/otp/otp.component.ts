import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router,RouterModule } from '@angular/router';
import { DataService } from '../data.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [RouterModule, FormsModule, HttpClientModule],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.scss',
  providers: [DataService]

})
export class OtpComponent {
  email: string ='';
  otp:string = '';
  constructor(private router: Router, private route: ActivatedRoute, private dataService: DataService) {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
    });
  }
  verifyOtp(){
    this.dataService.verifyOtp(this.email, this.otp).subscribe(
      (res) =>{
        this.router.navigate(['/login']);
      },
      err => console.error(err)
    );
  }

}
