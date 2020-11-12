/// <reference types="@types/dom-mediacapture-record" />

interface CanvasElement extends HTMLCanvasElement {
    captureStream(frameRate?: number): MediaStream;
}

export default class CanvasVideo {
    dataChunks: Array<Blob>;
    blob: Blob | null;
    recorder: MediaRecorder;

    constructor(canvas: CanvasElement, bitrate?: number) {
        this.dataChunks = [];

        this.blob = null;
        this.recorder = new MediaRecorder(canvas.captureStream(), { mimeType: "video/webm", videoBitsPerSecond: (bitrate || 2500000) });

        this.recorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) {
                this.dataChunks.push(e.data);
                this.Save();
            }
        };

        this.recorder.onstop = () => {
            this.blob = new Blob(this.dataChunks, { type: "video/webm" });
        };
    }

    Start() {
        this.recorder.start();
    }

    Stop() {
        this.recorder.stop();
    }

    Save() {
        const blob = this.blob || new Blob(this.dataChunks, { type: "video/webm" });
        const objectURL = URL.createObjectURL(blob);
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.id = "tempBlobElement";
        a.style.display = "none";
        a.href = objectURL;
        a.download = "maptoglobe.webm";
        a.click();
        setTimeout(() => {
            (document.getElementById("tempBlobElement") as HTMLLinkElement).remove();
            URL.revokeObjectURL(objectURL);
        }, 100);
    }
}