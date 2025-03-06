




type Message = {roomId: string, message: string, sender: string}

interface ClientToServerActions {
    message: (data: Message) => void
    exit: (reason?: string) => void
    joinRoom: (id: string) => void
    leave: (id: string, roomId: string) => void
}

interface ServerToCiientActions {
    message: (data: Message) => void
    exit: (reason?: string) => void
    joinRoom: (roomId: string) => void
    leave: (id: string, roomId: string) => void
} 


export {Message, ClientToServerActions, ServerToCiientActions}