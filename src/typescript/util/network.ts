export class YourPlaceServerDetector {
    static async checkWithHttp(): Promise<boolean> { // Check using HTTP
        try {
            const response = await fetch("http://localhost:42424/ping", {
                method: "GET",
                mode: "cors",
                headers: {
                    "Accept": "text/plain",
                },
                credentials: "omit"
            });
            if (!response.ok) {
                return false;
            }
            const text = await response.text();
            return text === "pong";
        } catch (e) {
            return false;
        }
    }
    static checkWithWebSocket(): Promise<boolean> { // Check using WebSocket
        return new Promise((resolve) => {
            try {
                const ws = new WebSocket("ws://localhost:42424/ws");
                const timeout = setTimeout(() => {
                    ws.close();
                    resolve(false);
                }, 3000);
                ws.onopen = () => {
                    clearTimeout(timeout);
                    ws.close();
                    resolve(true);
                };
                ws.onerror = () => {
                    clearTimeout(timeout);
                    resolve(false);
                };
            } catch (e) {
                resolve(false);
            }
        });
    }
    static async checkService(): Promise<boolean> { // Try both methods
        try {
            // Try HTTP first
            const httpResult = await this.checkWithHttp();
            if (httpResult) {
                console.log("HTTP works");
                return true;
            }

            // If HTTP fails, try WebSocket
            const wsResult = await this.checkWithWebSocket();
            if (wsResult) {
                console.log("WebSocket works");
                return true;
            }
        } catch (e) {
            console.log("YourPlace Server not running");
            return false;
        }
        return false;
    }
}