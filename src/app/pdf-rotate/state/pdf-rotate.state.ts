import {Injectable} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {ClearState, RedoBlobFileChanges, StoreBlobFile, UndoBlobFileChanges} from '../actions/pdf-rotate.actions';


const PDF_ROTATE_DEFAULT = {
    pdfFile: [],
    index: -1,
};

export interface PdfRotateModel {
    pdfFile: string[];
    index: number;
}

@State<PdfRotateModel>({
    name: 'PDF_ROTATE',
    defaults: PDF_ROTATE_DEFAULT,
})

@Injectable()
export class PdfRotateState {

    @Selector()
    static getBlobFile(state: PdfRotateModel) {
        if (state.pdfFile.length > 0) {
            return state.pdfFile[state.index];
        }
    }

    constructor() {
    }

    @Action(StoreBlobFile)
    storeBlobFile({getState, setState}: StateContext<PdfRotateModel>, action: StoreBlobFile) {
        const state = getState();
        const pdfFile = state.pdfFile;
        pdfFile[state.index + 1] = action.payload;
        let newIndex = state.index + 1;
        setState({...state, pdfFile: pdfFile, index: newIndex});
    }

    @Action(UndoBlobFileChanges)
    undoBlobFileChanges({getState, setState}: StateContext<PdfRotateModel>, action: UndoBlobFileChanges) {
        const state = getState();
        let newIndex = state.index;
        if (state.index > 0) {
            newIndex = state.index - 1;
        }
        setState({...state, index: newIndex});
    }

    @Action(RedoBlobFileChanges)
    redoBlobFileChanges({getState, setState}: StateContext<PdfRotateModel>, action: RedoBlobFileChanges) {
        const state = getState();
        let newIndex = state.index;
        if (state.index < state.pdfFile.length - 1) {
            newIndex = state.index + 1;
        }
        setState({...state, index: newIndex})
    }

    @Action(ClearState)
    clearState({setState}: StateContext<PdfRotateModel>, action: ClearState) {
        const defaultState = Object.assign({}, PDF_ROTATE_DEFAULT);
        setState(defaultState);
    }
}
