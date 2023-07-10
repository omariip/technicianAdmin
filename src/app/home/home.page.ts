import { Component } from '@angular/core';
import { collection, doc, Firestore, setDoc } from '@angular/fire/firestore';
import { deleteDoc, getDocs, query } from '@firebase/firestore';
import 'src/assets/smtp.js';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  technicians = [];
  constructor(
    private firestore: Firestore,
    private alertController: AlertController,
    private router: Router
  ) { }

  ngOnInit() {
    this.getTech();
  }

  async getTech() {
    this.technicians = []
    const q = await query(collection(this.firestore, "technicianPending"));
    const querySnapshot = await getDocs(q);
    await querySnapshot.forEach((doc) => {
      this.technicians.push(doc.data());
    });

    console.log(this.technicians);
  }

  async approve(i) {
    await deleteDoc(doc(this.firestore, "technicianPending", this.technicians[i].technicianId));
    await setDoc(doc(this.firestore, "technician", this.technicians[i].technicianId), this.technicians[i]);


    await Email.send({
      Host: "smtp.elasticemail.com",
      Username: "mobichanicapp@gmail.com",
      Password: "BA394CAFAD08FDB94BC7C701B8C0ABB8C8C7",
      To: 'aboushaar.omar@gmail.com',
      From: 'mobichanicapp@gmail.com',
      Subject: 'Mobichanic Technician Approved!',
      Body: `Congrats ${this.technicians[i].technicianName}! You have been approved to become a technician in Mobichanic. Now you can login to the app and start receiving requests!`

    })

    this.technicians.splice(i, 1);
  }

  async reject(i) {
    await deleteDoc(doc(this.firestore, "technicianPending", this.technicians[i].technicianId));
    await setDoc(doc(this.firestore, "technicianRejected", this.technicians[i].technicianId), this.technicians[i]);


    await Email.send({
      Host: "smtp.elasticemail.com",
      Username: "mobichanicapp@gmail.com",
      Password: "BA394CAFAD08FDB94BC7C701B8C0ABB8C8C7",
      To: 'aboushaar.omar@gmail.com',
      From: 'mobichanicapp@gmail.com',
      Subject: 'Mobichanic Technician Rejected',
      Body: `We are sorry to inform you ${this.technicians[i].technicianName} that you've been rejected for Mobichanic App! Please contact us on mobichanicapp@gmail.com for more details.`
    }).catch(e => {
      console.log(e)
      console.log("adsadasd")
    })

    this.technicians.splice(i, 1);
  }

  async refresh(event) {
    await this.getTech()
    await event.target.complete();
  }

  goToRejected() {
    this.router.navigateByUrl('/rejected');
  }

  async alertApprove(i) {
    const alert = await this.alertController.create({
      header: "Are you sure you want to approve this technician?",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Yes',
          role: 'confirm',
          handler: () => {
            this.approve(i);
          },
        },
      ],
    });

    await alert.present();
  }

  async alertReject(i) {
    const alert = await this.alertController.create({
      header: "Are you sure you want to reject this technician?",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Yes',
          role: 'confirm',
          handler: () => {
            this.reject(i);
          },
        },
      ],
    });

    await alert.present();
  }
}
