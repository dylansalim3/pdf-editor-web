export class StoreBlobFile {
  static readonly type = '[Pdf Rotate] Store Blob PDF File';

  constructor(public payload: string) {
  }
}

export class GetBlobFile {
  static readonly type = '[Pdf Rotate] Get Blob PDF File';

  constructor() {
  }
}
