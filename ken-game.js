var game = new Phaser.Game("100", "100", Phaser.AUTO, '', { preload: preload, create: create, update: update });

var cursors, spacebarKey, enemies, currentSplats, text, titleText, titleInstructions

var random = new Phaser.RandomDataGenerator()

	
// ~~~~~ CONSTS ~~~~~	
	

splatGoal = 25
hitDist = 125
playerSpeed = 2000
//enemySpeed = 0
enemySpeed = playerSpeed / 2 
spawnInterval = 0.5
r = random.realInRange(0, 255) 
g = random.realInRange(0, 255) 
b = random.realInRange(0, 255) 
splatColor = r << 16 | g << 8 | b;

function preload () {

	game.load.audio("music", "Joshua Du Chene - 8 Bit Game Jam Song Loop.ogg")

	game.stage.backgroundColor = "#ffffff"

	cursors = game.input.keyboard.createCursorKeys();

	game.load.image("splat1", "splat1.png")
	game.load.image("splat2", "splat2.png")
	game.load.image("splat3", "splat3.png")
	game.load.image("splat4", "splat4.png")
	game.load.image("splat5", "splat5.png")


	game.load.spritesheet("explosion", "explosion.png", 128, 128)

}
function create () {

	game.add.audio("music", 1, true).play("", 0, 1, true)


	currentSplats = []

	boxBitmapData = game.add.bitmapData(256, 256)
	boxBitmapData.rect(0, 0, 256, 256, "#dddddd")
	scoreBox = game.add.sprite(game.world.width/2, game.world.height/2, boxBitmapData)
	scoreBox.anchor.setTo(0.5, 0.5)

	game.physics.startSystem(Phaser.Physics.ARCADE)
	playerBitmapData = game.add.bitmapData(32, 32)

	playerBitmapData.circle(16, 16, 16)

	player = game.add.sprite(game.world.width/2, game.world.height/2, playerBitmapData)

	game.physics.arcade.enable(player)

	player.anchor.setTo(0.5, 0.5)
	player.body.collideWorldBounds = true
	player.body.drag.set(400)
	player.body.maxVelocity.set(350)


	splats = game.add.group()
	enemies = game.add.group()

	enemyBitmapData = game.add.bitmapData(32, 32)

	enemyBitmapData.rect(0,0,32, 32)
	
	spacebarKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	
	
	spacebarKey.onDown.add(function() {
		if (player.alive) {
			enemies.forEach(function (enemy) {
				//check all the sprites, see how far away they are
				if (game.physics.arcade.distanceBetween(player, enemy) < hitDist) {
					//if they're close enough, enemy.splat
					enemy.splat()
				}
			})
		}

	})


	spawnTimer = game.time.create(false) // what does this do again?
	spawnTimer.loop(spawnInterval * 1000, spawnEnemy, this)



	game.add.text(16, game.world.height - 32, "created by @ken_hoff", {
        font: "bold 16px Courier New",
        fill: "#000000",
    });
	game.add.text(game.world.width - 235, game.world.height - 32, "music by @JoshuaDuChene", {
        font: "bold 16px Courier New",
        fill: "#000000",
    });


	text = game.add.text(game.world.centerX, 65, "0%", {
        font: "bold 65px Courier New",
        fill: "#000000",
        align: "center"
    });

    text.anchor.setTo(0.5, 0.5);
	text.alpha = 0

	titleCreditText = game.add.text(game.world.centerX, 100, "banana cat's", {
        font: "bold 16px Courier New",
        fill: "#000000",
        align: "center"
	})
	titleCreditText.anchor.setTo(0.5, 0.5)

	titleText = game.add.text(game.world.centerX, 130, "VIOLENCE", {
        font: "bold 65px Courier New",
        fill: "#000000",
        align: "center"
	})

	titleText.anchor.setTo(0.5, 0.5)

	keysBitmapData = game.add.bitmapData(256, 256)
	keysBitmapData.rect(0, 32+8, 128, 32)
	keysBitmapData.rect(128 + 16,32 + 8,32,32)
	keysBitmapData.rect(128 + 16 + 32 + 8,32 + 8,32,32)
	keysBitmapData.rect(128 + 16 + 32 + 8,0,32,32)
	keysBitmapData.rect(128 + 16 + 32 + 8 + 32 + 8,32+8,32,32)


	keys = game.add.sprite(game.world.width/2, game.world.height - 32, keysBitmapData)
	keys.anchor.setTo(0.5, 0.5)


	spacebarKey.onDown.add(function () {
		if (spawnTimer.running != true) {
			spawnTimer.start()
			game.add.tween(text).to({alpha: 1}, 2000, Phaser.Easing.Linear.None, true)
			game.add.tween(titleText).to({alpha: 0}, 2000, Phaser.Easing.Linear.None, true)
			game.add.tween(titleCreditText).to({alpha: 0}, 2000, Phaser.Easing.Linear.None, true)
			game.add.tween(keys).to({alpha: 0}, 2000, Phaser.Easing.Linear.None, true)
		}
		if (player.alive) {
			explosion = game.add.sprite(player.position.x, player.position.y, 'explosion');
			explosion.tint = "#000000"
			explosion.anchor.setTo(0.5, 0.5);

			// Add an animation for the explosion that kills the sprite when the
			// animation is complete
			var animation = explosion.animations.add('boom', [0,1,2,3], 60, false);
			animation.killOnComplete = true;

			explosion.angle = this.game.rnd.integerInRange(0, 360);

			// Play the animation
			explosion.animations.play('boom');
		}
	
	})

}


