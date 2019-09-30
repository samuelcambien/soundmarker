import { LoadableManifest } from 'ngx-loadable-component';

export enum LoadableComponentIds {
  SMA = 'SmaComponent',
}

export const appLoadableManifests: Array<LoadableManifest> = [
  {
    componentId: LoadableComponentIds.SMA,
    path: `loadable-${LoadableComponentIds.SMA}`,
    loadChildren: './modules/sma.module#SmaComponentModule',
  }
];
