type Message = { roomId: string; message: string; sender: string };

interface OfferData {
  target: string;
  spd: RTCSessionDescriptionInit;
}
interface AnswerData {
  target: string;
  sdp: RTCSessionDescriptionInit;
}

interface MessageData {
  roomId: string;
  message: string;
}
interface IceCandidateData {
  target: string;
  candidate: RTCIceCandidateInit; // ICE Candidate details
}

//Websocket events when the clients emits to the server
//joinRom -> Client tells teh server it wants to a video room.
//offer -> Client sender an offer (call) to the server
//client -> Client sends an answer to the server
//ICE candidate -> Clietns sends ICE candidates to the server
interface ClientToServerActions {
  offer: (data: OfferData) => void;
  answer: (data: AnswerData) => void;
  iceCandidate: (data: IceCandidateData) => void;
  message: (data: Message) => void;
  exit: (reason?: string) => void;
  joinRoom: (id: string) => void;
  leave: (id: string, roomId: string) => void;
}

//Events that the websocket sercer emits to clients
//offer -> Server forwards tan offer to the target client
//answer -> Server forwards an answer to the target client
//iceCandidate -> Server forwards an ICE candidate to the target client
//message -> Server sends a chat message to every on in the room
interface ServerToCiientActions {
  offer: (data: OfferData) => void;
  answer: (data: AnswerData) => void;
  iceCandidate: (data: IceCandidateData) => void;
  message: (data: Message) => void;
}

export { Message, ClientToServerActions, ServerToCiientActions };
