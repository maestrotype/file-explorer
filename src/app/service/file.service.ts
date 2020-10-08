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

  // private _dataChange: Subject<FileElement> = new Subject<FileElement>();
  // private _dbPromise;

  constructor() {
  }

  // connectToIDB() {
  //   this._dbPromise = idb.open('pwa-database', 1, UpgradeDB => {
  //     if (!UpgradeDB.objectStoreNames.contains('Items')) {
  //       UpgradeDB.createObjectStore('Items', {keyPath: 'id', autoIncrement: true});
  //     }
  //     if (!UpgradeDB.objectStoreNames.contains('Sync-Items')) {
  //       UpgradeDB.createObjectStore('Sync-Items', {keyPath: 'id', autoIncrement: true});
  //     }
  //   });
  // }

  add(fileElement: FileElement) {
    // this._dbPromise.then((db: any) => {
    //   const tx = db.transaction(target, 'readwrite');
    //   tx.objectStore(target).put({
    //   time: value.time,
    //   subject: value.subject,
    //   location: value.location,
    //   description: value.description
    // });
    // this.getAllData('Items').then((items: FileElement) => {
    //   this._dataChange.next(items);
    // });
    //   return tx.complete;
    // });
  
    fileElement.id = v4()
    this.map.set(fileElement.id, this.clone(fileElement))
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
}