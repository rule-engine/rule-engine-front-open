import {METHOD, request} from "@/utils/request";
import {importExport} from "@/services/api";


export function exportData(query) {
    request(importExport.EXPORT, METHOD.POST, query).then(res => {
        const blob = new Blob([JSON.stringify(JSON.parse(res.data.data.data), null, 4)]);
        const downloadElement = document.createElement("a");
        const href = window.URL.createObjectURL(blob);
        downloadElement.href = href;
        let suffix;
        if (query.dataType === 0) {
            suffix = '.r';
        } else if (query.dataType === 1) {
            suffix = '.rs';
        } else if (query.dataType === 2) {
            suffix = '.dt';
        }
        downloadElement.download = decodeURIComponent(res.data.data.code + suffix);
        document.body.appendChild(downloadElement);
        downloadElement.click();
        document.body.removeChild(downloadElement);
        window.URL.revokeObjectURL(href);
    })
}
