import { createMod } from "@fruit-pie/sdk";
import { initText } from "@fruit-pie/text";

// Import sprites
import cherry0 from "./sprites/cherry-0.png?inline";
import cherry1 from "./sprites/cherry-1.png?inline";

// Import fonts
import fredoka from "./fonts/fredoka-latin.woff2?inline";

export default createMod((mod) => {
  const cherry = mod.resource.sprite.create("cherry", { origin: { x: 10, y: 12 } });
  void cherry.load([cherry0, cherry1]);

  const { drawText, createText } = initText(mod, {
    fonts: { fredoka },
  });

  const hello = createText("こんにちは、世界", { font: "fredoka", size: 22 });

  mod.resource.object.create({
    name: "main",
    vars: ["left", "top", "width", "height", "frame"],
    events: {
      draw: ({ v }) => `
        if (view_enabled) {
          ${v.left} = view_xview[0];
          ${v.top} = view_yview[0];
          ${v.width} = view_wview[0];
          ${v.height} = view_hview[0];
        } else {
          ${v.left} = 0;
          ${v.top} = 0;
          ${v.width} = room_width;
          ${v.height} = room_height;
        }

        draw_set_color(c_blue);
        ${drawText(`${v.left} + 8`, `${v.top} + 8`, hello)}

        if (${cherry.id} >= 0) {
          ${v.frame} = floor(current_time / 200) mod sprite_get_number(${cherry.id});
          draw_sprite(
            ${cherry.id},
            ${v.frame},
            ${v.left} + ${v.width} / 2,
            ${v.top} + ${v.height} / 2
          );
        }
      `,
      step: ({ send }) => `
        if (keyboard_check_pressed(ord("H"))) ${send("ping", "room_get_name(room)")}
      `,
    },
    receive: {
      pong: ({ payload }) => `show_message("Pong received in room " + ${payload});`,
    },
  });

  mod.on("ping", (room) => {
    console.log(`Ping received from room ${room}`);
    mod.send("pong", room);
  });
});
