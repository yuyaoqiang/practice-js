(function(window) {
  let audioDOM = `audio[data-value="$"]`;
  let divDOM = `div[data-value="$"]`;
  let TRANSFORM = "transform";
  let PLAYING = "playing";
  let currentKeyCode = 0;

  function changer(current) {
    currentKeyCode = current;
  }
  function startPlay(audio) {
    audio.currentTime = 0;
    audio.play();
  }
  function isLive(audio) {
    return audio ? false : true;
  }
  function getEventObject(domStr) {
    let newDom = domStr.replace(/\$/g, currentKeyCode);
    return document.querySelector(newDom);
  }
  function keyDwonEvent(event) {
    let audio, div;
    changer(event.keyCode);
    audio = getEventObject(audioDOM);
    div = getEventObject(divDOM);
    if (isLive(audio)) return;
    startPlay(audio);
    addEleStyle(div);
  }
  function addEleStyle(div) {
    div.classList.add(PLAYING);
  }
  function removeEleStyle(event) {
    if (event.propertyName !== TRANSFORM) return;
    event.target.classList.remove(PLAYING);
  }
  function bindEvents() {
    keyList = Array.from(document.querySelectorAll(".key"));
    keyList.forEach(ele => {
      ele.addEventListener("transitionend", removeEleStyle);
    });
  }
  bindEvents();
  window.addEventListener("keydown", keyDwonEvent);
})(window);
