import { ImageTransform, base64ToFile  } from 'ngx-image-cropper';
export class ImageTransformer {

    getImageSize(myBase64: any): Promise<any> {
        return new Promise(resolve => {
            const image = new Image();
            image.src = myBase64;
            let width, height;
            image.onload = () => { width = image.width; height = image.height; resolve({width: width, height: height});   };
        });
    }

    
    compressImage(myBase64: any, maxw: number, maxh: number) {
        return new Promise((res, rej) => {
            const img = new Image();
            img.src = myBase64;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = maxw;
                const MAX_HEIGHT = maxh;
                let width = img.width;
                let height = img.height;
                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                const data = ctx.canvas.toDataURL();
                res(data);
            }
            img.onerror = error => rej(error);
        });
    }

    convertToFile(imageBase64: any, name: string, type: string) {
        const blobcropped =  base64ToFile(imageBase64);
        const file = new File([blobcropped], name, { type: type });
        return file;
    }
}