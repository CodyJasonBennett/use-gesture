import React from 'react'
import { EasterDiv } from './examples'

const handMojis = ['👆', '👇', '👈', '🤘', '🤙', '✊', '🖖', '🖐', '🤞', '👍', '👊']
const randomEmoji = () => handMojis[Math.floor(Math.random() * handMojis.length)]

export default function Rug() {
  return (
    <EasterDiv>
      <span style={{ color: '#ff9800', touchAction: 'none' }}>
        {randomEmoji()} <strong>@use-gesture</strong>/react
      </span>
    </EasterDiv>
  )
}
