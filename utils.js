function playSoundEffect(type, name, volume = 1, loop = false) {
  let audio = new Audio('./sounds/' + type + '/' + name)
  audio.volume = volume
  audio.loop = loop
  if (!soundMuted) {
    audio.play()
  }
  return audio
}

function sleep(time) {
  return new Promise((resolve, reject) => {
    this.setTimeout(resolve, time)
  })
}