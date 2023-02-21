import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog';
import Dexie, { liveQuery, Observable } from 'dexie';
import { first } from 'rxjs';
import { todoDB } from 'src/app/database/todoDB';
import { Board } from 'src/app/interfaces/board';
import { Task } from 'src/app/interfaces/task';
import { SeeDelDialogComponent } from '../see-del-dialog/see-del-dialog.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})

export class BoardComponent implements OnInit {
  todoForm: FormGroup;
  boardForm: FormGroup;
  tasks: Task[] = []
  inprogress: Task[] = [];
  done: Task[] = [];
  deletes: Task[] = [];
  temp: Task[] = [];
  tempBoard: Board[] = [];
  updatedIndex: any;
  isEdit: boolean = false;
  defaultDb: todoDB = new todoDB("default");
  defaultToDo$: Observable<Task[]>;
  informationDb: any[];
  currentBoard: Board = {
    name: '',
    isActive: false,
    isCurrent: false
  }
  boards: Board[] = [];
  boardColumns: string[] = ['name'];

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog) { }

  async ngOnInit(): Promise<void> {
    //this.allLocalData();
    
    this.todoForm = this.formBuilder.group({
      item: ['', Validators.required]
    });

    this.boardForm = this.formBuilder.group({
      name: ['', Validators.required]
    })

  
  

    this.tempBoard = await this.defaultDb.boardlist.toArray();
    this.boards = this.tempBoard.filter(x => x.isActive == true);


    if (this.boards.length > 0) {
      this.currentBoard = this.boards.find(x => x.isCurrent == true && x.isActive == true);
    }

    this.temp = await this.defaultDb.deletedList.toArray();
    this.deletes = this.temp.filter(x => x.boardName == this.currentBoard.name);

    this.temp = await this.defaultDb.todoList.toArray();
    this.tasks = this.temp.filter(x => x.boardName == this.currentBoard.name);

    this.temp = await this.defaultDb.progressList.toArray();
    this.inprogress = this.temp.filter(x => x.boardName == this.currentBoard.name);

    this.temp = await this.defaultDb.doneList.toArray();
    this.done = this.temp.filter(x => x.boardName == this.currentBoard.name);

  }

  async jsonMethod(){    
    console.log(
      JSON.stringify(await this.defaultDb.todoList.toArray()) + '\n' +  JSON.stringify(await this.defaultDb.progressList.toArray()) + '\n' +  
      JSON.stringify(await this.defaultDb.doneList.toArray()) + '\n' +  JSON.stringify(await this.defaultDb.deletedList.toArray()) + '\n' +  
      JSON.stringify(await this.defaultDb.boardlist.toArray()));
  }

  addBoard() {
    let temp: string[] = [];
    this.boards.forEach(element => {
      temp.push(element.name);
    });

    if (temp.includes(this.boardForm.value.name) == false) {
      if (this.boards.length > 0) {
        this.defaultDb.boardlist.update(this.boards.find(x => x.isCurrent == true)?.id, {isCurrent: false });
      }
      this.currentBoard.isActive = true;
      this.defaultDb.boardlist.add({ name: this.boardForm.value.name, isActive: true, isCurrent: true });
      this.currentBoard.name = this.boardForm.value.name;
      this.ngOnInit();
    }
    else if (temp.includes(this.boardForm.value.name) == true) {
      alert("Please use another board name!");
    }

    this.currentBoard.name = this.boards.find(x => x.isCurrent == true)?.name;

  }

  async deleteBoard() {
    let temp: string[] = [];
   
    this.tasks.forEach(element => {
      this.defaultDb.deletedList.add(element);
      this.defaultDb.todoList.delete(element.id);
    });

    this.inprogress.forEach(element => {
      this.defaultDb.deletedList.add(element);
      this.defaultDb.progressList.delete(element.id);
    });

    this.done.forEach(element => {
      this.defaultDb.deletedList.add(element);
      this.defaultDb.doneList.delete(element.id);
    });

    this.defaultDb.boardlist.update(this.boards.find(x => x.isCurrent == true && x.isActive == true).id,{ isCurrent: false, isActive: false});
    this.defaultDb.boardlist.update(this.boards.find(x => x.isCurrent == false && x.isActive == true)?.id,{ isCurrent: true});


    // const clear = this.defaultDb.todoList.filter(x => x.boardName === this.currentBoard.name).first().then((response) => {
    //   this.defaultDb.deletedList.add({ description: response.description, boardName: response.boardName, done: response.done });
    //   this.defaultDb.todoList.delete(response?.id);
    // });

    // const clear1 = this.defaultDb.progressList.filter(x => x.boardName === this.currentBoard.name).first().then((response) => {
    //   this.defaultDb.deletedList.add({ description: response.description, boardName: response.boardName, done: response.done });
    //   this.defaultDb.progressList.delete(response?.id);
    // });

    // const clear2 = this.defaultDb.doneList.filter(x => x.boardName === this.currentBoard.name).first().then((response) => {
    //   this.defaultDb.deletedList.add({ description: response.description, boardName: response.boardName, done: response.done });
    //   this.defaultDb.doneList.delete(response?.id);
    // });

    // const clear3 = this.defaultDb.boardlist.filter(x => x.isCurrent === true).first().then((response) => {
    //   this.defaultDb.boardlist.update(response?.id, { name: response.name, isActive: false, isCurrent: false });
    // });

    // const clear4 = this.defaultDb.boardlist.filter(x => x.isActive === true).first().then(async (response) => {
    //   this.defaultDb.boardlist.update(response?.id, { name: response.name, isActive: response.isActive, isCurrent: true });

    //   this.boards = await this.defaultDb.boardlist.toArray();
    //   this.boards.forEach(element => {
    //     if (element.isActive == true) {
    //       temp.push(element.name);
    //     }
    //   });
    //   if (temp.length != 1) {
    //     console.log(this.boards.find(x => x.isActive == true));
    //     this.currentBoard = this.boards.find(x => x.isActive == true);
    //   }
    //   else{
    //     this.currentBoard = {
    //       name: '', isActive: false, isCurrent: false
    //     }
    //   }

    //   this.ngOnInit();
    // });
    this.ngOnInit();
  }


  async catch(row: Board) {
    //this.currentBoard.name = row.name;
    let tempBrd: Board = {
      name: '',
      isActive: false,
      isCurrent: false
    }
    if (this.boards.length > 1) {
      tempBrd = this.boards.find(x => x.isCurrent == true);
      this.defaultDb.boardlist.update(tempBrd?.id, { name: tempBrd.name, isActive: tempBrd.isActive, isCurrent: false });
      // const clear = this.defaultDb.boardlist.filter(x => x.isCurrent === true).first().then((response) => {
      //   this.defaultDb.boardlist.update(response?.id, { name: response.name, isActive: response.isActive, isCurrent: false });
      // })
    }
    // const clear = this.defaultDb.boardlist.filter(x => x.name === this.currentBoard.name).first().then((response) => {
    //   this.defaultDb.boardlist.update(response?.id, { name: response.name, isActive: response.isActive, isCurrent: true });
    // })
    tempBrd = this.boards.find(x => x.name == row.name);
    this.defaultDb.boardlist.update(tempBrd?.id, { name: tempBrd.name, isActive: tempBrd.isActive, isCurrent: true });

    this.ngOnInit();

  }



  async addTask() {
    this.defaultDb.todoList.add({
      description: this.todoForm.value.item,
      boardName: this.currentBoard.name,
      done: false
    });

    this.todoForm.reset();
    this.ngOnInit();
  }

  async deleteTask(typeTask: Task[], i: number, nameTask: any) {
    this.deletes.push(typeTask[i]);
    // const clear = this.defaultDb.todoList.filter(x => x == typeTask[i]).first().then((response) => {
    //   this.defaultDb.todoList.delete(response?.id);

    this.deleteMethod(nameTask, typeTask[i]);

    if (nameTask == 'doneList') {
      this.defaultDb.deletedList.add({ description: typeTask[i].description, boardName: typeTask[i].boardName, done: true });
    }
    else {
      this.defaultDb.deletedList.add({ description: typeTask[i].description, boardName: typeTask[i].boardName, done: typeTask[i].done });
    }

    //this.callNgOnitFilter();
    this.ngOnInit();
  }


  editTask(item: Task, i: number) {
    this.todoForm.controls['item'].setValue(item.description);
    this.updatedIndex = i;
    this.isEdit = true;

  }

  updateTask() {
    const clear = this.defaultDb.todoList.filter(x => x.description === this.tasks[this.updatedIndex].description).first().then((response) => {
      this.defaultDb.todoList.update(response?.id, { description: this.todoForm.value.item, done: false });
      this.todoForm.reset();
      this.updatedIndex = undefined;
      this.isEdit = false;
      //this.callNgOnitFilter();
      this.ngOnInit();
    });
    // this.tasks[this.updatedIndex].description = this.todoForm.value.item;
    // this.tasks[this.updatedIndex].done = false;
    // this.todoForm.reset();
    // this.updatedIndex = undefined;
    // this.isEdit = false;
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {

      this.deleteMethod(event.previousContainer.id, event.previousContainer.data[event.previousIndex]);
      if (event.previousContainer.id == 'doneList') {
        event.previousContainer.data[event.previousIndex].done = false;
      }
      this.carrymethod(event.container.id, event.previousContainer.data[event.previousIndex]);
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  deleteMethod(inputString: string, taskObj: Task) {
    if (inputString == 'todoList') {
      const clear = this.defaultDb.todoList.filter(x => x.description == taskObj.description).first().then((response) => {
        this.defaultDb.todoList.delete(response?.id);
        //this.defaultDb.deletedList.add({description: response.description, done: response.done});
      });
    }
    else if (inputString == 'progressList') {
      const clear = this.defaultDb.progressList.filter(x => x.description == taskObj.description).first().then((response) => {
        this.defaultDb.progressList.delete(response?.id);
        //this.defaultDb.deletedList.add({description: response.description, done: response.done});
      });
    }
    else if (inputString == 'doneList') {
      const clear = this.defaultDb.doneList.filter(x => x.description == taskObj.description).first().then((response) => {
        this.defaultDb.doneList.delete(response?.id);
        //this.defaultDb.deletedList.add({description: response.description, done: response.done});
      });
    }

  }

  carrymethod(inputString: string, taskObj: Task) {
    if (inputString == 'todoList') {
      this.defaultDb.todoList.add({ description: taskObj.description, boardName: taskObj.boardName, done: taskObj.done });
    }
    else if (inputString == 'progressList') {
      this.defaultDb.progressList.add({ description: taskObj.description, boardName: taskObj.boardName, done: taskObj.done });
    }
    else if (inputString == 'doneList') {
      this.defaultDb.doneList.add({ description: taskObj.description, boardName: taskObj.boardName, done: true });
    }
  }

  async openDialog() {
    if(this.deletes.length > 0){
      this.dialog.open(SeeDelDialogComponent, {
        height: 'fit',
        width: '500px',
        data: this.deletes
      });
    }
    
  }

  async seeDeleted() {
    this.deletes = await this.defaultDb.deletedList.toArray();
  }

  // callNgOnitFilter(){
  //   this.ngOnInit().then(names => {
  //     this.tasks = this.tasks.filter(x => x.boardName ==    this.currentBoard.name);
  //     this.inprogress =  this.inprogress.filter(x => x.boardName ==    this.currentBoard.name);
  //     this.done =  this.done.filter(x => x.boardName ==    this.currentBoard.name);
  //     this.deletes =  this.deletes.filter(x => x.boardName ==    this.currentBoard.name);
  //   })
  // }

  allLocalData() {
    if (this.informationDb.length == 0) {
      Dexie.getDatabaseNames()
        .then(names => {
          names.forEach(name => {
            this.informationDb.push(name);
          });
        });
    }
  }

}
