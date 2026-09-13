export const LOGO_DURATION: number;

export type LogoMotion = {
  play(): boolean;
  stop(): void;
  destroy(): void;
  readonly isPlaying: boolean;
};

export type MountedLogoMotion = LogoMotion & { svg: SVGSVGElement };

export function attachLogoMotion(
  svg: SVGSVGElement,
  options?: { onHover?: boolean; onLoad?: boolean; trigger?: Element },
): LogoMotion;

export function mountAnimatedLogo(
  container: Element,
  src: string,
  options?: { onHover?: boolean; onLoad?: boolean; signal?: AbortSignal },
): Promise<MountedLogoMotion>;
