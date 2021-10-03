import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import{FileUploaderComponent}from './file-uploader/file-uploader.component'
import{LoginComponent} from './login/login.component'

const routes: Routes = [{
  path: "upload",
  component: FileUploaderComponent
},
{
  path: "login",
  component: LoginComponent
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
