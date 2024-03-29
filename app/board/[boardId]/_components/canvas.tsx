"use client";

import { nanoid } from "nanoid";
import { useCallback, useMemo, useState, useEffect } from "react";
import { LiveObject } from "@liveblocks/client";

import { 
  useHistory, 
  useCanUndo, 
  useCanRedo,
  useMutation,
  useStorage,
  useOthersMapped,
  useSelf,
} from "@/liveblocks.config";
import { 
  colorToCss,
  connectionIdToColor, 
  findIntersectingLayersWithRectangle, 
  penPointsToPathLayer, 
  pointerEventToCanvasPoint, 
  resizeBounds,
} from "@/lib/utils";
import { 
  Camera, 
  CanvasMode, 
  CanvasState, 
  Color,
  LayerType,
  Point,
  Side,
  XYWH,
} from "@/types/canvas";
import { useDisableScrollBounce } from "@/hooks/use-disable-scroll-bounce";
import { useDeleteLayers } from "@/hooks/use-delete-layers";

import { Info } from "./info";
import { Path } from "./path";
import { Toolbar } from "./toolbar";
import { Participants } from "./participants";
import { LayerPreview } from "./layer-preview";
import { SelectionBox } from "./selection-box";
import { SelectionTools } from "./selection-tools";
import { CursorsPresence } from "./cursors-presence";
import { useProModal } from "@/hooks/use-pro-modal";

const MAX_LAYERS = 200; //max amount of stuff on the whtieboard

interface CanvasProps {
  boardId: string;
};

document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});

