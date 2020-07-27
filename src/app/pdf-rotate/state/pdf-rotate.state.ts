import {Injectable} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {StoreBlobFile} from '../actions/pdf-rotate.actions';


const PDF_ROTATE_DEFAULT = {
  pdfFile: null,
};

export interface PdfRotateModel {
  pdfFile: string;
}

@State<PdfRotateModel>({
  name: 'PDF_ROTATE',
  defaults: PDF_ROTATE_DEFAULT,
})

@Injectable()
export class PdfRotateState {

  @Selector()
  static getBlobFile(state: PdfRotateModel) {
    return state.pdfFile;
  }

  constructor() {
  }

  @Action(StoreBlobFile)
  storeBlobFile({getState, setState}: StateContext<PdfRotateModel>, action: StoreBlobFile) {
    const state = getState();
    setState({...state, pdfFile: action.payload});
  }

  // @Action(GetBlobFile)
  // getBlobFile({getState}: StateContext<PdfRotateModel>, action: GetBlobFile) {
  //   const state = getState();
  //   return state.pdfFile;
  // }
}
