import { Injectable } from '@angular/core'
// import idb from 'idb';
import { v4 } from 'uuid'
import { FileElement } from '../file-explorer/model/file-element'
import { Observable, Subject, interval, BehaviorSubject } from 'rxjs'

export interface IFileService {
  add(fileElement: FileElement)
  delete(id: string)
  update(id: string, update: Partial<FileElement>)
  queryInFolder(folderId: string): Observable<FileElement[]>
  get(id: string): FileElement
}

@Injectable()
export class FileService implements IFileService {
  private map = new Map<string, FileElement>()

  storage: Storage;
  changes$ = new Subject();

  constructor() {
    this.storage = window.localStorage;
    console.log("localStorage", this.storage);    
  }

  add(fileElement: FileElement) {
    console.log("fileElement", fileElement)
    
    fileElement.id = v4()
    this.map.set(fileElement.id, this.clone(fileElement))
    this.setItem(fileElement.id, JSON.stringify(fileElement))
    this.getItem(fileElement.id)
    console.log("localStorage2", this.storage)
    return fileElement
  }

  delete(id: string) {
    this.map.delete(id)
  }

  update(id: string, update: Partial<FileElement>) {
    let element = this.map.get(id)
    element = Object.assign(element, update)
    this.map.set(element.id, element)
  }

  private querySubject: BehaviorSubject<FileElement[]>
  queryInFolder(folderId: string) {
    const result: FileElement[] = []
    this.map.forEach(element => {
      if (element.parent === folderId) {
        result.push(this.clone(element))
      }
    })
    if (!this.querySubject) {
      this.querySubject = new BehaviorSubject(result)
    } else {
      this.querySubject.next(result)
    }
    return this.querySubject.asObservable()
  }

  get(id: string) {
    return this.map.get(id)
  }

  clone(element: FileElement) {
    return JSON.parse(JSON.stringify(element))
  }

  getItem(key: string): string | null {
    return this.storage.getItem(key);
  }

  setItem(key: string, value: string): void {
    this.storage.setItem(key, value);
  }
}