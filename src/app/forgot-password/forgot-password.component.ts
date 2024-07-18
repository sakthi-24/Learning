import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, HttpClientModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  providers:[DataService]
})
export class ForgotPasswordComponent {
  email: string ='';
  password: string ='';
  confirmPassword: string ='';

  constructor(private router: Router, private dataService: DataService) {}
  changePassword(){
    if(this.password === this.confirmPassword){
    this.dataService.changePassword(this.email, this.password).subscribe(
      (res) =>{
        this.router.navigate(['/login']);
      },
      err => console.error(err)
    );
    }
  }
}
