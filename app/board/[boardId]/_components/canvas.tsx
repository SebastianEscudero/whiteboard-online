"use client";

import { customAlphabet } from "nanoid";
import React, { useCallback, useMemo, useState, useEffect, useRef } from "react";

import {
    colorToCss,
    connectionIdToColor,
    findIntersectingLayersWithRectangle,
    penPointsToPathLayer,
    resizeArrowBounds,
    pointerEventToCanvasPoint,
    resizeBounds,
} from "@/lib/utils";

import {
    ArrowHandle,
    ArrowHead,
    Camera,
    CanvasMode,
    CanvasState,
    Layers,
    LayerType,
    Point,
    Presence,
    PreviewLayer,
    Side,
    XYWH,
} from "@/types/canvas";

import { useDisableScrollBounce } from "@/hooks/use-disable-scroll-bounce";
import { Info } from "./info";
import { Path } from "../canvas-objects/path";
import { Toolbar } from "./toolbar";
import { Participants } from "./participants";
import { LayerPreview } from "./layer-preview";
import { SelectionBox } from "./selection-box";
import { SelectionTools } from "./selection-tools";
import { CursorsPresence } from "./cursors-presence";
import { useProModal } from "@/hooks/use-pro-modal";
import { getMaxCapas, getMaxImageSize } from "@/lib/planLimits";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { CurrentPreviewLayer } from "./current-preview-layer";
import { useRoom } from "@/components/room";
import { toast } from "sonner";
import { Socket } from "socket.io-client";

interface Command {
    execute(): void;
    undo(): void;
}

class InsertLayerCommand implements Command {
    constructor(private layerIds: any[],
        private layers: any[],
        private prevLayers: Layers,
        private prevLayerIds: string[],
        private setLiveLayers: (layers: Layers) => void,
        private setLiveLayerIds: (layerIds: string[]) => void,
        private deleteLayer: (args: { boardId: string; layerId: any; }) => void,
        private addLayer: (args: { boardId: string; layer: any; layerId: any; }) => void,
        private boardId: string,
        private socket: Socket | null) { }
    execute() {
        let newLayers = { ...this.prevLayers };
        let newLayerIds = [...this.prevLayerIds];

        this.layerIds.forEach((layerId, index) => {
            newLayers = { ...newLayers, [layerId]: this.layers[index] };
            newLayerIds = [...newLayerIds, layerId];
        });

        this.setLiveLayers(newLayers);
        this.setLiveLayerIds(newLayerIds);

        if (this.socket) {
            this.socket.emit('layer-update', this.layerIds, this.layers);
        }

        // Call the addLayer API mutation to add the layers in the database
        this.addLayer({ boardId: this.boardId, layerId: this.layerIds, layer: this.layers });
    }

    undo() {
        let remainingLayers = { ...this.prevLayers };
        let remainingLayerIds = [...this.prevLayerIds];

        this.layerIds.forEach((layerId) => {
            const { [layerId]: _, ...remaining } = remainingLayers;
            remainingLayers = remaining;
            remainingLayerIds = remainingLayerIds.filter(id => id !== layerId);
        });

        this.setLiveLayers(remainingLayers);
        this.setLiveLayerIds(remainingLayerIds);

        if (this.socket) {
            this.socket.emit('layer-delete', this.layerIds);
        }

        // Call the deleteLayer API mutation to delete the layers in the database
        this.deleteLayer({ boardId: this.boardId, layerId: this.layerIds });
    }
}

class DeleteLayerCommand implements Command {
    constructor(private layerIds: string[],
        private layers: any,
        private prevLayers: Layers,
        private prevLayerIds: string[],
        private setLiveLayers: (layers: Layers) => void,
        private setLiveLayerIds: (layerIds: string[]) => void,
        private deleteLayer: (args: { boardId: string; layerId: any; }) => void,
        private addLayer: (args: { boardId: string; layer: any; layerId: any; }) => void,
        private boardId: string,
        private socket: Socket | null) { }

    execute() {
        const remainingLayers = { ...this.prevLayers };
        const remainingLayerIds = [...this.prevLayerIds];

        this.layerIds.forEach(id => {
            if (!remainingLayers[id]) {
                // Layer doesn't exist, skip deletion
                return;
            }
            delete remainingLayers[id];
            const index = remainingLayerIds.indexOf(id);
            if (index > -1) {
                remainingLayerIds.splice(index, 1);
            }
        });

        // Call the deleteLayer API mutation to delete all the layers in the database
        this.deleteLayer({ boardId: this.boardId, layerId: this.layerIds });

        if (this.socket) {
            this.socket.emit('layer-delete', this.layerIds);
        }

        this.setLiveLayers(remainingLayers);
        this.setLiveLayerIds(remainingLayerIds);
    }

    undo() {
        const newLayers = { ...this.prevLayers };
        const newLayerIds = [...this.prevLayerIds];

        const layersToAdd = this.layerIds.map(id => {
            newLayers[id] = this.layers[id];
            if (!newLayerIds.includes(id)) {
                newLayerIds.push(id);
            }
            return this.layers[id];
        });

        // Call the addLayer API mutation to add all the layers back in the database
        this.addLayer({ boardId: this.boardId, layerId: this.layerIds, layer: layersToAdd });

        if (this.socket) {
            this.socket.emit('layer-update', this.layerIds, layersToAdd);
        }

        this.setLiveLayers(newLayers);
        this.setLiveLayerIds(newLayerIds);
    }
}

class TranslateLayersCommand implements Command {
    constructor(
        private layerIds: string[],
        private initialLayers: any,
        public finalLayers: any,
        private setLiveLayers: (layers: any) => void,
        private updateLayer: (args: { boardId: string; layerId: any; layerUpdates: any; }) => void,
        private boardId: string,
        private socket: Socket | null) { }

    execute() {
        this.setLiveLayers({ ...this.finalLayers });

        // Prepare layer updates
        const layerUpdates = this.layerIds.map(layerId => this.finalLayers[layerId]);

        // Call the updateLayer API mutation to update the layers in the database
        this.updateLayer({ boardId: this.boardId, layerId: this.layerIds, layerUpdates: layerUpdates });

        // Emit socket message
        if (this.socket) {
            this.socket.emit('layer-update', this.layerIds, layerUpdates);
        }
    }

    undo() {
        this.setLiveLayers({ ...this.initialLayers });

        // Prepare layer updates
        const layerUpdates = this.layerIds.map(layerId => this.initialLayers[layerId]);

        // Call the updateLayer API mutation to revert the layers in the database
        this.updateLayer({ boardId: this.boardId, layerId: this.layerIds, layerUpdates: layerUpdates });

        // Emit socket message
        if (this.socket) {
            this.socket.emit('layer-update', this.layerIds, layerUpdates);
        }
    }
}

const preventDefault = (e: any) => {
    if (e.scale !== 1) {
        e.preventDefault();
    }
};

if (typeof window !== 'undefined') {
    window.addEventListener('wheel', preventDefault, { passive: false });
}

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 21);

interface CanvasProps {
    boardId: any;
};

