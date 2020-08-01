export class StoreBlobFile {
    static readonly type = '[Pdf Rotate] Store Blob PDF File';

    constructor(public payload: string) {
    }
}

export class UndoBlobFileChanges {
    static readonly type = '[Pdf Rotate] Undo Blob file Changes';

    constructor() {
    }
}

export class RedoBlobFileChanges{
    static readonly type = '[PDF Rotate] Redo Blob file Changes'

    constructor(){

    }
}

export class ClearState {
    static readonly type = '[PDF Rotate] Clear State';

    constructor() {
    }
}
