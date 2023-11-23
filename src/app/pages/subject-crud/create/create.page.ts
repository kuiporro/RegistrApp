import { Component, NgZone, OnInit } from '@angular/core';
import { FormGroup, FormBuilder} from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { SubjectCrudService } from 'src/app/services/subject-crud.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {

  subjectFormRaw: FormGroup;
  subjectForm: FormGroup;
  data: any;
  daysNumber: 0;
  numberCollection: Array<any>;

  constructor(private formBuilder: FormBuilder,
              private activeRoute: ActivatedRoute,
              private router: Router,
              private auth: AuthService,
              private zone: NgZone,
              private subjectCrudService: SubjectCrudService,
              private toastController: ToastController, 
    ) {
    this.subjectFormRaw = this.formBuilder.group({
      name: [''],
      code: [''],
      teachersName: [''],
      weekDay1: [''],
      weekDay2: [''],
      weekDay3: [''],
      weekDay4: [''],
      weekDay5: [''],
      start1: [''],
      start2: [''],
      start3: [''],
      start4: [''],
      start5: [''],
      end1: [''],
      end2: [''],
      end3: [''],
      end4: [''],
      end5: [''],
      room1: [''],
      room2: [''],
      room3: [''],
      room4: [''],
      room5: [''],
      dayNumber: [''],
      days: [''],
    })
    this.subjectForm = this.formBuilder.group({
      name: [''],
      code: [''],
      teachersId: [''],
      teachersName: [''],
      days: [''],
    })
    this.activeRoute.queryParams.subscribe(paramas => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.data = this.router.getCurrentNavigation().extras.state.user;
      }
    });
   }

  ngOnInit() {
    this.auth.validate(this.data);
  }

  async presentToast(position: 'top' | 'middle' | 'bottom', message, icon){
    const toast = await this.toastController.create({
      message,
      duration: 1500,
      position,
      icon,
    });

    await toast.present();
  }

  genQR(){
    console.log("generar qr")
  }

  genForm(){
    if(!this.subjectFormRaw.valid){
      console.log('Debe rellenar los campos');
      return false;
    }
    else{
      let dayNumber = this.subjectFormRaw.value['dayNumber'];
      this.daysNumber = dayNumber;
      this.numberCollection = Array(dayNumber).fill(1).map((x,i)=>i);
      console.log(this.numberCollection);
    }
  }

  dataToPage(path: string) {
    let navigationExtras: NavigationExtras = {
      state: {
        user: this.data
      }
    };
    this.router.navigate([path], navigationExtras)
  }

  onSubmit(){
    if(!this.subjectFormRaw.valid){
      console.log('Debe rellenar los campos');
      return false;
    }
    else{
      let dayNumber = this.subjectFormRaw.value['dayNumber'];
      let name = this.subjectFormRaw.value['name'];
      let code = this.subjectFormRaw.value['code'];
      let teachersName = this.data.name + " " + this.data.suname;
      let teachersId = this.data.id;
      let weekDay1 = this.subjectFormRaw.value['weekDay1']
      let weekDay2 = this.subjectFormRaw.value['weekDay2']
      let weekDay3 = this.subjectFormRaw.value['weekDay3']
      let weekDay4 = this.subjectFormRaw.value['weekDay4']
      let weekDay5 = this.subjectFormRaw.value['weekDay5']
      let start1 = this.subjectFormRaw.value['start1']
      let start2 = this.subjectFormRaw.value['start2']
      let start3 = this.subjectFormRaw.value['start3']
      let start4 = this.subjectFormRaw.value['start4']
      let start5 = this.subjectFormRaw.value['start5']
      let end1 = this.subjectFormRaw.value['end1']
      let end2 = this.subjectFormRaw.value['end2']
      let end3 = this.subjectFormRaw.value['end3']
      let end4 = this.subjectFormRaw.value['end4']
      let end5 = this.subjectFormRaw.value['end5']
      let room1 = this.subjectFormRaw.value['room1']
      let room2 = this.subjectFormRaw.value['room2']
      let room3 = this.subjectFormRaw.value['room3']
      let room4 = this.subjectFormRaw.value['room4']
      let room5 = this.subjectFormRaw.value['room5']
      let day1 = weekDay1+" "+start1+"-"+end1+" "+room1;
      let day2 = weekDay2+" "+start2+"-"+end2+" "+room2;
      let day3 = weekDay3+" "+start3+"-"+end3+" "+room3;
      let day4 = weekDay4+" "+start4+"-"+end4+" "+room4;
      let day5 = weekDay5+" "+start5+"-"+end5+" "+room5;
      let days = [day1];
      if (dayNumber == 2){
        days = [day1,day2];
      }
      else if (dayNumber == 3){
        days = [day1,day2,day3];
      }
      else if (dayNumber == 4){
        days = [day1,day2,day3,day4];
      }
      else if (dayNumber == 5){
        days = [day1,day2,day3,day4,day5];
      }
      this.subjectForm.value['name']=name;
      this.subjectForm.value['code']=code;
      this.subjectForm.value['teachersName']=teachersName;
      this.subjectForm.value['teachersId']=teachersId;
      this.subjectForm.value['days']=days;
      console.log(this.subjectForm.value)
      this.subjectCrudService.createSubject(this.subjectForm.value)
      .subscribe((response) => {
        this.zone.run(() => {
          this.subjectForm.reset();
          this.presentToast('bottom', 'Registrado correctamente', 'checkmark-circle-outline');
          this.router.navigate(['/sublist']);
        })
      })
    }
  }

}
