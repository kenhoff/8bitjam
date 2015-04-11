var game = new Phaser.Game("100", "100", Phaser.AUTO, '', { preload: preload, create: create, update: update });

var cursors

function preload () {
	
	game.stage.backgroundColor = "#ffffff"

	cursors = game.input.keyboard.createCursorKeys();


}
function create () {

	bmd = game.add.bitmapData(32, 32)

	bmd.circle(16, 16, 16)

	player = game.add.sprite(200,200,bmd)

	game.physics.startSystem(Phaser.Physics.ARCADE)
	game.physics.arcade.enable(player)

	player.anchor.setTo(0.5, 0.5)
	player.body.collideWorldBounds = true
	player.body.drag.set(400)
	player.body.maxVelocity.set(350)

}

playerSpeed = 2000

function update () {
	player.body.acceleration.set(0)

	if (cursors.right.isDown) {
		player.body.acceleration.add(playerSpeed, 0)
	}
	if (cursors.left.isDown) {
		player.body.acceleration.add(-playerSpeed, 0)
	}
	if (cursors.up.isDown) {
		player.body.acceleration.add(0, -playerSpeed)
	}
	if (cursors.down.isDown) {
		player.body.acceleration.add(0, playerSpeed)
	}
}
