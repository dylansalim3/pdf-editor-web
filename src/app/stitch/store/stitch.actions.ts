import { StitchFile } from '../models/stitch.model';

export class AddFile {
  static readonly type = '[Stitch] Add File';
  constructor(public payload: StitchFile) {}
}

export class RemoveFile {
  static readonly type = '[Stitch] Remove File';
  constructor(public id: string) {}
}

export class SelectFile {
  static readonly type = '[Stitch] Select File';
  constructor(public id: string) {}
}

export class ToggleFileSelection {
  static readonly type = '[Stitch] Toggle File Selection';
  constructor(public id: string) {}
}

export class SelectAllFiles {
  static readonly type = '[Stitch] Select All Files';
  constructor(public selected: boolean) {}
}

export class ClearFiles {
  static readonly type = '[Stitch] Clear Files';
}
