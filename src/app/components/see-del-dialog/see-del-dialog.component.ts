import { DataSource } from '@angular/cdk/collections';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task } from 'src/app/interfaces/task';

@Component({
  selector: 'app-see-del-dialog',
  templateUrl: './see-del-dialog.component.html',
  styleUrls: ['./see-del-dialog.component.scss']
})
export class SeeDelDialogComponent {

 
  constructor(@Inject(MAT_DIALOG_DATA) public data: Task[]) {
    
  }
  displayedColumns: string[] = ["description", "isDone"];


  
  
}
