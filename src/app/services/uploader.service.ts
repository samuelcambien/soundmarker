import {Injectable} from '@angular/core';
import {FileUploader} from '../tools/ng2-file-upload';

@Injectable({
  providedIn: 'root'
})

export class Uploader {
  UPLOAD_FILES_ENDPOINT = 'http://localhost:8080/rest/upload/file';

  acceptedQueueMargin = 80000000; // 80 MB
  titles = [];
  soundmarkerLimit = 2000000000; //
  queueSizeRemaining: number; // 2000000000 2 000 000 000
  queueSizeRemainingString:  string = "2 GB";
  uploading: boolean = false;

  fileUploader: FileUploader = new FileUploader({
    url: this.UPLOAD_FILES_ENDPOINT,
    disableMultipart: true,
    maxFileSize: 2080000000, // 2GB 2 000 000 000 + 80 MB margin
    filters: [
      {
        name: 'avoidDuplicates',
        fn: item => this.fileUploader.queue.findIndex(
          ref => ref.file.name == item.name
            && ref.file.size == item.size
            && ref.file.type == item.type
            && ref.file.lastModifiedDate == item.lastModifiedDate
        ) < 0
      },
      {
        name: 'onlyAudio',
        fn: item => this.accept(item.type)
      },
      // {
      //   name: 'checkSizeLimit',
      //   fn: item => {return this.acceptedQueueMargin + this.queueSizeRemaining - item.size > 0}
      // }
    ],
  });

  public static ACCEPTED_FILE_TYPES: string[] =
    [
      "audio/wv",
      "audio/flac",
      "audio/wav",
      "audio/x-m4a",
      "audio/x-wav",
      "audio/x-aiff",
      "audio/mpeg",
      "audio/aiff",
      "audio/mp3",
      "audio/ogg",
      "audio/aac",
      "audio/m4a",
    ];


  constructor(  ) {
  }

  getAcceptedFileTypes() {
    return Uploader.ACCEPTED_FILE_TYPES;
  }

  private getStreamFileExtension(extension: string) {
    switch (extension) {
      case "aac":
        return "aac";
      default:
        return "mp3"
    }
  }

  // Remove the size of a added file again to the leftover queuesize.
  removeFileSize(fileSize){
    this.queueSizeRemaining = this.queueSizeRemaining - fileSize;
    this.queueSizeRemainingString = this.bytesToSize(this.queueSizeRemaining);
  }

  // Add the size of a removed file again to the leftover queuesize.
  addFileSize(fileSize): void{
    this.queueSizeRemaining = this.queueSizeRemaining + fileSize;
    this.queueSizeRemainingString = this.bytesToSize(this.queueSizeRemaining);
  }

  // Convert the queue size left to a human readable string.
  bytesToSize(bytes: number): string {
    let sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes <= 0) {bytes=bytes+this.acceptedQueueMargin};
    let i = Math.floor(Math.log(bytes)/Math.log(1000));
    let p = Math.round(bytes/(Math.pow(1000, i))*100)/100;
    return p + " " + sizes[i];
  }

  accept(fileType: string): boolean {
    return Uploader.ACCEPTED_FILE_TYPES.find(
      acceptedType => acceptedType == fileType
    ) != null;
  }

  reset(){
    this.fileUploader.clearQueue();
    this.fileUploader.uploaded = 0;
    this.titles = [];
  }

  removeFromQueue(item){
    this.titles.splice(this.fileUploader.getIndexOfItem(item),1);
    this.fileUploader.removeFromQueue(item);
    this.removeFileSize(item.file.size);
  }

  addTitles(items){
    let new_titles = items.map(a => a._file.name);
    this.titles = this.titles.concat(new_titles);
  }

  getTitle(track){
    return this.titles[this.fileUploader.getIndexOfItem(track)];
  }

  isUploading(){
    // return this.fileUploader.isUploading;
    return this.uploading;
}
}
