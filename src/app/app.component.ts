import { Component } from '@angular/core';
import { FileElement } from './file-explorer/model/file-element';
import { Observable } from 'rxjs';
import { FileService } from './service/file.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  fileElements: Observable<FileElement[]>;
  currentRoot: FileElement;
  currentPath: string;
  canNavigateUp = false;

  
  constructor(public fileService: FileService) { }

  ngOnInit() {
    const folderA = this.fileService.add({ name: 'Folder A', isFolder: true, content: '', parent: 'root' });
    const folderB = this.fileService.add({ name: 'Folder B', isFolder: true, content: '', parent: 'root' });
    // this.fileService.add({ name: 'Folder B', isFolder: true, parent: 'root' });
    this.fileService.add({ name: 'Folder C', isFolder: true, content: '', parent: folderA.id });
    this.fileService.add({ name: 'File A', isFolder: false, content: 'sdsdsd', parent: 'root' });
    this.fileService.add({ name: 'File B', isFolder: false, content: 'dsds', parent: 'root' });
    this.fileService.add({ name: 'File C', isFolder: false, content: 'sdsdsds', parent: folderB.id });
    this.updateFileElementQuery();
  }

  addFile(file: { name: string }) {
    this.fileService.add({ isFolder: false, name: file.name, content: 'addFile', parent: this.currentRoot ? this.currentRoot.id : 'root' });
    this.updateFileElementQuery();
  }

  addFolder(folder: { name: string }) {
    this.fileService.add({ isFolder: true, name: folder.name, content: '', parent: this.currentRoot ? this.currentRoot.id : 'root' });
    this.updateFileElementQuery();
  }

  removeElement(element: FileElement) {
    this.fileService.delete(element.id);
    this.updateFileElementQuery();
  }

  moveElement(event: { element: FileElement; moveTo: FileElement }) {
    this.fileService.update(event.element.id, { parent: event.moveTo.id });
    this.updateFileElementQuery();
  }

  updateFileElementQuery() {
    this.fileElements = this.fileService.queryInFolder(this.currentRoot ? this.currentRoot.id : 'root');
  }

  renameElement(element: FileElement) {
    this.fileService.update(element.id, { name: element.name });
    this.updateFileElementQuery();
  }

  navigateUp() {
    if (this.currentRoot && this.currentRoot.parent === 'root') {
      this.currentRoot = null;
      this.canNavigateUp = false;
      this.updateFileElementQuery();
    } else {
      this.currentRoot = this.fileService.get(this.currentRoot.parent);
      this.updateFileElementQuery();
    }
    this.currentPath = this.popFromPath(this.currentPath);
  }

  navigateToFolder(element: FileElement) {
    this.currentRoot = element;
    this.updateFileElementQuery();
    this.currentPath = this.pushToPath(this.currentPath, element.name);
    this.canNavigateUp = true;
  }

  pushToPath(path: string, folderName: string) {
    let p = path ? path : '';
    p += `${folderName}/`;
    return p;
  }

  popFromPath(path: string) {
    let p = path ? path : '';
    let split = p.split('/');
    split.splice(split.length - 2, 1);
    p = split.join('/');
    return p;
  }
}
