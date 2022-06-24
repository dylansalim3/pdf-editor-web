import {Component, OnDestroy, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {PdfRotateState} from '../../state/pdf-rotate.state';
import {Observable, Subscription} from 'rxjs';
import {PagesLoadedEvent} from 'ngx-extended-pdf-viewer';
import {degrees, PDFDocument, PDFPage, RGB, rgb, StandardFonts} from "pdf-lib";
import {ClearState, RedoBlobFileChanges, StoreBlobFile, UndoBlobFileChanges} from "../../actions/pdf-rotate.actions";
import {NzModalService} from "ng-zorro-antd";
import {Router} from "@angular/router";

@Component({
    selector: 'app-pdf-rotate-editor',
    templateUrl: './pdf-rotate-editor.component.html',
    styleUrls: ['./pdf-rotate-editor.component.less']
})
export class PdfRotateEditorComponent implements OnInit, OnDestroy {

    src: any;
    col = 8;
    id = -1;
    startPage = 1;
    endPage = 2;
    maxPage = 0;
    currentPage = 1;
    isCustomRotatePage: boolean = false;
    predefinedStyleSelectionIndex: number = 0;
    loading: boolean = false;

    removeStartPage: number = 1;
    removeEndPage: number = 1;
    isDeleteOnePage: boolean = false;

    watermarkText: string = "";
    colorCode = '#eeeeee';

    pdfDocs: PDFDocument;
    pdfPages: PDFPage[];

    blobFileSubscription: Subscription;


    @Select(PdfRotateState.getBlobFile) blobFile$: Observable<any>;

    constructor(private store: Store, private modalService: NzModalService,private router:Router) {
    }

    ngOnInit(): void {
        this.blobFileSubscription = this.blobFile$.subscribe(file => {
            this.loading = false;
            this.src = file;

            PDFDocument.load(file, {ignoreEncryption: true}).then(pdfDocs => {
                this.pdfDocs = pdfDocs;
                console.log(pdfDocs);
                this.pdfPages = pdfDocs.getPages();
                console.log(pdfDocs.getPages());
                if(pdfDocs.isEncrypted){
                    this.showConfirmModal("The file is encrypted. Please choose a file that is not encrypted.");
                    this.router.navigateByUrl("/pdf-rotate");
                }
            }).catch(err => {
                console.log(err);
            });


        });
    }


    onPageLoaded({pagesCount}: PagesLoadedEvent) {
        this.maxPage = pagesCount;
    }

    onCurrentPageChanged(pageNum: number) {
        if (!this.isCustomRotatePage) {
            this.currentPage = pageNum;
        }
    }

    onRotateLeft() {
        const rotationDegree = -90;
        this.rotatePDF(rotationDegree);
    }

    onRotateRight() {
        const rotationDegree = 90;
        this.rotatePDF(rotationDegree);
    }

    private rotatePDF(rotationDegree: number): void {
        const currentPDFPage = this.pdfPages[this.currentPage - 1];
        this.loading = true;
        const currentRotation = currentPDFPage.getRotation().angle;
        currentPDFPage.setRotation(degrees(currentRotation + rotationDegree));
        this.refreshPDF();
    }

    private refreshPDF() {
        this.pdfDocs.saveAsBase64({dataUri: true}).then(pdfUint8Array => {
            this.store.dispatch(new StoreBlobFile(pdfUint8Array));
        });
    }

    async onMovePages() {
        const [copiedPage] = await this.pdfDocs.copyPages(this.pdfDocs, [this.startPage - 1]);
        this.loading = true;
        this.pdfDocs.removePage(this.startPage - 1);
        this.pdfDocs.insertPage(this.endPage - 1, copiedPage);
        this.refreshPDF();
    }

    async onAddWatermark(text: string, colorCode: string, predefinedStyleSelectionIndex: number) {
        if (text.length <= 0) {
            this.showConfirmModal("Watermark text is empty");
        } else {
            const RGBValue = this.convertHexColorCodeToRGB(colorCode);
            const {width, height} = this.pdfPages[0].getSize();
            const watermarkStyle = await this.getPredefinedWatermarkStyle(predefinedStyleSelectionIndex, text.length, width, height, RGBValue);
            this.pdfPages.forEach(pdfPage => {
                pdfPage.drawText(text, watermarkStyle);
            });
            this.refreshPDF();
        }
    }

    onRemovePage(startPage: number, endPage: number) {
        let pagesToKeep = [];
        if (endPage == startPage || endPage == null) {
            pagesToKeep.push(startPage - 1);
        } else {
            for (let i = startPage; i < endPage; i++) {
                pagesToKeep.push(startPage - 1);
            }
        }
        for(let i = 0; i < this.maxPage; i++){
            if(!pagesToKeep.includes(i)){
                this.pdfDocs.removePage(i);
            }
        }
        this.refreshPDF();
    }

    onUndoChanges() {
        this.store.dispatch(new UndoBlobFileChanges());
    }

    onRedoChanges(){
        this.store.dispatch(new RedoBlobFileChanges());
    }

    onSavePDF() {
        const linkSource = this.src;
        const downloadLink = document.createElement("a");
        const fileName = "pdf-editor.pdf";

        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
    }

    private async getPredefinedWatermarkStyle(index: number, textLength: number, pageWidth: number, pageHeight: number, colorRGB: RGB) {
        let rotate = degrees(0);
        let x = pageWidth / 2 - (textLength * 7);
        let y = pageHeight / 2 - (textLength * 7);
        const helveticaFont = await this.pdfDocs.embedFont(StandardFonts.Helvetica);
        switch (index) {
            case 1:
                rotate = degrees(45);
                break;
            case 2:
                rotate = degrees(-45);
                break;
            case 3:
                rotate = degrees(0);
                y = pageHeight / 2;
                break;
        }
        return {
            x,
            y,
            size: 50,
            font: helveticaFont,
            color: colorRGB,
            rotate: rotate,
        };
    }

    private convertHexColorCodeToRGB(hexColor: string) {
        const [x, y, z] = hexColor.match(/[A-Za-z0-9]{2}/g).map(function (v) {
            return parseInt(v, 16) / 255
        });
        return rgb(x, y, z);
    }

    private showConfirmModal(text: string) {
        this.modalService.confirm({
            nzTitle: 'Error',
            nzContent: text,
            nzOkText: 'OK',
            nzCancelText: null,
            nzIconType: "warning",
        })
    }

    ngOnDestroy(): void {
        this.blobFileSubscription.unsubscribe();
        this.store.dispatch(new ClearState());
    }


}
