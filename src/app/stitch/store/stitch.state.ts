import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { StitchStateModel, StitchFile } from '../models/stitch.model';
import { AddFile, RemoveFile, SelectFile, ToggleFileSelection, SelectAllFiles, ClearFiles } from './stitch.actions';

const STITCH_STATE_DEFAULT: StitchStateModel = {
  files: [],
  selectedFileId: null
};

@State<StitchStateModel>({
  name: 'stitch',
  defaults: STITCH_STATE_DEFAULT
})
@Injectable()
export class StitchState {

  @Selector()
  static getFiles(state: StitchStateModel) {
    return state.files;
  }

  @Selector()
  static getSelectedFile(state: StitchStateModel) {
    return state.files.find(f => f.id === state.selectedFileId) || null;
  }

  @Action(AddFile)
  addFile({ getState, setState }: StateContext<StitchStateModel>, { payload }: AddFile) {
    const state = getState();
    setState({
      ...state,
      files: [...state.files, payload],
      selectedFileId: state.selectedFileId ?? payload.id
    });
  }

  @Action(RemoveFile)
  removeFile({ getState, setState }: StateContext<StitchStateModel>, { id }: RemoveFile) {
    const state = getState();
    setState({
      ...state,
      files: state.files.filter(f => f.id !== id),
      selectedFileId: state.selectedFileId === id ? null : state.selectedFileId
    });
  }

  @Action(SelectFile)
  selectFile({ getState, setState }: StateContext<StitchStateModel>, { id }: SelectFile) {
    const state = getState();
    setState({
      ...state,
      selectedFileId: id
    });
  }

  @Action(ToggleFileSelection)
  toggleFileSelection({ getState, setState }: StateContext<StitchStateModel>, { id }: ToggleFileSelection) {
    const state = getState();
    setState({
      ...state,
      files: state.files.map(f => f.id === id ? { ...f, selected: !f.selected } : f)
    });
  }

  @Action(SelectAllFiles)
  selectAllFiles({ getState, setState }: StateContext<StitchStateModel>, { selected }: SelectAllFiles) {
    const state = getState();
    setState({
      ...state,
      files: state.files.map(f => ({ ...f, selected }))
    });
  }

  @Action(ClearFiles)
  clearFiles({ setState }: StateContext<StitchStateModel>) {
    setState(STITCH_STATE_DEFAULT);
  }
}
