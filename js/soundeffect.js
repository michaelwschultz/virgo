export default class SoundEffect {
  constructor(type, name, volume = 1, loop = false) {
    this.audio = new Audio('./sounds/' + type + '/' + name)
    this.audio.volume = volume
    this.audio.loop = loop
    this.type = type
    this.name = name
    this.volume = volume
    this.loop = loop
    this.on = false
  }

  play() {
    this.on = true
    this.audio.play()
  }

  pause() {
    this.on = false
    this.audio.pause()
  }

  toggle() {
    this.on = !this.on
    if (this.on) {
      this.play()
    } else {
      this.pause()
    }
  }
}
