class CanvasVideo {
    constructor(canvas, framerate, bitrate) {
        const fps = framerate || 30;
        const stream = canvas.captureStream(fps);
        this.dataChunks = [];

        this.blob = null;
        this.recorder = new MediaRecorder(stream, { mimeType: "video/webm", videoBitsPerSecond: (bitrate || 2500000) });

        this.recorder.ondataavailable = (e) => {
            this.dataChunks.push(e.data);
        };

        this.recorder.onstop = () => {
            this.blob = new Blob(this.dataChunks, { type: "video/webm" });
        };
    }

    Start() {
        this.recorder.start(100);
    }

    Stop() {
        this.recorder.stop();
    }

    Save(filename) {
        const blob = this.blob || new Blob(this.dataChunks, { type: "video/webm" });
        const objectURL = URL.createObjectURL(blob);
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.id = "tempBlobElement";
        a.style.display = "none";
        a.href = objectURL;
        a.download = filename || "canvasvideo.webm";
        a.click();
        setTimeout(() => {
            document.getElementById("tempBlobElement").remove();
            URL.revokeObjectURL(objectURL);
        }, 100);
    }
}

export { CanvasVideo };