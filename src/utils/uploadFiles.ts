import { initializeApp } from 'firebase/app';
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from 'firebase/storage';
import { FIREBASE_CONFIG } from 'src/configs/firebaseConfig';
initializeApp(FIREBASE_CONFIG);
const storage = getStorage();
export class UploadFiles {
  private model: string;
  private type: string;
  private file: Express.Multer.File;

  constructor(model: string, type: string, file: Express.Multer.File) {
    this.model = model;
    this.type = type;
    this.file = file;
  }
  async uploadFileAndDownloadURL(): Promise<string> {
    if (this.file?.mimetype && this.file?.buffer) {
      const storageRef = ref(
        storage,
        `${this.model.toLowerCase()}/${this.type.toLowerCase()}/${Date.now()}`,
      );
      const metadata = {
        contentType: this.file.mimetype,
      };

      const snapshot = await uploadBytesResumable(
        storageRef,
        this.file.buffer,
        metadata,
      );

      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    }
    return undefined;
  }
}
