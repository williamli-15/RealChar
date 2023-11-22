'use strict';

const RTCPeerConnection = (
  window.RTCPeerConnection ||
  window.webkitRTCPeerConnection ||
  window.mozRTCPeerConnection
).bind(window);

let peerConnection;
let streamId;
let sessionId;
let sessionClientAnswer;
let statsIntervalId;
let videoIsPlaying;
let lastBytesReceived;

// DOM elements
const avatarImages = document.querySelectorAll('.img-fluid');
let talkVideo = null;
// const iceStatusLabel = document.getElementById('ice-status-label');
// const iceGatheringStatusLabel = document.getElementById(
//   'ice-gathering-status-label'
// );
// const peerStatusLabel = document.getElementById('peer-status-label');
// const signalingStatusLabel = document.getElementById('signaling-status-label');
// const streamingStatusLabel = document.getElementById('streaming-status-label');

// eslint-disable-next-line no-undef
const apiKey = process.env.REACT_APP_DID_API_KEY;

// https source urls for avatar images
const sourceUrlMap = {
  Jaward:
    'https://raw.githubusercontent.com/Jaykef/gradio-practice/main/jaward.png',
  Aquilla:
    'https://raw.githubusercontent.com/Jaykef/gradio-practice/main/aquilla.png',
  Amira:
    'https://raw.githubusercontent.com/Jaykef/gradio-practice/main/amira.png',
  Joker:
    'https://raw.githubusercontent.com/Jaykef/gradio-practice/main/joker.png',
  Sonia:
    'https://raw.githubusercontent.com/Jaykef/gradio-practice/main/sonia.png',
  Dong: 'https://raw.githubusercontent.com/Jaykef/gradio-practice/main/dong.png',
  Sully:
    'https://raw.githubusercontent.com/Jaykef/gradio-practice/main/sully.png',
  Neytiri:
    'https://raw.githubusercontent.com/Jaykef/gradio-practice/main/neytiri.png',
};

const voiceUrlMap = {
  Jaward: 'en-US-JasonNeural',
  Aquilla: 'zh-CN-XiaoyiNeural',
  Amira: 'en-ZA-LeahNeural',
  Joker: 'en-US-DavisNeural',
  Sonia: 'en-IN-NeerjaNeural',
  Dong: 'zh-CN-YunjianNeural',
  Sully: 'en-US-DavisNeural',
  Neytiri: 'en-US-JennyNeural',
};

// Helper functions
function updateAvatar() {
  avatarImages.forEach(avatarImage => {
    avatarImage.addEventListener('click', () => {
      const selectedVideo = avatarImage.alt;
      const selectedImage = avatarImage;

      const prevSelectedImage = document.querySelector('.img-fluid[selected]');
      if (prevSelectedImage) {
        prevSelectedImage.style.border = 'none';
        prevSelectedImage.removeAttribute('selected');
      }
      selectedImage.style.border = '5px solid #02a3ff91';
      selectedImage.setAttribute('selected', 'true');

      updateSelectedAvatar(selectedVideo);
      const video = document.getElementById('talking-video');
      video.style.zIndex = 40;
      video.src = `videos/${selectedVideo}.mp4`;
      video.pause();
    });
  });
}
function updateSelectedAvatar(selectedVideo) {
  const video = document.getElementById('talking-video');
  video.style.zIndex = 40;
  video.src = `videos/${selectedVideo}.mp4`;
  video.pause();
}
function updateVoice() {
  avatarImages.forEach(avatarImage => {
    avatarImage.addEventListener('click', () => {
      const selectedVideo = avatarImage.alt;
      const updatedVoiceUrl = voiceUrlMap[selectedVideo];
      updateSelectedAvatar(selectedVideo);
    });
  });
}

function setVideoElement(stream) {
  if (!stream) {
    console.log('[setVideoElement] stream is null');
    return;
  }
  console.log('[setVideoElement] remote stream');
  talkVideo.srcObject = stream;
  talkVideo.loop = false;

  // Safari hotfix
  if (talkVideo.paused) {
    talkVideo
      .play()
      .then(_ => {})
      .catch(e => {});
  }
}

