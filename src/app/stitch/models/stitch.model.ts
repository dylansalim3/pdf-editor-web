export interface StitchFile {
  id: string;
  name: string;
  size: number;
  type: string;
  lastModified: number;
  data: string; // Base64
  pageCount?: number;
  status: 'Ready' | 'Processing' | 'Compressed' | 'Signed';
  selected?: boolean;
}

export interface StitchStateModel {
  files: StitchFile[];
  selectedFileId: string | null;
}
