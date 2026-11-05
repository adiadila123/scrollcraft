import { mulberry } from '@/lib/motion';

/**
 * A particle shape: positions in a -1..1 cube, which particles are accent coloured (W), point sizes (S),
 * optional per-point alpha (A), and an update(t) that animates them. drawShape projects and paints it.
 */
export type Shape = {
  n: number;
  P: Float32Array;
  W: Uint8Array;
  S: Float32Array;
  A: Float32Array | null;
  /** spin speed around y, base tilt around y, tilt around x, base tilt around x */
  vy: number; ay0: number; ax: number; ax0: number;
  /** smoothed pointer position in -1..1 */
  mx: number; my: number;
  /** pointer tilts the shape */
  ptr: boolean;
  /** flat 2D layout using the full canvas width */
  wide: boolean;
  fill: number;
  update: ((t: number) => void) | null;
};

const fract = (v: number) => v - Math.floor(v);
const TAU = 6.2832;

export function makeShape(kind: string): Shape {
  const R = mulberry(11);
  let i: number, j: number, k: number;
  const s: Shape = {
    n: 0, P: new Float32Array(0), W: new Uint8Array(0), S: new Float32Array(0), A: null,
    vy: 0, ay0: 0, ax: 0, ax0: 0, mx: 0, my: 0, ptr: false, wide: false, fill: 0.9, update: null,
  };
  const alloc = (n: number) => {
    s.n = n; s.P = new Float32Array(n * 3); s.W = new Uint8Array(n); s.S = new Float32Array(n);
    for (let q = 0; q < n; q++) { s.W[q] = R() < 0.1 ? 1 : 0; s.S[q] = 0.8 + R() * 0.9; }
  };
  const alphaArr = () => { s.A = new Float32Array(s.n).fill(1); };
  const A = () => s.A!;

  switch (kind) {
    case 'globe': {
      alloc(2600);
      const ga = Math.PI * (3 - Math.sqrt(5));
      for (i = 0; i < s.n; i++) {
        const gy = 1 - (2 * (i + 0.5)) / s.n, gr = Math.sqrt(1 - gy * gy), th = ga * i;
        s.P[i * 3] = Math.cos(th) * gr; s.P[i * 3 + 1] = gy; s.P[i * 3 + 2] = Math.sin(th) * gr;
      }
      s.vy = 0.14; s.ax = 0.4;
      break;
    }
    case 'torus': {
      alloc(3400);
      for (i = 0; i < s.n; i++) {
        const u = R() * TAU, v = R() * TAU, rr = 0.3 + (R() - 0.5) * 0.03;
        s.P[i * 3] = (0.68 + rr * Math.cos(v)) * Math.cos(u);
        s.P[i * 3 + 1] = rr * Math.sin(v);
        s.P[i * 3 + 2] = (0.68 + rr * Math.cos(v)) * Math.sin(u);
      }
      s.vy = 0.16; s.ax = 0.95;
      break;
    }
    case 'lattice': {
      alloc(729);
      for (k = 0, i = 0; i < 9; i++) for (j = 0; j < 9; j++) for (let l = 0; l < 9; l++, k++) {
        s.P[k * 3] = ((i / 8) * 2 - 1) * 0.7; s.P[k * 3 + 1] = ((j / 8) * 2 - 1) * 0.7; s.P[k * 3 + 2] = ((l / 8) * 2 - 1) * 0.7;
        s.S[k] += 0.5;
      }
      s.vy = 0.22; s.ax = 0.5; s.ay0 = 0.4; s.fill = 0.8;
      break;
    }
    case 'terrain': {
      const g = 58; alloc(g * g); s.ax = 1.0; s.fill = 1.0;
      s.update = (t) => {
        for (let n = 0, a = 0; a < g; a++) for (let b = 0; b < g; b++, n++) {
          const x = (a / (g - 1)) * 2 - 1, z = (b / (g - 1)) * 2 - 1;
          s.P[n * 3] = x; s.P[n * 3 + 2] = z;
          s.P[n * 3 + 1] = 0.2 * Math.sin(3 * x + t) + 0.14 * Math.cos(4 * z - 1.3 * t) + 0.1 * Math.sin(5 * (x + z) + 0.7 * t);
        }
      };
      break;
    }
    case 'wave': {
      alloc(61 * 12); s.wide = true; s.fill = 0.92;
      for (i = 0; i < 61; i++) for (j = 0; j < 12; j++) if (j === 5 || j === 6) s.W[i * 12 + j] = 1;
      s.update = (t) => {
        for (let a = 0; a < 61; a++) {
          const x = (a / 60) * 2 - 1;
          const env = (0.12 + 0.88 * Math.abs(Math.sin(x * 3.1 + t * 1.3) * Math.cos(x * 1.7 - t * 0.9))) * (0.35 + 0.65 * Math.exp(-x * x * 1.1));
          for (let b = 0; b < 12; b++) {
            const n = a * 12 + b;
            s.P[n * 3] = x; s.P[n * 3 + 1] = ((b / 11) * 2 - 1) * env * 0.85; s.P[n * 3 + 2] = 0;
          }
        }
      };
      break;
    }
    case 'net': {
      const N = [[-0.85, 0], [-0.35, 0.55], [-0.35, -0.55], [0.2, 0], [0.85, 0]];
      const E = [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [1, 2]];
      const per = 55, cl = 45, ne = E.length * per;
      alloc(ne + N.length * cl); s.wide = true; s.fill = 0.9;
      const off: number[] = [], jit: number[] = [], cx: number[] = [], cy: number[] = [];
      for (i = 0; i < ne; i++) { off.push(R()); jit.push((R() - 0.5) * 0.03); }
      for (i = 0; i < N.length * cl; i++) {
        const an = R() * TAU, rd = Math.sqrt(R()) * 0.09;
        cx.push(Math.cos(an) * rd); cy.push(Math.sin(an) * rd * 1.4); s.W[ne + i] = R() < 0.3 ? 1 : 0;
      }
      s.update = (t) => {
        for (let n = 0; n < ne; n++) {
          const e = E[Math.floor(n / per)], f = fract(off[n] + t * 0.22), a = N[e[0]], b = N[e[1]];
          s.P[n * 3] = a[0] + (b[0] - a[0]) * f; s.P[n * 3 + 1] = a[1] + (b[1] - a[1]) * f + jit[n]; s.P[n * 3 + 2] = 0;
        }
        for (let m = 0; m < N.length * cl; m++) {
          const nd = N[Math.floor(m / cl)], br = 1 + 0.15 * Math.sin(t * 2 + Math.floor(m / cl));
          s.P[(ne + m) * 3] = nd[0] + cx[m] * br; s.P[(ne + m) * 3 + 1] = nd[1] + cy[m] * br; s.P[(ne + m) * 3 + 2] = 0;
        }
      };
      break;
    }
    case 'stream': {
      const L = 9, pl = 90; alloc(L * pl); alphaArr(); s.wide = true; s.fill = 0.94;
      const so: number[] = [], sp: number[] = [];
      for (i = 0; i < s.n; i++) { so.push(R()); sp.push(0.07 + 0.1 * R() + 0.015 * Math.floor(i / pl)); }
      s.update = (t) => {
        for (let n = 0; n < s.n; n++) {
          const lane = Math.floor(n / pl), f = fract(so[n] + t * sp[n]);
          s.P[n * 3] = f * 2 - 1;
          s.P[n * 3 + 1] = -0.62 + lane * 0.1 + 0.04 * Math.sin(f * 9 + so[n] * 20 + t);
          s.P[n * 3 + 2] = 0;
          A()[n] = Math.pow(Math.sin(Math.PI * f), 0.7);
        }
      };
      break;
    }
    case 'rings': {
      const rp = 150, cn = 120; alloc(3 * rp + cn); alphaArr(); s.ax = 1.05; s.fill = 0.95;
      const th2: number[] = [], cr: [number, number][] = [];
      for (i = 0; i < 3 * rp; i++) th2.push(R() * TAU);
      for (i = 0; i < cn; i++) { cr.push([R() * TAU, Math.sqrt(R()) * 0.07]); s.W[3 * rp + i] = 1; }
      s.update = (t) => {
        for (let n = 0; n < 3 * rp; n++) {
          const ring = Math.floor(n / rp), rr = fract(t * 0.2 + ring / 3), rad = rr * 0.95;
          s.P[n * 3] = Math.cos(th2[n]) * rad; s.P[n * 3 + 1] = 0; s.P[n * 3 + 2] = Math.sin(th2[n]) * rad;
          A()[n] = (1 - rr) * Math.min(rr * 6, 1);
        }
        const pul = 1 + 0.25 * Math.sin(t * 2.4);
        for (let m = 0; m < cn; m++) {
          const n = 3 * rp + m;
          s.P[n * 3] = Math.cos(cr[m][0] + t * 0.6) * cr[m][1] * pul; s.P[n * 3 + 1] = 0; s.P[n * 3 + 2] = Math.sin(cr[m][0] + t * 0.6) * cr[m][1] * pul;
          A()[n] = 1;
        }
      };
      break;
    }
    case 'tree': {
      const tp: [number, number, number, number, number][] = [];
      const grow = (x: number, y: number, z: number, ax: number, az: number, len: number, depth: number, b0: number) => {
        const steps = Math.max(5, Math.round(len * 100)), dx = Math.sin(ax) * Math.cos(az), dy = Math.cos(ax), dz = Math.sin(ax) * Math.sin(az), db = 0.12;
        for (let m = 0; m <= steps; m++) { const u = m / steps; tp.push([x + dx * len * u, y + dy * len * u, z + dz * len * u, b0 + u * db, 0]); }
        const ex = x + dx * len, ey = y + dy * len, ez = z + dz * len;
        if (depth === 0) {
          for (let q = 0; q < 6; q++) tp.push([ex + (R() - 0.5) * 0.07, ey + (R() - 0.5) * 0.07, ez + (R() - 0.5) * 0.07, b0 + db + R() * 0.05, 1]);
          return;
        }
        const nb = depth > 2 ? 2 : 3;
        for (let c = 0; c < nb; c++) grow(ex, ey, ez, ax + (R() - 0.5) * 1.1 + (c - (nb - 1) / 2) * 0.85, az + c * 2.1 + R(), len * 0.76, depth - 1, b0 + db);
      };
      grow(0, -0.95, 0, 0, 0, 0.45, 5, 0);
      alloc(tp.length); alphaArr();
      const tB = new Float32Array(s.n), tx0 = new Float32Array(s.n), ty0 = new Float32Array(s.n);
      for (i = 0; i < s.n; i++) {
        s.P[i * 3] = tp[i][0]; s.P[i * 3 + 1] = tp[i][1]; s.P[i * 3 + 2] = tp[i][2];
        tB[i] = tp[i][3]; s.W[i] = tp[i][4]; tx0[i] = tp[i][0]; ty0[i] = tp[i][1];
      }
      s.vy = 0.12; s.ax0 = 0.12; s.ax = 0.12; s.ptr = true; s.fill = 0.82;
      s.update = (t) => {
        const ph = (t * 0.11) % 1.7, out = Math.min(1, Math.max(0, (1.7 - ph) * 3));
        for (let n = 0; n < s.n; n++) {
          A()[n] = Math.min(1, Math.max(0, (ph - tB[n]) * 9)) * out;
          s.P[n * 3] = tx0[n] + Math.sin(t * 0.9 + ty0[n] * 2.2) * 0.02 * (ty0[n] + 1);
        }
      };
      break;
    }
    case 'blocks': {
      const bE = [[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0], [0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]];
      const bL = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
      const bPer = bL.length * 6, bN = 27, bc = 0.3, bg = 0.5;
      const bHome: number[][] = [], bDir: number[][] = [], bDly: number[] = [];
      alloc(bN * bPer); alphaArr(); s.fill = 0.74; s.ax0 = 0.5; s.ax = 0.5; s.vy = 0.2; s.ptr = true;
      const bBase = new Float32Array(s.n * 3), bCube = new Uint8Array(s.n);
      for (let bj = 0; bj < bN; bj++) {
        const bx = (bj % 3) - 1, by = (Math.floor(bj / 3) % 3) - 1, bz = Math.floor(bj / 9) - 1;
        bHome.push([bx * bg, by * bg, bz * bg]);
        const bv = [R() - 0.5, R() - 0.5, R() - 0.5], bl = Math.hypot(bv[0], bv[1], bv[2]) || 1;
        bDir.push([(bv[0] / bl) * 1.4, (bv[1] / bl) * 1.4, (bv[2] / bl) * 1.4]);
        bDly.push(bj === 13 ? 0.78 : (((bx + 1) + (by + 1) + (bz + 1)) / 6) * 0.55 + R() * 0.1);
        for (let bq = 0; bq < bL.length; bq++) for (let bu = 0; bu < 6; bu++) {
          const a = bE[bL[bq][0]], b = bE[bL[bq][1]], bn = bj * bPer + bq * 6 + bu, f = bu / 6;
          bBase[bn * 3] = (a[0] + (b[0] - a[0]) * f - 0.5) * bc; bBase[bn * 3 + 1] = (a[1] + (b[1] - a[1]) * f - 0.5) * bc; bBase[bn * 3 + 2] = (a[2] + (b[2] - a[2]) * f - 0.5) * bc;
          bCube[bn] = bj; s.W[bn] = bj === 13 ? 1 : 0;
        }
      }
      s.update = (t) => {
        const ph = (t * 0.12) % 1.75, out = Math.min(1, Math.max(0, (1.75 - ph) * 4));
        for (let n = 0; n < s.n; n++) {
          const j2 = bCube[n], h = bHome[j2], d = bDir[j2];
          const p = Math.min(1, Math.max(0, (ph - bDly[j2]) * 2.2)), e = 1 - Math.pow(1 - p, 3);
          const pul = j2 === 13 && p >= 1 ? 1 + 0.1 * Math.sin(t * 3) : 1;
          s.P[n * 3] = h[0] + d[0] * (1 - e) + bBase[n * 3] * pul;
          s.P[n * 3 + 1] = h[1] + d[1] * (1 - e) + bBase[n * 3 + 1] * pul;
          s.P[n * 3 + 2] = h[2] + d[2] * (1 - e) + bBase[n * 3 + 2] * pul;
          A()[n] = p * out;
        }
      };
      break;
    }
    case 'text': {
      s.wide = true; s.fill = 0.92;
      const xRows = 9, xs: [number, number, number, number, number][] = [];
      for (let xr = 0; xr < xRows; xr++) {
        let xx = -0.9;
        const xmax = xr % 4 === 3 ? 0.1 + R() * 0.5 : 0.85 - R() * 0.15, xlist: [number, number, number][] = [];
        while (xx < xmax - 0.06) { const xw = Math.min(0.1 + R() * 0.3, xmax - xx); xlist.push([xx, xx + xw, R() < 0.13 ? 1 : 0]); xx += xw + 0.05; }
        for (const [x0, x1, accent] of xlist) {
          const cnt = Math.round((x1 - x0) * 80);
          for (let xq = 0; xq < cnt; xq++) for (let xk = 0; xk < 2; xk++) {
            xs.push([x0 + ((x1 - x0) * xq) / cnt, 0.72 - xr * 0.18 + xk * 0.022, xr, (x0 + 0.9) / (xmax + 0.9) + (xq / cnt) * ((x1 - x0) / (xmax + 0.9)), accent]);
          }
        }
      }
      const xBody = xs.length, xCar = 10;
      alloc(xBody + xCar); alphaArr();
      const xRow = new Uint8Array(s.n), xU = new Float32Array(s.n), xBX = new Float32Array(s.n), xBY = new Float32Array(s.n);
      for (i = 0; i < xBody; i++) {
        s.P[i * 3] = xs[i][0]; s.P[i * 3 + 1] = xs[i][1]; xBX[i] = xs[i][0]; xBY[i] = xs[i][1]; xRow[i] = xs[i][2]; xU[i] = xs[i][3]; s.W[i] = xs[i][4];
      }
      for (i = xBody; i < s.n; i++) s.W[i] = 1;
      s.update = (t) => {
        const cyc = (t * 0.11) % 1.3, tpg = cyc * xRows * 0.95, out = Math.min(1, Math.max(0, (1.3 - cyc) * 6));
        const cr = Math.min(xRows - 1, Math.floor(tpg)), cf = Math.min(1, Math.max(0, tpg - cr)), lx = -0.9 + cf * 1.75, bl = Math.sin(t * 9) > 0 ? 1 : 0.3;
        for (let n = 0; n < xBody; n++) {
          const fr = Math.min(1, Math.max(0, tpg - xRow[n]));
          const dx = xBX[n] - s.mx, dy = xBY[n] - s.my, lift = 0.07 * Math.exp(-(dx * dx + dy * dy) * 9);
          s.P[n * 3 + 1] = xBY[n] + lift;
          A()[n] = (xU[n] <= fr ? 1 : 0) * out;
        }
        for (let n = xBody; n < s.n; n++) {
          s.P[n * 3] = lx; s.P[n * 3 + 1] = 0.72 - cr * 0.18 + ((n - xBody) / (xCar - 1) - 0.3) * 0.09;
          A()[n] = tpg < xRows ? bl * out : 0;
        }
      };
      break;
    }
    case 'scaffold': {
      const sL = 6, sH = 0.3, sa = 0.55, sd = 0.4, sy0 = -0.9, sPts: [number, number, number, number][] = [];
      const sAdd = (lv: number, ax: number, ay: number, az: number, bx: number, by: number, bz: number) => {
        for (let q = 0; q < 28; q++) { const f = q / 28; sPts.push([ax + (bx - ax) * f, ay + (by - ay) * f, az + (bz - az) * f, lv]); }
      };
      for (let sk = 0; sk < sL; sk++) {
        const yb = sy0 + sk * sH, yt = yb + sH;
        if (sk === 0) { sAdd(0, -sa, yb, -sd, sa, yb, -sd); sAdd(0, sa, yb, -sd, sa, yb, sd); sAdd(0, sa, yb, sd, -sa, yb, sd); sAdd(0, -sa, yb, sd, -sa, yb, -sd); }
        sAdd(sk, -sa, yt, -sd, sa, yt, -sd); sAdd(sk, sa, yt, -sd, sa, yt, sd); sAdd(sk, sa, yt, sd, -sa, yt, sd); sAdd(sk, -sa, yt, sd, -sa, yt, -sd);
        sAdd(sk, -sa, yb, -sd, -sa, yt, -sd); sAdd(sk, sa, yb, -sd, sa, yt, -sd); sAdd(sk, sa, yb, sd, sa, yt, sd); sAdd(sk, -sa, yb, sd, -sa, yt, sd);
        sAdd(sk, -sa, yb, sd, sa, yt, sd); sAdd(sk, sa, yb, -sd, -sa, yt, -sd);
      }
      const sg = 11;
      for (i = 0; i < sg; i++) for (j = 0; j < sg; j++) sPts.push([((i / (sg - 1)) * 2 - 1) * 0.95, sy0, ((j / (sg - 1)) * 2 - 1) * 0.8, -1]);
      alloc(sPts.length); alphaArr(); s.fill = 0.8; s.ax0 = 0.38; s.ax = 0.38; s.vy = 0.22; s.ptr = true;
      const sLev = new Int8Array(s.n), sY = new Float32Array(s.n);
      for (i = 0; i < s.n; i++) { s.P[i * 3] = sPts[i][0]; s.P[i * 3 + 1] = sPts[i][1]; s.P[i * 3 + 2] = sPts[i][2]; sLev[i] = sPts[i][3]; sY[i] = sPts[i][1]; s.W[i] = 0; }
      s.update = (t) => {
        const p = (t * 0.075) % 1.35, out = Math.min(1, Math.max(0, (1.35 - p) * 7));
        for (let n = 0; n < s.n; n++) {
          const lv = sLev[n];
          if (lv < 0) { A()[n] = 0.35 * out; continue; }
          const a = Math.min(1, Math.max(0, p * sL - lv));
          A()[n] = a * out; s.W[n] = a > 0 && a < 1 ? 1 : 0;
          s.P[n * 3 + 1] = sY[n] - (1 - a) * 0.12;
        }
      };
      break;
    }
    case 'tunnel': {
      const tR = 34, tM = 56;
      alloc(tR * tM); alphaArr(); s.wide = true; s.fill = 1;
      for (i = 0; i < s.n; i++) s.W[i] = (i % tM) % 7 === 0 ? 1 : 0;
      s.update = (t) => {
        const off = t * 0.07 + (window.scrollY || 0) * 0.0007;
        let n = 0;
        for (let jr = 0; jr < tR; jr++) {
          const dd = (((jr / tR - off) % 1) + 1) % 1, z = 0.35 + dd * 3, sc = 0.5 / z;
          for (let m = 0; m < tM; m++, n++) {
            const th = (m / tM) * TAU, ang = th + dd * 2.2, r = 0.55 + 0.1 * Math.sin(3 * th + dd * 9 + t * 0.4);
            s.P[n * 3] = Math.cos(ang) * r * sc * 1.5 + s.mx * 0.3 * dd; s.P[n * 3 + 1] = Math.sin(ang) * r * sc * 1.5 + s.my * 0.3 * dd;
            A()[n] = Math.pow(1 - dd, 0.8) * Math.min(dd * 10, 1);
            s.S[n] = 0.6 + (1 - dd) * 1.6;
          }
        }
      };
      break;
    }
    case 'field': {
      const fG = 52;
      alloc(fG * fG); alphaArr(); s.fill = 0.86; s.ax0 = 0.95; s.ax = 0.95; s.vy = 0.07; s.ptr = true;
      const fR = new Float32Array(s.n);
      for (i = 0; i < fG; i++) for (j = 0; j < fG; j++) {
        k = i * fG + j; s.P[k * 3] = (i / (fG - 1)) * 2 - 1; s.P[k * 3 + 2] = (j / (fG - 1)) * 2 - 1; fR[k] = Math.hypot(s.P[k * 3], s.P[k * 3 + 2]) / 1.05;
      }
      s.update = (t) => {
        const k1 = 10, k2 = 10 + s.mx * 4, sx = s.mx * 0.5, sz = -s.my * 0.5;
        for (let n = 0; n < s.n; n++) {
          const x = s.P[n * 3], z = s.P[n * 3 + 2];
          const r1 = Math.hypot(x + 0.45, z), r2 = Math.hypot(x - 0.45 - sx, z - sz);
          const y = 0.22 * (Math.sin(k1 * r1 - t * 2.2) / (1 + 3 * r1) + Math.sin(k2 * r2 - t * 2.2) / (1 + 3 * r2));
          s.P[n * 3 + 1] = y; s.W[n] = y > 0.1 ? 1 : 0;
          A()[n] = Math.max(0, 1 - Math.pow(fR[n], 4));
        }
      };
      break;
    }
    case 'graph': {
      const gN = 44, gp: number[][] = [], ge: [number, number][] = [], gseen = new Set<number>();
      while (gp.length < gN) {
        const x = R() * 2 - 1, y = R() * 2 - 1, z = R() * 2 - 1;
        if (x * x + y * y + z * z < 1) gp.push([x * 0.82, y * 0.82, z * 0.82]);
      }
      for (let a = 0; a < gN; a++) {
        const best: [number, number][] = [];
        for (let b = 0; b < gN; b++) if (b !== a) best.push([Math.hypot(gp[a][0] - gp[b][0], gp[a][1] - gp[b][1], gp[a][2] - gp[b][2]), b]);
        best.sort((p, q) => p[0] - q[0]);
        for (let q = 0; q < 3; q++) {
          const key = Math.min(a, best[q][1]) * 100 + Math.max(a, best[q][1]);
          if (!gseen.has(key)) { gseen.add(key); ge.push([a, best[q][1]]); }
        }
      }
      const gPer = 16, gNodeP = 10;
      alloc(ge.length * gPer + gN * gNodeP); alphaArr(); s.fill = 0.8; s.vy = 0.16; s.ax0 = 0.25; s.ax = 0.25; s.ptr = true;
      const gEdge = new Int16Array(s.n).fill(-1), gU = new Float32Array(s.n), gSp: number[] = [], gOf: number[] = [];
      for (i = 0; i < ge.length; i++) {
        gSp.push(0.12 + R() * 0.2); gOf.push(R());
        for (j = 0; j < gPer; j++) {
          k = i * gPer + j;
          const gf = j / (gPer - 1), a = gp[ge[i][0]], b = gp[ge[i][1]];
          s.P[k * 3] = a[0] + (b[0] - a[0]) * gf; s.P[k * 3 + 1] = a[1] + (b[1] - a[1]) * gf; s.P[k * 3 + 2] = a[2] + (b[2] - a[2]) * gf;
          gEdge[k] = i; gU[k] = gf; s.W[k] = 0;
        }
      }
      for (i = 0; i < gN; i++) for (j = 0; j < gNodeP; j++) {
        k = ge.length * gPer + i * gNodeP + j;
        s.P[k * 3] = gp[i][0] + (R() - 0.5) * 0.045; s.P[k * 3 + 1] = gp[i][1] + (R() - 0.5) * 0.045; s.P[k * 3 + 2] = gp[i][2] + (R() - 0.5) * 0.045;
        s.W[k] = 1; A()[k] = 1; s.S[k] = 1.3;
      }
      const gEdgeN = ge.length * gPer;
      s.update = (t) => {
        for (let n = 0; n < gEdgeN; n++) {
          const e = gEdge[n], d = (((t * gSp[e] + gOf[e] - gU[n]) % 1) + 1) % 1;
          A()[n] = 0.18 + 0.82 * Math.exp(-d * 10); s.W[n] = d < 0.08 ? 1 : 0;
        }
      };
      break;
    }
    case 'plume': {
      const lN = 1750, lS = 260;
      s.wide = true; s.fill = 0.95; alloc(lN + lS); alphaArr();
      const lAge = new Float32Array(s.n), lG1 = new Float32Array(s.n), lG2 = new Float32Array(s.n);
      const gauss = () => (R() + R() + R() - 1.5) * 0.8;
      for (i = 0; i < lN; i++) { lAge[i] = Math.pow(R(), 1.3) * 0.5; lG1[i] = gauss(); lG2[i] = gauss(); s.W[i] = lAge[i] < 0.03 ? 1 : 0; }
      for (i = lN; i < s.n; i++) { s.P[i * 3] = R() * 2 - 1; s.P[i * 3 + 1] = R() * 2 - 1; lAge[i] = R() * 6.28; s.S[i] = 0.5 + R() * 0.9; s.W[i] = 0; }
      s.update = (t) => {
        const tau = (t * 0.085) % 1, out = tau > 0.9 ? Math.max(0, (1 - tau) * 10) : 1, ox = s.mx * 0.18;
        for (let n = 0; n < lN; n++) {
          const a = lAge[n], tt = tau - a;
          if (tt < 0) { A()[n] = 0; continue; }
          const sp = 0.012 + a * 0.2;
          const px = -0.62 + 1.25 * Math.pow(tt, 1.5) + ox * tt, py = -0.88 + 1.78 * tt - a * 0.1;
          s.P[n * 3] = px + lG1[n] * sp; s.P[n * 3 + 1] = py + lG2[n] * sp;
          A()[n] = Math.pow(1 - a / 0.5, 1.4) * out;
        }
        for (let n = lN; n < s.n; n++) A()[n] = (0.25 + 0.55 * Math.abs(Math.sin(t * 1.3 + lAge[n]))) * 0.7;
      };
      break;
    }
  }
  s.update?.(0);
  return s;
}