function playIdleVideo() {
  talkVideo.srcObject = undefined;
  talkVideo.loop = true;
}

function stopAllStreams() {
  if (talkVideo.srcObject) {
    console.log('stopping video streams');
    talkVideo.srcObject.getTracks().forEach(track => track.stop());
    talkVideo.srcObject = null;
  }
}

function closePC(pc = peerConnection) {
  if (!pc) return;
  console.log('stopping peer connection');
  pc.close();
  pc.removeEventListener(
    'icegatheringstatechange',
    onIceGatheringStateChange,
    true
  );
  pc.removeEventListener('icecandidate', onIceCandidate, true);
  pc.removeEventListener(
    'iceconnectionstatechange',
    onIceConnectionStateChange,
    true
  );
  pc.removeEventListener(
    'connectionstatechange',
    onConnectionStateChange,
    true
  );
  pc.removeEventListener('signalingstatechange', onSignalingStateChange, true);
  pc.removeEventListener('track', onTrack, true);
  clearInterval(statsIntervalId);
  console.log('stopped peer connection');
  if (pc === peerConnection) {
    peerConnection = null;
  }
}

const maxRetryCount = 3;
const maxDelaySec = 4;

async function fetchWithRetries(url, options, retries = 1) {
  try {
    return await fetch(url, options);
  } catch (err) {
    if (retries <= maxRetryCount) {
      const delay =
        Math.min(Math.pow(2, retries) / 4 + Math.random(), maxDelaySec) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));

      console.log(
        `Request failed, retrying ${retries}/${maxRetryCount}. Error ${err}`
      );
      return fetchWithRetries(url, options, retries + 1);
    } else {
      throw new Error(`Max retries exceeded. error: ${err}`);
    }
  }
}

async function createPeerConnection(offer, iceServers) {
  if (!peerConnection) {
    peerConnection = new RTCPeerConnection({ iceServers });
    peerConnection.addEventListener(
      'icegatheringstatechange',
      onIceGatheringStateChange,
      true
    );
    peerConnection.addEventListener('icecandidate', onIceCandidate, true);
    peerConnection.addEventListener(
      'iceconnectionstatechange',
      onIceConnectionStateChange,
      true
    );
    peerConnection.addEventListener(
      'connectionstatechange',
      onConnectionStateChange,
      true
    );
    peerConnection.addEventListener(
      'signalingstatechange',
      onSignalingStateChange,
      true
    );
    peerConnection.addEventListener('track', onTrack, true);
  }

  await peerConnection.setRemoteDescription(offer);
  console.log('set remote sdp OK');

  const sessionClientAnswer = await peerConnection.createAnswer();
  console.log('create local sdp OK');

  await peerConnection.setLocalDescription(sessionClientAnswer);
  console.log('set local sdp OK');

  return sessionClientAnswer;
}

// Peer connection to D-ID
export async function sendConnectionRequest(imageSource) {
  if (peerConnection && peerConnection.connectionState === 'connected') {
    return;
  }

  stopAllStreams();
  closePC();
  if (apiKey === '' || apiKey === undefined) {
    alert('D-id API key is missing.');
  } else {
    const videoElement = document.getElementById('talking-video');
    videoElement.src = 'http://localhost:8000/static/Joker.mp4';
    const videoSource = videoElement.src;
    const videoName = videoSource
      .split('/')
      .pop()
      .split('.')
      .slice(0, -1)
      .join('.');
    const selectedVideo = videoName;
    // talkVideo.src = `videos/${selectedVideo}.mp4`;
    // talkVideo.src = imageSource;
    const updatedSourceUrl = sourceUrlMap[selectedVideo];
    const sessionResponse = await fetchWithRetries(`/didapi/talks/streams`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source_url: imageSource,
      }),
    });

    const {
      id: newStreamId,
      offer,
      ice_servers: iceServers,
      session_id: newSessionId,
    } = await sessionResponse.json();
    streamId = newStreamId;
    sessionId = newSessionId;

    try {
      sessionClientAnswer = await createPeerConnection(offer, iceServers);
    } catch (e) {
      console.log('error during streaming setup', e);
      stopAllStreams();
      closePC();
      return;
    }

    const sdpResponse = await fetch(`/didapi/talks/streams/${streamId}/sdp`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        answer: sessionClientAnswer,
        session_id: sessionId,
      }),
    });
  }
}

