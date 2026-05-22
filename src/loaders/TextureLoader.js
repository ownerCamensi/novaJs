/**
 * TextureLoader — Loads images and uploads them to GPU as WebGL2 textures.
 */
export class TextureLoader {
  constructor(gl) {
    this.gl = gl;
  }

  load(url, onLoad = null) {
    const gl  = this.gl;
    const tex = { _glTexture: null, width: 0, height: 0, loaded: false };

    // Create a 1×1 pink placeholder while image loads
    const glTex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, glTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
      new Uint8Array([255, 0, 255, 255]));
    tex._glTexture = glTex;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, glTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      tex.width = img.width; tex.height = img.height; tex.loaded = true;
      if (onLoad) onLoad(tex);
    };
    img.src = url;
    return tex;
  }

  /** Create a solid-color texture procedurally */
  fromColor(r, g, b, a = 255) {
    const gl  = this.gl;
    const glTex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, glTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
      new Uint8Array([r, g, b, a]));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    return { _glTexture: glTex, loaded: true };
  }
}
