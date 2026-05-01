/**
 * Neural Hero - Elegant Procedural 3D Neural Network Visualization
 * 
 * A beautiful, sophisticated neural network structure with:
 * - Procedurally generated 3D graph using spatial constraints
 * - Animated data particles flowing through connections
 * - 3D perspective projection with continuous rotation
 * - Depth-based rendering with glow effects
 * 
 * Color Theme (matches portfolio):
 * - Root: Red (hsla(0,60%,...))
 * - Connections: Cyan (hsla(200,60%,...))
 * - End nodes: Emerald (hsla(160,60%,...))
 * - Data: Gold (hsla(40,80%,...))
 */

import { useEffect, useRef } from "react";


// ─────────────────────────────────────────────────────────────────────────────
// TYPES & INTERFACES
// ─────────────────────────────────────────────────────────────────────────────

const NeuralHero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Get parent container dimensions
    const parent = canvas.parentElement;
    if (!parent) return;
    
    const rect = parent.getBoundingClientRect();
    let w = (canvas.width = Math.max(rect.width, 400));
    let h = (canvas.height = Math.max(rect.height, 480));
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Configuration - perfectly tuned for elegance
    const opts = {
      range: 180,
      baseConnections: 3,
      addedConnections: 5,
      baseSize: 5,
      minSize: 1,
      dataToConnectionSize: 0.4,
      sizeMultiplier: 0.7,
      allowedDist: 40,
      baseDist: 40,
      addedDist: 30,
      connectionAttempts: 100,
      dataToConnections: 1,
      baseSpeed: 0.04,
      addedSpeed: 0.05,
      baseGlowSpeed: 0.4,
      addedGlowSpeed: 0.4,
      rotVelX: 0.003,
      rotVelY: 0.002,
      repaintColor: "#0a0e27",
      connectionColor: "hsla(200,60%,light%,alp)",
      rootColor: "hsla(0,60%,light%,alp)",
      endColor: "hsla(160,60%,light%,alp)",
      dataColor: "hsla(40,80%,light%,alp)",
      wireframeWidth: 0.25,
      wireframeColor: "hsla(200,100%,55%,0.95)",
      depth: 250,
      focalLength: 250,
      vanishPoint: { x: w / 2, y: h / 2 },
    };

    const squareRange = opts.range * opts.range;
    const squareAllowed = opts.allowedDist * opts.allowedDist;
    const mostDistant = opts.depth + opts.range;
    const Tau = Math.PI * 2;

    let sinX = 0, sinY = 0, cosX = 0, cosY = 0;

    interface Connection {
      x: number;
      y: number;
      z: number;
      size: number;
      screen: { x: number; y: number; z: number; scale: number; color?: string };
      links: Connection[];
      isEnd: boolean;
      glowSpeed: number;
    }

    interface DataPoint {
      x: number;
      y: number;
      z: number;
      size: number;
      screen: { x: number; y: number; z: number; scale: number; lastX?: number; lastY?: number; color?: string };
      glowSpeed: number;
      speed: number;
      connection: Connection;
      nextConnection: Connection;
      ox: number;
      oy: number;
      oz: number;
      os: number;
      nx: number;
      ny: number;
      nz: number;
      ns: number;
      dx: number;
      dy: number;
      dz: number;
      ds: number;
      proportion: number;
      ended?: number;
      firstRender?: boolean;
      setConnection?: (conn: Connection) => void;
    }

    const connections: Connection[] = [];
    const toDevelop: Connection[] = [];
    const data: DataPoint[] = [];
    const all: (Connection | DataPoint)[] = [];
    let tick = 0;
    let animating = false;

    function squareDist(a: { x: number; y: number; z: number }, b: { x: number; y: number; z: number }) {
      const x = b.x - a.x;
      const y = b.y - a.y;
      const z = b.z - a.z;
      return x * x + y * y + z * z;
    }

    function createConnection(x: number, y: number, z: number, size: number): Connection {
      return {
        x,
        y,
        z,
        size,
        screen: { x: 0, y: 0, z: 0, scale: 0 },
        links: [],
        isEnd: false,
        glowSpeed: opts.baseGlowSpeed + opts.addedGlowSpeed * Math.random(),
      };
    }

    function linkConnection(connection: Connection) {
      if (connection.size < opts.minSize) {
        connection.isEnd = true;
        return;
      }

      const links: Array<{ x: number; y: number; z: number }> = [];
      const connectionsNum = opts.baseConnections + (Math.random() * opts.addedConnections) | 0;
      let attempt = opts.connectionAttempts;

      while (links.length < connectionsNum && --attempt > 0) {
        const alpha = Math.random() * Math.PI;
        const beta = Math.random() * Tau;
        const len = opts.baseDist + opts.addedDist * Math.random();

        const cosA = Math.cos(alpha);
        const sinA = Math.sin(alpha);
        const cosB = Math.cos(beta);
        const sinB = Math.sin(beta);

        const pos = {
          x: connection.x + len * cosA * sinB,
          y: connection.y + len * sinA * sinB,
          z: connection.z + len * cosB,
        };

        if (pos.x * pos.x + pos.y * pos.y + pos.z * pos.z < squareRange) {
          let passedExisting = true;
          let passedBuffered = true;

          for (let i = 0; i < connections.length; ++i) {
            if (squareDist(pos, connections[i]) < squareAllowed) {
              passedExisting = false;
            }
          }

          if (passedExisting) {
            for (let i = 0; i < links.length; ++i) {
              if (squareDist(pos, links[i]) < squareAllowed) {
                passedBuffered = false;
              }
            }
          }

          if (passedExisting && passedBuffered) {
            links.push({ x: pos.x, y: pos.y, z: pos.z });
          }
        }
      }

      if (links.length === 0) {
        connection.isEnd = true;
      } else {
        for (let i = 0; i < links.length; ++i) {
          const pos = links[i];
          const conn = createConnection(pos.x, pos.y, pos.z, connection.size * opts.sizeMultiplier);
          connection.links[i] = conn;
          all.push(conn);
          connections.push(conn);
        }
        for (let i = 0; i < connection.links.length; ++i) {
          toDevelop.push(connection.links[i]);
        }
      }
    }

    function createDataPoint(connection: Connection): DataPoint {
      const dp: DataPoint = {
        x: 0,
        y: 0,
        z: 0,
        size: 0,
        screen: { x: 0, y: 0, z: 0, scale: 0 },
        glowSpeed: opts.baseGlowSpeed + opts.addedGlowSpeed * Math.random(),
        speed: opts.baseSpeed + opts.addedSpeed * Math.random(),
        connection,
        nextConnection: connection,
        ox: 0,
        oy: 0,
        oz: 0,
        os: 0,
        nx: 0,
        ny: 0,
        nz: 0,
        ns: 0,
        dx: 0,
        dy: 0,
        dz: 0,
        ds: 0,
        proportion: 0,
        firstRender: true,
      };

      dp.setConnection = (conn: Connection) => {
        if (conn.isEnd) {
          dp.connection = connections[0];
          dp.ended = 2;
          dp.proportion = 0; // Reset proportion to prevent infinite loop at end nodes
        } else {
          dp.connection = conn;
          dp.nextConnection = conn.links[(conn.links.length * Math.random()) | 0];

          dp.ox = conn.x;
          dp.oy = conn.y;
          dp.oz = conn.z;
          dp.os = conn.size;

          dp.nx = dp.nextConnection.x;
          dp.ny = dp.nextConnection.y;
          dp.nz = dp.nextConnection.z;
          dp.ns = dp.nextConnection.size;

          dp.dx = dp.nx - dp.ox;
          dp.dy = dp.ny - dp.oy;
          dp.dz = dp.nz - dp.oz;
          dp.ds = dp.ns - dp.os;

          dp.proportion = 0;
        }
      };

      dp.setConnection!(connection);
      return dp;
    }

    function setScreen(obj: Connection | DataPoint) {
      let x = obj.x;
      let y = obj.y;
      let z = obj.z;

      const Y = y;
      y = y * cosX - z * sinX;
      z = z * cosX + Y * sinX;

      const Z = z;
      z = z * cosY - x * sinY;
      x = x * cosY + Z * sinY;

      obj.screen.z = z;
      z += opts.depth;

      obj.screen.scale = opts.focalLength / z;
      obj.screen.x = opts.vanishPoint.x + x * obj.screen.scale;
      obj.screen.y = opts.vanishPoint.y + y * obj.screen.scale;
    }

    function stepConnection(connection: Connection) {
      setScreen(connection);
      const light = 30 + ((tick * connection.glowSpeed) % 30);
      const alp = (1 - connection.screen.z / mostDistant) * 0.8;
      
      // Use red for root node, emerald for end nodes, cyan for others
      const isRoot = connection === connections[0];
      connection.screen.color = (isRoot ? opts.rootColor : connection.isEnd ? opts.endColor : opts.connectionColor)
        .replace("light", light.toString())
        .replace("alp", alp.toString());

      // Skip drawing connection lines until projection is fully initialized to prevent corner artifacts
      if (tick > 10) {
        for (let i = 0; i < connection.links.length; ++i) {
          ctx.moveTo(connection.screen.x, connection.screen.y);
          ctx.lineTo(connection.links[i].screen.x, connection.links[i].screen.y);
        }
      }
    }

    function drawConnection(connection: Connection) {
      ctx.fillStyle = connection.screen.color || "#0088ff";
      ctx.beginPath();
      ctx.arc(connection.screen.x, connection.screen.y, connection.screen.scale * connection.size, 0, Tau);
      ctx.fill();
    }

    function stepData(d: DataPoint) {
      d.proportion += d.speed;

      if (d.proportion < 1) {
        d.x = d.ox + d.dx * d.proportion;
        d.y = d.oy + d.dy * d.proportion;
        d.z = d.oz + d.dz * d.proportion;
        d.size = (d.os + d.ds * d.proportion) * opts.dataToConnectionSize;
      } else {
        d.setConnection!(d.nextConnection);
      }

      d.screen.lastX = d.screen.x;
      d.screen.lastY = d.screen.y;
      setScreen(d);

      const light = 40 + ((tick * d.glowSpeed) % 50);
      const alp = 0.2 + (1 - d.screen.z / mostDistant) * 0.6;
      d.screen.color = opts.dataColor
        .replace("light", light.toString())
        .replace("alp", alp.toString());
    }

    function drawData(d: DataPoint) {
      if (d.ended) {
        if (--d.ended === 0) {
          // Reset particle to start new journey from root when animation ends
          d.firstRender = true;
          d.setConnection!(connections[0]);
        }
        return;
      }

      // Skip trail drawing on first frame to prevent artifact from (0,0)
      if (!d.firstRender) {
        ctx.beginPath();
        ctx.strokeStyle = d.screen.color || "#ffcc00";
        ctx.lineWidth = d.size * d.screen.scale;
        ctx.moveTo(d.screen.lastX || d.screen.x, d.screen.lastY || d.screen.y);
        ctx.lineTo(d.screen.x, d.screen.y);
        ctx.stroke();
      }
      
      d.firstRender = false;
    }

    function init() {
      connections.length = 0;
      data.length = 0;
      all.length = 0;
      toDevelop.length = 0;

      const connection = createConnection(0, 0, 0, opts.baseSize);
      connections.push(connection);
      all.push(connection);
      linkConnection(connection);

      while (toDevelop.length > 0) {
        linkConnection(toDevelop[0]);
        toDevelop.shift();
      }

      if (!animating) {
        animating = true;
      }
    }

    // Initialize without background - canvas starts transparent
    setTimeout(init, 50);

    function anim() {
      requestAnimationFrame(anim);

      // Clear canvas transparently to show portfolio background
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, w, h);

      ++tick;

      const rotX = tick * opts.rotVelX;
      const rotY = tick * opts.rotVelY;

      cosX = Math.cos(rotX);
      sinX = Math.sin(rotX);
      cosY = Math.cos(rotY);
      sinY = Math.sin(rotY);

      if (data.length < connections.length * opts.dataToConnections) {
        const datum = createDataPoint(connections[0]);
        data.push(datum);
        all.push(datum);
      }

      ctx.globalCompositeOperation = "lighter";
      ctx.beginPath();
      ctx.lineWidth = opts.wireframeWidth;
      ctx.strokeStyle = opts.wireframeColor;

      for (const item of all) {
        if ("proportion" in item) {
          stepData(item as DataPoint);
        } else {
          stepConnection(item as Connection);
        }
      }

      ctx.stroke();

      ctx.globalCompositeOperation = "source-over";
      all.sort((a, b) => b.screen.z - a.screen.z);

      for (const item of all) {
        if ("proportion" in item) {
          drawData(item as DataPoint);
        } else {
          drawConnection(item as Connection);
        }
      }
    }

    anim();

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      w = canvas.width = Math.max(rect.width, 400);
      h = canvas.height = Math.max(rect.height, 480);
      opts.vanishPoint.x = w / 2;
      opts.vanishPoint.y = h / 2;
      ctx.fillRect(0, 0, w, h);
    };

    const handleClick = () => {
      init();
    };

    window.addEventListener("resize", handleResize);
    canvas.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{
        display: "block",
        background: "transparent",
        mixBlendMode: "screen",
      }}
      aria-hidden="true"
    />
  );
};

export default NeuralHero;