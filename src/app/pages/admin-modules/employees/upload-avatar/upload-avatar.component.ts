import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import { ImageTransformer } from 'src/app/core/libs/image-transformer.lib';

@Component({
  selector: 'app-upload-avatar',
  templateUrl: './upload-avatar.component.html',
  styleUrls: ['./upload-avatar.component.scss']
})
export class UploadAvatarComponent implements OnInit {

  imageChangedEvent: any = '';
  croppedImage: any = '';
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  containWithinAspectRatio = false;
  failed = false;
  transform: ImageTransform = {};
  uploading = false;
  progress = 0;
  selectedFile: File;
  loaded: boolean = false;
  imagetransformer = new ImageTransformer();

  constructor(public dialogRef: MatDialogRef<UploadAvatarComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }


  async acceptimage() {
    if (this.croppedImage !== '') {

      this.uploading = true;
      const name = this.selectedFile.name;
      const imageBase64 = this.croppedImage;

      const actualSize = await this.imagetransformer.getImageSize(imageBase64);

      let resizedImage;
      if (actualSize.width > 150 || actualSize.height > 150) {
        resizedImage = await this.imagetransformer.compressImage(imageBase64, 150, 150);
      } else {
        resizedImage =imageBase64;
      }
      const file = this.imagetransformer.convertToFile(resizedImage, name, this.selectedFile.type);
      this.uploading = false;
      this.dialogRef.close({ file: file, preview: resizedImage });

      // this.uploadService.uploadSingle(file , this.CUSTOMER._id).subscribe(event => {
      //     if (event.type === 'PROGRESS') {
      //       const percentDone = Math.round(100 * event.loaded / event.total);
      //       this.progress = percentDone;
      //     }
      //     if (event.type === 'RESPONSE') {
      //       this.uploading = false;
      //       this.dialogRef.close(event.file);
      //       this.progress = 0;
      //     }
      // });
    } else {
      this.dialogRef.close();
    }
  }




  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.selectedFile = event.target.files[0];
    this.loaded = false;
  }

  imageCropped(event: ImageCroppedEvent) {
      this.croppedImage = event.base64;
  }
  imageLoaded() {
    this.failed = false;
    this.loaded = true;
      // show cropper
  }
  cropperReady() {
      // cropper ready
      this.loaded = true;
  }
  loadImageFailed() {
    this.failed = true;
    this.loaded = false;
      // show message
  }
  zoomOut() {
    this.scale -= .1;
    this.transform = {
        ...this.transform,
        scale: this.scale
    };
  }

  zoomIn() {
      this.scale += .1;
      this.transform = {
          ...this.transform,
          scale: this.scale
      };
  }

}
