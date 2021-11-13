import kaboom from "kaboom";

;((self) => 
{
    let HEIGHT = 800;
    let WIDTH = 480;
    let STRETCH = false;
      if(innerWidth < innerHeight)
      {
        WIDTH = parseInt(HEIGHT/(innerHeight/innerWidth),10);
        STRETCH = true;
      }
      else
      {
        STRETCH = false;
        HEIGHT = innerHeight;
        WIDTH = parseInt((innerHeight/HEIGHT * WIDTH),10);
      }
      let SPEED_X = WIDTH / 4;
console.log("widht => " + WIDTH)
      kaboom(
      {
        width: WIDTH,
        height: HEIGHT,
        global: true,
        stretch: STRETCH
      });

loadBean()
      let _center = () =>
      {
        return vec2(WIDTH / 2, HEIGHT / 2);
      };
      window.c = _center;
      scene("menu", (args) => {

        var startButton = add([
          text("Start", 24),
          color(rgb(0,100,100)),
          origin("center"),
          area({ cursor: "pointer", }),
          pos(_center()),
        ]);
        window.$S = startButton;

        startButton.onUpdate(() => {
          if (startButton.isHovering())
          {
            startButton.color = rgb(200, 100, 100);
          } else {
            startButton.color = rgb(255, 255, 255);
          }
        });

        startButton.onClick(() => {
          console.log('clicked');
          go("main");
        });
      });

      // define a scene
      scene("main", () => {

layers([
	"game",
	"ui",
], "game")

        // add a text at position (100, 100)
        var player = add([
          sprite("bean"),
          origin("center"),
          color(rgb(255, 255, 255)),
          pos(_center()),
          area(),
          body(),
          "player",
        ]);
        window.$P = player;
        let left_btn = null;
        let right_btn = null;
        if(isTouch())
        {
          left_btn = add([
            origin("center"),
            pos(40, HEIGHT-40),
            //sprite("bean"),
            fixed(),
            layer("ui"),
            text('<'),
            area({ cursor: "pointer", }),
            "left_b"
          ]);
          window.$L = left_btn;
          left_btn.onClick(() =>
          {
            console.log("LEFT_A");
            player.move(-SPEED_X, 0);

          });
          left_btn.on('Click', () =>
          {
            console.log("LEFT_B");
            player.move(-SPEED_X, 0);
          });

          right_btn = add([
            origin("center"),
            pos(WIDTH-40, HEIGHT-40),
            circle(30),
            layer("ui"),
            fixed(),
            "right_b"
          ])

          right_btn.on('touch', () =>
          {
            console.log("LEFT");
            player.move(-SPEED_X, 0);
          });
        }

        var lastPosY = player.pos.y;
        var highestPlatformY = HEIGHT;

        //create first 10 platforms
        for (let i = 0; i < 10; i++) {
          createPlatform();
        }


        player.collides("platform", (p) => {
          if (player.pos.y > lastPosY) {
            player.jump(HEIGHT);
          }
        });

        onKeyPress("space", () => {
          console.log("AAA");
        })

        onKeyDown("left", () => {
          player.move(-SPEED_X, 0);
          console.log("L");
        });
        onKeyDown("right", () => {
          player.move(SPEED_X, 0);
          console.log("R");
        });

        player.onUpdate(() => {
          lastPosY = player.pos.y;
          camPos({ x: WIDTH / 2, y: player.pos.y });
          if (player.pos.x > WIDTH + player.width / 2) {
            player.pos.x = -player.width / 2;
          }
          if (player.pos.x < -player.width / 2) {
            player.pos.x = WIDTH + player.width / 2;
          }
        });

        onUpdate("platform", (platform) => {
          if (platform.pos.y > player.pos.y + HEIGHT / 2) {
            destroy(platform);
            createPlatform();
          }
        });

        onUpdate("player", (player) =>
        {
          if (player.pos.y > HEIGHT*2) {
            go("menu");
          }
        });

        function createPlatform() {
          let newPlatform = add([
            rect(120, 24),
            origin("center"),
            color(rgb(255, 255, 255)),
            pos(
              rand(60, WIDTH - 60),
              rand(highestPlatformY - 40, highestPlatformY - 200)
            ),
            area(),
            "platform",
          ]);
          if (newPlatform.pos.y < highestPlatformY) {
            highestPlatformY = newPlatform.pos.y;
          }
        }
      });

      // start the game
      
      go("menu");
})();
