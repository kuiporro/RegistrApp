import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavigationExtras, Router } from '@angular/router';
import { UserCrudService } from './user-crud.service';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  Users: any = [];
  USER;

  data:any;

  objt: any;

  constructor(
    private toastController: ToastController,
    private http:HttpClient,
    private userCrudService: UserCrudService,
    private router: Router) { }

    async presentToast(message, position: 'top' | 'middle' | 'bottom' , icon){
      const toast = await this.toastController.create({
        message,
        duration: 1500,
        position,
        icon: icon
      });
  
      await toast.present();
    }

    async auth(email, password){
      let valid = false;
      await this.userCrudService.getUsers().subscribe((response) => {
        this.Users = response
        let filtrado = this.Users.filter(obj => obj.email == email );
        
        if (filtrado.length != 0){
          if (filtrado[0].password == password){
            valid = true;
            this.presentToast('Credenciales correctas', 'bottom', 'checkmark-circle-outline');
            this.USER = filtrado[0].email;
            this.objt = {
              rut: (filtrado[0].rut),
              name: (filtrado[0].name),
              pass: (filtrado[0].password),
              suname:(filtrado[0].suname),
              username:(filtrado[0].username),
              email:(filtrado[0].email),
              isAdmin:(filtrado[0].isAdmin),
              id:(filtrado[0].id),
              teacher:(filtrado[0].teacher)
            }
            this.dataToPage(this.objt);
          }
          else{
            this.presentToast("Las credenciales no coinciden", "bottom", 'alert-circle-sharp')
          }
        }
      }
    );
    return valid;
  };

  dataToPage(data){
    let navigationExtras: NavigationExtras = {
      state: {
        user: data
      }
    };
    this.router.navigate(['home'], navigationExtras)
  }

  validate(data){
    if(data === undefined){
      this.router.navigate(['signin']);
    }
    else{
      return false;
    }
  }
}
