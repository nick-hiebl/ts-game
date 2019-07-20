export type Offset = number;
export type Dimension = number;
export type Angle = number;

type Color = string;

export type TimeDelta = number;

export type Setup = () => void;
export type Update = (t: TimeDelta) => void;

export class Canvas {

  private cnv: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  public width: Dimension;
  public height: Dimension;

  constructor(id: string) {
    const cnv: HTMLCanvasElement | null
      = document.querySelector(`canvas#${id}`);
    if (cnv === null) {
      throw `Canvas with id: '${id}' could not be found.`;
    }
    this.cnv = cnv;
    const ctx: CanvasRenderingContext2D | null = this.cnv.getContext('2d');
    if (ctx === null) {
      throw "Could not create CanvasRenderingContext2D";
    }
    this.ctx = ctx;
    this.width = this.cnv.width;
    this.height = this.cnv.height;
  }

  resize(width: Dimension, height: Dimension): void {
    this.width = width;
    this.height = height;

    this.cnv.width = width;
    this.cnv.height = height;
  }

  fillRect(x: Offset, y: Offset, width: Dimension, height: Dimension): void {
    this.ctx.fillRect(x, y, width, height);
  }

  strokeRect(x: Offset, y: Offset, width: Dimension, height: Dimension): void {
    this.ctx.strokeRect(x, y, width, height);
  }

  fillCRect(x: Offset, y: Offset, width: Dimension, height: Dimension): void {
    this.ctx.fillRect(x - width/2, y - height/2, width, height);
  }

  strokeCRect(
    x: Offset, y: Offset, width: Dimension, height: Dimension
  ): void {
    this.ctx.strokeRect(x - width/2, y - height/2, width, height);
  }

  private ellipse(
    x: Offset, y: Offset, width: Dimension, height?: Dimension,
    rotation?: Angle, start?: Angle, end?: Angle
  ): void {
    this.ctx.ellipse(x, y, width, height || width, rotation || 0, start || 0,
      end || 2 * Math.PI);
  }

  fillArc(
    x: Offset, y: Offset, width: Dimension, height?: Dimension,
    rotation?: Angle, start?: Angle, end?: Angle
  ): void {
    this.ctx.beginPath();
    this.ellipse(x, y, width, height, rotation, start, end);
    this.ctx.fill();
  }

  strokeArc(
    x: Offset, y: Offset, width: Dimension, height?: Dimension,
    rotation?: Angle, start?: Angle, end?: Angle
  ): void {
    this.ctx.beginPath();
    this.ellipse(x, y, width, height, rotation, start, end);
    this.ctx.stroke();
  }

  fillSector(
    x: Offset, y: Offset, width: Dimension, height?: Dimension,
    rotation?: Angle, start?: Angle, end?: Angle
  ): void {
    this.ctx.beginPath();
    this.ellipse(x, y, width, height, rotation, start, end);
    this.ctx.lineTo(x, y);
    this.ctx.fill();
  }

  line(x1: Offset, y1: Offset, x2: Offset, y2: Offset): void {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
  }

  background(): void {
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  clear(): void {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  color(color: Color): void {
      this.ctx.fillStyle = color;
      this.ctx.strokeStyle = color;
  }

  lineWidth(width: Dimension) {
    this.ctx.lineWidth = width;
  }

  filter(filter: string) {
    this.ctx.filter = filter;
  }

  drawImage(
    image: CanvasImageSource, dx: Offset, dy: Offset, dWidth?: Dimension,
    dHeight?: Dimension
  ): void {
    if (dWidth && dHeight) {
      this.ctx.drawImage(image, dx, dy, dWidth, dHeight);
    }
    this.ctx.drawImage(image, dx, dy);
  }

  drawImageFrom(
    image: CanvasImageSource, sx: Offset, sy: Offset, sWidth: Dimension,
    sHeight: Dimension, dx: Offset, dy: Offset, dWidth: Dimension,
    dHeight: Dimension
  ): void {
    this.ctx.drawImage(
      image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight
    );
  }

  save(): void {
    this.ctx.save();
  }

  restore(): void {
    this.ctx.restore();
  }

  translate(x: Offset, y: Offset): void {
    this.ctx.translate(x, y);
  }
}

const SETUPS: Setup[] = [];
const UPDATES: Update[] = [];
let started: boolean = false;

function beginLoop(): void {
  let lastFrame = Date.now();

  function loop(): void {
      const thisFrame = Date.now();
      const elapsed: TimeDelta = thisFrame - lastFrame;

      window.requestAnimationFrame(loop);

      for (const update of UPDATES) {
          update(elapsed);
      }

      lastFrame = thisFrame;
  }

  window.requestAnimationFrame(loop);
}

export function addUpdate(f: Update): void {
  UPDATES.push(f);
}

export function addSetup(f: Setup): void {
  SETUPS.push(f);

  if (started) f();
}

window.onload = function() {

  for (const s of SETUPS) {
      s();
  }

  started = true;

  beginLoop();
};
