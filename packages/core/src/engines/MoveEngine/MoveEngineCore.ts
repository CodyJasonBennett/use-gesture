import { ConfigResolverMap } from '../../imports'
import { moveConfigResolver } from '../../config/moveConfigResolver'
import { CoordinatesEngine } from '../CoordinatesEngine'
import { Pointer } from '../../utils/events'
import { V } from '../../utils/maths'
import type { Controller } from '../../Controller'

ConfigResolverMap.set('move', moveConfigResolver)

export interface MoveEngineConstructor {
  new (ctrl: Controller, args: any[]): MoveEngine
}

export interface MoveEngine extends CoordinatesEngine<'move'> {
  move(this: MoveEngine, event: PointerEvent): void
  moveChange(this: MoveEngine, event: PointerEvent): void
  moveEnd(this: MoveEngine, event?: PointerEvent): void
}

export const MoveEngine: MoveEngineConstructor = function (this: MoveEngine, ctrl: Controller, args: any[]) {
  this.ingKey = 'moving'
  // @ts-ignore
  CoordinatesEngine.call(this, ctrl, args, 'move')
} as any

MoveEngine.prototype = Object.create(CoordinatesEngine.prototype)

MoveEngine.prototype.move = function (event) {
  if (!this.state._active) this.start(event)

  this.moveChange(event)
  this.timeoutStore.add('moveEnd', this.moveEnd.bind(this))
} as MoveEngine['move']

MoveEngine.prototype.moveChange = function (event) {
  if (event.cancelable) event.preventDefault()
  const values = Pointer.values(event)
  const delta = V.sub(values, this.state.values)
  V.addTo(this.state._movement, delta)
  this.state.values = values

  this.compute(event)
  this.emit()
} as MoveEngine['moveChange']

MoveEngine.prototype.moveEnd = function (event) {
  if (!this.state._active) return
  this.state._active = false
  this.compute(event)
  this.emit()
} as MoveEngine['moveEnd']

MoveEngine.prototype.bind = function (this: MoveEngine, bindFunction) {
  bindFunction('pointer', 'change', this.move.bind(this))
  bindFunction('pointer', 'leave', this.moveEnd.bind(this))
} as MoveEngine['bind']
