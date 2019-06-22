
export function sleep(time) {
  return new Promise((resolve, reject) => {
    this.setTimeout(resolve, time)
  })
}