function spawnEnemy () {

	x = random.pick([-100, game.world.width + 100])
	y = random.pick([-100, game.world.height + 100])

	enemy = game.add.sprite(x, y, enemyBitmapData)
	enemies.add(enemy)
	game.physics.arcade.enable(enemy)
	enemy.anchor.setTo(0.5, 0.5)
	enemy.body.drag.set(400)
	enemy.body.maxVelocity.set(350 * 0.5)
	enemy.splat = function () {
		splat = game.add.sprite(this.position.x, this.position.y, random.pick(["splat1", "splat3", "splat4", "splat5"]))
		splat.anchor.setTo(0.5, 0.5)
		splat.tint = splatColor
		splat.rotation = random.realInRange(0, 6.283)
		splats.add(splat)
		splats.bringToTop(splat)
		enemies.remove(this)
		currentSplats.push(splat)

		totalX = 0
		totalY = 0

		currentSplats.forEach(function (s) {
			totalX += s.position.x
			totalY += s.position.y
		})

		avgX = totalX / currentSplats.length
		avgY = totalY / currentSplats.length

		countPercent = currentSplats.length / splatGoal
		locationAvg = (avgX / game.world.width) + (avgY / game.world.height) / 2
		score = ((countPercent * 0.8) + (locationAvg * 0.2)) * 100



		if (score > 100) {
			currentSplats = []
			r = random.realInRange(0, 255) 
			g = random.realInRange(0, 255) 
			b = random.realInRange(0, 255) 
			splatColor = r << 16 | g << 8 | b;
		}

		text.setText(parseInt(score) + "%")


		player.bringToTop()

		this.kill()
	}
}

function respawnPlayer () {

	playerBitmapData = game.add.bitmapData(32, 32)

	playerBitmapData.circle(16, 16, 16)
	player = game.add.sprite(game.world.width/2, game.world.height/2, playerBitmapData)

	game.physics.arcade.enable(player)

	player.anchor.setTo(0.5, 0.5)
	player.body.collideWorldBounds = true
	player.body.drag.set(400)
	player.body.maxVelocity.set(350)
	player.bringToTop()
}

function killAllEnemies () {
	enemies.forEach(function (enemy) {
		enemy.kill()
	})
}

function update () {

	game.physics.arcade.collide(player, enemies, function (p, e) {
		splat = game.add.sprite(player.position.x, player.position.y, random.pick(["splat1", "splat3", "splat4", "splat5"]))
		splat.anchor.setTo(0.5, 0.5)
		splat.tint = "0x000000"
		splat.rotation = random.realInRange(0, 6.283)
		splats.add(splat)
		splats.bringToTop(splat)
		player.kill()
		enemies.forEach(function (enemy) {
			enemy.direction = -1;
		})
		game.time.events.add(3000, respawnPlayer)
		game.time.events.add(3000, killAllEnemies)
	})
	game.physics.arcade.collide(enemies, enemies)

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

	if (player.alive) {
		direction = 1;
	}
	else {
		direction = -1	
	}

	enemies.forEach(function(enemy) {
		xdiff = player.position.x - enemy.position.x
		ydiff = player.position.y - enemy.position.y

		enemy.body.acceleration.set(0)

		if (xdiff > 0) {
			enemy.body.acceleration.add(enemySpeed * direction, 0)
		}
		if (xdiff < 0) {
			enemy.body.acceleration.add(-enemySpeed * direction, 0)
		}
		if (ydiff < 0) {
			enemy.body.acceleration.add(0, -enemySpeed * direction)
		}
		if (ydiff > 0) {
			enemy.body.acceleration.add(0, enemySpeed * direction)
		}
	})
}
