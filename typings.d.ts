import type { Server as WebsocketServer, WebSocket as WebsocketConnection } from "ws"
import type RandomChatEventsManager from "./randomChatBackendLogic/RandomChatEventsManager"

export declare class RandomChatSession {

    sessionUID: string

    leftSide: WebsocketConnection

    rightSide: WebsocketConnection

    private leftSideMessages: string[]

    private rightSideMessages: string[]

    sessionTime: number

    constructor(sessionUID: string, leftSide: WebsocketConnection)

    addRightSide(rightSide: WebsocketConnection): void

}

export declare class RandomChatSessionsManager {

    private managedWebsocketServer: WebsocketServer

    private sessions: SessionsStash

    /**Contains UID's of sessions wich wait for second chatter*/
    private pendingSessions: string[]

    private sessionsEvents: RandomChatEventsManager

    constructor(managedWebsocketServer: WebsocketServer)

    createSession(incomingConnection: WebsocketConnection): string

    getSessionsStats(): SessionsStats

}

export type SessionsStats = {

    curentChatters: number

    chattersPerHour: number

}

export type SessionsStash = { [key: string]: RandomChatSession }

export type FrontendEvent = {

    type: string

    message: string

} 