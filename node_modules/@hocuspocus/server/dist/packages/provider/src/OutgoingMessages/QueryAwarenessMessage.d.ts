import * as encoding from 'lib0/encoding';
import { MessageType, OutgoingMessageArguments } from '../types';
import { OutgoingMessage } from '../OutgoingMessage';
export declare class QueryAwarenessMessage extends OutgoingMessage {
    type: MessageType;
    description: string;
    get(args: Partial<OutgoingMessageArguments>): encoding.Encoder;
}
