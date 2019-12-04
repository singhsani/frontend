
export function downloadFile(data, filename, mime) {
    downloadFileViewOnly(data,filename,mime);
  }

  export function downloadFileViewOnly(data, filename, mime) {
    const blob = new Blob([data], {type: mime || 'application/octet-stream'});
    if (typeof window.navigator.msSaveBlob !== 'undefined') {
      window.navigator.msSaveBlob(blob, filename);
      return;
    }
   
    const blobURL = window.URL.createObjectURL(blob);
    window.open(blobURL,'_blank')
    
  }

  
  export function downloadFileAndSave(data:any, filename:string) {
    
    if(filename.toLowerCase().endsWith('.pdf')) {
      const blob = new Blob([data],{type: 'application/pdf'});
      const blobURL = window.URL.createObjectURL(blob);
      window.open(blobURL,'_blank');
    } else {
      const blob = new Blob([data]);
      const blobURL = window.URL.createObjectURL(blob);

      const tempLink = document.createElement('a');
      tempLink.style.display = 'none';
      tempLink.href = blobURL;
      tempLink.setAttribute('download', filename);
    
      if (typeof tempLink.download === 'undefined') {
        tempLink.setAttribute('target', '_blank');
      }
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      setTimeout(() => {
        // For Firefox it is necessary to delay revoking the ObjectURL
        window.URL.revokeObjectURL(blobURL);
      }, 100);
    }
  }

  
  