/** Projects the shape and paints it as additive squares: white first, then accent blue on top. */
export function drawShape(ctx: CanvasRenderingContext2D, w: number, h: number, dpr: number, s: Shape, t: number, pmx: number, pmy: number) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, w, h);
  s.mx += (pmx - s.mx) * 0.07;
  s.my += (pmy - s.my) * 0.07;
  if (s.ptr) { s.ay0 = s.mx * 0.7; s.ax = s.ax0 + s.my * 0.25; }
  s.update?.(t);
  const ay = s.ay0 + s.vy * t, ca = Math.cos(ay), sa = Math.sin(ay), cxx = Math.cos(s.ax), sxx = Math.sin(s.ax);
  const sc = (Math.min(w, h) / 2) * s.fill, P = s.P;
  ctx.globalCompositeOperation = 'lighter';
  for (let pass = 0; pass < 2; pass++) {
    ctx.fillStyle = pass ? 'rgb(92,200,255)' : 'rgb(234,240,244)';
    for (let i = 0; i < s.n; i++) {
      if (s.W[i] !== pass) continue;
      const x = P[i * 3], y = P[i * 3 + 1], z = P[i * 3 + 2];
      let px: number, py: number, k: number, al: number;
      if (s.wide) {
        px = w / 2 + x * (w / 2) * s.fill; py = h / 2 - y * (h / 2) * s.fill; k = 1; al = 0.85;
      } else {
        const x1 = x * ca + z * sa, z1 = -x * sa + z * ca;
        const y1 = y * cxx - z1 * sxx, z2 = y * sxx + z1 * cxx;
        k = 1 / (1 - z2 * 0.22);
        px = w / 2 + x1 * sc * k; py = h / 2 - y1 * sc * k;
        al = 0.25 + 0.75 * (z2 * 0.5 + 0.5);
      }
      if (s.A) al *= s.A[i];
      if (al <= 0.02) continue;
      const sz = s.S[i] * dpr * k;
      ctx.globalAlpha = al > 1 ? 1 : al;
      ctx.fillRect(px - sz / 2, py - sz / 2, sz, sz);
    }
  }
  ctx.globalAlpha = 1;
}
