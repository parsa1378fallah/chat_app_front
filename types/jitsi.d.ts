interface IJitsiEvent {
    muted?: boolean;
    [key: string]: any;
}

interface IJitsiMeetExternalAPI {
    executeCommand: (command: string) => void;
    addEventListener: (event: string, callback: (payload: IJitsiEvent) => void) => void;
    dispose: () => void;
}

interface Window {
    JitsiMeetExternalAPI: typeof JitsiMeetExternalAPI;
}
