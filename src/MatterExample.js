import React, { useRef, useEffect } from "react";
import Matter from "matter-js";

function MatterExample() {
    const bodyRef =  useRef(null)
    const canvasRef = useRef(null)

    //***** grabbed from example code *****//
      try {
        if (typeof MatterWrap !== 'undefined') {
            // either use by name from plugin registry (Browser global)
            Matter.use('matter-wrap');
        } else {
            // or require and use the plugin directly (Node.js, Webpack etc.)
            Matter.use(require('matter-wrap'));
        }
    } catch (e) {
        // could not require the plugin or install needed
    }

useEffect(() => {   
    let Engine = Matter.Engine
    let Render = Matter.Render
    let Bodies = Matter.Bodies
    let Mouse = Matter.Mouse
    let Composites = Matter.Composites
    let Common = Matter.Common
    let World = Matter.World
    let MouseConstraint = Matter.MouseConstraint;

    let engine = Engine.create();
    
    let render = Render.create({
        element: bodyRef.current,
        engine: engine,
        canvas: canvasRef.current,
        options: {
            width: 800,
            height: 600,
            background: '#0c1459',
            wireframes: false,
        }
    });

    //**** create a stack of random sized balls*****//
    const stack = Composites.stack (150, 5, 5, 5, 0, 0, function(x, y) {
        return Bodies.circle(x, y, (50, 51), {  restitution: 1.05, density: 0.001, render: { fillStyle: '#ff00ea' } });
    });

        
    // const boxB = Bodies.circle(450, 50, 50, 80);
    const groundA = Bodies.rectangle(150, 400, 360, 20, { isStatic: true , render: { fillStyle: '#21ffae' }});
    const groundB = Bodies.rectangle(650, 400, 360, 20, { isStatic: true, render: { fillStyle: '#21ffae' } });
    const wallLeft = Bodies.rectangle(10, 190, 20, 400, { isStatic: true, render: { fillStyle: '#21ffae' } });
    const wallRight = Bodies.rectangle(790, 190, 20, 400, { isStatic: true, render: { fillStyle: '#21ffae' } });

    // add all of the bodies to the world
    World.add(engine.world, [groundA, groundB, wallLeft, wallRight, stack]);

    //***** add mouse constraint to grab and move objects *****//
    let mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
          mouse: mouse,
            constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
            }
        });
      
      World.add(engine.world, mouseConstraint);

      // loop all the bodies in bounds
      for (var i = 0; i < stack.bodies.length; i += 1) {
        stack.bodies[i].plugin.wrap = {
            min: { x: render.bounds.min.x, y: render.bounds.min.y },
            max: { x: render.bounds.max.x, y: render.bounds.max.y }
        };
    }
        // run the renderer
        // run the engine
        Render.run(render)
        Engine.run(engine)
}, [] )

return (
    <div  
    ref={bodyRef}
    style={{
        width: 800,
        height: 600,
    }}
    >
        <canvas className="canvas" 
        ref={canvasRef} />
    </div>
  )
}

export default MatterExample;