import { Component } from '@angular/core';
import { TasksService } from '../services/tasks.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Task } from '../model/task';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    public taskService: TasksService,
    private router: Router,
    private alertController: AlertController
  ) {}

  goEditTask(id?: number|undefined){
    //if (id != null) {
      this.router.navigateByUrl(`/edit${id != undefined ? '/' + id : ''}`);
    //}
  }

  deleteTask(id:number){
    this.taskService.deleteTask(id);
  }

  async presentAlertConfirm(t:Task){
    //if(t && t.id){
      console.log('alerta');
      const alert = await this.alertController.create({
        header: 'Borrar tarea',
        message: `¿Estás seguro que quieres borrar la tarea <strong> ${t.title}</strong>?`,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
          }, {
            text: 'Aceptar',
            handler: () => {
              if(t && t.id)
                this.deleteTask(t.id);
            }
          }
        ]
      })
      await alert.present();

    //}
    /**else{
      throw("La tarea no está definida");
    }**/
    
  }

}
