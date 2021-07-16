const MOVE_SPEED = 200
const TIME_LEFT = 8
const INVADER_SPEED = 100
let CURRENT_SPEED = INVADER_SPEED
const LEVEL_DOWN = 250
const BULLET_SPEED = 400

layer('obj', 'ui', 'obj')

//Map
addLevel([
  '!^^^^^^^^^^        &',
  '!^^^^^^^^^^        &',
  '!^^^^^^^^^^        &',
  '!                  &',
  '!                  &',
  '!                  &',
  '!                  &',
  '!                  &',
  '!                  &',
  '!                  &',
  '!                  &',
  '!                  &',
  '!                  &'
], {
    width: 30,
    height: 22,
    '^': [sprite('space_invader'), scale(0.9), 'space_invader'],
    '!': [sprite('wall'), 'left-wall'],
    '&': [sprite('wall'), 'right-wall'],
  })

const player = add([
  sprite('space-ship'),
  pos(width() / 2, height() / 2),
  origin('center')

])

keyDown('left', () => {
  player.move(-MOVE_SPEED, 0)
})

keyDown('right', () => {
  player.move(MOVE_SPEED, 0)
})

//Bullets
function spawnBullet(p){
  add([
    rect(5,12),
    pos(p),
    origin('center'),
    color(1,0.9,0.2),
    'bullet'
  ])
}

keyPress('space', ()=>{
spawnBullet(player.pos.add(0,0))
})

action('bullet',(b)=>{
  b.move(0,-BULLET_SPEED)
  if (b.pos.y < 0){
    destroy(b)
  }
})

collides('bullet','space_invader',(b,s)=>{
  camShake(4),
  destroy(b),
  destroy(s),
  score.value++
  score.text=score.value
})
//Score Card
const score = add([
  text('0'),
  pos(50, 50),
  layer('ui'),
  scale(3),
  {
    value: 0,
  }
])
//Timer
const timer = add([
  text('0'),
  pos(100, 50),
  layer('ui'),
  scale(2),
  {
    time: TIME_LEFT,
  },
])

//review the timer section of this 
timer.action(() => {
  timer.time -= dt()
  timer.text = timer.time.toFixed(1)
  if (timer.time <= 0) {
    go('lose', {score:score.value})
  }
})
//Space Invader
action('space_invader', (s) => {
  s.move(CURRENT_SPEED, 0)
})

collides('space_invader', 'right-wall', () => {
  CURRENT_SPEED = -INVADER_SPEED
  every('space_invader', (s) => {
    s.move(0, LEVEL_DOWN)
  })
})

collides('space_invader', 'left-wall', () => {
  CURRENT_SPEED = INVADER_SPEED
  every('space_invader', (s) => {
    s.move(0, LEVEL_DOWN)
  })
})

player.overlaps('space_invader', () => {
  go('lose', { score: score.value })
})

action('space_invader', (s) => {
  if (s.pos.y >= (12 * 22)) {
    //you can also use this as a calculation: 
    //if (s.pos.y >=height()/2) {}
    go('lose', { score: score.value })
  }
}) 