import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { SubjectCrudService } from 'src/app/services/subject-crud.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.page.html',
  styleUrls: ['./update.page.scss'],
})
export class UpdatePage implements OnInit {

  data: any;
  updateSubjectFgRaw: FormGroup;
  subjectForm: FormGroup;
  Subjects: any = [];
  numberCollection:any;
  daysNumber:any;
  id: any;

  constructor(
    private auth: AuthService,
    private activeRoute: ActivatedRoute,
    private subjectCrudService: SubjectCrudService,
    private activatedRoute: ActivatedRoute,
    public formBuilder: FormBuilder,
    private router: Router,
    private zone: NgZone,
    private toastController: ToastController,
  ) { 
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.activeRoute.queryParams.subscribe(paramas => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.data = this.router.getCurrentNavigation().extras.state.subject;
      }
    });
    this.subjectForm = this.formBuilder.group({
      name: [''],
      code: [''],
      teachersId: [''],
      teachersName: [''],
      days: [''],
    })
  }

  genForm(){
    if(!this.updateSubjectFgRaw.valid){
      console.log('Debe rellenar los campos');
      return false;
    }
    else{
      let dayNumber = this.updateSubjectFgRaw.value['dayNumber'];
      this.daysNumber = dayNumber;
      this.numberCollection = Array(dayNumber).fill(1).map((x,i)=>i);
      console.log(this.numberCollection);
    }
  }

  onSubmit(){
    if(!this.updateSubjectFgRaw.valid){
      console.log('Debe rellenar los campos');
      return false;
    }
    else{
      let dayNumber = this.updateSubjectFgRaw.value['dayNumber'];
      let name = this.updateSubjectFgRaw.value['name'];
      let code = this.updateSubjectFgRaw.value['code'];
      let teachersName = this.data.name + " " + this.data.suname;
      let teachersId = this.data.id;
      let weekDay1 = this.updateSubjectFgRaw.value['weekDay1']
      let weekDay2 = this.updateSubjectFgRaw.value['weekDay2']
      let weekDay3 = this.updateSubjectFgRaw.value['weekDay3']
      let weekDay4 = this.updateSubjectFgRaw.value['weekDay4']
      let weekDay5 = this.updateSubjectFgRaw.value['weekDay5']
      let start1 = this.updateSubjectFgRaw.value['start1']
      let start2 = this.updateSubjectFgRaw.value['start2']
      let start3 = this.updateSubjectFgRaw.value['start3']
      let start4 = this.updateSubjectFgRaw.value['start4']
      let start5 = this.updateSubjectFgRaw.value['start5']
      let end1 = this.updateSubjectFgRaw.value['end1']
      let end2 = this.updateSubjectFgRaw.value['end2']
      let end3 = this.updateSubjectFgRaw.value['end3']
      let end4 = this.updateSubjectFgRaw.value['end4']
      let end5 = this.updateSubjectFgRaw.value['end5']
      let room1 = this.updateSubjectFgRaw.value['room1']
      let room2 = this.updateSubjectFgRaw.value['room2']
      let room3 = this.updateSubjectFgRaw.value['room3']
      let room4 = this.updateSubjectFgRaw.value['room4']
      let room5 = this.updateSubjectFgRaw.value['room5']
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
      this.subjectCrudService.updateSubject(this.id, this.subjectForm.value)
      .subscribe(() => {
        this.subjectForm.reset();
        this.dataToPage('/sublist');
      })
    }
  }

  dataToPage(path:string){
    let navigationExtras: NavigationExtras = {
      state: {
        subject: this.data
      }
    };
    this.router.navigate([path], navigationExtras)
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

  fetchSubject(id) {
    this.subjectCrudService.getSubject(id).subscribe((data) => {
      this.updateSubjectFgRaw.setValue({
        name: data['name'],
        code: data['code'],
        days: data['days'],
        dayNumber: data['days'].length,
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
      });
    });
  }

  ngOnInit() {
    this.auth.validate(this.data);
    this.fetchSubject(this.id);
    this.updateSubjectFgRaw = this.formBuilder.group({
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
  }

}
