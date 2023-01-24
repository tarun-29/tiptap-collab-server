import { HocuspocusProvider } from './HocuspocusProvider';
import { IncomingMessage } from './IncomingMessage';
export declare class MessageReceiver {
    message: IncomingMessage;
    broadcasted: boolean;
    constructor(message: IncomingMessage);
    setBroadcasted(value: boolean): this;
    apply(provider: HocuspocusProvider, emitSynced?: boolean): void;
    private applySyncMessage;
    private applyAwarenessMessage;
    private applyAuthMessage;
    private applyQueryAwarenessMessage;
}
