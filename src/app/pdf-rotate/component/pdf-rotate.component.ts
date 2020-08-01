import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngxs/store';
import {StoreBlobFile} from '../actions/pdf-rotate.actions';
import {Observable} from 'rxjs';
import {NzUploadFile} from "ng-zorro-antd";

@Component({
    selector: 'app-pdf-rotate',
    templateUrl: './pdf-rotate.component.html',
    styleUrls: ['./pdf-rotate.component.css']
})
export class PdfRotateComponent implements OnInit {

    fileList: NzUploadFile[] = [];
    src;
    onUploadFile = (file: File)=>{
        this.fileList = [];
        const uploadFile:NzUploadFile = {uid:"-1",name:file.name,originFileObj:file,status:"done"};
        this.fileList = this.fileList.concat(uploadFile);
        return false;
    };

    private blobToBase64(blob: Blob): Observable<{}> {
        const fileReader = new FileReader();
        const observable = new Observable(observer => {
            fileReader.onloadend = () => {
                observer.next(fileReader.result);
                observer.complete();
            };
        });
        fileReader.readAsDataURL(blob);
        return observable;
    }


    constructor(private store: Store, private router: Router, private route: ActivatedRoute) {
    }

    ngOnInit(): void {
    }

    onSubmitClick() {
        this.blobToBase64(this.fileList[0].originFileObj).subscribe(base64File => {
            this.src = base64File;
            this.store.dispatch(new StoreBlobFile(this.src));
            this.router.navigateByUrl('/pdf-rotate/editor', {relativeTo: this.route});
        });
    }

    onCancelClick() {
        console.log('cancel button clicked');
    }

}
