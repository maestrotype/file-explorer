import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FileExplorerModule } from './file-explorer/file-explorer.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { FileService } from './service/file.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [BrowserModule, FileExplorerModule, FlexLayoutModule, MatCardModule], 
  providers: [FileService],
  bootstrap: [AppComponent]
})
export class AppModule { }
