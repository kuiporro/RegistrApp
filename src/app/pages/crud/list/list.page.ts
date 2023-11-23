import { Component, OnInit } from '@angular/core';
import { User, UserCrudService } from '../../../services/user-crud.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {

  data:any;
  Users: any = [];

  constructor(
    private auth: AuthService,
    private activeRoute: ActivatedRoute,
    private userCrudService: UserCrudService,
    private router: Router
  ) {
    this.activeRoute.queryParams.subscribe(paramas => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.data = this.router.getCurrentNavigation().extras.state.user;
      }
    });
  }

  ngOnInit() {
    this.auth.validate(this.data);
  }

  ionViewDidEnter() {
    this.userCrudService.getUsers().subscribe((response) => {
      this.Users = response;
    })
  }

  dataToEdit(id){
    let navigationExtras: NavigationExtras = {
      state: {
        user: this.data
      }
    };
    this.router.navigate(['update/'+id], navigationExtras)
  }

  dataToPageHome() {
    let navigationExtras: NavigationExtras = {
      state: {
        user: this.data
      }
    };
    this.router.navigate(['home'], navigationExtras)
  }

  removeUser(user) {
    if (window.confirm('Estas seguro?')) {
      this.userCrudService.deleteUser(user.id)
      .subscribe(() => {
          this.ionViewDidEnter();
          console.log('Usuario borrado!')
        }
      )
    }
  }

}
