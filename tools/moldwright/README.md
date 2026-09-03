# Moldwright

A single-file browser tool that turns an STL of a vessel into a printable mold,
for the classroom exercise where students model a ring dish / phone dock / pen
cup and then model its negative.

Open `index.html` directly in a browser. No build step, no server, no install.
The only network request is three.js from a CDN for the 3D preview; everything
else — STL parsing, the geometry, the STL export — runs locally in the page.

## What it produces

**Shell + plug** (concrete or epoxy)

- `shell.stl` — the outer mold. Its cavity is the vessel's outside surface.
- `plug.stl` — the inner core, with a flange that caps the shell and sets the
  depth, a grip rib, and riser holes bored through to the cast.

Print both, mix Rapid Set Cement All, fill the shell, press the plug in, demold
next period.

**Silicone box**

- `silicone-box.stl` — an open-top containment box auto-sized to the master,
  reporting how much rubber the pour will take.

## How the geometry works

The obvious approach — `box - object` — is wrong. It locks the cast in for any
model with an undercut. Everything here is built from a **draw sweep** along +Z
instead:

```
U(x,y,z) = the object smeared upward to infinity
           (per column: min over all z' <= z of the signed distance)

shell    = moldBox - U        cast always lifts straight out
plug     = U - object         provably exactly the vessel's void
cast     = U - plug = object  so the casting is the original model
```

Both halves are drawable by construction. The pipeline is:

1. Ray-cast every lattice column against the mesh (triangles bucketed by XY),
   giving sorted surface crossings and even-odd inside/outside parity.
2. Build a narrow-band signed distance field from those triangles.
3. Sweep it upward, combine the fields with min/max CSG, and mesh each part
   with naive Surface Nets.

## The checks

The STLs are half the point; the diagnostics are the other half.

- **Thinnest cast section** — measured at ridge points of a 3D chamfer distance
  transform, i.e. on the medial axis. Reading the raw minimum instead would just
  find the silhouette edge, where every closed solid is zero thick.
- **Undercuts** — two tests. Columns whose void is capped by material above
  (enclosed pockets the plug cannot reach), and any layer where the plug's
  cross-section shrinks going up (a mouth narrower than the belly, which locks
  the plug in).
- **Draft** — the fraction of near-vertical wall area with no taper at all.
  Reported rather than silently corrected, because tapering the walls for the
  student would change the shape they designed.

## Notes

- STL units are read as millimetres; there is a scale field for inch models.
- Resolution is the voxel grid on the longest axis. Wall-thickness readings
  below about 1.2 voxels can't be resolved and are flagged as such.
- Undercuts on the *outside bottom* get filled by the sweep rather than
  reproduced — that is what makes the mold openable. Feet and domed bases come
  out flat. Use the silicone box for those.
- Inside the claude.ai artifact viewer the platform's save allowlist has no
  `.stl`, so files are handed over as `.stl.txt` and the extension is stripped
  by hand. Run the file locally for plain `.stl`.
