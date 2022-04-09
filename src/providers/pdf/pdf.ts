import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FileOpener } from '@ionic-native/file-opener';
import { File } from '@ionic-native/file';
import { Platform } from 'ionic-angular';
@Injectable()
export class PdfProvider {

  constructor(public http: HttpClient,
    private platform: Platform,
    private opener: FileOpener,
    private file: File,) {
    console.log('Hello PdfProvider Provider');
  }
  getLogoString(){
    return ' data:image/jpeg;base64,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';
  }
  saveAndOpenPdf(pdf: string, filename: string) {
    const writeDirectory = this.platform.is('ios') ? this.file.dataDirectory : this.file.externalDataDirectory;
    this.file.writeFile(writeDirectory, filename, this.convertBase64ToBlob(pdf, 'data:application/pdf;base64'), {replace: true})
      .then(() => {
          this.opener.open(writeDirectory + filename, 'application/pdf')
              .catch(() => {
                  console.log('Error opening pdf file');
              });
      })
      .catch(() => {
          console.error('Error writing pdf file');
      });
  }
  convertBase64ToBlob(b64Data, contentType): Blob {
    contentType = contentType || '';
    const sliceSize = 512;
    b64Data = b64Data.replace(/^[^,]+,/, '');
    b64Data = b64Data.replace(/\s/g, '');
    const byteCharacters = window.atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
         const slice = byteCharacters.slice(offset, offset + sliceSize);
         const byteNumbers = new Array(slice.length);
         for (let i = 0; i < slice.length; i++) {
             byteNumbers[i] = slice.charCodeAt(i);
         }
         const byteArray = new Uint8Array(byteNumbers);
         byteArrays.push(byteArray);
    }
   return new Blob(byteArrays, {type: contentType});
}
}
