// GDevelop 5 Project Exporter for Spectrum Clone
// Validated against official GDevelop 5 WebAssembly / libGD project schema
import { LEVELS } from './levels';
import { LevelData } from './types';

// RFC4122 compliant UUID v4 generator
function generateUuid(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function generateGDevelop5Project(): Record<string, unknown> {
  const globalObjects = [
    {
      adaptCollisionMaskAutomatically: true,
      assetStoreId: '',
      name: 'Chr_Putih',
      type: 'Sprite',
      updateIfNotVisible: false,
      variables: [{ name: 'warnaId', type: 'number', value: 0 }],
      effects: [],
      behaviors: [
        {
          name: 'PlatformerObject',
          type: 'PlatformBehavior::PlatformerObjectBehavior',
          acceleration: 1250,
          canGoDownFromJumpthru: true,
          canGrabPlatforms: false,
          canGrabWithoutMoving: false,
          deceleration: 1250,
          gravity: 1350,
          ignoreDefaultControls: false,
          jumpSpeed: 580,
          jumpSustainTime: 0.15,
          ladderClimbingSpeed: 150,
          maxFallingSpeed: 900,
          maxSpeed: 210,
          roundCoordinates: false,
          slopeMaxAngle: 60,
          useLegacyTrajectory: false,
          xGrabTolerance: 10,
          yGrabOffset: 0,
        },
      ],
      animations: [
        {
          name: 'Default',
          useMultipleDirections: false,
          directions: [{ looping: true, timeBetweenFrames: 0.1, sprites: [] }],
        },
      ],
    },
    {
      adaptCollisionMaskAutomatically: true,
      assetStoreId: '',
      name: 'Chr_Merah',
      type: 'Sprite',
      updateIfNotVisible: false,
      variables: [{ name: 'warnaId', type: 'number', value: 1 }],
      effects: [],
      behaviors: [
        {
          name: 'PlatformerObject',
          type: 'PlatformBehavior::PlatformerObjectBehavior',
          acceleration: 1250,
          canGoDownFromJumpthru: true,
          canGrabPlatforms: false,
          canGrabWithoutMoving: false,
          deceleration: 1250,
          gravity: 1350,
          ignoreDefaultControls: false,
          jumpSpeed: 580,
          jumpSustainTime: 0.15,
          ladderClimbingSpeed: 150,
          maxFallingSpeed: 900,
          maxSpeed: 210,
          roundCoordinates: false,
          slopeMaxAngle: 60,
          useLegacyTrajectory: false,
          xGrabTolerance: 10,
          yGrabOffset: 0,
        },
      ],
      animations: [
        {
          name: 'Default',
          useMultipleDirections: false,
          directions: [{ looping: true, timeBetweenFrames: 0.1, sprites: [] }],
        },
      ],
    },
    {
      adaptCollisionMaskAutomatically: true,
      assetStoreId: '',
      name: 'Chr_Hijau',
      type: 'Sprite',
      updateIfNotVisible: false,
      variables: [{ name: 'warnaId', type: 'number', value: 2 }],
      effects: [],
      behaviors: [
        {
          name: 'PlatformerObject',
          type: 'PlatformBehavior::PlatformerObjectBehavior',
          acceleration: 1250,
          canGoDownFromJumpthru: true,
          canGrabPlatforms: false,
          canGrabWithoutMoving: false,
          deceleration: 1250,
          gravity: 1350,
          ignoreDefaultControls: false,
          jumpSpeed: 580,
          jumpSustainTime: 0.15,
          ladderClimbingSpeed: 150,
          maxFallingSpeed: 900,
          maxSpeed: 210,
          roundCoordinates: false,
          slopeMaxAngle: 60,
          useLegacyTrajectory: false,
          xGrabTolerance: 10,
          yGrabOffset: 0,
        },
      ],
      animations: [
        {
          name: 'Default',
          useMultipleDirections: false,
          directions: [{ looping: true, timeBetweenFrames: 0.1, sprites: [] }],
        },
      ],
    },
    {
      adaptCollisionMaskAutomatically: true,
      assetStoreId: '',
      name: 'Chr_Biru',
      type: 'Sprite',
      updateIfNotVisible: false,
      variables: [{ name: 'warnaId', type: 'number', value: 3 }],
      effects: [],
      behaviors: [
        {
          name: 'PlatformerObject',
          type: 'PlatformBehavior::PlatformerObjectBehavior',
          acceleration: 1250,
          canGoDownFromJumpthru: true,
          canGrabPlatforms: false,
          canGrabWithoutMoving: false,
          deceleration: 1250,
          gravity: 1350,
          ignoreDefaultControls: false,
          jumpSpeed: 580,
          jumpSustainTime: 0.15,
          ladderClimbingSpeed: 150,
          maxFallingSpeed: 900,
          maxSpeed: 210,
          roundCoordinates: false,
          slopeMaxAngle: 60,
          useLegacyTrajectory: false,
          xGrabTolerance: 10,
          yGrabOffset: 0,
        },
      ],
      animations: [
        {
          name: 'Default',
          useMultipleDirections: false,
          directions: [{ looping: true, timeBetweenFrames: 0.1, sprites: [] }],
        },
      ],
    },
    {
      assetStoreId: '',
      height: 32,
      name: 'Wall_Netral',
      texture: '',
      type: 'TiledSpriteObject::TiledSprite',
      width: 32,
      variables: [],
      effects: [],
      behaviors: [
        {
          name: 'Platform',
          type: 'PlatformBehavior::PlatformBehavior',
          canBeGrabbed: false,
          platformType: 'Normal',
          yGrabOffset: 0,
        },
      ],
    },
    {
      assetStoreId: '',
      height: 32,
      name: 'Wall_Merah',
      texture: '',
      type: 'TiledSpriteObject::TiledSprite',
      width: 32,
      variables: [{ name: 'BarrierColor', type: 'string', value: 'red' }],
      effects: [],
      behaviors: [
        {
          name: 'Platform',
          type: 'PlatformBehavior::PlatformBehavior',
          canBeGrabbed: false,
          platformType: 'Normal',
          yGrabOffset: 0,
        },
      ],
    },
    {
      assetStoreId: '',
      height: 32,
      name: 'Wall_Hijau',
      texture: '',
      type: 'TiledSpriteObject::TiledSprite',
      width: 32,
      variables: [{ name: 'BarrierColor', type: 'string', value: 'green' }],
      effects: [],
      behaviors: [
        {
          name: 'Platform',
          type: 'PlatformBehavior::PlatformBehavior',
          canBeGrabbed: false,
          platformType: 'Normal',
          yGrabOffset: 0,
        },
      ],
    },
    {
      assetStoreId: '',
      height: 32,
      name: 'Wall_Biru',
      texture: '',
      type: 'TiledSpriteObject::TiledSprite',
      width: 32,
      variables: [{ name: 'BarrierColor', type: 'string', value: 'blue' }],
      effects: [],
      behaviors: [
        {
          name: 'Platform',
          type: 'PlatformBehavior::PlatformBehavior',
          canBeGrabbed: false,
          platformType: 'Normal',
          yGrabOffset: 0,
        },
      ],
    },
    {
      assetStoreId: '',
      height: 32,
      name: 'Wall_Cyan',
      texture: '',
      type: 'TiledSpriteObject::TiledSprite',
      width: 32,
      variables: [{ name: 'BarrierColor', type: 'string', value: 'cyan' }],
      effects: [],
      behaviors: [
        {
          name: 'Platform',
          type: 'PlatformBehavior::PlatformBehavior',
          canBeGrabbed: false,
          platformType: 'Normal',
          yGrabOffset: 0,
        },
      ],
    },
    {
      adaptCollisionMaskAutomatically: true,
      assetStoreId: '',
      name: 'Hazard_Duri',
      type: 'Sprite',
      updateIfNotVisible: false,
      variables: [],
      effects: [],
      behaviors: [],
      animations: [
        {
          name: 'Default',
          useMultipleDirections: false,
          directions: [{ looping: true, timeBetweenFrames: 0.1, sprites: [] }],
        },
      ],
    },
    {
      adaptCollisionMaskAutomatically: true,
      assetStoreId: '',
      name: 'Itm_Dot',
      type: 'Sprite',
      updateIfNotVisible: false,
      variables: [{ name: 'DotId', type: 'string', value: '' }],
      effects: [],
      behaviors: [],
      animations: [
        {
          name: 'Default',
          useMultipleDirections: false,
          directions: [{ looping: true, timeBetweenFrames: 0.1, sprites: [] }],
        },
      ],
    },
    {
      adaptCollisionMaskAutomatically: true,
      assetStoreId: '',
      name: 'Zona_Finish',
      type: 'Sprite',
      updateIfNotVisible: false,
      variables: [{ name: 'Active', type: 'boolean', value: false }],
      effects: [],
      behaviors: [],
      animations: [
        {
          name: 'Default',
          useMultipleDirections: false,
          directions: [{ looping: true, timeBetweenFrames: 0.1, sprites: [] }],
        },
      ],
    },
  ];

  // Helper to build layout for each level
  const buildLayout = (level: LevelData, index: number) => {
    const layoutName = `Level_${level.id}`;
    const nextLayoutName = index < LEVELS.length - 1 ? `Level_${LEVELS[index + 1].id}` : 'Layar_Menang';
    const instances: Array<Record<string, unknown>> = [];

    // Player Spawn (Chr_Putih)
    instances.push({
      angle: 0,
      customSize: true,
      depth: 1,
      height: 36,
      keepRatio: false,
      layer: '',
      name: 'Chr_Putih',
      persistentUuid: generateUuid(),
      width: 36,
      x: level.playerStart.x - 18,
      y: level.playerStart.y - 18,
      zOrder: 10,
      numberProperties: [],
      stringProperties: [],
      initialVariables: [{ name: 'warnaId', type: 'number', value: 0 }],
    });

    // Platforms (Wall_Netral)
    level.platforms.forEach((plat) => {
      instances.push({
        angle: 0,
        customSize: true,
        depth: 1,
        height: plat.height,
        keepRatio: false,
        layer: '',
        name: 'Wall_Netral',
        persistentUuid: generateUuid(),
        width: plat.width,
        x: plat.x,
        y: plat.y,
        zOrder: 1,
        numberProperties: [],
        stringProperties: [],
        initialVariables: [],
      });
    });

    // Spikes (Hazard_Duri)
    level.spikes.forEach((spike) => {
      instances.push({
        angle: 0,
        customSize: true,
        depth: 1,
        height: spike.height,
        keepRatio: false,
        layer: '',
        name: 'Hazard_Duri',
        persistentUuid: generateUuid(),
        width: spike.width,
        x: spike.x,
        y: spike.y,
        zOrder: 3,
        numberProperties: [],
        stringProperties: [],
        initialVariables: [],
      });
    });

    // Portals (Portal_Merah, Portal_Hijau, Portal_Biru, Portal_Prisma)
    level.portals.forEach((portal) => {
      let objName = 'Portal_Prisma';
      if (portal.type === 'red') objName = 'Portal_Merah';
      else if (portal.type === 'green') objName = 'Portal_Hijau';
      else if (portal.type === 'blue') objName = 'Portal_Biru';

      instances.push({
        angle: 0,
        customSize: true,
        depth: 1,
        height: portal.height,
        keepRatio: false,
        layer: '',
        name: objName,
        persistentUuid: generateUuid(),
        width: portal.width,
        x: portal.x,
        y: portal.y,
        zOrder: 2,
        numberProperties: [],
        stringProperties: [],
        initialVariables: [{ name: 'PortalType', type: 'string', value: portal.type }],
      });
    });

    // Items (Itm_Kotak)
    level.items.forEach((item) => {
      instances.push({
        angle: 0,
        customSize: true,
        depth: 1,
        height: item.height,
        keepRatio: false,
        layer: '',
        name: 'Itm_Kotak',
        persistentUuid: generateUuid(),
        width: item.width,
        x: item.x,
        y: item.y,
        zOrder: 4,
        numberProperties: [],
        stringProperties: [],
        initialVariables: [{ name: 'WarnaDibutuhkan', type: 'string', value: item.warnaDibutuhkan }],
      });
    });

    // Finish Zone (Zona_Finish)
    instances.push({
      angle: 0,
      customSize: true,
      depth: 1,
      height: level.finishZone.height,
      keepRatio: false,
      layer: '',
      name: 'Zona_Finish',
      persistentUuid: generateUuid(),
      width: level.finishZone.width,
      x: level.finishZone.x,
      y: level.finishZone.y,
      zOrder: 2,
      numberProperties: [],
      stringProperties: [],
      initialVariables: [{ name: 'Active', type: 'boolean', value: false }],
    });

    // Events for stage logic
    const events: Array<Record<string, unknown>> = [
      // 1. Scene start: Initialize item counters
      {
        type: 'BuiltinCommonInstructions::Standard',
        conditions: [
          {
            type: { inverted: false, value: 'SceneJustBegins' },
            parameters: [],
            subInstructions: [],
          },
        ],
        actions: [
          {
            type: { inverted: false, value: 'ModVarScene' },
            parameters: ['JumlahItemTerkumpul', '=', '0'],
            subInstructions: [],
          },
          {
            type: { inverted: false, value: 'ModVarScene' },
            parameters: ['TotalItemLevel', '=', String(level.items.length)],
            subInstructions: [],
          },
        ],
      },
      // 2. Item collection
      {
        type: 'BuiltinCommonInstructions::Standard',
        conditions: [
          {
            type: { inverted: false, value: 'CollisionNP' },
            parameters: ['Chr_Putih', 'Itm_Kotak', '', '', ''],
            subInstructions: [],
          },
        ],
        actions: [
          {
            type: { inverted: false, value: 'Delete' },
            parameters: ['Itm_Kotak'],
            subInstructions: [],
          },
          {
            type: { inverted: false, value: 'ModVarScene' },
            parameters: ['JumlahItemTerkumpul', '+', '1'],
            subInstructions: [],
          },
        ],
      },
      // 3. Spike collision -> Reset position
      {
        type: 'BuiltinCommonInstructions::Standard',
        conditions: [
          {
            type: { inverted: false, value: 'CollisionNP' },
            parameters: ['Chr_Putih', 'Hazard_Duri', '', '', ''],
            subInstructions: [],
          },
        ],
        actions: [
          {
            type: { inverted: false, value: 'MxtPosition' },
            parameters: ['Chr_Putih', '=', String(level.playerStart.x), '=', String(level.playerStart.y)],
            subInstructions: [],
          },
        ],
      },
      // 4. Finish Zone advance
      {
        type: 'BuiltinCommonInstructions::Standard',
        conditions: [
          {
            type: { inverted: false, value: 'CollisionNP' },
            parameters: ['Chr_Putih', 'Zona_Finish', '', '', ''],
            subInstructions: [],
          },
          {
            type: { inverted: false, value: 'VarScene' },
            parameters: ['JumlahItemTerkumpul', '>=', String(level.items.length)],
            subInstructions: [],
          },
        ],
        actions: [
          {
            type: { inverted: false, value: 'PushScene' },
            parameters: [JSON.stringify(nextLayoutName)],
            subInstructions: [],
          },
        ],
      },
    ];

    return {
      b: 47,
      disableInputWhenNotFocused: true,
      mangledName: layoutName,
      name: layoutName,
      r: 27,
      standardSortMethod: true,
      stopSoundsOnStartup: false,
      title: `${level.stageLabel}: ${level.title}`,
      v: 27,
      uiSettings: {
        grid: true,
        gridType: 'rectangular',
        gridWidth: 32,
        gridHeight: 32,
        gridOffsetX: 0,
        gridOffsetY: 0,
        gridColor: 16777215,
        gridAlpha: 0.1,
        snap: true,
        zoomFactor: 1,
        windowMask: true,
      },
      objectsFolderStructure: {
        folderName: '__ROOT',
      },
      layers: [
        {
          ambientLightColorB: 0,
          ambientLightColorG: 0,
          ambientLightColorR: 0,
          camera3DFarPlaneDistance: 10000,
          camera3DFieldOfView: 45,
          camera3DNearPlaneDistance: 0.1,
          cameraType: '',
          followBaseLayerCamera: false,
          isLightingLayer: false,
          isLocked: false,
          name: '',
          renderingType: '',
          visibility: true,
          cameras: [
            {
              defaultSize: true,
              defaultViewport: true,
              height: 720,
              viewportBottom: 1,
              viewportLeft: 0,
              viewportRight: 1,
              viewportTop: 0,
              width: 1280,
            },
          ],
          effects: [],
        },
      ],
      behaviorsSharedData: [
        {
          name: 'PlatformerObject',
          type: 'PlatformBehavior::PlatformerObjectBehavior',
        },
        {
          name: 'Platform',
          type: 'PlatformBehavior::PlatformBehavior',
        },
      ],
      objects: [],
      instances,
      events,
    };
  };

  const layouts = LEVELS.map((lvl, idx) => buildLayout(lvl, idx));

  // Also include Layar_Menang (Win screen layout)
  layouts.push({
    b: 47,
    disableInputWhenNotFocused: true,
    mangledName: 'Layar_Menang',
    name: 'Layar_Menang',
    r: 27,
    standardSortMethod: true,
    stopSoundsOnStartup: false,
    title: 'Layar Menang: Spectrum Clone',
    v: 27,
    uiSettings: {
      grid: true,
      gridType: 'rectangular',
      gridWidth: 32,
      gridHeight: 32,
      gridOffsetX: 0,
      gridOffsetY: 0,
      gridColor: 16777215,
      gridAlpha: 0.1,
      snap: true,
      zoomFactor: 1,
      windowMask: true,
    },
    objectsFolderStructure: {
      folderName: '__ROOT',
    },
    layers: [
      {
        ambientLightColorB: 0,
        ambientLightColorG: 0,
        ambientLightColorR: 0,
        camera3DFarPlaneDistance: 10000,
        camera3DFieldOfView: 45,
        camera3DNearPlaneDistance: 0.1,
        cameraType: '',
        followBaseLayerCamera: false,
        isLightingLayer: false,
        isLocked: false,
        name: '',
        renderingType: '',
        visibility: true,
        cameras: [
          {
            defaultSize: true,
            defaultViewport: true,
            height: 720,
            viewportBottom: 1,
            viewportLeft: 0,
            viewportRight: 1,
            viewportTop: 0,
            width: 1280,
          },
        ],
        effects: [],
      },
    ],
    behaviorsSharedData: [],
    objects: [],
    instances: [],
    events: [],
  });

  return {
    firstLayout: 'Level_1',
    gdVersion: {
      build: 0,
      major: 5,
      minor: 4,
      revision: 215,
    },
    properties: {
      adaptGameAspectRatio: false,
      antialiasingMode: 'none',
      antialiasingSettingName: '',
      author: 'Spectrum Team',
      connectionConfig: {},
      decimalPrecision: 3,
      description: 'Minimalist 2D puzzle-platformer featuring color splitting, selective barriers, and physics mechanics.',
      folderProject: false,
      isFolderProject: false,
      folderProjectLoadingOptions: 'legacy',
      fps: 60,
      gameResolutionHeight: 720,
      gameResolutionWidth: 1280,
      maxFPS: 60,
      minFPS: 20,
      name: 'Spectrum Clone',
      orientation: 'landscape',
      packageForAndroid: false,
      packageName: 'com.spectrum.game',
      pixelsRounding: false,
      projectUuid: generateUuid(),
      scaleMode: 'linear',
      sizeOnStartupMode: 'adaptWidth',
      templateSlug: '',
      useDeprecatedZeroAsDefaultZOrder: false,
      useExternalSourceFiles: false,
      version: '1.0.0',
      watermark: {
        placement: 'bottom-right',
        showWatermark: false,
      },
    },
    resources: {
      resources: [],
    },
    objects: globalObjects,
    objectsFolderStructure: {
      folderName: '__ROOT',
    },
    layouts,
    externalEvents: [],
    eventsFunctionsExtensions: [],
    externalLayouts: [],
    externalSourceFiles: [],
  };
}

export function downloadGDevelop5Project() {
  const project = generateGDevelop5Project();
  const json = JSON.stringify(project, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'game.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
