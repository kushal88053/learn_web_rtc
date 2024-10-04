class PeerService {
  constructor() {
    // Initialize the peer connection only if it hasn't been created already
    if (!this.peer) {
      this.peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      });
    }
  }

  // Async method to create an offer
  async getOffer() {
    if (this.peer) {
      // Create the offer
      const offer = await this.peer.createOffer();
      // Set the local description to the generated offer
      await this.peer.setLocalDescription(offer);
      // Return the offer
      return offer;
    }
    throw new Error("Peer connection not initialized");
  }

  // Async method to create and return an answer
  async getAnswer(offer) {
    if (this.peer) {
      // Set the remote description using the received offer
      await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
      // Create an answer based on the offer
      const answer = await this.peer.createAnswer();
      // Set the local description to the generated answer
      await this.peer.setLocalDescription(answer);
      // Return the answer
      return answer;
    }
    throw new Error("Peer connection not initialized");
  }

  // Method to set the remote description using the answer
  async setLocalDescription(answer) {
    if (this.peer) {
      await this.peer.setRemoteDescription(new RTCSessionDescription(answer));
    }
  }
}

// Export an instance of the PeerService class
export default new PeerService();
