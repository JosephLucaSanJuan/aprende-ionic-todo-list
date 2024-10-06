import { Injectable } from '@angular/core';
import { Task } from '../model/task';
//import { Plugins } from '@capacitor/core';
//import { Storage } from '@capacitor/storage';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  tasks: Task[] = [];
  taskCounter: number = 0;

  constructor() { 
    /**this.tasks = [
      {
        id: 0,
        title: 'Ordena el escritorio',
        description: 'Sacarlo todo, limpiar y tirar lo que no sirve.'
      },
      {
        id: 1,
        title: 'Hacer la colada',
        description: 'Separar la ropa blanca de la ropa de color.'
      }
    ]**/
    this.getTasksFromPreferences().then(
      data => this.tasks = data
    );
    this.getTaskCounterFromPreferences().then(
      data => this.taskCounter = data
    );
  }

  public getTasks():Task[] {
    return this.tasks;
  }

  public async getTasksFromPreferences(): Promise<Task[]> {
    const ret = await Preferences.get({ key: 'tasks' });
    if (ret.value != null) {
      return JSON.parse(ret.value) ? JSON.parse(ret.value):[]
    } else {
      return [];
    };
  }

  public async getTaskCounterFromPreferences(): Promise<number> {
    const { value } = await Preferences.get({ key: 'taskCounter' });
    return value ? +value : 0;
  }

  public getTask(id:number):Task {
    return { ...this.tasks.filter(t => t.id === id)[0] };
  }

  public async saveTask(t:Task){
    if (t.id == undefined) { //tarea nueva
      t.id = this.taskCounter++;
      this.tasks.push(t);
    } else { //edición de una tarea existente
      this.tasks = this.tasks.filter(ta => ta.id != t.id);//this.deleteTask(t.id);
      this.tasks.push(t);
    }

    await this.saveTasks(this.tasks);
    await this.saveTaskCounter(this.taskCounter);
  }

  public async saveTasks(tasks:Task[]){
    await Preferences.set({
      key: 'tasks',
      value: JSON.stringify(tasks)
    });
  }

  public async saveTaskCounter(tc:number){
    await Preferences.set({
      key: 'taskCounter',
      value: '' + tc
    })
  }

  public async deleteTask(id: number){
    this.tasks = this.tasks.filter(t => t.id != id);
    await this.saveTasks(this.tasks);
  }
}
