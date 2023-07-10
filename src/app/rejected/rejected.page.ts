import { Component, OnInit } from '@angular/core';
import { collection, deleteDoc, doc, Firestore, getDocs, query } from '@angular/fire/firestore';
import { setDoc } from '@firebase/firestore';
import { AlertController } from '@ionic/angular';
import 'src/assets/smtp.js';

@Component({
  selector: 'app-rejected',
  templateUrl: './rejected.page.html',
  styleUrls: ['./rejected.page.scss'],
})
export class RejectedPage implements OnInit {

  technicians = [];

  constructor(
    private firestore: Firestore,
    private alertController: AlertController
  ) {
    this.getTech()
  }

  ngOnInit() {

  }

  async getTech() {
    const q = query(collection(this.firestore, "technicianRejected"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      this.technicians.push(doc.data());
    });

    console.log(this.technicians);
  }

  async alertApprove(i) {
    const alert = await this.alertController.create({
      header: "Are you sure you want to re-approve this technician?",
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

  async approve(i) {
    await deleteDoc(doc(this.firestore, "technicianRejected", this.technicians[i].technicianId));
    await setDoc(doc(this.firestore, "technician", this.technicians[i].technicianId), this.technicians[i]);
    
    await Email.send({
      Host: "smtp.elasticemail.com",
      Username: "mobichanicapp@gmail.com",
      Password: "BA394CAFAD08FDB94BC7C701B8C0ABB8C8C7",
      To: 'aboushaar.omar@gmail.com',
      From: 'mobichanicapp@gmail.com',
      Subject: 'Mobichanic Technician Approved!',
      Body: `Congrats ${this.technicians[i].technicianName}! You have been re-approved to become a technician in Mobichanic. Now you can login to the app and start receiving requests!`

    })

    this.technicians.splice(i, 1);
  }
}
