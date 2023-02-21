import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoardComponent } from './components';
import { TestComponent } from './components/test/test.component';

export const routes: Routes = [ {
  path: "",
  component: BoardComponent
},{
  path: "test",
  component: TestComponent
},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
