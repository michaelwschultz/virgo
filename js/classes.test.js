const { EnemyShip } = require('./classes')
// const faker = require('faker-js')
 
describe('EnemyShip', () => {
  const originalSoundEffect = global.playSoundEffect

  beforeAll(() => {
    global.playSoundEffect = jest.fn()
  })

  afterAll(() => {
    global.playSoundEffect = originalSoundEffect
  })
  
  it('should die', () => {
    const enemy = new EnemyShip()

    expect(enemy.alive).toBe(true)
    enemy.destroy()
    expect(enemy.alive).toBe(false)
    expect(global.playSoundEffect).toHaveBeenCalledWith(
      'explosions', 
      '1.wav', 
      0.5,
    )
  })

  it('should not die if still have health', () => {
    const mockHealth = 20
    const enemy = new EnemyShip(null, 'mock-enemy', '', mockHealth)
    console.log("HEALTH TO START: ", mockHealth);
    expect(enemy.health).toBe(mockHealth)
    enemy.reactToCollision()
    expect(enemy.health).toBe(mockHealth - 1)
    console.log("HEALTH AFTER GETTING HIT: ", mockHealth);
    expect(enemy.alive).toBe(true)
  })

  it('should die if at 0 health', () => {
    const mockHealth = 1
    const enemy = new EnemyShip(null, 'mock-enemy', '', mockHealth)

    expect(enemy.health).toBe(mockHealth)
    enemy.reactToCollision()
    expect(enemy.health).toBe(mockHealth - 1)
    expect(enemy.alive).toBe(false)
  })
})