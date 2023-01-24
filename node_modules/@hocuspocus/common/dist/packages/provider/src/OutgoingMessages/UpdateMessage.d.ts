import { MessageType, OutgoingMessageArguments } from '../types';
import { OutgoingMessage } from '../OutgoingMessage';
export declare class UpdateMessage extends OutgoingMessage {
    type: MessageType;
    description: string;
    get(args: Partial<OutgoingMessageArguments>): import("lib0/encoding").Encoder;
}
