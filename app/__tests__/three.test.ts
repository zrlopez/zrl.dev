/**
 * three.js helpers — mocked three / three-stdlib (no WebGL).
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';

const disposeMat = vi.fn();
const disposeGeo = vi.fn();
const disposeTex = vi.fn();
const closeBitmap = vi.fn();
const traverse = vi.fn();
const removeLight = vi.fn();

vi.mock('three', () => {
  class TextureLoader {}
  return {
    Cache: { enabled: false },
    TextureLoader,
  };
});

vi.mock('three-stdlib', () => {
  class DRACOLoader {
    setDecoderPath() {}
  }
  class GLTFLoader {
    setDRACOLoader() {}
  }
  return { DRACOLoader, GLTFLoader };
});

describe('three helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('cleanMaterial disposes material and textures', async () => {
    const { cleanMaterial } = await import('~/utils/three');
    const material = {
      dispose: disposeMat,
      map: {
        minFilter: 1000,
        dispose: disposeTex,
        source: { data: { close: closeBitmap } },
      },
      color: '#fff',
    };
    cleanMaterial(material);
    expect(disposeMat).toHaveBeenCalled();
    expect(disposeTex).toHaveBeenCalled();
    expect(closeBitmap).toHaveBeenCalled();
  });

  it('cleanScene walks meshes and materials', async () => {
    const { cleanScene } = await import('~/utils/three');
    const singleMat = { isMaterial: true, dispose: disposeMat, map: null };
    const multiMat = [
      { dispose: disposeMat, map: null },
      { dispose: disposeMat, map: null },
    ];
    const scene = {
      traverse: cb => {
        cb({ isMesh: false });
        cb({
          isMesh: true,
          geometry: { dispose: disposeGeo },
          material: singleMat,
        });
        cb({
          isMesh: true,
          geometry: { dispose: disposeGeo },
          material: multiMat,
        });
      },
    };
    cleanScene(scene);
    expect(disposeGeo).toHaveBeenCalledTimes(2);
    expect(disposeMat).toHaveBeenCalled();
  });

  it('cleanRenderer disposes renderer', async () => {
    const { cleanRenderer } = await import('~/utils/three');
    const renderer = { dispose: vi.fn() };
    cleanRenderer(renderer);
    expect(renderer.dispose).toHaveBeenCalled();
  });

  it('removeLights detaches from parent', async () => {
    const { removeLights } = await import('~/utils/three');
    const parent = { remove: removeLight };
    removeLights([{ parent }, { parent }]);
    expect(removeLight).toHaveBeenCalledTimes(2);
  });

  it('getChild finds named node', async () => {
    const { getChild } = await import('~/utils/three');
    const target = { name: 'Frame' };
    const object = {
      traverse: cb => {
        cb({ name: 'Other' });
        cb(target);
      },
    };
    expect(getChild('Frame', object)).toBe(target);
    expect(getChild('Missing', object)).toBeUndefined();
  });

  it('exports loaders', async () => {
    const mod = await import('~/utils/three');
    expect(mod.modelLoader).toBeTruthy();
    expect(mod.textureLoader).toBeTruthy();
  });
});
