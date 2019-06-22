import { EnemyShip } from './classes';

import { SoundEffect } from './SoundEffect';
// const faker = require('faker-js')

const mockPlay = jest.fn();
jest.mock('./SoundEffect', () => {
  return {
    SoundEffect: jest.fn().mockImplementation(() => {
      return { play: mockPlay };
    })
  }
});

describe('EnemyShip', () => {
  afterEach(() => {
    SoundEffect.mockClear();
  })

  it('should die', () => {
    const enemy = new EnemyShip()

    expect(enemy.alive).toBe(true)
    enemy.destroy()
    expect(enemy.alive).toBe(false)
    expect(SoundEffect).toHaveBeenCalledWith(
      'explosions',
      '1.wav',
      0.5,
    )
    expect(mockPlay).toHaveBeenCalled();
  })

  it('should not die if still have health', () => {
    const mockHealth = 20
    const enemy = new EnemyShip(null, null, 'mock-enemy', '', mockHealth)

    expect(enemy.health).toBe(mockHealth)
    enemy.reactToCollision()
    expect(enemy.health).toBe(mockHealth - 1)
    expect(enemy.alive).toBe(true)
  })

  it('should die if at 0 health', () => {
    const mockHealth = 1
    const enemy = new EnemyShip(null, null, 'mock-enemy', '', mockHealth)

    expect(enemy.health).toBe(mockHealth)
    enemy.reactToCollision()
    expect(enemy.health).toBe(mockHealth - 1)
    expect(enemy.alive).toBe(false)
  })
})
