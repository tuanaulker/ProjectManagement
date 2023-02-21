import Dexie, { Table } from "dexie";
import { Board } from "../interfaces/board";
import { Task } from "../interfaces/task";

//todoList  [cdkDropListConnectedTo]="['progressList','doneList']
export class todoDB extends Dexie {
    todoList: Table<Task, number>;
    progressList: Table<Task, number>;
    doneList: Table<Task, number>;
    deletedList: Table<Task, number>;
    boardlist: Table<Board, number>;

    constructor(name: string) {
      super(name);
      this.version(2.1).stores({
        todoList: '++id, description, boardName, done',
        progressList: '++id, description, boardName, done',
        doneList: '++id, description, boardName, done',
        deletedList: '++id, description, boardName, done',
        boardlist: '++id, name, isActive'
      });
    }
}