export const Canvas = ({
  boardId,
}: CanvasProps) => {
  const [isClickingLayer, setIsClickingLayer] = useState(false);

  const proModal = useProModal();
  const layerIds = useStorage((root) => root.layerIds);

  const [copiedLayers, setCopiedLayers] = useState<Map<string, LiveObject<any>>>(new Map());
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 }); 

  const pencilDraft = useSelf((me) => me.presence.pencilDraft);
  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None,
  });
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPanPoint, setStartPanPoint] = useState({ x: 0, y: 0 });

  const [lastUsedColor, setLastUsedColor] = useState<Color>({
    r: 0,
    g: 0,
    b: 0,
  });

  const [selectedImage, setSelectedImage] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
 

  useDisableScrollBounce();
  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  const insertLayer = useMutation((
    { storage, setMyPresence },
    layerType: LayerType.Ellipse | LayerType.Rectangle | LayerType.Text | LayerType.Note,
    position: Point,
  ) => {
    const liveLayers = storage.get("layers");
    if (liveLayers.size >= MAX_LAYERS) {
      proModal.onOpen();
      return;
    }

    const liveLayerIds = storage.get("layerIds");
    const layerId = nanoid();
    const layer = new LiveObject({
      type: layerType,
      x: position.x,
      y: position.y,
      height: 100,
      width: 100,
      fill: lastUsedColor,
    });

    liveLayerIds.push(layerId);
    liveLayers.set(layerId, layer);

    setMyPresence({ selection: [layerId] }, { addToHistory: true });
    setCanvasState({ mode: CanvasMode.None });
  }, [lastUsedColor]);

  const insertImage = useMutation((
    { storage, setMyPresence },
    layerType: LayerType.Image,
    position: Point,
    selectedImage: string,
  ) => {
    const liveLayers = storage.get("layers");
    if (liveLayers.size >= MAX_LAYERS) {
      proModal.onOpen();
      return;
    }

    const liveLayerIds = storage.get("layerIds");
    const layerId = nanoid();


    if (selectedImage === "") {
      return;
    }

    const layer = new LiveObject({
      type: layerType,
      x: position.x,
      y: position.y,
      height: 100,
      width: 100,
      src: selectedImage,
      fill: null,
      value: "",
    });

    liveLayerIds.push(layerId);
    liveLayers.set(layerId, layer);

    setMyPresence({ selection: [layerId] }, { addToHistory: true });
    setCanvasState({ mode: CanvasMode.None });
  }, [lastUsedColor]);

  const translateSelectedLayers = useMutation((
    { storage, self },
    point: Point,
  ) => {
    if (canvasState.mode !== CanvasMode.Translating) {
      return;
    }

    const offset = {
      x: point.x - canvasState.current.x,
      y: point.y - canvasState.current.y,
    };

    const liveLayers = storage.get("layers");

    for (const id of self.presence.selection) {
      const layer = liveLayers.get(id);

      if (layer) {
        layer.update({
          x: layer.get("x") + offset.x,
          y: layer.get("y") + offset.y,
        });
      }
    }

    setCanvasState({ mode: CanvasMode.Translating, current: point });
  }, 
  [
    canvasState,
  ]);

  const unselectLayers = useMutation((
    { self, setMyPresence }
  ) => {
    if (self.presence.selection.length > 0) {
      setMyPresence({ selection: [] }, { addToHistory: true });
    }
  }, []);

  const updateSelectionNet = useMutation((
    { storage, setMyPresence },
    current: Point,
    origin: Point,
  ) => {
    const layers = storage.get("layers").toImmutable();
    setCanvasState({
      mode: CanvasMode.SelectionNet,
      origin,
      current,
    });

    const ids = findIntersectingLayersWithRectangle(
      layerIds,
      layers,
      origin,
      current,
    );

    setMyPresence({ selection: ids });
  }, [layerIds]);

  const startMultiSelection = useCallback((
    current: Point,
    origin: Point,
  ) => {
    if (
      Math.abs(current.x - origin.x) + Math.abs(current.y - origin.y) > 5
    ) {
      setCanvasState({
        mode: CanvasMode.SelectionNet,
        origin,
        current,
      });
    }
  }, []);

  const continueDrawing = useMutation((
    { self, setMyPresence },
    point: Point,
    e: React.PointerEvent,
  ) => {
    const { pencilDraft } = self.presence;

    if (
      canvasState.mode !== CanvasMode.Pencil ||
      e.buttons !== 1 ||
      pencilDraft == null
    ) {
      return;
    }

    setMyPresence({
      cursor: point,
      pencilDraft:
        pencilDraft.length === 1 &&
        pencilDraft[0][0] === point.x &&
        pencilDraft[0][1] === point.y
          ? pencilDraft
          : [...pencilDraft, [point.x, point.y, e.pressure]],
    });
  }, [canvasState.mode]);

  const insertPath = useMutation((
    { storage, self, setMyPresence }
  ) => {
    const liveLayers = storage.get("layers");
    const { pencilDraft } = self.presence;

    if (liveLayers.size >= MAX_LAYERS) {
      proModal.onOpen();
      setMyPresence({ pencilDraft: null });
      return;
    }

    if (
      pencilDraft == null ||
      pencilDraft.length < 2
    ) {
      setMyPresence({ pencilDraft: null });
      return;
    }

    const id = nanoid();
    liveLayers.set(
      id,
      new LiveObject(penPointsToPathLayer(
        pencilDraft,
        lastUsedColor,
      )),
    );

    const liveLayerIds = storage.get("layerIds");
    liveLayerIds.push(id);

    setMyPresence({ pencilDraft: null });
    setCanvasState({ mode: CanvasMode.Pencil });
  }, [lastUsedColor]);

  const startDrawing = useMutation((
    { setMyPresence },
    point: Point,
    pressure: number,
  ) => {
    setMyPresence({
      pencilDraft: [[point.x, point.y, pressure]],
      penColor: lastUsedColor,
    })
  }, [lastUsedColor]);

  const resizeSelectedLayer = useMutation((
    { storage, self },
    point: Point,
  ) => {
    if (canvasState.mode !== CanvasMode.Resizing) {
      return;
    }

    const bounds = resizeBounds(
      canvasState.initialBounds,
      canvasState.corner,
      point,
    );

    const liveLayers = storage.get("layers");
    const layer = liveLayers.get(self.presence.selection[0]);

    if (layer) {
      layer.update(bounds);
    };
  }, [canvasState]);

  const onResizeHandlePointerDown = useCallback((
    corner: Side,
    initialBounds: XYWH,
  ) => {
    history.pause();
    setCanvasState({
      mode: CanvasMode.Resizing,
      initialBounds,
      corner,
    });
  }, [history]);

  const onWheel = useCallback((e: React.WheelEvent) => {
    setCamera((camera) => ({
      x: camera.x - e.deltaX,
      y: camera.y - e.deltaY,
    }));
  }, []);

  const onPointerMove = useMutation((
    { setMyPresence }, 
    e: React.PointerEvent
  ) => {
    e.preventDefault();
    if (isPanning) {
      const newCameraPosition = {
        x: camera.x + e.clientX - startPanPoint.x,
        y: camera.y + e.clientY - startPanPoint.y,
      };
      setCamera(newCameraPosition);
      setStartPanPoint({ x: e.clientX, y: e.clientY });
    }
    const current = pointerEventToCanvasPoint(e, camera);

    if (canvasState.mode === CanvasMode.Pressing) {
      startMultiSelection(current, canvasState.origin);
    } else if (canvasState.mode === CanvasMode.SelectionNet) {
      updateSelectionNet(current, canvasState.origin);
    } else if (canvasState.mode === CanvasMode.Translating) {
      translateSelectedLayers(current);
    } else if (canvasState.mode === CanvasMode.Resizing) {
      resizeSelectedLayer(current);
    } else if (canvasState.mode === CanvasMode.Pencil) {
      continueDrawing(current, e);
    }

    setMyPresence({ cursor: current });
  }, 
  [
    continueDrawing,
    camera,
    canvasState,
    resizeSelectedLayer,
    translateSelectedLayers,
    startMultiSelection,
    updateSelectionNet,
    isPanning,
  ]);

  const onPointerLeave = useMutation(({ setMyPresence }) => {
    setMyPresence({ cursor: null });
  }, []);

  const onPointerDown = useCallback((
    e: React.PointerEvent,
  ) => {
    const point = pointerEventToCanvasPoint(e, camera);

    if (e.button === 0) {
      if (canvasState.mode === CanvasMode.Inserting) {
        return;
      }
  
      if (canvasState.mode === CanvasMode.Pencil) {
        startDrawing(point, e.pressure);
        return;
      }
  
      setCanvasState({ origin: point, mode: CanvasMode.Pressing });
    } else if (e.button === 2) {
      setIsPanning(true);
      setStartPanPoint({ x: e.clientX, y: e.clientY });
      document.body.style.cursor = 'grabbing';
    }}, [camera, canvasState.mode, setCanvasState, startDrawing, setIsPanning]);

  const onPointerUp = useMutation((
    {},
    e
  ) => {
    setIsPanning(false);
    document.body.style.cursor = 'default';
    const point = pointerEventToCanvasPoint(e, camera);

    if (
      canvasState.mode === CanvasMode.None ||
      canvasState.mode === CanvasMode.Pressing
    ) {
      setIsClickingLayer(false);
      unselectLayers();
      setCanvasState({  
        mode: CanvasMode.None,
      });
    } else if (canvasState.mode === CanvasMode.Pencil) {
      insertPath();
    } else if (canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Image) {
      setSelectedImage("");
      insertImage(LayerType.Image, point, selectedImage);
    } else if (canvasState.mode === CanvasMode.Inserting && canvasState.layerType !== LayerType.Image) {
      insertLayer(canvasState.layerType, point);
    } else {
      setCanvasState({
        mode: CanvasMode.None,
      });
    }

    history.resume();
  }, 
  [
    setCanvasState,
    camera,
    canvasState,
    history,
    insertLayer,
    unselectLayers,
    insertPath,
    insertImage,
    selectedImage,
  ]);

  const selections = useOthersMapped((other) => other.presence.selection);
  
  const onLayerPointerDown = useMutation((
    { self, setMyPresence },
    e: React.PointerEvent,
    layerId: string,
  ) => {
    setIsClickingLayer(true);

    if (
      canvasState.mode === CanvasMode.Pencil ||
      canvasState.mode === CanvasMode.Inserting
    ) {
      return;
    }

    history.pause();
    e.stopPropagation();

    const point = pointerEventToCanvasPoint(e, camera);
    if (!self.presence.selection.includes(layerId)) {
      setMyPresence({ selection: [layerId] }, { addToHistory: true });
    }
    setCanvasState({ mode: CanvasMode.Translating, current: point });
  }, 
  [
    setCanvasState,
    camera,
    history,
    canvasState.mode,
  ]);

  const layerIdsToColorSelection = useMemo(() => {
    const layerIdsToColorSelection: Record<string, string> = {};

    for (const user of selections) {
      const [connectionId, selection] = user;

      for (const layerId of selection) {
        layerIdsToColorSelection[layerId] = connectionIdToColor(connectionId)
      }
    }

    return layerIdsToColorSelection;
  }, [selections]);

  const deleteLayers = useDeleteLayers();

  // useEffect(() => {
  //   const handlePaste = (event: any) => {
  //     const centerX = window.innerWidth / 2;
  //     const centerY = window.innerHeight / 2;
  //     const items = (event.clipboardData || event.originalEvent.clipboardData).items;
  //     for (let index in items) {
  //       const item = items[index];
  //       if (item.kind === 'file') {
  //         const blob = item.getAsFile();
  //         const reader = new FileReader();
  //         reader.onload = function(event) { 
  //           const image = new Image();
  //           image.onload = function() {
  //             insertImage(LayerType.Image, { x: centerX, y: centerY }, event?.target?.result as string);
  //           };
  //           image.src = event?.target?.result as string;
  //         };
  //         reader.readAsDataURL(blob);
  //       }
  //     }
  //   }

  //   window.addEventListener('paste', handlePaste);
  //   return () => {
  //     window.removeEventListener('paste', handlePaste);
  //   };
  // }, [insertImage, camera]);