export const Canvas = ({
    boardId,
}: CanvasProps) => {
    const [isPenMenuOpen, setIsPenMenuOpen] = useState(false);
    const [isShapesMenuOpen, setIsShapesMenuOpen] = useState(false);
    const [isPenEraserSwitcherOpen, setIsPenEraserSwitcherOpen] = useState(false);
    const [selectedTool, setSelectedTool] = useState(CanvasMode.None);
    const [showingSelectionBox, setShowingSelectionBox] = useState(false);
    const [initialLayers, setInitialLayers] = useState<Layers>({}); // used for undo/redo
    const [history, setHistory] = useState<Command[]>([]);
    const [redoStack, setRedoStack] = useState<Command[]>([]);
    const mousePositionRef = useRef({ x: 0, y: 0 });
    const { liveLayers, liveLayerIds, User, otherUsers, setLiveLayers, setLiveLayerIds, org, socket, board, expired } = useRoom();
    const maxFileSize = org && getMaxImageSize(org) || 0;
    const [isDraggingOverCanvas, setIsDraggingOverCanvas] = useState(false);
    const selectedLayersRef = useRef<string[]>([]);
    const [copiedLayers, setCopiedLayers] = useState<Map<string, any>>(new Map());
    const [pencilDraft, setPencilDraft] = useState<[number, number, number][]>([]);
    const [layerRef, setLayerRef] = useState<any>(null);
    const [canvasState, setCanvasState] = useState<CanvasState>({
        mode: CanvasMode.None,
    });
    const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const zoomRef = useRef(zoom);
    const cameraRef = useRef(camera);
    const canvasStateRef = useRef(canvasState);
    const [isPanning, setIsPanning] = useState(false);
    const [rightClickPanning, setIsRightClickPanning] = useState(false);
    const [startPanPoint, setStartPanPoint] = useState({ x: 0, y: 0 });
    const [selectedImage, setSelectedImage] = useState<string>("");
    const [isUploading, setIsUploading] = useState(false);
    const [currentPreviewLayer, setCurrentPreviewLayer] = useState<PreviewLayer | null>(null);
    const [myPresence, setMyPresence] = useState<Presence | null>(null);
    const [pathColor, setPathColor] = useState({ r: 1, g: 1, b: 1, a: 1 });
    const [pathStrokeSize, setPathStrokeSize] = useState(4);
    const [pinchStartDist, setPinchStartDist] = useState<number | null>(null);
    const [activeTouches, setActiveTouches] = useState(0);
    const updateLayerMutation = useRef(useApiMutation(api.board.updateLayer).mutate);
    const addLayerMutation = useRef(useApiMutation(api.board.addLayer).mutate);
    const deleteLayerMutation = useRef(useApiMutation(api.board.deleteLayer).mutate);
    const addLayer = useCallback((args: { boardId: string; layer: any; layerId: string; }) => addLayerMutation.current(args), []);
    const updateLayer = useCallback((args: { boardId: string; layerId: any; layerUpdates: any; }) => updateLayerMutation.current(args), []);
    const deleteLayer = useCallback((args: { boardId: string; layerId: any; }) => deleteLayerMutation.current(args), []);
    const proModal = useProModal();

    useDisableScrollBounce();

    const performAction = (command: Command) => {
        command.execute();
        setHistory([...history, command]);
        setRedoStack([]); // clear redo stack when new action is performed
    };

    const undo = () => {
        const lastCommand = history[history.length - 1];
        lastCommand.undo();
        setHistory(history.slice(0, -1));
        setRedoStack([...redoStack, lastCommand]);
    };

    const redo = () => {
        const lastCommand = redoStack[redoStack.length - 1];
        lastCommand.execute();
        setRedoStack(redoStack.slice(0, -1));
        setHistory([...history, lastCommand]);
    };

    const insertLayer = useCallback((layerType: LayerType, position: Point, width: number, height: number, center?: Point) => {
        if (org && liveLayerIds.length >= getMaxCapas(org)) {
            proModal.onOpen(org._id);
            return;
        }

        const layerId = nanoid();

        let layer;
        let fillColor = { r: 0, g: 0, b: 0, a: 0 }
        if (layerType === LayerType.Note) {
            if (width < 20 && height < 20) {
                width = 80
                height = 80
            }

            fillColor = { r: 255, g: 249, b: 177, a: 1 }
        }

        if (layerType === LayerType.Text) {

            if (width < 95) {
                width = 95;
            }

            layer = {
                type: layerType,
                x: position.x,
                y: position.y,
                height: height,
                width: width,
                fill: fillColor,
                textFontSize: 12,
                outlineFill: null
            };
        } else if (layerType === LayerType.Note) {
            layer = {
                type: layerType,
                x: position.x,
                y: position.y,
                height: height,
                width: width,
                fill: fillColor,
                outlineFill: { r: 0, g: 0, b: 0, a: 0 },
                textFontSize: 12,
            };
        } else if (layerType === LayerType.Arrow) {
            layer = {
                type: layerType,
                x: position.x,
                y: position.y,
                center: center,
                height: height,
                width: width,
                fill: fillColor,
                startArrowHead: ArrowHead.None,
                endArrowHead: ArrowHead.Triangle,
            };
        } else {
            if (width < 20 && height < 20) {
                width = 80
                height = 80
            }

            layer = {
                type: layerType,
                x: position.x,
                y: position.y,
                height: height,
                width: width,
                fill: fillColor,
                outlineFill: { r: 1, g: 1, b: 1, a: 1 },
            };
        }

        const newLayers = { ...liveLayers, [layerId]: layer };
        const newLayerIds = [...liveLayerIds, layerId];

        const command = new InsertLayerCommand([layerId], [layer], liveLayers, liveLayerIds, setLiveLayers, setLiveLayerIds, deleteLayer, addLayer, boardId, socket);
        performAction(command);

        if (layer.type !== LayerType.Text) {
            selectedLayersRef.current = [layerId];
        }
        setLiveLayerIds(newLayerIds);
        setLiveLayers(newLayers as Layers);

        const newPresence: Presence = {
            ...myPresence,
            selection: [layerId]
        };

        setMyPresence(newPresence);
        setCanvasState({ mode: CanvasMode.None });
    }, [liveLayers, liveLayerIds, myPresence, socket, org, proModal, User.userId, setLiveLayers, setLiveLayerIds, boardId, addLayer]);

    const insertImage = useCallback((
        layerType: LayerType.Image,
        position: Point,
        selectedImage: string,
    ) => {

        if (org && liveLayerIds.length >= getMaxCapas(org)) {
            proModal.onOpen(org._id);
            return;
        }

        const layerId = nanoid();

        if (selectedImage === "") {
            return;
        }

        const layer = {
            type: layerType,
            x: position.x,
            y: position.y,
            height: 100,
            width: 100,
            src: selectedImage,
            fill: null,
        };

        const command = new InsertLayerCommand([layerId], [layer], liveLayers, liveLayerIds, setLiveLayers, setLiveLayerIds, deleteLayer, addLayer, boardId, socket);
        performAction(command);

        const newPresence: Presence = {
            ...myPresence,
            selection: [layerId]
        };

        setMyPresence(newPresence);

        selectedLayersRef.current = [layerId];
        setCanvasState({ mode: CanvasMode.None });
    }, [liveLayers, liveLayerIds, myPresence, socket, org, proModal, User.userId, setLiveLayers, setLiveLayerIds, boardId, addLayer]);

    const translateSelectedLayers = useCallback((point: Point) => {
        if (canvasState.mode !== CanvasMode.Translating) {
            return;
        }

        const offset = {
            x: (point.x - canvasState.current.x),
            y: (point.y - canvasState.current.y)
        };

        const newLayers = { ...liveLayers };
        const updatedLayers: any = [];

        selectedLayersRef.current.forEach(id => {
            const layer = newLayers[id];

            if (layer) {
                const newLayer = { ...layer };
                newLayer.x += offset.x;
                newLayer.y += offset.y;
                if (newLayer.type === LayerType.Arrow && newLayer.center) {
                    const newCenter = {
                        x: newLayer.center.x + offset.x,
                        y: newLayer.center.y + offset.y
                    };
                    newLayer.center = newCenter;
                }
                updatedLayers.push(newLayer);
                newLayers[id] = newLayer;
            }
        });

        if (socket && expired !== true) {
            socket.emit('layer-update', selectedLayersRef.current, updatedLayers);
        }

        setLiveLayers(newLayers);
        setCanvasState({ mode: CanvasMode.Translating, current: point });
    }, [canvasState, selectedLayersRef.current, setCanvasState, setLiveLayers, socket, liveLayers]);

    const unselectLayers = useCallback(() => {
        if (selectedLayersRef.current.length > 0) {
            selectedLayersRef.current = ([]);
            const newPresence: Presence = {
                ...myPresence,
                selection: []
            };

            setMyPresence(newPresence);
        }
    }, [selectedLayersRef.current, setMyPresence, myPresence]);

    const updateSelectionNet = useCallback((current: Point, origin: Point) => {
        setCanvasState({
            mode: CanvasMode.SelectionNet,
            origin,
            current,
        });

        const ids = findIntersectingLayersWithRectangle(
            liveLayerIds,
            liveLayers,
            origin,
            current,
        );

        selectedLayersRef.current = ids;

        const newPresence: Presence = {
            ...myPresence,
            selection: ids,
            cursor: current,
        };

        setMyPresence(newPresence);
    }, [liveLayers, liveLayerIds, setMyPresence, myPresence]);

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

    const startDrawing = useCallback((point: Point, pressure: number) => {
        const pencilDraft: [number, number, number][] = [[point.x, point.y, pressure]];
        setPencilDraft(pencilDraft);
        const newPresence: Presence = {
            ...myPresence,
            pencilDraft: pencilDraft
        };

        setMyPresence(newPresence);
    }, [myPresence, setMyPresence]);

    const continueDrawing = useCallback((point: Point, e: React.PointerEvent) => {
        if (
            (canvasState.mode !== CanvasMode.Pencil && canvasState.mode !== CanvasMode.Laser && canvasState.mode !== CanvasMode.Highlighter) ||
            e.buttons !== 1 ||
            pencilDraft == null
        ) {
            return;
        }

        setPencilDraft(pencilDraft.length === 1 &&
            pencilDraft[0][0] === point.x &&
            pencilDraft[0][1] === point.y
            ? pencilDraft
            : [...pencilDraft, [point.x, point.y, e.pressure]]);


            const newPresence: Presence = {
                ...myPresence,
                cursor: point,
                pencilDraft: pencilDraft.length === 1 &&
                    pencilDraft[0][0] === point.x &&
                    pencilDraft[0][1] === point.y
                    ? pencilDraft
                    : [...pencilDraft, [point.x, point.y, e.pressure]],
                pathStrokeSize: canvasState.mode === CanvasMode.Laser
                    ? 5 / zoom
                    : canvasState.mode === CanvasMode.Highlighter
                        ? 30 / zoom // Increase stroke size for highlighter
                        : pathStrokeSize,
                    pathStrokeColor: canvasState.mode === CanvasMode.Laser
                        ? { r: 243, g: 82, b: 35, a: 1 } // F35223 in RGB
                        : canvasState.mode === CanvasMode.Highlighter
                            ? { ...pathColor, a: 0.5 } // Semi-transparent yellow
                            : pathColor,
            };

        setMyPresence(newPresence);

    }, [canvasState.mode, pencilDraft, myPresence, setMyPresence]);


    const insertPath = useCallback(() => {

        if (org && liveLayerIds.length >= getMaxCapas(org)) {
            proModal.onOpen(org._id);
            return;
        }

        if (
            pencilDraft == null ||
            pencilDraft.length < 2
        ) {
            setPencilDraft([]);
            return;
        }

        const id = nanoid();
        liveLayers[id] = penPointsToPathLayer(pencilDraft, pathColor, pathStrokeSize);

        // Create a new InsertLayerCommand
        const command = new InsertLayerCommand(
            [id],
            [liveLayers[id]],
            { ...liveLayers },
            [...liveLayerIds],
            setLiveLayers,
            setLiveLayerIds,
            deleteLayer,
            addLayer,
            boardId,
            socket
        );

        // Add the command to the command stack    
        setPencilDraft([]);
        performAction(command);

        const newPresence: Presence = {
            ...myPresence,
            pencilDraft: null,
        };

        setMyPresence(newPresence);

        setCanvasState({ mode: CanvasMode.Pencil });
    }, [pencilDraft, liveLayers, setLiveLayers, setLiveLayerIds, myPresence, org, proModal, liveLayerIds, socket, boardId, addLayer]);

    const insertHighlight = useCallback(() => {

        if (org && liveLayerIds.length >= getMaxCapas(org)) {
            proModal.onOpen(org._id);
            return;
        }

        if (
            pencilDraft == null ||
            pencilDraft.length < 2
        ) {
            setPencilDraft([]);
            return;
        }

        const id = nanoid();
        liveLayers[id] = penPointsToPathLayer(pencilDraft, { ...pathColor, a: 0.5 }, 30 / zoom);

        // Create a new InsertLayerCommand
        const command = new InsertLayerCommand(
            [id],
            [liveLayers[id]],
            { ...liveLayers },
            [...liveLayerIds],
            setLiveLayers,
            setLiveLayerIds,
            deleteLayer,
            addLayer,
            boardId,
            socket
        );

        // Add the command to the command stack    
        performAction(command);

        const newPresence: Presence = {
            ...myPresence,
            pencilDraft: null,
        };

        setMyPresence(newPresence);
        setPencilDraft([]);
        setCanvasState({ mode: CanvasMode.Highlighter });
    }, [pencilDraft, liveLayers, setLiveLayers, setLiveLayerIds, myPresence, org, proModal, liveLayerIds, socket, boardId, addLayer]);

    const resizeSelectedLayer = useCallback((point: Point) => {
        const layer = liveLayers[selectedLayersRef.current[0]];
        let bounds

        if (canvasState.mode === CanvasMode.Resizing) {
            if (layer.type === LayerType.Text) {
                bounds = resizeBounds(
                    layer?.type,
                    canvasState.initialBounds,
                    canvasState.corner,
                    point,
                    layerRef,
                    layer,
                );
            } else {
                bounds = resizeBounds(
                    layer?.type,
                    canvasState.initialBounds,
                    canvasState.corner,
                    point,
                );
            }
        } else if (canvasState.mode === CanvasMode.ArrowResizeHandler) {
            bounds = resizeArrowBounds(
                canvasState.initialBounds,
                point,
                canvasState.handle,
            );
        } else {
            return;
        }

        if (layer) {
            const newLayer = { ...layer }; // Create a new object instead of modifying the existing one
            if (newLayer.type === LayerType.Note) {
                bounds.textFontSize = newLayer.textFontSize;
            } else if (newLayer.type === LayerType.Arrow) {
                newLayer.center = bounds.center;
            }
            Object.assign(newLayer, bounds);
            liveLayers[selectedLayersRef.current[0]] = newLayer;
            setLiveLayers({ ...liveLayers });

            if (socket && expired !== true) {
                socket.emit('layer-update', selectedLayersRef.current[0], newLayer);
            }
        }

    }, [canvasState, liveLayers, selectedLayersRef, socket, layerRef]);

    const onResizeHandlePointerDown = useCallback((
        corner: Side,
        initialBounds: XYWH,
    ) => {
        setCanvasState({
            mode: CanvasMode.Resizing,
            initialBounds,
            corner,
        });
    }, []);

    const onArrowResizeHandlePointerDown = useCallback((
        handle: ArrowHandle,
        initialBounds: XYWH,
    ) => {
        setCanvasState({
            mode: CanvasMode.ArrowResizeHandler,
            initialBounds,
            handle,
        });
    }, []);

    const onWheel = useCallback((e: React.WheelEvent) => {
        const svgRect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - svgRect.left;
        const y = e.clientY - svgRect.top;

        const isMouseWheel = Math.abs(e.deltaY) % 100 === 0 && e.deltaX === 0;

        if (isMouseWheel || e.ctrlKey) {
            // Zooming
            let newZoom = zoom;
            if (e.deltaY < 0) {
                newZoom = Math.min(zoom * 1.1, 3.5);
            } else {
                newZoom = Math.max(zoom / 1.1, 0.3);
            }

            const zoomFactor = newZoom / zoom;
            const newX = x - (x - camera.x) * zoomFactor;
            const newY = y - (y - camera.y) * zoomFactor;

            setZoom(newZoom);
            setCamera({ x: newX, y: newY });
        } else {
            // Panning
            const newCameraPosition = {
                x: camera.x - e.deltaX,
                y: camera.y - e.deltaY,
            };

            setCamera(newCameraPosition);
        }
    }, [zoom, camera]);

    const onPointerDown = useCallback((
        e: React.PointerEvent,
    ) => {

        if (activeTouches > 1) {
            return;
        }

        const point = pointerEventToCanvasPoint(e, camera, zoom);

        if (e.button === 0 && expired !== true) {
            if (canvasState.mode === CanvasMode.Eraser) {
                setIsPenEraserSwitcherOpen(false);
                setIsPenMenuOpen(false);
                return;
            }

            if (canvasState.mode === CanvasMode.Laser || canvasState.mode === CanvasMode.Pencil || canvasState.mode === CanvasMode.Highlighter) {
                setIsPenEraserSwitcherOpen(false);
                setIsPenMenuOpen(false);
                startDrawing(point, e.pressure);
                return;
            }

            if (canvasState.mode === CanvasMode.Moving) {
                setIsPanning(true);
                setStartPanPoint({ x: e.clientX, y: e.clientY });
                document.body.style.cursor = 'url(/custom-cursors/grab.svg) 8 8, auto';
                return;
            }

            if (canvasState.mode === CanvasMode.Inserting) {
                const point = pointerEventToCanvasPoint(e, camera, zoom);
                setStartPanPoint(point);
                setIsPanning(false);
                return;
            }

            setCanvasState({ origin: point, mode: CanvasMode.Pressing });
        } else if (e.button === 2 || e.button === 1) {
            setIsRightClickPanning(true);
            setStartPanPoint({ x: e.clientX, y: e.clientY });
            document.body.style.cursor = 'url(/custom-cursors/grab.svg) 8 8, auto';
        }
    }, [camera, canvasState.mode, setCanvasState, startDrawing, setIsPanning, setIsRightClickPanning, zoom, activeTouches, expired]);


    const onPointerMove = useCallback((e: React.PointerEvent) => {
        e.preventDefault();

        if (activeTouches > 1) {
            return;
        }

        if (rightClickPanning) {
            const newCameraPosition = {
                x: camera.x + e.clientX - startPanPoint.x,
                y: camera.y + e.clientY - startPanPoint.y,
            };
            setCamera(newCameraPosition);
            setStartPanPoint({ x: e.clientX, y: e.clientY });
        }

        if (canvasState.mode === CanvasMode.Moving && isPanning) {
            const newCameraPosition = {
                x: camera.x + e.clientX - startPanPoint.x,
                y: camera.y + e.clientY - startPanPoint.y,
            };
            setCamera(newCameraPosition);
            setStartPanPoint({ x: e.clientX, y: e.clientY });
        }

        const current = pointerEventToCanvasPoint(e, camera, zoom);

        const newPresence: Presence = {
            ...myPresence,
            cursor: { x: current.x, y: current.y },
        };

        setMyPresence(newPresence);

        if (socket && expired !== true) {
            socket.emit('presence', myPresence, User.userId);
        }

        if (canvasState.mode === CanvasMode.Pressing) {
            startMultiSelection(current, canvasState.origin);
        } else if (canvasState.mode === CanvasMode.SelectionNet) {
            updateSelectionNet(current, canvasState.origin);
        } else if (canvasState.mode === CanvasMode.Translating) {
            translateSelectedLayers(current);
        } else if (canvasState.mode === CanvasMode.Resizing) {
            resizeSelectedLayer(current);
        } else if (canvasState.mode === CanvasMode.ArrowResizeHandler) {
            resizeSelectedLayer(current);
        } else if (canvasState.mode === CanvasMode.Pencil && e.buttons === 1 || canvasState.mode === CanvasMode.Laser && e.buttons === 1 || canvasState.mode === CanvasMode.Highlighter && e.buttons === 1) {
            continueDrawing(current, e);
        } else if (
            e.buttons === 1 &&
            canvasState.mode === CanvasMode.Inserting &&
            startPanPoint &&
            canvasState.layerType !== LayerType.Path &&
            canvasState.layerType !== LayerType.Image &&
            (startPanPoint.x !== 0 || startPanPoint.y !== 0)
        ) {
            const point = pointerEventToCanvasPoint(e, camera, zoom);
            const widthArrow = point.x - startPanPoint.x;
            const heightArrow = point.y - startPanPoint.y;
            const x = Math.min(point.x, startPanPoint.x);
            const y = Math.min(point.y, startPanPoint.y);
            const width = Math.abs(point.x - startPanPoint.x);
            const height = Math.abs(point.y - startPanPoint.y);
            setIsPanning(true);

            switch (canvasState.layerType) {
                case LayerType.Rectangle:
                    setCurrentPreviewLayer({ x, y, width, height, type: LayerType.Rectangle, fill: { r: 0, g: 0, b: 0, a: 0 }, outlineFill: { r: 1, g: 1, b: 1, a: 1 } });
                    break;
                case LayerType.Ellipse:
                    setCurrentPreviewLayer({ x, y, width, height, type: LayerType.Ellipse, fill: { r: 0, g: 0, b: 0, a: 0 }, outlineFill: { r: 1, g: 1, b: 1, a: 1 } });
                    break;
                case LayerType.Text:
                    setCurrentPreviewLayer({ x, y, width, height: 18, type: LayerType.Rectangle, fill: { r: 0, g: 0, b: 0, a: 0 }, outlineFill: { r: 39, g: 142, b: 237, a: 1 } });
                    break;
                case LayerType.Note:
                    setCurrentPreviewLayer({ x, y, width, height, textFontSize: 12, type: LayerType.Note, fill: { r: 255, g: 249, b: 177, a: 1 }, outlineFill: { r: 0, g: 0, b: 0, a: 0 } });
                    break;
                case LayerType.Arrow:
                    setCurrentPreviewLayer({
                        x: startPanPoint.x,
                        y: startPanPoint.y,
                        center: { x: startPanPoint.x + widthArrow / 2, y: startPanPoint.y + heightArrow / 2 },
                        width: widthArrow,
                        height: heightArrow,
                        type: LayerType.Arrow,
                        fill: { r: 0, g: 0, b: 0, a: 0 },
                        startArrowHead: ArrowHead.None,
                        endArrowHead: ArrowHead.Triangle
                    });
            }
        }
    },
        [continueDrawing,
            camera,
            canvasState,
            resizeSelectedLayer,
            translateSelectedLayers,
            startMultiSelection,
            updateSelectionNet,
            isPanning,
            rightClickPanning,
            setCamera,
            User.userId,
            zoom,
            myPresence,
            startPanPoint,
            socket,
            activeTouches,
            expired
        ]);

    const onPointerUp = useCallback((e: React.PointerEvent) => {    
        setIsRightClickPanning(false);
        const point = pointerEventToCanvasPoint(e, camera, zoom);
        if (canvasState.mode === CanvasMode.SelectionNet) {
            if (selectedLayersRef.current.length > 0) {
                setShowingSelectionBox(true);
            } else {
                setShowingSelectionBox(false);
            }
        }

        if (canvasState.mode !== CanvasMode.Translating && canvasState.mode !== CanvasMode.SelectionNet) {
            setShowingSelectionBox(false)
        }

        if (
            canvasState.mode === CanvasMode.None ||
            canvasState.mode === CanvasMode.Pressing
        ) {
            document.body.style.cursor = 'default';
            unselectLayers();
            setCanvasState({
                mode: CanvasMode.None,
            });
        } else if (canvasState.mode === CanvasMode.Pencil) {
            document.body.style.cursor = 'url(/custom-cursors/pencil.svg) 2 18, auto';
            insertPath();
        } else if (canvasState.mode === CanvasMode.Highlighter) {
            document.body.style.cursor = 'url(/custom-cursors/highlighter.svg) 2 18, auto';
            insertHighlight();
        } else if (canvasState.mode === CanvasMode.Laser) {
            document.body.style.cursor = 'url(/custom-cursors/laser.svg) 4 18, auto';
            setPencilDraft([]);
            const newPresence: Presence = {
                ...myPresence,
                pencilDraft: null,
            };
            setMyPresence(newPresence);
            if (socket && expired !== true) {
                socket.emit('presence', newPresence, User.userId);
            }
        } else if (canvasState.mode === CanvasMode.Eraser) {
            document.body.style.cursor = 'url(/custom-cursors/eraser.svg) 8 8, auto';
            return;
        } else if (canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Image) {
            setSelectedImage("");
            insertImage(LayerType.Image, point, selectedImage);
        } else if (canvasState.mode === CanvasMode.Inserting && canvasState.layerType !== LayerType.Image) {
            const layerType = canvasState.layerType;
            setIsPanning(false);
            if (isPanning && currentPreviewLayer) {
                if (layerType === LayerType.Arrow && currentPreviewLayer.type === LayerType.Arrow) {
                    insertLayer(layerType, { x: currentPreviewLayer.x, y: currentPreviewLayer.y }, currentPreviewLayer.width, currentPreviewLayer.height, currentPreviewLayer.center)
                    setCurrentPreviewLayer(null);
                } else {
                    insertLayer(layerType, { x: currentPreviewLayer.x, y: currentPreviewLayer.y }, currentPreviewLayer.width, currentPreviewLayer.height);
                    setCurrentPreviewLayer(null);
                }
            } else if (layerType !== LayerType.Arrow) {
                let width
                let height
                if (layerType === LayerType.Text) {
                    width = 95;
                    height = 18;
                    point.x = point.x - width / 2
                    point.y = point.y - height / 2
                    insertLayer(layerType, point, width, height)
                } else {
                    width = 80;
                    height = 80;
                    point.x = point.x - width / 2
                    point.y = point.y - height / 2
                    insertLayer(layerType, point, width, height);
                }
            }
        } else if (canvasState.mode === CanvasMode.Moving) {
            document.body.style.cursor = 'url(/custom-cursors/hand.svg) 8 8, auto';
            setIsPanning(false);
        } else if (canvasState.mode === CanvasMode.Translating) {
            let layerIds: any = [];
            let layerUpdates: any = [];
            selectedLayersRef.current.forEach(id => {
                const newLayer = liveLayers[id];
                if (newLayer) {
                    layerIds.push(id);
                    layerUpdates.push(newLayer);
                }
            });

            if (layerIds.length > 0) {
                let lastState;
                if (history.length > 0) {
                    lastState = (history[history.length - 1] as TranslateLayersCommand).finalLayers;
                }

                // Compare the initialLayers with the finalLayers of the last history state
                if (!lastState || JSON.stringify(liveLayers) !== JSON.stringify(lastState)) {
                    const command = new TranslateLayersCommand(layerIds, initialLayers, liveLayers, setLiveLayers, updateLayer, boardId, socket);
                    performAction(command);
                }
            }

            setShowingSelectionBox(true);
            if (selectedLayersRef.current.length === 1 && showingSelectionBox) {
                const layerType = liveLayers[selectedLayersRef.current[0]].type;
                const initialLayer = JSON.stringify(initialLayers[selectedLayersRef.current[0]]);
                const liveLayer = JSON.stringify(liveLayers[selectedLayersRef.current[0]]);
                const changed = initialLayer !== liveLayer;
                if (layerType === LayerType.Text || layerType === LayerType.Note && !changed) {
                    const layer = layerRef.current;
                    layer.focus();

                    const range = document.createRange();
                    range.selectNodeContents(layer);
                    range.collapse(false);

                    const selection = window.getSelection();
                    selection?.removeAllRanges();
                    selection?.addRange(range);
                    if (layer.value || layer.value === "") {
                        layer.selectionStart = layer.selectionEnd = layer.value.length;
                    }
                }
            }   

            setCanvasState({
                mode: CanvasMode.None,
            });
        } else if (canvasState.mode === CanvasMode.Resizing || canvasState.mode === CanvasMode.ArrowResizeHandler) {
            setShowingSelectionBox(true);
            let layerIds: any = [];
            let layerUpdates: any = [];
            selectedLayersRef.current.forEach(id => {
                const newLayer = liveLayers[id];
                if (newLayer) {
                    layerIds.push(id);
                    layerUpdates.push(newLayer);
                }
            });

            if (layerIds.length > 0) {
                const command = new TranslateLayersCommand(layerIds, initialLayers, liveLayers, setLiveLayers, updateLayer, boardId, socket);
                performAction(command);
            }
            setCanvasState({
                mode: CanvasMode.None,
            });
        } else {
            document.body.style.cursor = 'default';
            setCanvasState({
                mode: CanvasMode.None,
            });
        }

    },
        [
            setCanvasState,
            canvasState,
            insertLayer,
            unselectLayers,
            insertPath,
            setIsPanning,
            selectedImage,
            setSelectedImage,
            insertImage,
            selectedLayersRef,
            liveLayers,
            updateLayer,
            boardId,
            camera,
            zoom,
            currentPreviewLayer,
            isPanning,
            initialLayers,
            history,
            layerRef,
        ]);

    const onPointerLeave = useCallback(() => {
        const newPresence: Presence = {
            ...myPresence,
            cursor: null,
        };

        setMyPresence(newPresence);

        if (socket && expired !== true) {
            socket.emit('presence', null, User.userId);
        }
    }, [setMyPresence, myPresence, socket, User.userId]);

    const onPathErase = useCallback((e: React.PointerEvent, layerId: string) => {
        if (canvasState.mode === CanvasMode.Eraser && e.buttons === 1) {
            if (canvasState.mode === CanvasMode.Eraser && e.buttons === 1) {
                const command = new DeleteLayerCommand(
                    [layerId],
                    liveLayers,
                    { ...liveLayers },
                    [...liveLayerIds],
                    setLiveLayers,
                    setLiveLayerIds,
                    deleteLayer,
                    addLayer,
                    board._id,
                    socket
                );
                performAction(command);
            }
        }
    }, [canvasState.mode, liveLayers, liveLayerIds, setLiveLayers, boardId, deleteLayer, socket]);

    const onLayerPointerDown = useCallback((e: React.PointerEvent, layerId: string) => {

        if (
            canvasStateRef.current.mode === CanvasMode.Pencil ||
            canvasStateRef.current.mode === CanvasMode.Inserting ||
            canvasStateRef.current.mode === CanvasMode.Moving ||
            canvasStateRef.current.mode === CanvasMode.Eraser ||
            canvasStateRef.current.mode === CanvasMode.Laser ||
            canvasStateRef.current.mode === CanvasMode.Highlighter ||
            e.button !== 0 ||
            expired === true
        ) {
            return;
        }

        e.stopPropagation();
        const point = pointerEventToCanvasPoint(e, cameraRef.current, zoomRef.current);
        setCanvasState({ mode: CanvasMode.Translating, current: point });

        if (selectedLayersRef.current.includes(layerId)) {
            return;
        }

        const newPresence: Presence = {
            ...myPresence,
            selection: [layerId],
            cursor: point
        };

        setMyPresence(newPresence);

        selectedLayersRef.current = [layerId];
    }, [selectedLayersRef]);

    const layerIdsToColorSelection = useMemo(() => {
        const layerIdsToColorSelection: Record<string, string> = {};

        if (otherUsers) {
            for (const user of otherUsers) {
                const connectionId = user.userId;
                const selection = user.presence?.selection || [];

                for (const layerId of selection) {
                    layerIdsToColorSelection[layerId] = connectionIdToColor(connectionId)
                }
            }
        }

        return layerIdsToColorSelection;
    }, [otherUsers]);

    const onDragOver = (event: React.DragEvent) => {
        event.preventDefault();
        setIsDraggingOverCanvas(true);
    };

    const onDragLeave = (event: React.DragEvent) => {
        event.preventDefault();
        setIsDraggingOverCanvas(false);
    };

    const onDrop = (event: React.DragEvent) => {
        event.preventDefault();
        setIsDraggingOverCanvas(false);
        let x = (Math.round(event.clientX) - camera.x) / zoom
        let y = (Math.round(event.clientY) - camera.y) / zoom
        const files = event.dataTransfer.files;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (!file.type.startsWith('image/')) {
                toast.error('File type not accepted. Please upload an image file.');
                continue;  // Skip if not an image
            }

            // Check file size
            const fileSizeInMB = file.size / 1024 / 1024;
            if (fileSizeInMB > maxFileSize) {
                toast.error(`File size has to be lower than ${maxFileSize}MB. Please try again.`);
                return;
            }

            const toastId = toast.loading("Image is being processed, please wait...");
            const formData = new FormData();
            formData.append('file', file);
            formData.append('userId', User.userId);

            fetch('/api/aws-s3-images', {
                method: 'POST',
                body: formData
            })
                .then(async (res: Response) => {
                    if (!res.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const url = await res.text();

                    // Insert the image into the canvas
                    insertImage(LayerType.Image, { x: x, y: y }, url);
                })
                .catch(error => {
                    console.error('Error:', error);
                })
                .finally(() => {
                    toast.dismiss(toastId);
                    toast.success("Image uploaded successfully, you can now add it to the board.")
                });
        }
    };

    const onTouchDown = useCallback((e: React.TouchEvent) => {
        setActiveTouches(e.touches.length);
    }, []);

    const onTouchUp = useCallback((e: React.TouchEvent) => {
        setActiveTouches(e.changedTouches.length);
    }, []);

    const onTouchMove = useCallback((e: React.TouchEvent) => {
        setActiveTouches(e.touches.length);

        if (e.touches.length < 2) {
            setPinchStartDist(null);
            return;
        }

        const touch1 = e.touches[0];
        const touch2 = e.touches[1];

        const dist = Math.hypot(
            touch1.clientX - touch2.clientX,
            touch1.clientY - touch2.clientY
        );

        const svgRect = e.currentTarget.getBoundingClientRect();
        const x = ((touch1.clientX + touch2.clientX) / 2) - svgRect.left;
        const y = ((touch1.clientY + touch2.clientY) / 2) - svgRect.top;

        if (pinchStartDist === null) {
            setPinchStartDist(dist);
            setStartPanPoint({ x, y });
            return;
        }

        const distChange = Math.abs(dist - pinchStartDist);

        if (distChange > 10) { // Zooming
            let newZoom = zoom;
            if (dist > pinchStartDist) {
                newZoom = Math.min(zoom * 1.1, 3.5);
            } else {
                newZoom = Math.max(zoom / 1.1, 0.3);
            }

            const zoomFactor = newZoom / zoom;
            const newX = x - (x - camera.x) * zoomFactor;
            const newY = y - (y - camera.y) * zoomFactor;

            setZoom(newZoom);
            setCamera({ x: newX, y: newY });
        } else if (startPanPoint) { // Panning
            const dx = x - startPanPoint.x;
            const dy = y - startPanPoint.y;

            const newCameraPosition = {
                x: camera.x + dx,
                y: camera.y + dy,
            };

            setCamera(newCameraPosition);
        }

        setPinchStartDist(dist);
        setStartPanPoint({ x, y });
    }, [zoom, pinchStartDist, camera, startPanPoint]);

    const copySelectedLayers = useCallback(() => {
        const copied = new Map();
        for (const id of selectedLayersRef.current) {
            const layer = liveLayers[id];
            if (layer) {
                const copiedLayer = JSON.parse(JSON.stringify(layer));
                copied.set(id, copiedLayer);
            }
        }
        setCopiedLayers(copied);
    }, [liveLayers, selectedLayersRef]);

    const pasteCopiedLayers = useCallback((mousePosition: any) => {

        if (org && liveLayerIds.length >= getMaxCapas(org)) {
            proModal.onOpen(org._id);
            return;
        }

        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        copiedLayers.forEach((layer) => {
            minX = Math.min(minX, layer.x);
            minY = Math.min(minY, layer.y);
            maxX = Math.max(maxX, layer.x + layer.width);
            maxY = Math.max(maxY, layer.y + layer.height);
        });

        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;

        const offsetX = mousePosition.x - centerX;
        const offsetY = mousePosition.y - centerY;

        const newSelection = [] as string[];
        const newLiveLayers = { ...liveLayers };
        const newLiveLayerIds = [...liveLayerIds];
        const newIds: any = [];
        const clonedLayers: any = [];
        copiedLayers.forEach((layer) => {
            const newId = nanoid();
            newSelection.push(newId);
            newLiveLayerIds.push(newId);
            const clonedLayer = JSON.parse(JSON.stringify(layer));
            clonedLayer.x = clonedLayer.x + offsetX;
            clonedLayer.y = clonedLayer.y + offsetY;
            if (clonedLayer.type === LayerType.Arrow) {
                clonedLayer.center.x += offsetX;
                clonedLayer.center.y += offsetY;
            }
            newLiveLayers[newId] = clonedLayer;
            newIds.push(newId);
            clonedLayers.push(clonedLayer);
        });

        const command = new InsertLayerCommand(newIds, clonedLayers, liveLayers, liveLayerIds, setLiveLayers, setLiveLayerIds, deleteLayer, addLayer, boardId, socket);
        performAction(command);
        setLiveLayers(newLiveLayers);
        setLiveLayerIds(newLiveLayerIds);



        const newPresence: Presence = {
            ...myPresence,
            selection: newSelection
        };

        setMyPresence(newPresence);

    }, [copiedLayers, myPresence, setLiveLayers, setLiveLayerIds, setMyPresence, org, proModal, liveLayerIds, socket, liveLayers, addLayer, boardId]);

    useEffect(() => {
        const onPointerDown = (e: PointerEvent) => {
            const deepCopy = JSON.parse(JSON.stringify(liveLayers));
            setInitialLayers(deepCopy);
        }

        document.addEventListener('pointerdown', onPointerDown);

        return () => {
            document.removeEventListener('pointerdown', onPointerDown);
        }
    }, [liveLayers]);

    useEffect(() => {
        const onMouseMove = (e: any) => {
            if (e.buttons === 0) {
                mousePositionRef.current = pointerEventToCanvasPoint(e, camera, zoom);
            }
        };

        document.addEventListener('mousemove', onMouseMove);

        function onKeyDown(e: KeyboardEvent) {
            switch (e.key.toLocaleLowerCase()) {
                case "z": {
                    if (e.ctrlKey || e.metaKey) {
                        if (e.shiftKey && redoStack.length > 0) {
                            redo();
                            return;
                        } else if (!e.shiftKey && history.length > 0) {
                            undo();
                            return;
                        }
                        e.preventDefault();
                    }
                    break;
                }
                case "c": {
                    if (e.ctrlKey || e.metaKey) {
                        copySelectedLayers();
                    }
                    break;
                }
                case "v": {
                    if (document.activeElement instanceof HTMLTextAreaElement) {
                        break;
                    }
                    if (e.ctrlKey || e.metaKey) {
                        if (copiedLayers.size > 0) {
                            e.preventDefault();
                            pasteCopiedLayers(mousePositionRef.current);
                        }
                    }
                    break;
                }
                case "backspace":
                    if (
                        document.activeElement instanceof HTMLTextAreaElement ||
                        document.activeElement instanceof HTMLInputElement ||
                        (document.activeElement instanceof HTMLElement && document.activeElement.contentEditable === "true")
                    ) {
                        break;
                    }
                    if (selectedLayersRef.current.length > 0) {
                        const newLayers = { ...liveLayers };
                        const deletedLayers: { [key: string]: any } = {};
                        selectedLayersRef.current.forEach(id => {
                            deletedLayers[id] = newLayers[id];
                            delete newLayers[id];
                        });

                        // Create a new DeleteLayerCommand and add it to the history
                        const command = new DeleteLayerCommand(selectedLayersRef.current, deletedLayers, liveLayers, liveLayerIds, setLiveLayers, setLiveLayerIds, deleteLayer, addLayer, board._id, socket);
                        performAction(command);
                        setLiveLayers(newLayers);
                        setLiveLayerIds(liveLayerIds.filter(id => !selectedLayersRef.current.includes(id)));
                        unselectLayers();
                    }
            }
        }

        document.addEventListener("keydown", onKeyDown);

        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.removeEventListener('mousemove', onMouseMove);
        }
    }, [copySelectedLayers, pasteCopiedLayers, camera, zoom, liveLayers, selectedLayersRef.current, copiedLayers, liveLayerIds]);

    useEffect(() => {
        if (typeof document !== 'undefined') {
            const handleContextMenu = (e: MouseEvent) => {
                e.preventDefault();
            };

            document.addEventListener('contextmenu', handleContextMenu);

            return () => {
                document.removeEventListener('contextmenu', handleContextMenu);
            };
        }
    }, []);

    useEffect(() => {
        if (canvasState.mode === CanvasMode.Inserting) {
            if (canvasState.layerType === LayerType.Text) {
                document.body.style.cursor = 'url(/custom-cursors/text-cursor.svg) 8 8, auto';
            } else {
                document.body.style.cursor = 'url(/custom-cursors/inserting.svg) 12 12, auto';
            }
        } else if (canvasState.mode === CanvasMode.Pencil) {
            document.body.style.cursor = 'url(/custom-cursors/pencil.svg) 2 18, auto';
        } else if (canvasState.mode === CanvasMode.Highlighter) {
            document.body.style.cursor = 'url(/custom-cursors/highlighter.svg) 2 18, auto';
        } else if (canvasState.mode === CanvasMode.Laser) {
            document.body.style.cursor = 'url(/custom-cursors/laser.svg) 4 18, auto';
        } else if (canvasState.mode === CanvasMode.Eraser) {
            document.body.style.cursor = 'url(/custom-cursors/eraser.svg) 8 8, auto';
        } else if (canvasState.mode === CanvasMode.Moving) {
            document.body.style.cursor = 'url(/custom-cursors/hand.svg) 8 8, auto';
        } else if (canvasState.mode === CanvasMode.ArrowResizeHandler) {
            document.body.style.cursor = 'url(/custom-cursors/grab.svg) 8 8, auto';
        } else {
            document.body.style.cursor = 'default';
        }
    }, [canvasState.mode, canvasState]);

    useEffect(() => { // for on layer pointer down to update refts
        canvasStateRef.current = canvasState;
        zoomRef.current = zoom;
        cameraRef.current = camera;
    }, [canvasState, zoom, camera]);

    useEffect(() => {
        return () => {
            document.removeEventListener('gesturestart', preventDefault);
            document.removeEventListener('gesturechange', preventDefault);
            document.removeEventListener('gestureend', preventDefault);
            window.removeEventListener('wheel', preventDefault);
        };
    }, []);

    useEffect(() => {
        const preventDefault = (e: any) => {
            if (e.scale !== 1) {
                e.preventDefault();
            }
        };

        window.addEventListener('wheel', preventDefault, { passive: false });

        return () => {
            window.removeEventListener('wheel', preventDefault);
        };
    }, []);

    return (
        <main
            className={`fixed h-full w-full bg-neutral-100 touch-none overscroll-none ${isDraggingOverCanvas ? 'bg-neutral-300 border-2 border-dashed border-custom-blue' : ''}`}
            style={{
                background: `
                  linear-gradient(0deg, rgba(0,0,0,0.05) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px),
                  #f4f4f4
                `,
                backgroundSize: `${65 * zoom}px ${65 * zoom}px`, // Adjust the size based on the zoom level
                backgroundPosition: `${camera.x}px ${camera.y}px`,
                WebkitOverflowScrolling: 'touch',
                WebkitUserSelect: 'none',
            }}
        >
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
            <Info board={board} />
            <Participants
                otherUsers={otherUsers}
                User={User}
            />
            {expired !== true && (
                <Toolbar
                    pathColor={pathColor}
                    pathStrokeSize={pathStrokeSize}
                    setPathColor={setPathColor}
                    setPathStrokeSize={setPathStrokeSize}
                    isUploading={isUploading}
                    setIsUploading={setIsUploading}
                    onImageSelect={setSelectedImage}
                    canvasState={canvasState}
                    setCanvasState={setCanvasState}
                    org={org}
                    undo={undo}
                    redo={redo}
                    canUndo={history.length > 0}
                    canRedo={redoStack.length > 0}
                    isPenMenuOpen={isPenMenuOpen}
                    setIsPenMenuOpen={setIsPenMenuOpen}
                    isShapesMenuOpen={isShapesMenuOpen}
                    setIsShapesMenuOpen={setIsShapesMenuOpen}
                    isPenEraserSwitcherOpen={isPenEraserSwitcherOpen}
                    setIsPenEraserSwitcherOpen={setIsPenEraserSwitcherOpen}
                    selectedTool={selectedTool}
                    setSelectedTool={setSelectedTool}                />
            )}
            {canvasState.mode === CanvasMode.None && expired !== true && (
                <SelectionTools
                    setLiveLayerIds={setLiveLayerIds}
                    setLiveLayers={setLiveLayers}
                    liveLayerIds={liveLayerIds}
                    liveLayers={liveLayers}
                    selectedLayers={selectedLayersRef.current}
                    zoom={zoom}
                    camera={camera}
                    updateLayer={updateLayer}
                    socket={socket}
                    boardId={boardId}
                    DeleteLayerCommand={DeleteLayerCommand}
                    performAction={performAction}
                    addLayer={addLayer}
                    org={org}
                    proModal={proModal}
                    InsertLayerCommand={InsertLayerCommand}
                    myPresence={myPresence}
                    setMyPresence={setMyPresence}
                />
            )}
            <svg
                id="canvas"
                className="h-[100vh] w-[100vw]"
                onWheel={onWheel}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onDragLeave={onDragLeave}
                onTouchStart={onTouchDown}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchUp}
                onPointerMove={onPointerMove}
                onPointerLeave={onPointerLeave}
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
            >
                <g
                    style={{
                        transform: `translate(${camera.x}px, ${camera.y}px) scale(${zoom})`,
                        transformOrigin: 'top left',
                    }}
                >
                    {liveLayerIds.map((layerId: any) => (
                        <LayerPreview
                            selectionColor={layerIdsToColorSelection[layerId]}
                            onPathErase={onPathErase}
                            onLayerPointerDown={onLayerPointerDown}
                            liveLayers={liveLayers}
                            setLiveLayers={setLiveLayers}
                            updateLayer={updateLayer}
                            key={layerId}
                            id={layerId}
                            onRefChange={setLayerRef}
                            zoomRef={zoomRef}
                        />
                    ))}
                    {currentPreviewLayer && (
                        <CurrentPreviewLayer
                            layer={currentPreviewLayer}
                        />
                    )}
                    {(canvasState.mode === CanvasMode.SelectionNet || canvasState.mode === CanvasMode.None || CanvasMode.Resizing) && expired !== true && activeTouches < 2 && (
                        <SelectionBox
                            zoom={zoom}
                            liveLayers={liveLayers}
                            selectedLayers={selectedLayersRef.current}
                            onResizeHandlePointerDown={onResizeHandlePointerDown}
                            onArrowResizeHandlePointerDown={onArrowResizeHandlePointerDown}
                            setCanvasState={setCanvasState}
                            camera={camera}
                        />
                    )}
                    {canvasState.mode === CanvasMode.SelectionNet && canvasState.current != null && (
                        <rect
                            style={{
                                fill: 'rgba(59, 130, 246, 0.3)',
                                stroke: '#3B82F6',
                                strokeWidth: 0.5
                            }}
                            x={Math.min(canvasState.origin.x, canvasState.current.x)}
                            y={Math.min(canvasState.origin.y, canvasState.current.y)}
                            width={Math.abs(canvasState.origin.x - canvasState.current.x)}
                            height={Math.abs(canvasState.origin.y - canvasState.current.y)}
                        />
                    )}
                    {otherUsers && <CursorsPresence otherUsers={otherUsers} />}
                    {
                        pencilDraft != null && pencilDraft.length > 0 && pencilDraft[0].length > 0 && !pencilDraft.some(array => array.some(isNaN)) && (
                            <Path
                                points={pencilDraft}
                                fill={
                                    canvasState.mode === CanvasMode.Laser
                                        ? '#F35223'
                                        : canvasState.mode === CanvasMode.Highlighter
                                            ? colorToCss({ ...pathColor, a: 0.5 }) // Semi-transparent yellow
                                            : colorToCss(pathColor)
                                }
                                x={0}
                                y={0}
                                strokeSize={
                                    canvasState.mode === CanvasMode.Laser
                                        ? 5 / zoom
                                        : canvasState.mode === CanvasMode.Highlighter
                                            ? 30 / zoom // Increase stroke size for highlighter
                                            : pathStrokeSize
                                }
                            />
                        )
                    }
                </g>
            </svg>
        </main>
    );
};