// send stream request to D-ID
export async function sendRenderRequest(textForRendering) {
  // Check the peer connection's signaling and ice connection states
  if (
    peerConnection?.signalingState === 'stable' ||
    peerConnection?.iceConnectionState === 'connected'
  ) {
    const videoElement = document.getElementById('talking-video');
    const videoSource = videoElement.src;
    const videoName = videoSource
      .split('/')
      .pop()
      .split('.')
      .slice(0, -1)
      .join('.');
    const selectedVideo = videoName;
    const updatedVoiceUrl = voiceUrlMap[selectedVideo];

    const talkResponse = await fetchWithRetries(
      `/didapi/talks/streams/${streamId}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          script: {
            type: 'text',
            subtitles: 'false',
            provider: { type: 'microsoft', voice_id: updatedVoiceUrl },
            ssml: true,
            input: textForRendering,
          },
          driver_url: 'bank://lively/',
          config: {
            stitch: true,
          },
          session_id: sessionId,
        }),
      }
    );
  }
}

// send disconnect request to D-ID
export async function sendDisconnectRequest() {
  if (!streamId) {
    console.log('[sendDisconnectRequest] streamId is null');
    return;
  }
  await fetch(`/didapi/talks/streams/${streamId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Basic ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ session_id: sessionId }),
  });

  stopAllStreams();
  talkVideo.pause();
  closePC();
}

updateAvatar();
updateVoice();

// ICE and peer connection status changes
function onIceGatheringStateChange() {}

// ICE candidate
function onIceCandidate(event) {
  console.log('onIceCandidate', event);
  if (event.candidate) {
    const { candidate, sdpMid, sdpMLineIndex } = event.candidate;

    fetch(`/didapi/talks/streams/${streamId}/ice`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        candidate,
        sdpMid,
        sdpMLineIndex,
        session_id: sessionId,
      }),
    });
  }
}

// Listeners for ICE and peer connection status changes
function onIceConnectionStateChange() {
  if (
    peerConnection.iceConnectionState === 'failed' ||
    peerConnection.iceConnectionState === 'closed'
  ) {
    stopAllStreams();
    closePC();
  }
}

function onConnectionStateChange() {}

function onSignalingStateChange() {}

// Listener for video status change
function onVideoStatusChange(videoIsPlaying, stream) {
  let status;
  if (videoIsPlaying) {
    status = 'streaming';
    setVideoElement(stream);
  } else {
    status = 'empty';
    playIdleVideo();
  }
}

// Event listener for track event
function onTrack(event) {
  if (!event.track) return;
  if (!peerConnection) {
    console.log('peer connection or streamId is null');
    return;
  }
  statsIntervalId = setInterval(async () => {
    if (!peerConnection || !streamId) {
      console.log('peer connection or streamId is null');
      return;
    }
    const stats = await peerConnection.getStats(event.track);
    stats.forEach(report => {
      if (report.type === 'inbound-rtp' && report.mediaType === 'video') {
        const videoStatusChanged =
          videoIsPlaying !== report.bytesReceived > lastBytesReceived;

        if (videoStatusChanged) {
          videoIsPlaying = report.bytesReceived > lastBytesReceived;
          onVideoStatusChange(videoIsPlaying, event.streams[0]);
        }
        lastBytesReceived = report.bytesReceived;
      }
    });
  }, 1000);
}

export function initTalkVideo(video) {
  if (talkVideo) return;
  console.info('[Funtion: initTalkVideo]');
  talkVideo = video;
}

export async function detectVideoEle() {
  console.info('[Funtion: detectVideoEle]');
  console.info(talkVideo);
}