// Add a new state variable to hold the copied layers

  // Function to copy selected layers
  const copySelectedLayers = useMutation(({ storage, self }) => {
    const liveLayers = storage.get("layers");
    const copied = new Map();
    for (const id of self.presence.selection) {
      const layer = liveLayers.get(id);
      if (layer) {
        // Use the clone method provided by the LiveObject class
        copied.set(id, layer.clone());
      }
    }
    setCopiedLayers(copied);
  }, []);

  const pasteCopiedLayers = useMutation(({ storage, setMyPresence }, mousePosition) => {
    const liveLayers = storage.get("layers");
    const liveLayerIds = storage.get("layerIds");
  
    if (copiedLayers.size + liveLayers.size > MAX_LAYERS) {
      proModal.onOpen();
      return;
    }
  
    // Find the top-left corner of the copied layers
    let minX = Infinity;
    let minY = Infinity;
    for (const layer of Array.from(copiedLayers.values())) {
      minX = Math.min(minX, layer.get("x"));
      minY = Math.min(minY, layer.get("y"));
    }
  
    // Calculate the offset from the mouse position
    const offsetX = mousePosition.x - minX;
    const offsetY = mousePosition.y - minY;
  
    const newSelection = [];
    for (const [id, layer] of Array.from(copiedLayers.entries())) {
      const newId = nanoid();
      newSelection.push(newId);
      liveLayerIds.push(newId);
      const clonedLayer = layer.clone();
      clonedLayer.set("x", clonedLayer.get("x") + offsetX); // Adjust x position
      clonedLayer.set("y", clonedLayer.get("y") + offsetY); // Adjust y position
      liveLayers.set(newId, clonedLayer);
    }
    setMyPresence({ selection: newSelection }, { addToHistory: true });
  }, [copiedLayers]);

  useEffect(() => {
    function onPointerMove(e: PointerEvent) {
      setMousePosition({ 
        x: Math.round(e.clientX) - camera.x,
        y: Math.round(e.clientY) - camera.y,
       });
    }
  
    document.addEventListener("pointermove", onPointerMove);
  
    return () => {
      document.removeEventListener("pointermove", onPointerMove);
    };
  }, [camera, mousePosition, setMousePosition]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      switch (e.key.toLocaleLowerCase()) {
        case "c": {
          if (e.ctrlKey || e.metaKey) {
            copySelectedLayers();
          }
          break;
        }
        case "v": {
          if (e.ctrlKey || e.metaKey) {
            if (isClickingLayer === false) {
              pasteCopiedLayers(mousePosition);
            }
          }
          break;
        }
        case "z": {
          if (e.ctrlKey || e.metaKey) {
            if (e.shiftKey) {
              history.redo();
            } else {
              history.undo();
            }
            break;
          }
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [copySelectedLayers, pasteCopiedLayers, deleteLayers, history, mousePosition, isClickingLayer]);

  return (
    <main
      className="h-full w-full relative bg-neutral-100 touch-none overscroll-none"
    >
      <Info boardId={boardId} />
      <Participants />
      <Toolbar
        isUploading={isUploading}
        setIsUploading={setIsUploading}
        onImageSelect={setSelectedImage}
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        canRedo={canRedo}
        canUndo={canUndo}
        undo={history.undo}
        redo={history.redo}
      />
      <SelectionTools
        camera={camera}
        setLastUsedColor={setLastUsedColor}
      />
      <svg
        id="canvas"
        className="h-[100vh] w-[100vw]"
        onWheel={onWheel}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <g
          style={{
            transform: `translate(${camera.x}px, ${camera.y}px)`,
          }}
        >
          {layerIds.map((layerId) => (
            <LayerPreview
              key={layerId}
              id={layerId}
              onLayerPointerDown={onLayerPointerDown}
              selectionColor={layerIdsToColorSelection[layerId]}
            />
          ))}
          <SelectionBox
            onResizeHandlePointerDown={onResizeHandlePointerDown}
          />
          {canvasState.mode === CanvasMode.SelectionNet && canvasState.current != null && (
            <rect
              className="fill-blue-500/5 stroke-blue-500 stroke-1"
              x={Math.min(canvasState.origin.x, canvasState.current.x)}
              y={Math.min(canvasState.origin.y, canvasState.current.y)}
              width={Math.abs(canvasState.origin.x - canvasState.current.x)}
              height={Math.abs(canvasState.origin.y - canvasState.current.y)}
            />
          )}
          <CursorsPresence />
          {pencilDraft != null && pencilDraft.length > 0 && (
            <Path
              points={pencilDraft}
              fill={colorToCss(lastUsedColor)}
              x={0}
              y={0}
            />
          )}
        </g>
      </svg>
    </main>
  );
};