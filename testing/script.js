const mouth = document.getElementById("mouth");
const eyebrows = document.getElementById("eyebrows");
console.log("sahi h")
let mouthOpen = false;
let eyebrowDown = false;
let speaking = false;

function toggleMouth() {
  mouthOpen = !mouthOpen;
  mouth.src = mouthOpen
    ? "assets/mouth-open.png"
    : "assets/mouth-closed.png";
}

function toggleEyebrows() {
  eyebrowDown = !eyebrowDown;
  eyebrows.src = eyebrowDown
    ? "assets/eyebrows-down.png"
    : "assets/eyebrows-open.png";
}

function speak() {
  const text = document.getElementById("text").value;
  if (!text.trim()) return;

  const utterance = new SpeechSynthesisUtterance(text);
  speaking = true;

  // Start animation loop
  const interval = setInterval(() => {
    if (!speaking) {
      clearInterval(interval);
      mouth.src = "assets/mouth-closed.png";
      eyebrows.src = "assets/eyebrows-open.png";
      return;
    }
    toggleMouth();
    toggleEyebrows();
  }, 200); // Flick every 200ms

  utterance.onend = () => {
    speaking = false;
  };

  speechSynthesis.speak(utterance);
}
